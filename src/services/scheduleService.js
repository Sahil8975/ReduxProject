import { postData } from '../utils/rest-services';

export const getScheduleOrdersList = (url, data) => postData(url, data);

export const getScheduleMapViews = (url, data) => postData(url, data);
