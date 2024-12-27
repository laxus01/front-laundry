export const formatPrice = (value: any): string => {
  // Convertir el número a cadena
  const stringValue = value.toString();

  // Usar una expresión regular para insertar un punto cada tres caracteres
  const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
