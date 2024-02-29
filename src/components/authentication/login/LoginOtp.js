import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { Typography, Button, Container, Paper, Grid, Link, Avatar, CssBaseline, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { makeStyles } from '@mui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
  grid: {
    // backgroundColor: 'grey',
    height: '50vh',
    textAlign: 'center'
  },
  avatar: {
    margin: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

export function LoginOtp({ maxWidth, open, handleClose, verifyOtp }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const maxNum = 4;
  const correctOtp = '1111';

  const [value, setValue] = useState('');

  const handleChange = (val) => setValue(val);

  const handleOnClick = () => {
    if (value === correctOtp) {
      verifyOtp();
    } else {
      alert('Please enter valid OTP');
    }
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={handleClose}>
      <DialogContent>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <Grid
              container
              // style={{ backgroundColor: 'white' }}
              className={classes.grid}
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item container justify="center">
                <Grid item container alignItems="center" direction="column">
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography component="h1" variant="h5">
                      Verification Code
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Paper elevation={0}>
                  <Typography variant="h6">Please enter the verification code</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} container justify="center" alignItems="center" direction="column">
                <Grid item spacing={3} justify="center" sx={{ pb: '1rem' }}>
                  <OtpInput
                    value={value}
                    onChange={(val) => handleChange(val)}
                    numInputs={maxNum}
                    separator={
                      <span>
                        <strong>.</strong>
                      </span>
                    }
                    inputStyle={{
                      width: '3rem',
                      height: '3rem',
                      margin: '0 1rem',
                      fontSize: '2rem',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.3)'
                    }}
                  />
                  {value.length === maxNum && value !== correctOtp && (
                    <Box sx={{ pt: '0.3rem', pl: '1rem' }}>
                      <p className="error">Please enter valid OTP</p>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          {t('dialog.cancel')}
        </Button>
        <Button autoFocus onClick={handleOnClick}>
          {t('dialog.proceed')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// export default LoginOtp;
