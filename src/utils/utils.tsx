export const formatPrice = (value: number): string => {
  const formattedValue = value.toLocaleString('es-ES', { minimumFractionDigits: 0 });
  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
