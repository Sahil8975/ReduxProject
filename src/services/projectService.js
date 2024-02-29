import { deleteData, getData, postData, putData } from '../utils/rest-services';

export const getNewProjectDetails = (url) => getData(url);

export const getExistingProjectDetails = (url) => getData(url);

export const getServiceFrequencyList = (url) => getData(url);

export const getServiceLevelList = (url) => getData(url);

export const getServiceSubjectList = (url, payload) => postData(url, payload);

export const getProjectTypeList = (url) => getData(url);

export const getProjectStatusList = (url) => getData(url);

export const getSingotoriesInformation = (url) => getData(url);

export const getProjectNumberList = (url) => getData(url);

export const getPreferredTimeList = (url) => getData(url);

export const addNewProject = (url, payload) => postData(url, payload);

export const updateProject = (url, payload) => putData(url, payload);

export const addServiceSubject = (url, payload) => postData(url, payload);

export const getServiceOccurrencesList = (url, payload) => postData(url, payload);

export const createServiceOrders = (url, payload) => postData(url, payload);

export const getServiceOrderDatesList = (url, payload) => getData(url, payload);

export const getProjectZonesList = (url) => getData(url);

export const getServiceTasksList = (url, payload) => postData(url, payload);

export const getServiceTaskItemDdlList = (url, payload) => postData(url, payload);

export const getServiceTaskItemList = (url, payload) => postData(url, payload);

export const getProjectDetailsFromPrevProject = (url) => getData(url);

export const getServiceOrdersByProjectId = (url) => getData(url);

export const removeServiceSubjectTask = (url) => deleteData(url);

export const removeServiceOrder = (url) => deleteData(url);

export const createAdditionalServiceOrder = (url, payload) => postData(url, payload);

export const updateServiceOrder = (url, payload) => putData(url, payload);

export const getAllServiceSubjectsForProject = (url) => getData(url);

export const saveFirstServiceDateAndProjectZones = (url, payload) => putData(url, payload);

export const refreshCustomerData = (url) => getData(url);

export const copyServiceDetails = (url, payload) => putData(url, payload);

export const saveEditServiceSubject = (url, payload) => putData(url, payload);

export const removeEditServiceSubjectTask = (url) => deleteData(url);

export const validateServiceSubjectQty = (url, payload) => postData(url, payload);
