import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
import { MIconButton } from '../../components/@material-extend';
import AccountPopover from './AccountPopover';
import useOffSetTop from '../../hooks/useOffSetTop';
import Logo from '../../components/Logo';
import './DashboardNavbar.scss';

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func
};

export default function DashboardNavbar({ header, toggleSidebar, props }) {
  const handleSidebarOpen = () => toggleSidebar();
  const isOffset = useOffSetTop(100);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          className="customAppbar"
          position="fixed"
          color={isHome ? 'default' : 'default'}
          sx={{ boxShadow: 0, height: '3rem' }}
        >
          <Toolbar>
            <MIconButton
              onClick={handleSidebarOpen}
              sx={{
                ml: 1,
                color: '#faebd7',
                ...(isHome && { color: 'common.white' }),
                ...(isOffset && { color: 'common.white' })
                // ...(isOffset && { color: 'text.primary' })
              }}
            >
              <Icon icon={menu2Fill} />
            </MIconButton>
            <Logo />
            <h3 style={{ color: 'black' }}>{header}</h3>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
              <AccountPopover />
            </Stack>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </>
  );
}

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  header: PropTypes.string,
  toggleSidebar: PropTypes.func,
  props: PropTypes.object
};
