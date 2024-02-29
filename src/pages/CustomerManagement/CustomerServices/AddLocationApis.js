import axios from 'axios';
import { GOOGLE_MAP, API_REQ_TYPE, API_RESPONSE_CODES } from '../../../utils/constants';
import { ERRORS } from '../../../utils/messages';
import * as authService from '../../../components/authentication/identityServer/services/AuthService';

const { SAUDI_POST_CR_API_KEY, API_KEY, SAUDI_POST_NAGEOCODE_API_KEY } = GOOGLE_MAP;

const handleSuccessResponse = (res) => {
  const { SUCCESS } = API_RESPONSE_CODES;
  if (res.status === SUCCESS) {
    return res.data;
  }
  return res;
};

const handleErrorResponse = async (err) => err;
// {
//   const { UNAUTHORISED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYLOAD_ERROR } = API_RESPONSE_CODES;
//   if (
//     [UNAUTHORISED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYLOAD_ERROR].includes(
//       err?.response?.status
//     )
//   ) {
//     const { status, errors, data, statusText } = err.response;
//     if (status === UNAUTHORISED) {
//       authService.logout();
//     }
//     const error = (errors && errors) || (data.errors && data.errors) || statusText;
//     // const error = (errors && Object.values(errors)[0]) || (data.errors && Object.values(data.errors)[0]) || statusText;
//     return { error, errorCode: status || BAD_REQUEST, isSuccessful: false, data: data?.data };
//   }
//   if (err) {
//     const errRes = err.toJSON();
//     if (errRes.message === ERRORS.NETWORK_ERROR) {
//       authService.logout();
//     }
//     return { error: errRes, errorCode: INTERNAL_SERVER_ERROR, isSuccessful: false, data: null };
//   }
//   return err;
// };

const getData = (url, config = '') =>
  axios
    .get(url, config)
    .then((res) => handleSuccessResponse(res))
    .catch((err) => handleErrorResponse(err, { type: API_REQ_TYPE.GET, url }));

export const getSaudiPostApi = (crNumber) => {
  const apiURL = `https://apina.address.gov.sa/NationalAddress/v3.1/AddressByCRNumber/cr-number?language=E&format=JSON&crnumber=${crNumber}&api_key=${SAUDI_POST_CR_API_KEY}`;
  const res = getData(apiURL);
  return res;
};

export const getAddressGoogleApi = (lat, lng) => {
  const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
  const res = getData(apiURL);
  return res;
};

export const getLatlngGoogleApi = (address) => {
  const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
  const res = getData(apiURL);
  return res;
};

export const getLatlngSaudiApi = (lat, lng) => {
  const apiURL = `https://apina.address.gov.sa/NationalAddress/FullNationalAddressByGeocode/FullNationalAddressByGeocode?language=E&format=JSON&lat=${lat}&long=${lng}`;
  const res = getData(apiURL, {
    headers: {
      api_key: '0a3f1e91b8854f679dd447a3df7c7ee6',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
      // 'Access-Control-Allow-Headers': 'api_key, Accept,Access-Control-Allow-Origin,Access-Control-Allow-Methods'
      // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, HEAD, DELETE'
    }
  });
  return res;
};
