import { Log, UserManager } from 'oidc-client';

import { clientRoot } from '../helpers/Constants';
import { clearLocalStorage, clearSessionStorage, clearCookies, hardReload } from '../../../../utils/utils';
import { logUserActivity } from '../../../../utils/rest-services';
import { ENV_VAR, LOCAL_STORAGE_KEYS, LOG_USER_ACTIVITY } from '../../../../utils/constants';
import { API_V1, APIS } from '../../../../utils/apiList';
import { getRolewiseMenus } from '../../../../services/masterDataService';

const { STS_AUTHORITY, CLIENT_ID, CLIENT_ROOT, REDIRECT_URI, RESPONSE_TYPE, CLIENT_SCOPE } = ENV_VAR;
const settings = {
  authority: STS_AUTHORITY,
  client_id: CLIENT_ID,
  redirect_uri: `${CLIENT_ROOT}${REDIRECT_URI}`,
  silent_redirect_uri: `${CLIENT_ROOT}${REDIRECT_URI}`,
  post_logout_redirect_uri: clientRoot,
  response_type: RESPONSE_TYPE,
  scope: CLIENT_SCOPE
};

const userManager = new UserManager(settings);

Log.logger = console;
Log.level = Log.INFO;

export const getUser = () => userManager.getUser().then((user) => user);

export const login = () => userManager.signinRedirect();

export const renewToken = () => userManager.signinSilent();

export const logout = () => {
  logUserActivity(sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID), LOG_USER_ACTIVITY.LOGOUT);
  userManager.clearStaleState();
  userManager.removeUser();
  clearLocalStorage();
  clearSessionStorage();
  clearCookies();
  return userManager.signoutRedirect();
};

export const signInSilentRedirect = async () =>
  userManager
    .signinSilentCallback()
    .then((user) => {
      console.log('signinSilentCallback: ', user);
      return user;
    })
    .catch((error) => console.log(error));

export const signInRedirect = async () =>
  userManager
    .signinRedirectCallback()
    .then((user) => {
      console.log('signInRedirect: ', user);
      return user;
    })
    .catch((error) => console.log(error));

export const getRolewiseMenu = (role) => getRolewiseMenus(`${API_V1}/${APIS.GET_ROLEWISE_MENU}?role=${role}`);
