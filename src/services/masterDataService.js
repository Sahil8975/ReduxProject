import { getData, postData } from '../utils/rest-services';

export const getLegalEntities = async (url) => getData(url);

export const getCountries = async (url) => getData(url);

export const getRegions = async (url) => getData(url);

export const getBusinessTypes = async (url) => getData(url);

export const getBusinessSubTypes = async (url) => getData(url);

export const getrolelist = async (url) => postData(url, {}, false, true);

export const getRegionsWithHierarchy = (url) => getData(url);

export const getRolewiseMenus = (url) => getData(url, false, true);

export const getSalesmanList = async (url, data) => postData(url, data);

export const getSignatoryInformation = async (url, data) => postData(url, data);

export const getCountriesList = async (url) => getData(url);

export const getRegionsList = async (url) => getData(url);

export const getServicemensDdl = (url) => getData(url);

export const getSalesmensDdl = (url) => getData(url);

export const getCurrencyCodes = (url) => getData(url);

export const getFundingTypes = (url) => getData(url);

export const getServiceOrderStatus = (url) => getData(url);
