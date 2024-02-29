import { getData, postData, putData, deleteData } from '../utils/rest-services';

export const getUserList = async (url, data) => postData(url, data);

export const addLeaveEntry = async (url, data) => postData(url, data);

export const leavesData = async (url, data) => postData(url, data);

export const removeLeave = (url, data) => deleteData(url, data);
