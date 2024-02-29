import { postData, getData } from '../utils/rest-services';

export const getServiceman = (url, data) => postData(url, data);

export const getServiceDetailCard = (url) => getData(url);
