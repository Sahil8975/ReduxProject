import { getData, postData } from '../utils/rest-services';

export const getEmployees = (url, data) => postData(url, data, false, true);

export const getColorCode = (url, payload) => postData(url, payload, false, true);

export const validateColorCode = (url, payload) => postData(`${url}`, payload, false, true);

export const getUsers = (url, payload) => postData(url, payload, false, true);

export const getUserProfileDetails = (url) => getData(url, false, true);

export const addUpdateUser = (url, payload) => postData(url, payload, false, true);
