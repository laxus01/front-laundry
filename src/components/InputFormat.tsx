import { NumericFormat } from 'react-number-format';

interface InputFormatProps {
    value: number; 
  }

export const InputFormat = ({value}: InputFormatProps) => {
  return (
    <div>
      <h1>Formato con Separadores de Miles</h1>
      <NumericFormat 
        value={value} 
        displayType="text" 
        thousandSeparator="." 
        decimalSeparator="," 
      />
    </div>
  );
};
