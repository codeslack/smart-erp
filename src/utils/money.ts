// src/utils/money.ts

export const money = (
  value: string | number | null | undefined
): number => {
  const num = Number(value);

  return Number.isNaN(num)
    ? 0
    : num;
};

export const roundMoney = (
  value: string | number,
  decimals = 4
): number => {
  return Number(
    money(value).toFixed(decimals)
  );
};

export const addMoney = (
  ...values: Array<string | number | null | undefined>
): number => {
  return values.reduce<number>(
    (total, value) => total + money(value),
    0
  );
};

export const subtractMoney = (
  value1: string | number,
  value2: string | number
): number => {
  return money(value1) - money(value2);
};

export const multiplyMoney = (
  value: string | number,
  quantity: string | number
): number => {
  return money(value) * Number(quantity);
};

export const divideMoney = (
  value: string | number,
  divisor: string | number
): number => {
  const numberDivisor = Number(divisor);

  if (numberDivisor === 0) {
    return 0;
  }

  return money(value) / numberDivisor;
};