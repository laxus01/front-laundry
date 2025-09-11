import numeral from 'numeral';

export const formatPrice = (value: number): string => {
  const formattedValue = numeral(value).format("0,0").replace(/,/g, ".");
  return formattedValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};

// Formatea solo enteros con separador de miles (es-CO). No permite decimales
export const formatMoneyInput = (input: string): string => {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  const n = Number(digits);
  return new Intl.NumberFormat('es-CO').format(n);
};

// Convierte a entero: elimina puntos y descarta decimales
export const moneyToInteger = (s: string): number => {
  if (!s) return 0;
  const noThousands = s.replace(/\./g, '');
  const intPart = noThousands.split(',')[0] || '';
  const digits = intPart.replace(/[^0-9]/g, '');
  const n = Number(digits || '0');
  return isNaN(n) ? 0 : n;
};
