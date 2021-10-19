/* eslint-disable */
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  db_id: string;
  user_id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void| string>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: 'cancel' | 'dismiss' | 'locked' | 'error' | 'success';
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function saveUserOnDatabase(userParam: Omit<User, "db_id">): Promise<string> {
    const userCollection = database.get<ModelUser>('users');
    const photo = userParam.photo ? userParam.photo : `https://ui-avatars.com/api/?name=${userParam.name}&length=1`;

    const createAndReturnIdUser = await database.write(async () => {
      const userModelDB = await userCollection.create((newUser) => {
        newUser.user_id = userParam.user_id,
          newUser.name = userParam.name,
          newUser.email = userParam.email,
          newUser.photo = photo;
      });

      return userModelDB.id;
    });

    return createAndReturnIdUser;
  }

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === 'dismiss') {
        return 'dismiss';
      }

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
        );
        const userInfo = await response.json();

        const userLogged = {
          user_id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        const db_id = await saveUserOnDatabase(userLogged);

        setUser({ ...userLogged, db_id });
      }
    } catch (error) {
      throw new Error(String(error));
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
        const userLogged = {
          user_id: credential.user,
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName!.givenName!}&length=1`,
        };

        const db_id = await saveUserOnDatabase(userLogged);
        setUser({ ...userLogged, db_id });
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function signOut() {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.write(async () => {
        const userSelected = await userCollection.find(user.db_id);
        await userSelected.destroyPermanently();
      });

      setUser({} as User);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userCollection = database.get<ModelUser>('users');
      const response = await userCollection.query().fetch();

      if (response.length > 0) {
        const userDataOnDB = response[0];

        const userData: User = {
          user_id: userDataOnDB.user_id,
          email: userDataOnDB.email,
          name: userDataOnDB.name,
          photo: userDataOnDB.photo,
          db_id: userDataOnDB.id
        };

        setUser(userData);
        setUserStorageLoading(false);
      }
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userStorageLoading,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
