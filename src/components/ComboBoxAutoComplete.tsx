import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { OptionsComboBoxAutoComplete } from "../interfaces/interfaces";

interface ComboBoxAutoCompleteProps {
  title: string;
  options: OptionsComboBoxAutoComplete[];
  onSelect: (id: string) => void;
  value?: string;
  disabled?: boolean;
}

export default function ComboBoxAutoComplete({
  title,
  options,
  onSelect,
  value,
  disabled = false,
}: ComboBoxAutoCompleteProps) {
  // Ensure value is always a string to maintain controlled state
  const controlledValue = value || "";
  const selectedOption = controlledValue && options.length > 0 
    ? options.find(option => option.id === controlledValue) || null 
    : null;
  
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option) => option.name}
      value={selectedOption}
      disabled={disabled}
      onChange={(_, selectedValue) => {
        console.log('ComboBoxAutoComplete onChange:', selectedValue);
        if (selectedValue && !disabled) {
          onSelect(selectedValue.id);
        }
      }}
      renderInput={(params) => <TextField {...params} label={title} />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      noOptionsText="No hay opciones disponibles"
    />
  );
}
