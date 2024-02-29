import axios from 'axios';
import { API_REQ_TYPE, API_RESPONSE_CODES, ENV_VAR, LOG_USER_ACTIVITY, TOKEN_KEY } from './constants';
import { ERRORS } from './messages';
import * as authService from '../components/authentication/identityServer/services/AuthService';
import { detectBrowser } from './utils';
import { APIS, API_V1 } from './apiList';

const basePathV1 = ENV_VAR.API_ENDPOINT;
const basePathV2 = ENV_VAR.API_ENDPOINT_V2;
// const basePathV3 = ENV_VAR.API_ENDPOINT_V3;

const config = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, HEAD, DELETE'
  }
};

export const logUserActivity = async (userId, activity, url) => {
  if (userId) {
    const res = await fetch(LOG_USER_ACTIVITY.GET_IP_API);
    const data = await res.json();

    const userActivityPayload = {
      userId,
      device: 'Computer',
      operatingSystem: navigator.appVersion,
      ipAddress: data?.ip || '',
      client: LOG_USER_ACTIVITY.WEB_APP,
      browser: detectBrowser(),
      activity,
      url
    };
    postData(`${API_V1}/${APIS.LOG_USER_ACTIVITY}`, userActivityPayload, true);
  }
};

const handleErrorResponse = async (err) => {
  const { UNAUTHORISED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYLOAD_ERROR } = API_RESPONSE_CODES;
  if (
    [UNAUTHORISED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYLOAD_ERROR].includes(
      err?.response?.status
    )
  ) {
    const { status, errors, data, statusText } = err.response;
    if (status === UNAUTHORISED) {
      authService.logout();
    }
    const error = (errors && errors) || (data.errors && data.errors) || statusText;
    // const error = (errors && Object.values(errors)[0]) || (data.errors && Object.values(data.errors)[0]) || statusText;
    return { error, errorCode: status || BAD_REQUEST, isSuccessful: false, data: data?.data };
  }
  if (err) {
    const errRes = err.toJSON();
    if (errRes.message === ERRORS.NETWORK_ERROR) {
      authService.logout();
    }
    return { error: errRes, errorCode: INTERNAL_SERVER_ERROR, isSuccessful: false, data: null };
  }
  return err;
};

const handleSuccessResponse = (res) => {
  const { SUCCESS } = API_RESPONSE_CODES;
  if (res.status === SUCCESS) {
    return res.data;
  }
  // else {
  // }
  // else if ([SUCCESS_CREATE, SUCCESS_NO_CONTENT].includes(res.status)) {
  //   return res;
  // }
  return res;
};

// export const getData = (url, v2 = false, v3 = false) => {
export const getData = (url, v2 = false) => {
  const { accessToken, userId } = sessionStorage;
  if (accessToken && userId) {
    config.headers.Authorization = `bearer ${accessToken}`;
    config.headers.userId = userId;
    return (
      axios
        // .get(`${(v2 && basePathV2) || (v3 && basePathV3) || basePathV1}${url}`, config)
        .get(`${(v2 && basePathV2) || basePathV1}${url}`, config)
        .then((res) => handleSuccessResponse(res))
        .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.GET, url }))
    );
  }
  return '';
};

// export const postData = (url, body, isBaseURL = false) => {
// export const postData = (url, body, v2 = false, v3 = false) => {
export const postData = (url, body, v2 = false) => {
  const { accessToken, userId } = sessionStorage;
  if (accessToken && userId) {
    config.headers.Authorization = `bearer ${accessToken}`;
    config.headers.userId = userId;
    return (
      axios
        // .post(`${(v2 && basePathV2) || (v3 && basePathV3) || basePathV1}${url}`, body, config)
        .post(`${(v2 && basePathV2) || basePathV1}${url}`, body, config)
        .then((res) => handleSuccessResponse(res))
        // .catch((err) => handleErrorResponse(err), { type: API_REQ_TYPE.POST, url, body, isBaseURL });
        .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.POST, url, body }))
    );
  }
  return '';
};

// export const patchData = (url, body, v2 = false, v3 = false) => {
export const patchData = (url, body, v2 = false) => {
  const { accessToken, userId } = sessionStorage;
  if (accessToken && userId) {
    config.headers.Authorization = `bearer ${accessToken}`;
    config.headers.userId = userId;
    return (
      axios
        // .patch(`${(v2 && basePathV2) || (v3 && basePathV3) || basePathV1}${url}`, body, config)
        .patch(`${(v2 && basePathV2) || basePathV1}${url}`, body, config)
        .then((res) => handleSuccessResponse(res))
        .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.PATCH, url, body }))
    );
  }
  return '';
};

// export const putData = (url, body, v2 = false, v3 = false) => {
export const putData = (url, body, v2 = false) => {
  const { accessToken, userId } = sessionStorage;
  if (accessToken && userId) {
    config.headers.Authorization = `bearer ${accessToken}`;
    config.headers.userId = userId;
    return (
      axios
        // .put(`${(v2 && basePathV2) || (v3 && basePathV3) || basePathV1}${url}`, body, config)
        .put(`${(v2 && basePathV2) || basePathV1}${url}`, body, config)
        .then((res) => handleSuccessResponse(res))
        .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.PUT, url, body }))
    );
  }
  return '';
};

// export const deleteData = (url, v2 = false, v3 = false) => {
export const deleteData = (url, v2 = false) => {
  const { accessToken, userId } = sessionStorage;
  if (accessToken && userId) {
    config.headers.Authorization = `bearer ${accessToken}`;
    config.headers.userId = userId;
    return (
      axios
        // .delete(`${(v2 && basePathV2) || (v3 && basePathV3) || basePathV1}${url}`, config)
        .delete(`${(v2 && basePathV2) || basePathV1}${url}`, config)
        .then((res) => handleSuccessResponse(res))
        .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.DELETE, url }))
    );
  }
  return '';
};
