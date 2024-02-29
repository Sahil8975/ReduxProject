import {
  POST_OFFICE,
  POST_CONTRACTS,
  POST_SERVICE_SUBJECT,
  GET_LEGAL_ENTITIES,
  POST_LEGAL_ENTITIES,
  GET_COUNTRY,
  GET_BUSINESS_TYPES,
  GET_REGIONS,
  GET_REGIONS_WITH_HIERARCHY,
  GET_BUSINESS_SUB_TYPES,
  SAVE_ROLEWISE_MENU,
  IS_DATA_LOADING,
  SAVE_ROLES,
  SAVE_SALESMANS,
  SAVE_SERVICEMANS,
  GET_CURRIENCY_CODES,
  GET_FUNDING_TYPES,
  GET_SERVICE_ORDER_STATUS,
  GET_PROJECT_STATUS
} from '../constants';
import { SEVICE_DASHBOARD_FILTER_MASTER_DATA, TASKS } from '../../components/ServiceBoard/data';
import { PREFERRED_NAMES } from '../../utils/constants';
import { MOBILE_WAREHOUSE_ITEM_LIST } from '../../services/tempApiResponses';

const {
  PROJECT_STATUS,
  STATUS,
  CONTRACT,
  LOCATION,
  CALL_OUT_REASONS,
  CUSTOMERS,
  CURRENCYS,
  PROJECTS,
  STOCK_CODES,
  RATIOS,
  COUNTRY_CODE,
  PROJECT_CLASSIFICATION,
  PROJECT_BUSINESS_CATEGORY,
  FD_BUSINESS_UNIT,
  PROJECT_TYPE,
  HOUR_COST_CAT_ID,
  HOUR_COST_CATEGORY_DESCRIPTION,
  PREFERRED_TIMING,
  SERVICE_FREQUENCY,
  INVOICE_FREQUENCY,
  SCHEDULED_INVOICE_FREQUENCY,
  SEND_INVOICE_TO,
  NUMBERS_IN_WORDS,
  FIRST_SERVICE_DATE
} = SEVICE_DASHBOARD_FILTER_MASTER_DATA;

const initialState = {
  country: [],
  office: [],
  status: STATUS,
  contract: CONTRACT,
  location: LOCATION,
  salesmens: [],
  servicemens: [],
  customers: CUSTOMERS,
  callOutReasons: CALL_OUT_REASONS,
  serviceSubject: [],
  currency: CURRENCYS,
  contracts: [],
  projects: PROJECTS,
  stockCodes: STOCK_CODES,
  ratios: RATIOS,
  tasks: TASKS,
  countryCode: COUNTRY_CODE,
  roles: [],
  legalEntity: [],
  businessType: [],
  projectClassification: PROJECT_CLASSIFICATION,
  businessSubType: [],
  projectBusinessCategory: PROJECT_BUSINESS_CATEGORY,
  fdBusinessUnit: FD_BUSINESS_UNIT,
  projectType: PROJECT_TYPE,
  hourCostCatID: HOUR_COST_CAT_ID,
  hourCostCatDescription: HOUR_COST_CATEGORY_DESCRIPTION,
  regions: [],
  regionsWithHierarchy: [],
  rolewiseMenu: null,
  isDataLoading: false,
  preferredNames: Object.keys(PREFERRED_NAMES)?.map((r) => ({ id: r, name: PREFERRED_NAMES[r] })),
  mobileWarehouseItemList: MOBILE_WAREHOUSE_ITEM_LIST,
  preferredTiming: PREFERRED_TIMING,
  serviceFrequency: SERVICE_FREQUENCY,
  invoiceFrequency: INVOICE_FREQUENCY,
  scheduledInvoiceFrequency: SCHEDULED_INVOICE_FREQUENCY,
  sendInvoiceTo: SEND_INVOICE_TO,
  numberInWords: NUMBERS_IN_WORDS,
  firstServiceDate: FIRST_SERVICE_DATE,
  currencyCode: [],
  fundingTypes: [],
  serviceOrderStatus: [],
  projectStatuses: []
};

export default function MasterDataReducer(state = initialState, actions) {
  const { type, data } = actions;
  switch (type) {
    case POST_OFFICE:
      return { ...state, office: data };
    case POST_CONTRACTS:
      return { ...state, contracts: data };
    case POST_SERVICE_SUBJECT:
      return { ...state, serviceSubject: data };
    case GET_LEGAL_ENTITIES:
      return { ...state, legalEntity: data };
    case POST_LEGAL_ENTITIES:
      return { ...state, legalEntity: data };
    case GET_COUNTRY:
      return { ...state, country: data };
    case GET_BUSINESS_TYPES:
      return { ...state, businessType: data };
    case GET_REGIONS:
      return { ...state, regions: data };
    case GET_REGIONS_WITH_HIERARCHY:
      return { ...state, regionsWithHierarchy: data };
    case GET_BUSINESS_SUB_TYPES:
      return { ...state, businessSubType: data };
    case SAVE_ROLEWISE_MENU:
      return { ...state, rolewiseMenu: data };
    case SAVE_ROLES:
      return { ...state, roles: data };
    case SAVE_SALESMANS:
      return { ...state, salesmens: data };
    case SAVE_SERVICEMANS:
      return { ...state, servicemens: data };
    case IS_DATA_LOADING:
      return { ...state, isDataLoading: data };
    case GET_CURRIENCY_CODES:
      return { ...state, currencyCode: data };
    case GET_FUNDING_TYPES:
      return { ...state, fundingTypes: data };
    case GET_SERVICE_ORDER_STATUS:
      return { ...state, serviceOrderStatus: data };
    case GET_PROJECT_STATUS:
      return { ...state, projectStatuses: data };
    default:
      return { ...state };
  }
}
