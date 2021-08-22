export function formatToBRL(number: number): string {
  const formatted = number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return formatted;
}
