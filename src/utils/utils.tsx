export const formatPrice = (value: any): string => {
  const stringValue = value.toString();
  const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
