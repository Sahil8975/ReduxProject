import { postData, putData } from '../utils/rest-services';

export const getCustomer = (url, data) => postData(url, data);

export const updateShortName = async (url, body) => putData(url, body);
