export const formatPrice = (value: any): string => {
  const stringValue = value.toString();
  const length = stringValue.length;

  if (length > 3 && length < 7) {
    return stringValue.slice(0, length - 3) + '.' + stringValue.slice(length - 3);
  } else if (length >= 7) {
    return stringValue.slice(0, length - 6) + '.' + stringValue.slice(length - 6, length - 3) + '.' + stringValue.slice(length - 3);
  }
  return stringValue;
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
