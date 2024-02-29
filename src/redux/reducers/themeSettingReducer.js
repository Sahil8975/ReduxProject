import * as types from '../constants';

const initialState = {
  theme: 'light'
};

export default function ThemeSettingReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.THEME_SETTING_DARK:
      return {
        ...state,
        theme: 'dark'
      };
    case types.THEME_SETTING_LIGHT:
      return {
        ...state,
        theme: 'light'
      };
    default:
      return {
        ...state,
        theme: 'light'
      };
  }
}
