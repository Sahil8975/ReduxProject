import { getData, postData, putData } from '../utils/rest-services';

export const getCoustomerDetails = (url) => getData(url);

export const createContract = async (url, data) => postData(url, data);

export const getContractList = (url, data) => postData(url, data);

export const getContractDetails = (url) => getData(url);

export const updateContrcat = (url, data) => putData(url, data);

export const uploadAttachment = (url, data) => postData(url, data);

export const removeAttachment = (url, data) => putData(url, data);

export const getProjects = async (url, data) => postData(url, data);
