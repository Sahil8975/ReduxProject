import { combineReducers } from 'redux';
import LoginUserDetailsReducer from './loginUserDetailsReducer';
import StaticDropdownReducer from './staticDropdownReducer';
import EmployeeReducer from './employeeReducer';
import ThemeReducer from './themeSettingReducer';
import MasterDataReducer from './masterDataReducer';
import CustomerDataReducer from './customerDataReducer';

export default combineReducers({
  LoginUserDetailsReducer,
  StaticDropdownReducer,
  EmployeeReducer,
  ThemeReducer,
  MasterDataReducer,
  CustomerDataReducer
});
