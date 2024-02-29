import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

// style
import './Icon-button.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0)
    }
  }
}));

export default function IconButtons() {
  const classes = useStyles();

  return (
    <div className="icon">
      <IconButton color="secondary" className="icon-button" size="large">
        <LocalPrintshopIcon fontSize="small" />
      </IconButton>
      <IconButton color="primary" className="icon-button" size="large">
        <BorderColorTwoToneIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="delete" className="icon-button" size="large">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
