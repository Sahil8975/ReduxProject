import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Container, Avatar, Menu, MenuItem, Stack, TextField } from '@mui/material';
// hooks
import { useState, useEffect } from 'react';
import useOffSetTop from '../../hooks/useOffSetTop';
import useSettings from '../../hooks/useSettings';

// components
import Logo from '../../components/Logo';
import { MHidden } from '../../components/@material-extend';
//
import image from '../../assets/images/img_avatar.png';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import { logout } from '../../utils/auth-service';
import { LANGUAGES, LANGUAGE_CODES, LANGUAGES_CODES_RTL_ORIENTATION } from '../../utils/constants';
import { ROUTES } from '../../routes/paths';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('md')]: {
    height: APP_BAR_DESKTOP
  }
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const navigate = useNavigate();
  const { onChangeDirection } = useSettings();
  const { t, i18n } = useTranslation();
  const { EN, AR } = LANGUAGE_CODES;
  // Code for Menu Items
  const [isOpen, setOpen] = useState(null);
  const [isOpenList, setOpenList] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [isOpenMaxHeight, setOpenMaxHeight] = useState(null);

  const { LOGIN, DASHBOARD } = ROUTES;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = async (option) => {
    setOpen(null);
    if (option === 'Logout') {
      navigate(LOGIN);
    }
  };

  const isOffset = useOffSetTop(100);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [language, setLanguage] = useState(EN);

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    onChangeDirection({ target: { value: LANGUAGES_CODES_RTL_ORIENTATION.includes(language) ? 'rtl' : 'ltr' } });
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <AppBar color="default" sx={{ boxShadow: 0 }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: 'background.default',
            height: { md: APP_BAR_DESKTOP - 16 }
          })
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <RouterLink to={DASHBOARD}>
            <Logo />
          </RouterLink>
          <Box sx={{ flexGrow: 1 }} />

          {/* <MHidden width="mdDown">
            <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden>

          <MHidden width="mdUp">
            <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden> */}

          <Avatar src={image} sx={{ width: 40, height: 40 }} onClick={handleOpen} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <TextField
              size="small"
              select
              fullWidth
              label={t('Navbar.Language')}
              placeholder={t('Navbar.Language')}
              SelectProps={{ native: true }}
              onChange={handleChangeLanguage}
              value={language}
              sx={{ ml: '10px', height: '30px' }}
            >
              {LANGUAGES?.map((lang) => (
                <option key={lang.val} value={lang.val}>
                  {lang.name}
                </option>
              ))}
            </TextField>
          </Stack>
          <Menu keepMounted id="simple-menu" anchorEl={isOpen} onClose={handleClose} open={Boolean(isOpen)}>
            {['Profile', 'My account', 'Logout'].map((option) => (
              <MenuItem key={option} onClick={() => handleClose(option)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
