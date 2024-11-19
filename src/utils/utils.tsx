export const formatPrice = (value: number): string => {
  const val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
