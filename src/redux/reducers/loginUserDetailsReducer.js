import * as types from '../constants';

const initialState = {
  // loginLoader: false
  userInfo: null,
  fetchLoginUsersData: false,
  rolewiseMenu: null
};

export default function LoginUserDetailsReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.GET_LOGIN_USER_INFO:
      return { ...state, fetchLoginUsersData: false };

    case types.SAVE_LOGIN_USERS_DETAILS_SUCCESS: {
      const userInfo = actions?.data || null;
      return { ...state, userInfo, fetchUsersData: true };
    }

    case types.SAVE_ROLEWISE_MENU: {
      const menus = actions?.data || null;
      return { ...state, menus };
    }

    case types.SAVE_LOGIN_USERS_DETAILS_FAILURE:
      return { ...state, fetchUsersData: true, userInfo: null };

    default:
      return state;
  }
}
