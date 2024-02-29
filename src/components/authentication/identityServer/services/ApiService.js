import axios from 'axios';
import { apiRoot } from '../helpers/Constants';
import * as authService from './AuthService';

export const callApi = () =>
  authService.getUser().then((user) => {
    if (user) {
      if (user.access_token) {
        return _callApi(user.access_token).catch((error) => {
          if (error.response.status === 401) {
            return authService.renewToken().then((renewedUser) => _callApi(renewedUser.access_token));
          }
          throw error;
        });
      }
      return authService.renewToken().then((renewedUser) => _callApi(renewedUser.access_token));
    }
    throw new Error('user is not logged in');
  });

const _callApi = (token) => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };

  return axios.get(`${apiRoot} test`, { headers });
};
