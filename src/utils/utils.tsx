export const formatPrice = (value: number): string => {
  const val = value.toFixed(2).replace(".", ",");
  return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const removeFormatPrice = (value: string): number => {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
};
