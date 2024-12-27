export const formatPrice = (value: number): string => {
  return value.toLocaleString('es-ES'); 
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
