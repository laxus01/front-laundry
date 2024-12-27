export const formatPrice = (value: number): void => {
  let num = value.toString().replace(/[.,]/g, "");
  if (!isNaN(Number(num))) {
    num = num.split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
    num = num.split("").reverse().join("").replace(/^[\.]/, "");
    value = Number(num);
  } else {
    value = Number(value.toString().replace(/[^\d\.]*/g, ""));
  }  
};

export const removeFormatPrice = (value: string): string => {
  return value.replace(/\./g, "");
};
