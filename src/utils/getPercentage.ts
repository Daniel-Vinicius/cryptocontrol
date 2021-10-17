export function getPercentage(firstValue: number, secondValue: number) {
  if (!firstValue && !secondValue) {
    return '';
  }

  let percentage = '';

  const percentageCalc = 100 - (firstValue / secondValue) * 100;
  const percentageText = `${percentageCalc.toFixed(2)}%`;

  if (percentageCalc >= 0) {
    percentage = `+ ${percentageText}`;
  }

  if (percentageCalc < 0) {
    percentage = percentageText;
  }

  return percentage;
}
