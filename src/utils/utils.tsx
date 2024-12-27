export const formatPrice = (value: any): string => {
  const formattedValue = value.toLocaleString('es-ES');
  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
