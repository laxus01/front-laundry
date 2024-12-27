import numeral from 'numeral';

export const formatPrice = (value: number): string => {
  const formattedValue = numeral(value).format("0,0").replace(/,/g, ".");
  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
