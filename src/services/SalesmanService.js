import { postData } from '../utils/rest-services';

export const getSalesman = (url, data) => postData(url, data);
