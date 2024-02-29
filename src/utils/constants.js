import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import SyncIcon from '@mui/icons-material/Sync';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { orange } from '@mui/material/colors';

export const BUILD_VERSION = '240223.1.1';

export const BLOCKED_SERVICE_ORDER_STATUS_ID = [700, 600, 702, 703];

export const ICON_COLOR = {
  ORANGE: orange[700]
};

export const FontFamily = 'Montserrat';
export const PrimaryMain = '#141e46';
export const SecondaryMain = '#008cc1';
export const PrimaryLight = '#98cbdb';

export const LOCATIONS = {
  JEDDHA: { lat: 21.558713873263724, lng: 39.16410297768899 },
  ABHA: { lat: 18.250744611029106, lng: 42.508570484878675 },
  KHOBAR: { lat: 26.219221999751944, lng: 50.189752998270215 },
  RIYADH: { lat: 24.728739887715445, lng: 46.65738871242791 },
  SAUDI_ARABIA: { lat: 23.367615360504534, lng: 45.17417651393956 }
};

export const getDialogBoldContent = (title, title2, name, details) => {
  switch (name) {
    case 'refreshCustomer':
      return (
        <div>
          Customer data refreshed successfully for <b>{title}</b>
          <br />
          {details}
        </div>
      );
    case 'contractNumber':
      return (
        <div>
          Contract <b>{title}</b> updated successfully
        </div>
      );
    case 'deleteTask':
      return (
        <div>
          Selected task <b>{title}</b> will get deleted, do you want to continue?
        </div>
      );
    case 'deleteSparePart':
      return (
        <div>
          Selected task item <b>{title}</b> will get deleted, do you want to continue?
        </div>
      );
    case 'contractCreatedSuccessfully':
      return (
        <div>
          Contract created successfully for <b>{title}</b> and Contract Number is <b>{title2}</b>. Do you want to
          proceed with Project creation?
        </div>
      );
    case 'zoneDetails':
      return (
        <div>
          <h3 style={{ display: 'inline' }}>{title}</h3> is already assigned to service order so cannot delete it
        </div>
      );
    case 'serviceOrderGridTask':
      return (
        <div>
          Do you want to delete <b>{title}</b> ?
        </div>
      );
    default:
      return null;
  }
};

const {
  REACT_APP_CLIENT_ID,
  REACT_APP_RESPONSE_TYPE,
  REACT_APP_CLIENT_SCOPE,
  REACT_APP_STS_AUTHORITY,
  REACT_APP_API_ENDPOINT,
  REACT_APP_API_ENDPOINT_V2,
  REACT_APP_API_ENDPOINT_V3,
  REACT_APP_CLIENT_ROOT,
  REACT_APP_REDIRECT_URI
} = process?.env;

export const ENV_VAR = {
  CLIENT_ID: REACT_APP_CLIENT_ID,
  RESPONSE_TYPE: REACT_APP_RESPONSE_TYPE,
  CLIENT_SCOPE: REACT_APP_CLIENT_SCOPE,
  STS_AUTHORITY: REACT_APP_STS_AUTHORITY,
  API_ENDPOINT: REACT_APP_API_ENDPOINT,
  API_ENDPOINT_V2: REACT_APP_API_ENDPOINT_V2,
  API_ENDPOINT_V3: REACT_APP_API_ENDPOINT_V3,
  CLIENT_ROOT: REACT_APP_CLIENT_ROOT,
  REDIRECT_URI: REACT_APP_REDIRECT_URI
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'userId',
  ROLE: 'role'
};

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const API_BASE_PATH = 'https://lims-admin-api.azurewebsites.net';

// Valid upload file type constants
export const VALID_FILE_FORMAT = {
  INVOICES: '.jpg, .jpeg, .png, .gif, .JPEG, .PNG, .JPG,.pdf,.PDF',
  INVOICES_LIST: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'JPEG', 'PNG', 'JPG', 'pdf', 'PDF']
};

export const LANGUAGE_CODES = { EN: 'en', AR: 'ar' };

const { EN, AR } = LANGUAGE_CODES;

export const LANGUAGES = [
  { name: 'English', val: EN },
  { name: 'عربي', val: AR } // Arabic
];

export const LANGUAGES_CODES_RTL_ORIENTATION = [AR];

export const SERVICE_TYPES = {
  CALL_OUT: 'callOut',
  SCHEDULE: 'scheduled',
  CUSTOM: 'custom',
  CANCELLED: 'cancelled',
  COMPLETED: 'complete',
  REFILL: 'refill',
  MAINTENANCE: 'maintenance',
  AUDIT: 'audit',
  CREDITHOLD: 'credithold',
  STOCKHOLD: 'stockhold',
  CUSTOMERHOLD: 'customerhold',
  GET_PERMIT: 'getPermit',
  EARLY_MORNING_JOB: 'earlymorningJob',
  LATE_NIGHT_JOB: 'latenightJob',
  PO_NEEDED: 'poNeeded',
  DEVICE_NOT_ALLOWED: 'deviceNotAllowed',
  ADDITIONAL_SERVICEMEN: 'hasAdditionalServicemen'
};

export const GROUP_BY = {
  SERVICE_MEN: 'Servicemen',
  CUSTOMER: 'Customers'
};

export const MAX_LANES = 10;

export const REGX_TYPE = {
  NUM: 'num',
  DISCOUNT: 'discount',
  CONTRACT: 'contractName',
  NO_OF_SERVICES_RX: 'noOfServicesRx',
  AGREEMENT_LPO_NUM_RX: 'agreementLpoNoRx',
  UNIT_PRICE_RX: 'unitPrice'
};

// validations regex
export const PATTERN = {
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  URL: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)/g,
  // PHONE: /^(?!0000000000)(?!000-000-0000)(?:\?1[-.●]?)?\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
  // PHONE: /^\([2-9][\d]{2}\) [\d]{3}-[\d]{4}$/,
  PHONE: /^(\+\d?)?\d{7,9}$/,
  NAME: /^[a-zA-Z][a-zA-Z ]*$/, // Alphabets
  USERNAME: /^[a-zA-Z0-9.]*$/, // Alphanumeric with dot
  ALPHANUMERIC: /^[a-zA-Z0-9]*$/, // Alphanumeric
  SHORT_NAME: /^[a-zA-Z]+$/,
  ADD_SPACE_TO_CAMEL_CASE: /([A-Z])/g,
  DISPLAY_NAME: /^[a-zA-Z.\\-\s]*$/, // No special Character except dot and space and hyphen
  AGREEMENT_LPO_NUM: /^[a-zA-Z0-9-]*$/, // Alphanumeric with hyphen
  GENERAL_DISCOUNT: /^\d{1,2}$/, // Number value till two digit only
  NO_OF_SERVICES: /^\d{1,3}$/, // Number value till two digit only
  CONTRACT_NAME: /^[ A-Za-z0-9|&]*$/s, // AphaNumeric and special characters |, & only.
  NUMBERS: /^\d+$/, // Number only.
  UNIT_PRICE: /^\d+(\.\d{0,2})?$/ // Numbers with 2 decimal point
};

export const DATE_FORMAT = {
  INPUT_FORMAT: 'dd-MM-yyyy',
  VIEWS: ['year', 'month', 'day'],
  DATE_NAME_FORMAT: 'ddd DD-MM-YYYY',
  SERVICE_DATE: 'dddd DD-MM-YYYY',
  DATE_DAY_FORMAT: 'DD-MM-YYYY',
  DATE_YEAR_FORMAT: 'YYYY-MM-DD',
  YEAR_DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss'
};

export const COMPONENTS = {
  TEXT_FIELD: 'TEXT_FIELD',
  SELECT_BOX: 'SELECT_BOX',
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  DATEPICKER: 'DATEPICKER',
  TEXT_AREA: 'TEXT_AREA',
  MULTI_SELECT_BOX: 'MULTI_SELECT_BOX',
  BUTTON: 'BUTTON',
  LINK: 'LINK',
  NONE: 'NONE',
  TYPOGRAPHY: 'TYPOGRAPHY',
  ICON: 'ICON'
};

export const NOTIFICATION_MSG_FORMAT = { type: '', msg: '', status: false };

export const SNACK_BAR_MESSAGE_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

export const LOGIN_PROPS = {
  LOGIN_PAGE: 'login',
  FORGOT_USERNAME: 'forgotUsername',
  FORGOT_PASSWORD: 'forgotPwd',
  RESET_PASSORD: 'resetPassword'
};

export const STATUS = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  WARNING: 'Warning',
  ERROR: 'Error'
};
export const rowsPerPageOptions = [10, 20, 50, 100, 500];
export const contractListPageOptions = [5, 10];

// Rest service related constants

export const TOKEN_KEY = 'accessToken';

export const API_REQ_TYPE = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
  DELETE: 'delete'
};

export const API_RESPONSE_CODES = {
  SUCCESS: 200,
  SUCCESS_CREATE: 201,
  SUCCESS_NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  PAYLOAD_ERROR: 502
};

export const PREFERRED_NAMES = {
  displayName: 'Display Name',
  shortName: 'Short Name',
  name: 'Name'
};

export const PREFERRED_NAMES_KEYS = {
  displayName: 'displayName',
  shortName: 'shortName',
  name: 'name'
};

export const ROLE_NAME = {
  SuperAdmin: 'Super Admin',
  ITAdmin: 'IT Admin',
  OpsManager: 'Ops Admin',
  OpsAdmin: 'Ops Admin',
  ServiceManager: 'Service Manager',
  VanSalesman: 'Van Salesman',
  Salesman: 'Salesman',
  ServiceMan: 'Service Man',
  DeliveryDriver: 'Delivery Driver',
  MyRole: 'My Role',
  Serviceman: 'Serviceman'
};

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  IT_ADMIN: 'ITAdmin',
  OPS_MANAGER: 'OpsManager',
  OPS_ADMIN: 'OpsAdmin',
  SERVICE_MANAGER: 'ServiceManager',
  VAN_SALESMAN: 'VanSalesman',
  SALESMAN: 'Salesman',
  SERVICEMAN: 'ServiceMan',
  DELIVERY_DRIVER: 'DeliveryDriver',
  MY_ROLE: 'MyRole'
};

export const MAX_LENGTH = {
  CUSTOMER_NUMBER: 5,
  SHORT_NAME: 15,
  MAX_CHARACTER_LIMIT: 25,
  NOTE_CHARACTER_LIMIT: 500,
  CONTRACT_NAME: 60,
  NOTES: 500,
  SERIAL_NUMBER: 50
};

export const MENU_ICONS = [
  { code: 'DASHBOARD', icon: <HomeIcon /> },
  { code: 'ADMIN', icon: <SupervisorAccountIcon /> },
  { code: 'CUSTOMERMANAGEMENT', icon: <ManageAccountsIcon /> },
  { code: 'MASTLIST', icon: <SupportAgentIcon /> },
  { code: 'CONTRACTPROJ', icon: <AccountTreeIcon /> },
  { code: 'MANAGESCHEDULE', icon: <DateRangeIcon /> },
  { code: 'INVENTORYMGMT', icon: <InventoryIcon /> },
  { code: 'INVOICING', icon: <ReceiptIcon /> },
  { code: 'CREDITNOTES', icon: <CreditScoreIcon /> },
  { code: 'REPORTS', icon: <AssessmentIcon /> },
  { code: 'IPADSYNCLOGS', icon: <TabletMacIcon /> },
  { code: 'ROUTEANALYSIS', icon: <AltRouteIcon /> },
  { code: 'DISCOUNTWORKFLOW', icon: <PlayForWorkIcon /> },
  { code: 'EQPTBUILDER', icon: <HomeRepairServiceIcon /> },
  { code: 'AXSYNC', icon: <SyncIcon /> },
  { code: 'MOBILEWAREHOUSE', icon: <WarehouseIcon /> },
  { code: 'SALESMAN', icon: <AssignmentIndIcon /> },
  { code: 'EXPORT', icon: <FileUploadIcon /> },
  { code: 'DEACTIVATEUSERS', icon: <MoveUpIcon /> }
];

export const COUNTRY_LEGALENTITIES = [
  { id: '2', legalEntityName: 'HSD' },
  { id: '4', legalEntityName: 'RHE' },
  { id: '1', legalEntityName: 'RHB' },
  { id: '3', legalEntityName: 'RHQ' }
];
export const TRANSACTION_CURRENCY = [
  { id: '1', name: 'BHD' },
  { id: '2', name: 'SAR' },
  { id: '3', name: 'QAR' },
  { id: '4', name: 'AED' }
];
export const LOG_USER_ACTIVITY = {
  GET_IP_API: 'https://peerip.glitch.me/',
  WEB_APP: 'Web App',
  LOGIN: 'USER_LOGIN',
  LOGOUT: 'USER_LOGOUT',
  USER_VIEWPAGE: 'USER_VIEWPAGEURL'
};
export const ROLE_SPECIFIC_VIEWS = {
  SHOW_ADD_CALLOUT_BTN: 'SHOW_ADD_CALLOUT_BTN',
  DASHBOARD_ITEM_CONSUMPTION: 'DASHBOARD_ITEM_CONSUMPTION',
  DASHBOARD_UNFINISHED_TASK: 'DASHBOARD_UNFINISHED_TASK',
  DASHBOARD_PROJECT_PENDING_RENEWAL: 'DASHBOARD_PROJECT_PENDING_RENEWAL',
  DASHBOARD_PROJECT_PENDING_UNINSTALLATION: 'DASHBOARD_PROJECT_PENDING_UNINSTALLATION',
  DASHBOARD_PARTIALLY_COMPALTED_TASKS: 'DASHBOARD_PARTIALLY_COMPALTED_TASKS',
  DASHBOARD_PROJECT_ON_HOLD: 'DASHBOARD_PROJECT_ON_HOLD',
  DASHBOARD_INVOICE_DISCREPANCIES: 'DASHBOARD_INVOICE_DISCREPANCIES'
};

export const GOOGLE_MAP = {
  // API_KEY: 'AIzaSyBNNbsS5_M4buC581y36ZDX3N2gpkv22bY', // Old key
  API_KEY: 'AIzaSyCgKdH4PdexaO_kN6AKlVNOrNLjAmKrraI', // New Key
  SAUDI_POST_CR_API_KEY: 'bffb2ad5602946faa271c5dcf9aa9621',
  SAUDI_POST_NAGEOCODE_API_KEY: '0a3f1e91b8854f679dd447a3df7c7ee6',
  MAP_MARKER:
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
};

export const PAYMENT_TYPE = [
  { id: '1', name: 'Billable' },
  { id: '2', name: 'Non Billable' }
];

export const DAYS = [
  { name: 'Sunday', id: 1 },
  { name: 'Monday', id: 2 },
  { name: 'Tuesday', id: 3 },
  { name: 'Wednesday', id: 4 },
  { name: 'Thursday', id: 5 },
  { name: 'Friday', id: 6 },
  { name: 'Saturday', id: 7 }
];

export const MONTHS = [
  {
    id: 1,
    name: 'January'
  },
  {
    id: 2,
    name: 'February'
  },
  {
    id: 3,
    name: 'March'
  },
  {
    id: 4,
    name: 'April'
  },
  {
    id: 5,
    name: 'May'
  },
  {
    id: 6,
    name: 'June'
  },
  {
    id: 7,
    name: 'July'
  },
  {
    id: 8,
    name: 'August'
  },
  {
    id: 9,
    name: 'September'
  },
  {
    id: 10,
    name: 'October'
  },
  {
    id: 11,
    name: 'November'
  },
  {
    id: 12,
    name: 'December'
  }
];

export const MONTH_NUMBERS = [
  {
    id: 1,
    name: 1
  },
  {
    id: 2,
    name: 2
  },
  {
    id: 3,
    name: 3
  },
  {
    id: 4,
    name: 4
  },
  {
    id: 5,
    name: 5
  },
  {
    id: 6,
    name: 6
  },
  {
    id: 7,
    name: 7
  },
  {
    id: 8,
    name: 8
  },
  {
    id: 9,
    name: 9
  },
  {
    id: 10,
    name: 10
  },
  {
    id: 11,
    name: 11
  },
  {
    id: 12,
    name: 12
  }
];

export const PROJECT_STATUS_AX = {
  ACTIVE: 'Active',
  DISCRETE: 'Discrete',
  INACTIVE: 'InActive',
  HIOLD_CUST_REQ: 'Hold Customer Request',
  HOLD_STCK_AVAIL: 'Hold Stock Availability',
  HOLD_CR_HOLD: 'Hold Credit Hold',
  PENFING_RENEWAL: 'Pending Renewal',
  PENFING_UNINSTALLATION: 'Pending Uninstallation',
  PENFING_FINANCIAL_CLOSIN: 'Pending Financial Closing',
  FINANCIALLY_CLOSED: 'Financially Closed',
  COMPLETED: 'Completed',
  CREATED: 'Created',
  PENDING_AX_SYNC: 'PendingAXSync'
};

export const SERVICE_ORDER_STATUS = {
  EMPTY: 'Empty',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'InProgress',
  HOLD_CUSTOMER_REQUEST: 'HoldCustomerRequest',
  HOLD_STOCK_AVAILABILITY: 'HoldStockAvailability',
  HOLD_CREDIT: 'HoldCredit',
  NOT_COMPLETED: 'NotCompleted',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  CALL_OUT_PLANNED: 'CallOutPlanned',
  CALL_OUT_CANECELLED: 'CalloutCancelled',
  CALL_OUT_COMPLETED: 'CalloutCompleted'
};

export const PROJECT_STATUS = [
  { id: 1, name: PROJECT_STATUS_AX.ACTIVE },
  { id: 2, name: PROJECT_STATUS_AX.DISCRETE },
  { id: 3, name: PROJECT_STATUS_AX.INACTIVE },
  { id: 4, name: PROJECT_STATUS_AX.HIOLD_CUST_REQ },
  { id: 5, name: PROJECT_STATUS_AX.HOLD_STCK_AVAIL },
  { id: 6, name: PROJECT_STATUS_AX.HOLD_CR_HOLD },
  { id: 7, name: PROJECT_STATUS_AX.PENFING_RENEWAL },
  { id: 8, name: PROJECT_STATUS_AX.PENFING_UNINSTALLATION },
  { id: 9, name: PROJECT_STATUS_AX.PENFING_FINANCIAL_CLOSIN },
  { id: 10, name: PROJECT_STATUS_AX.FINANCIALLY_CLOSED },
  { id: 11, name: PROJECT_STATUS_AX.COMPLETED },
  { id: 12, name: PROJECT_STATUS_AX.CREATED },
  { id: 13, name: PROJECT_STATUS_AX.PENDING_AX_SYNC }
];

export const UPDATE_SWITCH = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ADD: 'ADD'
};

export const TASK_TYPE = {
  CUSTOM: 'Custom',
  SCHEDULED: 'Scheduled'
};

// export const TASK_TYPE = {
//   CUSTOM: 'Custom Task Checklist',
//   SCHEDULED: 'Scheduled Task Checklist'
// };

export const OWNERSHIP = {
  OWNED_BY_CUSTOMER: 'OwnedByCustomer',
  FREE_ON_LOAN_CUSTOMNER: 'FreeOnLoanAtCustomer',
  FIXED_ASSET: 'FixedAsset'
};

export const OWNERSHIP_TYPE = [
  { name: 'Owned By Customer', value: OWNERSHIP.OWNED_BY_CUSTOMER },
  { name: 'Free On Loan At Customer', value: OWNERSHIP.FREE_ON_LOAN_CUSTOMNER },
  { name: 'Fixed Asset', value: OWNERSHIP.FIXED_ASSET }
];

export const NOTE_TYPE = {
  TASK: 'task',
  TASK_ITEM: 'taskItem',
  SPARE_PART: 'sparePart',
  OPS_ADMIN_NOTES: 'serviceOrderNote'
};
