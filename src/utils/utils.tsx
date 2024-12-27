export const formatPrice = (value: any): string => {
  const stringValue = value.toString();
  if (stringValue.length > 3 && stringValue.length < 7) {
    return stringValue.slice(0, 3) + '.' + stringValue.slice(3);
  } else if (stringValue.length >= 7) {
    return stringValue.slice(0, 3) + '.' + stringValue.slice(3, 6) + '.' + stringValue.slice(6);
  }
  return stringValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
