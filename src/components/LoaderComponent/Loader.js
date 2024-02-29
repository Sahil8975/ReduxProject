import React from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { Backdrop, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ROUTES } from '../../routes/paths';

function Loader({ open }) {
  const theme = useTheme();
  const location = useLocation();
  // const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_MAIN = '#008cc1';
  const upLoader = location.pathname === ROUTES.SCHEDULEVIEWER || ROUTES.ADDCUSTOMER;
  return (
    <div>
      <Backdrop sx={{ color: PRIMARY_MAIN, zIndex: upLoader ? 1400 : (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

Loader.propTypes = {
  open: PropTypes.bool
};

export default Loader;
