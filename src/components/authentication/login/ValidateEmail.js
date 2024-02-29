import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { Grid, Toolbar, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { Backdrop, CircularProgress } from '@mui/material';
import { NOTIFICATIONS } from '../../../utils/messages';
import DialogComponent from '../../Dialog';
import { LOGIN_PROPS, STATUS } from '../../../utils/constants';
import { ROUTES } from '../../../routes/paths';
import { clearLocalStorage } from '../../../utils/utils';
import useBoolean from '../../../hooks/useBoolean';

const ValidateEmail = () => {
  const navigate = useNavigate();
  const { EMAIL_VERIFICATION_SUCCESS, EMAIL_VERIFICATION_FAILED, ACCESS_CODE_NOT_FOUND } = NOTIFICATIONS;
  const { SUCCESS, FAILED } = STATUS;
  const [loader, setLoader] = useState(true);
  const [dialogOpen, setDialogOpen] = useBoolean(false);
  const [dialogInfo, setDialogInfo] = useState({
    title: '',
    titleType: SUCCESS,
    content: '',
    isSuccess: true,
    proceedButtonText: ''
  });

  const { accessCode } = useParams();
  const { LOGIN, RESET_PASSWORD } = ROUTES;

  const validateUser = async () => {
    const res = accessCode === 'abcde';
    if (res) {
      setDialogInfo({
        ...dialogInfo,
        title: SUCCESS,
        titleType: SUCCESS,
        content: EMAIL_VERIFICATION_SUCCESS,
        proceedButtonText: ''
      });
      handleCardDialogOpen();
    } else {
      setDialogInfo({
        ...dialogInfo,
        title: FAILED,
        titleType: FAILED,
        content: EMAIL_VERIFICATION_FAILED,
        isSuccess: false,
        proceedButtonText: 'Ok'
      });
      handleCardDialogOpen();
    }
    setLoader(false);
  };

  const redirect = (path, state) => navigate(path, state, { replace: true });

  const handleCardDialogClose = () => {
    setDialogOpen.off();
    if (dialogInfo.isSuccess) {
      redirect(RESET_PASSWORD, { state: { defaultView: LOGIN_PROPS.RESET_PASSORD } });
    } else {
      redirect(LOGIN, { state: { defaultView: LOGIN_PROPS.FORGOT_PASSWORD } });
    }
  };

  const handleCardDialogOpen = () => setDialogOpen.on();

  useEffect(() => {
    if (accessCode) {
      clearLocalStorage();
      setTimeout(() => {
        validateUser();
      }, 2000);
    } else {
      setDialogInfo({
        ...dialogInfo,
        title: SUCCESS,
        titleType: SUCCESS,
        content: ACCESS_CODE_NOT_FOUND,
        isSuccess: false
      });
      handleCardDialogOpen();
    }
  }, []);

  return (
    <>
      <DialogComponent
        open={dialogOpen}
        handleClose={handleCardDialogClose}
        handleProceed={handleCardDialogClose}
        title={dialogInfo.title}
        titleType={dialogInfo.titleType}
        content={dialogInfo.content}
        contentProps={{ style: { marginBottom: '-2rem', marginTop: '1rem' } }}
        isCancelButton={false}
        proceedButtonText={dialogInfo.proceedButtonText}
      />
      <Helmet title="Validate User" />
      <Toolbar>
        <Container maxWidth="xl">
          <Grid item xs={12}>
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <Grid
                onClick={() => navigate(LOGIN)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <img
                  src="/static/home/rezaLogo.png"
                  alt="reza"
                  style={{ padding: '0 1.1rem 0 1.1rem', cursor: 'pointer' }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </Toolbar>
    </>
  );
};

export default ValidateEmail;
