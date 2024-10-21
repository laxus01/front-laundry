import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { OptionsComboBoxAutoComplete } from "../interfaces/interfaces";

interface ComboBoxAutoCompleteProps {
  title: string;
  options: OptionsComboBoxAutoComplete[];
  onSelect: (id: number) => void;
}

export default function ComboBoxAutoComplete({
  title,
  options,
  onSelect,
}: ComboBoxAutoCompleteProps) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option) => option.name}
      onChange={(_, value) => {
        if (value) {
          onSelect(value.id);
        }
      }}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  );
}
