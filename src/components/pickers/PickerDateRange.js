import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

export default function BasicDateRangePicker({ size = 'small', bool = false, onChange }) {
  const [value, setValue] = React.useState([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="From Date"
        endText="To Date"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <>
            {(startProps.helperText = '')}
            {(endProps.helperText = '')}
            <TextField size={size} InputLabelProps={{ style: { fontSize: 13 } }} {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField size={size} InputLabelProps={{ style: { fontSize: 13 } }} {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
}
