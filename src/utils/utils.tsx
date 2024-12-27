export const formatPrice = (value: any): string => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
