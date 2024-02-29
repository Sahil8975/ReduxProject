import propTypes from 'prop-types';
import NProgress from 'nprogress';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
// material
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/material';
//
import CircularProgress from '@mui/material/CircularProgress';
import Logo from './Logo';

// ----------------------------------------------------------------------

const nprogressStyle = makeStyles((theme) => ({
  '@global': {
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        top: 0,
        left: 0,
        height: 2,
        width: '100%',
        position: 'fixed',
        zIndex: theme.zIndex.snackbar,
        // backgroundColor: theme.palette.primary.main,
        backgroundColor: '#008cc1',
        // boxShadow: `0 0 2px ${theme.palette.primary.main}`
        boxShadow: `0 0 2px #008cc1`
      },
      '& .peg': {
        right: 0,
        opacity: 1,
        width: 100,
        height: '100%',
        display: 'block',
        position: 'absolute',
        transform: 'rotate(3deg) translate(0px, -4px)',
        // boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`
        boxShadow: `0 0 10px '#008cc1', 0 0 5px '#008cc1'`
      }
    }
  }
}));

const RootStyle = styled('div')(() => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: '0.6'
}));

// ----------------------------------------------------------------------

export default function LoadingScreen({ label, ...other }) {
  nprogressStyle();

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  const hideLoader = true;
  if (!hideLoader) {
    return (
      <RootStyle {...other}>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeatDelay: 1,
            repeat: Infinity
          }}
        >
          <Logo sx={{ width: 64, height: 64 }} />
        </motion.div>

        <Box
          component={motion.div}
          animate={{
            scale: [1.2, 1, 1, 1.2, 1.2],
            rotate: [270, 0, 0, 270, 270],
            opacity: [0.25, 1, 1, 1, 0.25],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
          sx={{
            width: 100,
            height: 100,
            borderRadius: '25%',
            position: 'absolute',
            border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`
          }}
        />

        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 270, 270, 0, 0],
            opacity: [1, 0.25, 0.25, 0.25, 1],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity
          }}
          sx={{
            width: 120,
            height: 120,
            borderRadius: '25%',
            position: 'absolute',
            border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`
          }}
        />
      </RootStyle>
    );
  }
  if (hideLoader) {
    return (
      <RootStyle {...other}>
        {label && <span style={{ position: 'relative', left: '3rem', fontSize: '10px' }}>{label}</span>}
        <CircularProgress color="success" disableShrink size={55} thickness={4} sx={{ opacity: '1' }} />
      </RootStyle>
    );
  }
}

LoadingScreen.propTypes = {
  label: propTypes.string
};
