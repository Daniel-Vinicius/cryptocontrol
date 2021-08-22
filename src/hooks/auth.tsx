import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

const collectionKeyUser = '@gofinances:user';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: "cancel" | "dismiss" | "locked" | "error" | "success";
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        };

        setUser(userLogged);
        await AsyncStorage.setItem(collectionKeyUser, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error);      
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      if (credential) {
        const name = credential.fullName!.givenName!;
        const userLogged = {
          id: credential.user,
          email: credential.email!,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`
        };

        setUser(userLogged);
        await AsyncStorage.setItem(collectionKeyUser, JSON.stringify(userLogged));
      }

    } catch (error) {
      throw new Error(error);      
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(collectionKeyUser);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userInStorage = await AsyncStorage.getItem(collectionKeyUser);
      
      if (userInStorage) {
        const userLogged = JSON.parse(userInStorage) as User;
        setUser(userLogged);
        setUserStorageLoading(false);
      }
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userStorageLoading, signInWithGoogle, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
