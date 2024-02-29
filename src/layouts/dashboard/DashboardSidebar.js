import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// routes
import { COMING_SOON, ROUTES } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
import { MENU_ICONS } from '../../utils/constants';
import { GET_SALESMEN } from '../../redux/constants';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = '13.5rem';
const COLLAPSE_WIDTH = '6.3rem';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

// ----------------------------------------------------------------------

function IconCollapse() {
  return <></>;
}

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const dispatch = useDispatch();
  const rolewiseMenu = useSelector((state) => state.MasterDataReducer.rolewiseMenu);
  const [sidebarConfig, setSidebarConfig] = useState(null);
  const { EDIT_SCHEDULE, SCHEDULEVIEWER, ADDCUSTOMER, CUSTOMERVIEW } = ROUTES;

  const handleActionDispatch = (type, data = []) => dispatch({ type, data });

  useEffect(() => {
    if (rolewiseMenu) {
      const sidebarConf = [];
      rolewiseMenu.forEach((menu) => {
        const { name, code, subMenu } = menu;
        const sidebarMenu = {
          title: name,
          path: ROUTES[code] || '',
          icon: MENU_ICONS?.map((icons) => (icons.code === code ? icons.icon : '')),
          children: subMenu?.map((sbMenu) => {
            const path = ROUTES[sbMenu.code] || '';
            return { title: sbMenu.name, path, isPending: !path || path === COMING_SOON };
          })
        };
        sidebarConf.push({ ...sidebarMenu });
      });
      setSidebarConfig(sidebarConf);
    }
  }, [rolewiseMenu]);

  const { pathname } = useLocation();

  useEffect(() => {
    const isRemoveEditScheduleData = pathname === EDIT_SCHEDULE || pathname === SCHEDULEVIEWER;
    const isRemoveCustomerViewData = pathname === CUSTOMERVIEW || pathname === ADDCUSTOMER;
    if (!isRemoveEditScheduleData) {
      localStorage.removeItem('editSchedData');
    }
    if (!isRemoveCustomerViewData) {
      localStorage.removeItem('filterPayload');
      handleActionDispatch(GET_SALESMEN, []);
    }
  }, [pathname]);

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    // if (isOpenSidebar) {
    //   onCloseSidebar();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isOpenSidebar]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 1,
          pt: 1,
          pb: 0,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Box sx={{ display: 'inline-flex' }}>
            <Logo />
          </Box>

          <MHidden width="lgDown">
            {!isCollapse && <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
          </MHidden>
        </Stack>

        {/* {isCollapse ? (
          <MyAvatar sx={{ mx: 'auto', mb: 2 }} />
        ) : (
          <Link underline="none" component={RouterLink} to={PATH_DASHBOARD.user.account}>
            <AccountStyle>
              <MyAvatar />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {user?.displayName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user?.role}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        )} */}
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />

      <Box sx={{ flexGrow: 1 }} />

      {/* {!isCollapse && (
        <Stack spacing={3} alignItems="center" sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center' }}>
          <DocIllustration sx={{ width: 1 }} />

          <div>
            <Typography gutterBottom variant="subtitle1">
              Hi, {user?.displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Need help?
              <br /> Please check our docs
            </Typography>
          </div>
          <Button href={PATH_DOCS} target="_blank" variant="contained">
            Documentation
          </Button>
        </Stack>
      )} */}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <Drawer
        open={isOpenSidebar}
        ModalProps={{ onBackdropClick: onCloseSidebar }}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: 'background.default',
            ...(isCollapse && {
              width: COLLAPSE_WIDTH
            }),
            ...(collapseHover && {
              borderRight: 0,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
              boxShadow: (theme) => theme.customShadows.z20,
              bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
            })
          }
        }}
      >
        {renderContent}
      </Drawer>
      {/* <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer> */}
      {/* </MHidden> */}
    </RootStyle>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};
