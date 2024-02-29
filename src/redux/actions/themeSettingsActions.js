import * as types from '../constants';

export const ThemeSettingChange = () => async (dispatch) => {
  // await dispatch({ type: types.THEME_SETTING_LIGHT });
  await dispatch({ type: types.THEME_SETTING_DARK });
};
