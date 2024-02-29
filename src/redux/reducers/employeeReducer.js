import * as types from '../constants';

const initialState = {};

export default function EmployeeReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.EMPLOYEE_FORM_REQUEST:
      return {
        isFormLoaded: false
      };

    case types.EMPLOYEE_FORM_SUCCESS:
      return {
        isFormLoaded: true
      };

    default:
      return state;
  }
}
