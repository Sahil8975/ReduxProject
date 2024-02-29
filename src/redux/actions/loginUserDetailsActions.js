import * as types from '../constants';
import { setLocalStorageItem } from '../../utility/utils';
import { LOCAL_STORAGE_KEYS } from '../../utility/constants';

export function LoginUserDetails(params) {
  return (dispatch) => {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.TIMEZONE, params.userInfo.timeZoneCode);
    dispatch({ type: types.LOGIN_USERS_DETAILS_SUCCESS, params: { ...params, error: false } });
    return params;
  };
}
