import * as types from '../constants';

export const LoadEmployeeForm = () => async (dispatch) => {
  await dispatch({ type: types.EMPLOYEE_FORM_REQUEST });
  setTimeout(() => dispatch({ type: types.EMPLOYEE_FORM_SUCCESS }), 1500);
};
