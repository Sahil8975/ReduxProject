import { getData, postData, putData } from '../../../utils/rest-services';
import { APIS, API_V1 } from '../../../utils/apiList';

export const getDeliveryModes = (id) => getData(`${API_V1}/${APIS.GET_DELIVERY_MODES}${id}`, false, true);

export const getPaymentTerms = (id) => getData(`${API_V1}/${APIS.GET_PAYMENT_TERMS}${id}`, false, true);

export const getCollectors = (id) => getData(`${API_V1}/${APIS.GET_COLLECTORS}${id}`, false, true);

export const getBusinessSectors = (id) => getData(`${API_V1}/${APIS.GET_BUSINESS_SECTORS}${id}`, false, true);

export const getBusinessIndustries = (id) => getData(`${API_V1}/${APIS.GET_BUSINESS_INDUSTRIES}${id}`, false, true);

export const getIncoterms = (id) => getData(`${API_V1}/${APIS.GET_INCOTERMS}${id}`, false, true);

export const getCustomerGroups = (id) => getData(`${API_V1}/${APIS.GET_CUSTOMER_GROUPS}${id}`, false, true);

export const getCurrencies = (id) => getData(`${API_V1}/${APIS.GET_CURRENCIES}${id}`, false, true);

export const getRegions = (id) => getData(`${API_V1}/${APIS.GET_REGION_LIST}${id}`, false, true);

export const getSalesTaxGroups = (id) => getData(`${API_V1}/${APIS.GET_SALES_TAX_GROUPS}${id}`, false, true);

export const getOrganizationIdentificationTypes = (id) =>
  getData(`${API_V1}/${APIS.GET_ORGANIZATION_IDENTIFICATION_TYPES}${id}`, false, true);

export const getCustomersDDL = (id, searchKey) =>
  getData(
    `${API_V1}/${APIS.GET_ADD_CUSTOMERS}?legalEntityId=${id}${searchKey ? `&searchKey=${searchKey}` : ''}`,
    false,
    true
  );

export const getLocationDDL = (event, id, searchKey) =>
  getData(
    `${API_V1}/${APIS.GET_ADD_CUSTOMERS}?customerId=${id}${searchKey ? `&searchKey=${searchKey}` : ''}`,
    false,
    true
  );

export const addCustomer = (body) => postData(`${API_V1}/${APIS.ADD_CUSTOMER}`, body, false, true);

export const uploadAttachment = (body) => postData(`${API_V1}/${APIS.UPLOAD_ATTACHMENTS}`, body, false, true);

export const addUpdateCustomerLocation = (body) =>
  postData(`${API_V1}/${APIS.ADD_UPDATE_CUSTOMER_LOCATION}`, body, false, true);

export const getLocationNames = (searchKey) =>
  getData(`${API_V1}/${APIS.GET_LOCATION_NAME_LIST}${searchKey ? `?searchKey=${searchKey}` : ''}`, false, true);

export const getLocationNameForContact = (id, searchKey) =>
  getData(
    `${API_V1}/${APIS.GET_ADD_LOCATIONS_NAME}?customerId=${id}${searchKey ? `?searchKey=${searchKey}` : ''}`,
    false,
    true
  );

export const getCustomerDetails = (id) => getData(`${API_V1}/${APIS.GET_CUTOMER_DETAILS}${id}`, false, true);

export const addLocationContact = (body) => postData(`${API_V1}/${APIS.ADD_LOCATION_CONTACT}`, body, false, true);

export const addCustomerContact = (body) => postData(`${API_V1}/${APIS.ADD_CUSTOMER_CONTACT}`, body, false, true);

export const downloadAttachment = (id) => getData(`${API_V1}/${APIS.DOWNLOAD_CUSTOMER_ATTACHMENT}${id}`, false, true);

export const getLocationDetails = (id) => getData(`${API_V1}/${APIS.GET_LOCATION_DETAILS}${id}`, false, true);

export const getLocationContactDetails = (id) =>
  getData(`${API_V1}/${APIS.GET_LOCATION_CONTACT_DETAILS}${id}`, false, true);

export const getCustomerContactDetails = (id) =>
  getData(`${API_V1}/${APIS.GET_CUSTOMER_CONTACT_DETAILS}${id}`, false, true);

export const deleteAttachment = (id) => postData(`${API_V1}/${APIS.DELETE_CUSTOMER_ATTACHMENT}${id}`, '', false, true);

export const submitForApproval = (customerId) =>
  postData(`${API_V1}/${APIS.SUBMIT_FOR_APPROVAL}${customerId}`, false, true);

export const approveCustomer = (body) => postData(`${API_V1}/${APIS.APPROVE_CUSTOMER}`, body, false, true);

export const resubmitForApproval = (customerId, isEscalate) =>
  postData(`${API_V1}/${APIS.RESUBMIT_FOR_APPROVAL}${customerId}&isEscalate=${isEscalate}`, false, true);

export const rejectCustomer = (customerId, isEscalate, reason) =>
  postData(`${API_V1}/${APIS.REJECT_CUSTOMER}${customerId}&isEscalate=${isEscalate}&reason=${reason}`, false, true);
