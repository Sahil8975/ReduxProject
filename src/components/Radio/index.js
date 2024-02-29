import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup() {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend"> </FormLabel>
      <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
        <FormControlLabel value="Non-collected" control={<Radio />} label="Non-collected" />
        <FormControlLabel value="collected" control={<Radio />} label="collected" />
        <FormControlLabel value="dispatched" control={<Radio />} label="dispatched" />
      </RadioGroup>
    </FormControl>
  );
}
