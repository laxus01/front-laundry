export const formatPrice = (value: any): string => {
  const stringValue = value.toString();
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
