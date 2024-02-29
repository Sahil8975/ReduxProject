import * as React from 'react';
import { TextField, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FormLabel from '@mui/material/FormLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '2px',
      width: '95px'
    }
  }
}));

export default function AgeSection({ age }) {
  const classes = useStyles();
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormLabel>Age</FormLabel>
      <TextField size="small" variant="outlined" value={age.years} label="Year(s)" />
      <TextField size="small" label="Month(s)" value={age.months} variant="outlined" />
      <TextField size="small" label="Day(s)" value={age.days} variant="outlined" />
    </form>
  );
}
