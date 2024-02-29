import { getData, postData } from '../utils/rest-services';

export const getCustomerData = async (url, data) => postData(url, data);

export const getMaterialPickingListData = async (url, data) => postData(url, data);

export const getStockedDetailedListData = async (url, data) => postData(url, data);
