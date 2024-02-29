import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import AlertDialog from '../AlertDialog';
import { ROUTES } from '../../routes/paths';

function FallBack() {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate(ROUTES.DASHBOARD);
  };
  const PreviousPage = () => {
    navigate(-1);
  };
  return (
    <Grid>
      <AlertDialog
        isOpen
        title="Something might have went wrong!"
        dialogContent={
          <img
            src="/static/illustrations/illustration_went_wrong.png"
            alt="error"
            style={{ width: '100%', height: '100%' }}
          />
        }
        positiveText="Go Back To Home"
        negativeText="Previous Page"
        handleSubmit={handleSubmit}
        handleNegative={PreviousPage}
      />
    </Grid>
  );
}

export default FallBack;
