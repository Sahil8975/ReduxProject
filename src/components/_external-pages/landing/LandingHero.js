import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import flashFill from '@iconify/icons-eva/flash-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { varFadeIn, varFadeInUp, varWrapEnter, varFadeInRight } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: 'common.white',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 960,
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    textAlign: 'center'
  }
}));

const HeroOverlayStyle = styled(motion.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  filter: 'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh'
  }
}));

// ----------------------------------------------------------------------

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        {/* <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" variants={varFadeIn} /> */}

        <Container maxWidth="lg" style={{ alignContent: 'center' }}>
          <ContentStyle>
            <div style={{ paddingLeft: '273px' }}>
              <motion.div variants={varFadeInRight}>
                <Typography variant="h3" sx={{ color: 'common.grey' }}>
                  {t('LandingHero.WelcomeTo')}
                  <br />
                  {/* t('LandingHero.OperationManagementSystem') */}
                </Typography>
              </motion.div>
            </div>
            <div style={{ position: 'relative', marginTop: '200px' }}>
              <HeroImgStyle alt="hero" src="/static/home/omslogo.png" variants={varFadeInUp} />
            </div>
            <motion.div variants={varFadeInRight} />
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: 'auto' } }} />
    </>
  );
}
