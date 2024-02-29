import { getData, postData, putData, deleteData } from '../../../utils/rest-services';

export const getTaskItemsWithPreferenceList = (url, payload) => postData(url, payload);

export const getTaskItemDetails = (url, payload) => postData(url, payload);

export const getTaskDetailsByServiceOrder = (url) => getData(url);

export const getServicemenOnLeave = (url) => getData(url);

export const getShiftNextService = (url) => getData(url);

export const getPreferredItemsForItem = (url) => getData(url);

export const getGlobalItems = (url, payload) => getData(url, payload);

export const saveEditScheduleAPI = (url, data) => putData(url, data);

export const removeTaskItems = (url) => deleteData(url);
