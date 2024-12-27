export const formatPrice = (value: any): string => {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value).replace('€', '').trim();
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
