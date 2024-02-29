import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  overflow: 'hidden',
  width: 'auto'
});

const MainStyle = styled('div')(({ theme }) => ({
  width: 'auto',
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 20,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP - 12,
    paddingLeft: theme.spacing(-8),
    paddingRight: theme.spacing(-8)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  const toggleDashSide = () => {
    console.log(open);
    setOpen(!open);
  };

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} toggleSidebar={() => toggleDashSide()} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />{' '}
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          })
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
