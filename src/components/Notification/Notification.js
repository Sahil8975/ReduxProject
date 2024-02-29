import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Notification({ open, onClose, severityType, message }) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={2000}
        onClose={onClose}
      >
        <MuiAlert style={{ color: '#FFF' }} elevation={6} variant="filled" onClose={onClose} severity={severityType}>
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Notification;
