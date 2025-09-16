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
  const selectedOption = value ? options.find(option => option.id === value) : null;
  
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
    />
  );
}
