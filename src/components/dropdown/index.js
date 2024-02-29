import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Autocomplete } from '@mui/material';

export default function ControlledOpenSelect({ label, li, value, handleSelectedValue }) {
  return (
    <div>
      <Autocomplete
        options={li}
        onChange={(event, newValue) => handleSelectedValue(event, newValue)}
        value={value}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </div>
  );
}

ControlledOpenSelect.propTypes = {
  label: PropTypes.string,
  li: PropTypes.object,
  value: PropTypes.string,
  handleSelectedValue: PropTypes.func
};
