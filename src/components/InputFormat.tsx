import { NumericFormat } from 'react-number-format';

interface InputFormatProps {
    value: number; 
  }

export const InputFormat = ({value}: InputFormatProps) => {
  return (
    <div>
      <NumericFormat 
        value={value} 
        displayType="text" 
        thousandSeparator="." 
        decimalSeparator="," 
      />
    </div>
  );
};
