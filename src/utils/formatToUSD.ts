export function formatToUSD(number: number): string {
  const formatted = number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return formatted;
}
