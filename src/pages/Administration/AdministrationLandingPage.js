import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import './AdministrationLandingPage.scss';
import { ROUTES } from '../../routes/paths';

function AdministrationLandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { USERS, COUNTRIESCUR } = ROUTES;
  return (
    <Grid className="administration_main_cls">
      <Grid style={{ marginTop: 0 }} container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            {`${t('administration.administration')}`}
          </Typography>
        </Grid>
        <Grid style={{ marginTop: '2rem' }} item xs={12}>
          <Typography style={{ color: '#637381' }} variant="h6" align="center">
            {`${t('administration.whatDoYouWantToDo')}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '0.1rem' }}>
        <Grid item xs={3}>
          <Grid style={{ marginTop: 0 }} container spacing={3}>
            <Grid item xs={2} style={{ cursor: 'pointer' }}>
              <Grid
                onClick={() => navigate(USERS)}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
              >
                <IconButton style={{ backgroundColor: '#94b1bf', padding: '1rem' }}>
                  <GroupIcon style={{ height: 50, width: 50, color: '#FFF' }} />
                </IconButton>
                <Typography style={{ color: '#637381', marginTop: '0.5rem' }} variant="h6">
                  {`${t('administration.users')}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid style={{ marginTop: 0 }} container spacing={3}>
            <Grid item xs={2} style={{ cursor: 'pointer' }}>
              <Grid
                onClick={() => navigate(COUNTRIESCUR)}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
              >
                <IconButton style={{ backgroundColor: '#94b1bf', padding: '1rem' }}>
                  <GroupIcon style={{ height: 50, width: 50, color: '#FFF' }} />
                </IconButton>
                <Typography style={{ color: '#637381', marginTop: '0.5rem', textAlign: 'center' }} variant="h6">
                  {`${t('administration.countryList')}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdministrationLandingPage;
