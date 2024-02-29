import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import './header.scss';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 0
  }
}));

export default function ProminentAppBar({ header, children, height }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className="header">
        <Toolbar className="toolBar" style={{ minHeight: height }}>
          <Typography className="header" variant="h5">
            {header}
            {children}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ProminentAppBar.propTypes = {
  header: PropTypes.string,
  children: PropTypes.object,
  height: PropTypes.string
};
