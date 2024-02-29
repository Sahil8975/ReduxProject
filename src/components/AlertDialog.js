import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({
  title,
  description,
  isOpen,
  handleClose,
  negativeText,
  positiveText,
  handleSubmit,
  dialogContent
}) => {
  console.log('calling Component...');
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        {dialogContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{negativeText}</Button>
        <Button onClick={handleSubmit} autoFocus>
          {positiveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  negativeText: PropTypes.string,
  positiveText: PropTypes.string,
  handleSubmit: PropTypes.func,
  dialogContent: PropTypes.string
};

export default AlertDialog;
