import { getData, postData, putData } from '../../../utils/rest-services';
import { APIS, API_V1 } from '../../../utils/apiList';

export const getSalesmen = (id, isApplyUser = false) =>
  getData(`${API_V1}/${APIS.GET_SALESMEN}?legaEntityId=${id}&isApplyUserFilter=${isApplyUser}`, false, true);

export const getLegalEntitiesByRegion = (body) =>
  postData(`${API_V1}/${APIS.GET_LEGAL_ENTITIES_BY_REGION}`, body, false, true);

export const getLocations = (id) => getData(`${API_V1}/${APIS.GET_LOCATIONS}${id}`, false, true);

export const getFilteredCustomers = (body) => postData(`${API_V1}/${APIS.GET_FILTERED_CUSTOMERS}`, body, false, true);

export const getCustomerGroups = (id) => getData(`${API_V1}/${APIS.GET_CUSTOMER_GROUPS}${id}`, false, true);

export const getCustomerClassifications = (id) =>
  getData(`${API_V1}/${APIS.GET_CUSTOMER_CLASSIFICATIONS}${id}`, false, true);

export const getHasLocationContact = (id) => getData(`${API_V1}/${APIS.GET_HAS_LOCATION_CONTACT}${id}`, false, true);

export const getCountryPhoneCode = () => getData(`${API_V1}/${APIS.GET_COUNTRY_PHONE_CODE}`, false, true);
