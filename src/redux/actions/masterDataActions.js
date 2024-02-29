import {
  ethnicityList,
  genderList,
  nationalityList,
  clinicWardList,
  titlePrefixList,
  disciplineList,
  subDisciplineList,
  orderStatusList
} from '../../services/masterDataService';
import * as types from '../constants';

export const getEthnicityList = () => async (dispatch) => {
  await dispatch({ type: types.GET_ETHNICITY_LIST_REQUEST });
  try {
    const res = await ethnicityList();
    return dispatch({
      type: types.GET_ETHNICITY_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_ETHNICITY_LIST_FAILURE, err });
  }
};

export const getGenderList = () => async (dispatch) => {
  await dispatch({ type: types.GET_GENDER_LIST_REQUEST });
  try {
    const res = await genderList();
    return dispatch({
      type: types.GET_GENDER_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_GENDER_LIST_FAILURE, err });
  }
};

export const getNationalityList = () => async (dispatch) => {
  await dispatch({ type: types.GET_NATIONALITY_LIST_REQUEST });
  try {
    const res = await nationalityList();
    return dispatch({
      type: types.GET_NATIONALITY_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_NATIONALITY_LIST_FAILURE, err });
  }
};

export const getClinicWardList = () => async (dispatch) => {
  await dispatch({ type: types.GET_CLINICWARD_LIST_REQUEST });
  try {
    const res = await clinicWardList();
    return dispatch({
      type: types.GET_CLINICWARD_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_CLINICWARD_LIST_FAILURE, err });
  }
};

export const getTitlePrefixList = () => async (dispatch) => {
  await dispatch({ type: types.GET_TITLEPREFIX_LIST_REQUEST });
  try {
    const res = await titlePrefixList();
    return dispatch({
      type: types.GET_TITLEPREFIX_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_TITLEPREFIX_LIST_FAILURE, err });
  }
};

export const getDisciplineList = () => async (dispatch) => {
  await dispatch({ type: types.GET_DISCIPLINE_LIST_REQUEST });
  try {
    const res = await disciplineList();
    return dispatch({
      type: types.GET_DISCIPLINE_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_DISCIPLINE_LIST_FAILURE, err });
  }
};

export const getSubDisciplineList = () => async (dispatch) => {
  await dispatch({ type: types.GET_SUBDISCIPLINE_LIST_REQUEST });
  try {
    const res = await subDisciplineList();
    return dispatch({
      type: types.GET_SUBDISCIPLINE_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_SUBDISCIPLINE_LIST_FAILURE, err });
  }
};

export const getOrderStatusList = () => async (dispatch) => {
  await dispatch({ type: types.GET_ORDERSTATUS_LIST_REQUEST });
  try {
    const res = await orderStatusList();
    return dispatch({
      type: types.GET_ORDERSTATUS_LIST_SUCCESS,
      payload: res?.data ? res.data : []
    });
  } catch (err) {
    return dispatch({ type: types.GET_ORDERSTATUS_LIST_FAILURE, err });
  }
};
