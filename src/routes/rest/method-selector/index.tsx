import { useId } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import type { MethodSelectorProps } from './types';
import { METHODS, METHODS_OPTIONS } from '~/constants';
import { useIntlayer } from 'react-intlayer';

const MethodSelector = ({ method, setMethod }: MethodSelectorProps) => {
  const content = useIntlayer('method-selector');
  const selectId = useId();
  const handleMethodChange = (event: SelectChangeEvent) => {
    setMethod(event.target.value as METHODS);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id={selectId}>{content.method}</InputLabel>
      <Select
        labelId={selectId}
        value={method}
        onChange={handleMethodChange}
        label={content.method}
        sx={{ minWidth: 120 }}
      >
        {METHODS_OPTIONS.map((httpMethod) => (
          <MenuItem key={httpMethod} value={httpMethod}>
            {httpMethod}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MethodSelector;
