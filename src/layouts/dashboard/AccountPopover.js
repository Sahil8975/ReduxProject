import { useRef, useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import lockFill from '@iconify/icons-eva/lock-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Stack, Button, Box, MenuItem, Typography, Tooltip, Grid } from '@mui/material';
// components
import { MIconButton } from '../../components/@material-extend';
import * as authService from '../../components/authentication/identityServer/services/AuthService';
import MenuPopover from '../../components/MenuPopover';
import SettingMode from '../../components/settings/SettingMode';
import { isViewAllowedForRole, isDisplayName } from '../../utils/utils';
import { NOTIFICATIONS } from '../../utils/messages';

import {
  LANGUAGE_CODES,
  LANGUAGES_CODES_RTL_ORIENTATION,
  ROLE_NAME,
  COMPONENTS,
  STATUS,
  ROLE_SPECIFIC_VIEWS,
  BUILD_VERSION,
  LOG_USER_ACTIVITY,
  LOCAL_STORAGE_KEYS,
  FontFamily,
  PrimaryLight
} from '../../utils/constants';
import { SAVE_LOGIN_USERS_DETAILS_SUCCESS } from '../../redux/constants';
import useSettings from '../../hooks/useSettings';
import DialogComponent from '../../components/Dialog';
import RenderComponent from '../../components/RenderComponent';
import { logUserActivity } from '../../utils/rest-services';
import { updateDisplayName } from '../../services/displayNameService';
import { APIS, API_V1 } from '../../utils/apiList';
import { ROUTES } from '../../routes/paths';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  { label: 'Change Password', icon: lockFill, linkTo: '#' }
  // { label: 'Profile', icon: personFill, linkTo: '#' },
  // { label: 'Settings', icon: settings2Fill, linkTo: '#' }
];

// ----------------------------------------------------------------------

function AccountPopover() {
  const { onChangeDirection, onChangeLang, themeMode } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const loginUserDetails = useSelector((state) => state.LoginUserDetailsReducer);
  const { EN } = LANGUAGE_CODES;
  // const [language, setLanguage] = useState(EN);
  const language = EN;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const userInfo = loginUserDetails?.userInfo;
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });

  const { displayName, preferredNameOption, preferredTheme, defaultUserScreen, version } = userInfo || {
    displayName: '',
    preferredNameOption: '',
    preferredTheme: ''
  };
  const [payload, setPayload] = useState({
    userName: displayName,
    preferredNameOption,
    preferredTheme,
    defaultUserScreen,
    version: '',
    clientId: ''
  });

  // const [userDetails, setUserDetails] = useState({ ...userInfo });
  const { preferredNames } = masterData;
  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;
  const componentSet = [
    {
      control: TEXT_FIELD,
      label: 'navbar.userName',
      key: 'userName',
      columnWidth: 12,
      isRequired: true,
      isError: isError && (!payload.userName || isDisplayName(payload.userName)),
      helperText:
        (isError && !payload.userName && 'Enter Display Name') ||
        (isError && isDisplayName(payload.userName) && 'Invalid Display Name')
    },
    {
      control: SELECT_BOX,
      label: 'navbar.prefName',
      placeholder: 'navbar.prefName',
      key: 'preferredNameOption',
      columnWidth: 12,
      options: preferredNames,
      isRequired: true,
      select: true,
      isError: isError && !payload.preferredNameOption,
      helperText: isError && !payload.preferredNameOption && 'Select Preferred Name',
      isSelecteAllAllow: false
    }
  ];

  const dialogActionsBtns = [
    {
      control: BUTTON,
      variant: 'contained',
      color: 'warning',
      groupStyle: { minWidth: '5.5rem' },
      handleClickButton: () => handleClose(),
      btnTitle: 'Cancel',
      tooltipTitle: 'Click to cancel'
    },
    {
      control: BUTTON,
      color: 'success',
      groupStyle: { minWidth: '5.5rem', marginLeft: '0.7rem' },
      handleClickButton: () => handleSaveUserName(),
      btnTitle: 'Save',
      tooltipTitle: 'Click to save display Settings'
    }
  ];

  const handleOpen = () => {
    if (location.pathname !== ROUTES.COUNTRIES) {
      logUserActivity(
        sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID),
        LOG_USER_ACTIVITY.USER_VIEWPAGE,
        location.pathname
      );
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const logoutHandler = async () => authService.logout();

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  // const handleChangeLanguage = (event) => setLanguage(event.target.value);

  const handleSaveUserName = async () => {
    if (!payload.userName || isDisplayName(payload.userName) || !payload.preferredNameOption) {
      setIsError(true);
    } else {
      const tempPayload = {
        id: userInfo?.id,
        displayName: payload?.userName,
        preferredNameOption: payload?.preferredNameOption,
        preferredTheme: themeMode,
        defaultUserScreen,
        version: '',
        clientId: ''
      };
      const res = await updateDisplayName(`${API_V1}/${APIS.UPDATE_DISPLAYNAME}`, tempPayload);
      if (res?.isSuccessful) {
        dispatch({
          type: SAVE_LOGIN_USERS_DETAILS_SUCCESS,
          data: {
            ...userInfo,
            preferredNameOption: payload?.preferredNameOption,
            displayName: payload?.userName
          }
        });
        if (location.pathname === ROUTES.USERS) {
          navigate(ROUTES.USERS, { state: { isReloadUserList: true } });
        }
        setIsError(false);
        setOpen(false);
      } else {
        setShowAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: t('dialog.error'),
          content: res?.error || NOTIFICATIONS.SOMETHING_WENT_WRONG
        });
      }
    }
  };

  const handleDispNameDialogClose = () => setShowConfirmBox(false);

  const handleDispNameDialogOpen = () => setShowConfirmBox(true);

  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs });

  const handleChangeData = (key, val) => {
    updatePayload({ [key]: val });
  };

  useEffect(() => {
    if (userInfo) {
      setPayload({
        userName: userInfo.displayName,
        preferredNameOption: userInfo.preferredNameOption,
        preferredTheme: userInfo.preferredTheme
      });
    }
  }, [userInfo]);

  useEffect(() => {
    onChangeDirection({ target: { value: LANGUAGES_CODES_RTL_ORIENTATION.includes(language) ? 'rtl' : 'ltr' } });
    i18n.changeLanguage(language);
    onChangeLang(language);
  }, [language]);

  useEffect(() => {
    setPayload({ ...payload, preferredTheme: themeMode });
  }, [themeMode]);

  return (
    <>
      <DialogComponent
        open={alertBox.open}
        handleClose={handleCloseAlertBox}
        title={alertBox.title}
        titleType={alertBox.titleType}
        content={alertBox.content}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
      />
      <DialogComponent
        open={showConfirmBox}
        handleClose={handleDispNameDialogClose}
        titleType={STATUS.SUCCESS}
        title="Success"
        // maxWidth="md"
        content="Display settings changed successfully!"
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
        color="success"
      />
      <Stack direction="row" spacing={2} sx={{ textAlign: 'center', alignItems: 'center' }}>
        {userInfo?.role && isViewAllowedForRole(ROLE_SPECIFIC_VIEWS.SHOW_ADD_CALLOUT_BTN, userInfo?.role) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_CALL_OUT)}
            variant="contained"
            size="small"
            style={{ position: 'relative', top: -3 }}
          >
            Add Callout
          </Button>
        )}
        <Typography variant="body1" sx={{ color: '#faebd7', mx: 1, fontFamily: FontFamily }} noWrap>
          {userInfo?.preferredNameOption === 'name' ? userInfo?.name : ''}
          {userInfo?.preferredNameOption === 'displayName' ? userInfo?.displayName : ''}
          {userInfo?.preferredNameOption === 'shortName' ? userInfo?.shortName : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: '#faebd7', fontFamily: FontFamily }} noWrap>
          {(userInfo?.role && `(${userInfo?.role})`) || ''}
        </Typography>
        <Button onClick={logoutHandler} sx={{ color: PrimaryLight, fontFamily: FontFamily }}>
          {t('Logout')}
        </Button>
      </Stack>
      <Tooltip title="Settings">
        <MIconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            color: '#faebd7',
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute'
                // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
              }
            })
          }}
        >
          {/* <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" /> */}
          <Box component={Icon} icon={settings2Fill} />
        </MIconButton>
      </Tooltip>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
        <Box sx={{ pl: 2, pr: 2, pt: 1.5 }}>
          <SettingMode />
        </Box>
        <Box sx={{ pl: 2, pr: 2, pt: 2 }}>
          <Stack direction={{ xs: 'column' }} spacing={{ xs: 2, sm: 2 }}>
            {componentSet?.map((comp, i) => (
              <RenderComponent key={i} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
            ))}
            <Grid container spacing={1}>
              <Grid item xs={12} style={{ display: 'flex', marginTop: '-1rem', marginLeft: '-0.5rem' }}>
                {dialogActionsBtns?.map((comp, ind) => (
                  <RenderComponent key={ind} metaData={comp} ind={ind} />
                ))}
              </Grid>
            </Grid>
            {/* LANGUAGES?.map((lang) => (
                <option key={lang.val} value={lang.val}>
                  {lang.name}
                </option>
              )) */}
          </Stack>
        </Box>
        {MENU_OPTIONS?.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5, textDecoration: 'line-through' }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />
            {t([option.label])}
          </MenuItem>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.8rem' }}>
          <Typography variant="caption">Build Version: {BUILD_VERSION}</Typography>
        </Box>
      </MenuPopover>
    </>
  );
}

export default memo(AccountPopover);
