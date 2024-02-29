import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function CitizenShipRadioGroup() {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Citizenship</FormLabel>
      <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
        <FormControlLabel value="Malaysiar" control={<Radio />} label="Malaysiar" />
        <FormControlLabel value="Foreigner" control={<Radio />} label="Foreigner" />
      </RadioGroup>
    </FormControl>
  );
}
