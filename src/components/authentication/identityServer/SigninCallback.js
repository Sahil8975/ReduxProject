import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Grid, Toolbar, Container } from '@material-ui/core';
import DialogComponent from '../../Dialog';
import { LOGIN_PROPS, STATUS } from '../../../utils/constants';
import { ROUTES } from '../../../routes/paths';
import { clearLocalStorage } from '../../../utils/utils';
import useBoolean from '../../../hooks/useBoolean';
import Loader from '../../LoaderComponent/Loader';
import { signInRedirect } from './services/AuthService';

const SigninCallback = () => {
  const navigate = useNavigate();
  const { SUCCESS } = STATUS;
  const [loader, setLoader] = useState(true);
  const [dialogOpen, setDialogOpen] = useBoolean(false);
  const dialogInfo = {
    title: '',
    titleType: SUCCESS,
    content: '',
    isSuccess: true,
    proceedButtonText: ''
  };

  const { LOGIN, RESET_PASSWORD, DASHBOARD } = ROUTES;

  const validateUser = async () => {
    await signInRedirect();
    setLoader(false);
    redirect(DASHBOARD);
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

  useEffect(() => {
    clearLocalStorage();
    setTimeout(() => {
      validateUser();
    }, 2000);
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
      <Helmet title="Reza Hygiene OMS" />
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
          <Loader open={loader} />
        </Container>
      </Toolbar>
    </>
  );
};

export default SigninCallback;
