import moment from 'moment';
import 'moment-timezone';
import { ROLE_SPECIFIC_VIEWS, PATTERN, REGX_TYPE, ROLES, MAX_LENGTH } from './constants';

const {
  EMAIL,
  URL,
  NAME,
  PHONE,
  SHORT_NAME,
  ADD_SPACE_TO_CAMEL_CASE,
  DISPLAY_NAME,
  GENERAL_DISCOUNT,
  NUMBERS,
  CONTRACT_NAME,
  NO_OF_SERVICES,
  AGREEMENT_LPO_NUM,
  USERNAME,
  UNIT_PRICE
} = PATTERN;

const { NUM, DISCOUNT, CONTRACT, NO_OF_SERVICES_RX, AGREEMENT_LPO_NUM_RX, UNIT_PRICE_RX } = REGX_TYPE;

export const setLocalStorageItem = (key, val) => localStorage.setItem(key, val);

export const setSessionStorageItem = (key, val) => sessionStorage.setItem(key, val);

export const clearLocalStorage = () => localStorage.clear();

export const clearSessionStorage = () => sessionStorage.clear();

export const hardReload = () => window.location.reload(true);

export const getFormattedDate = (format, date = new Date()) => moment(date).format(format);

export const getStartOfWeek = (format, date = new Date()) => moment(date).startOf('week').format(format);

export const getEndOfWeek = (format, date = new Date()) => moment(date).endOf('week').format(format);

export const getPrevWeekDate = (date = new Date()) => moment(date).subtract(1, 'weeks');

export const getNextWeekDate = (date = new Date()) => moment(date).add(1, 'weeks');

export const getPrevMonthDate = (date = new Date()) => moment(date).subtract(1, 'month');

export const getNextMonthDate = (date = new Date()) => moment(date).add(1, 'month');

export const getNextDay = (date = new Date()) => moment(date).add(1, 'day');

export const getPrevDay = (date = new Date()) => moment(date).subtract(1, 'day');

export const isSameDate = (firstDate, secondDate = new Date(), durationKey = 'day') =>
  moment(firstDate).isSame(secondDate, durationKey);

export const clearCookies = () => {
  const cookies = document.cookie.split(';');
  console.log('cookies: ', cookies);
  if (isArray(cookies)) {
    cookies.forEach((ck) => (document.cookie = `${ck}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`));
  }
};

export const ageCalculator = (date) => {
  const a = moment(new Date());
  const b = moment(date);

  const years = a.diff(b, 'year');
  b.add(years, 'years');

  const months = a.diff(b, 'months');
  b.add(months, 'months');

  const days = a.diff(b, 'days');
  return { years, months, days };
};

export const convertDate = (yymmdd, centuryCode) => {
  const d = yymmdd; // YYMMDD
  const yy = d.substr(0, 2);
  const mm = d.substr(2, 2);
  const dd = d.substr(4, 2);
  const yyyy = centuryCode === '0' ? `20${yy}` : `19${yy}`;
  return `${yyyy}-${mm}-${dd}`;
};

export const convertUTCToLocal = (date) => {
  if (date) {
    return moment.utc(date).local().format();
  }
  return '';
};

export const mapperFunction = (array) => {
  const mappedArray = array?.map((data) => ({ id: data.id, label: data.name }));
  return mappedArray;
};

export const sortListOfObjects = (list, key) => {
  let sortOrder = 1;
  if (key[0] === '-') {
    sortOrder = -1;
    key = key.substr(1);
  }
  list.sort((a, b) => {
    switch (true) {
      case a[key]?.toLowerCase() < b[key]?.toLowerCase():
        return -1 * sortOrder;
      case a[key]?.toLowerCase() > b[key]?.toLowerCase():
        return 1 * sortOrder;
      default:
        return 0;
    }
  });
  return list;
};

export const isValidStr = (str, type) => {
  switch (type) {
    case NUM:
      return NUMBERS.test(str);
    case DISCOUNT:
      return GENERAL_DISCOUNT.test(str);
    case CONTRACT:
      return CONTRACT_NAME.test(str);
    case NO_OF_SERVICES_RX:
      return NO_OF_SERVICES.test(str);
    case AGREEMENT_LPO_NUM_RX:
      return AGREEMENT_LPO_NUM.test(str);
    case UNIT_PRICE_RX:
      return UNIT_PRICE.test(str);
    default:
      return false;
  }
};

// Validation patterns
export const isEmail = (str) => !EMAIL.test(str);
export const isUrl = (str) => !URL.test(str);
export const isPhone = (str) => !PHONE.test(str);
export const isName = (str) => !NAME.test(str);
export const isShortName = (str) => !SHORT_NAME.test(str);
export const isDisplayName = (str) => !DISPLAY_NAME.test(str);

export const differenceBetweenArr = (arrayOne, arrayTwo, keyName) =>
  arrayOne?.filter(({ [keyName]: id1 }) => !arrayTwo.some(({ [keyName]: id2 }) => id2 === id1));

export const isObject = (val) => val && val instanceof Object;

export function isArray(arrayElement) {
  return arrayElement && Array.isArray(arrayElement) && arrayElement.length > 0;
}

export const convertStrToSpaceSeparated = (str) => (str && str.replace(ADD_SPACE_TO_CAMEL_CASE, ' $1').trim()) || '';

export const handleContractNumberMasking = (prefixVal, val, maxLength) => {
  const trimmedVal = prefixVal ? val.split('_').pop() * 1 : val * 1;
  if (trimmedVal) {
    if (isValidStr(trimmedVal, REGX_TYPE.NUM)) {
      const trimmedValLen = trimmedVal.toString().length;
      if (trimmedValLen <= maxLength) {
        const zerosToAdd = maxLength - trimmedValLen;
        const prefixedZeros =
          (zerosToAdd > 0 &&
            Array(zerosToAdd)
              .fill()
              .map(() => 0)
              .join('')) ||
          '';
        return `${prefixVal}${prefixedZeros}${trimmedVal}`;
      }
      return `${prefixVal}${trimmedVal.toString().slice(1)}`;
    }
  }
  return prefixVal ? `${prefixVal}00000` : '0000';
};

export const detectBrowser = () => {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
    return 'Opera';
  }
  if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'Chrome';
  }
  if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'Safari';
  }
  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'Firefox';
  }
  if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode) {
    return 'IE';
  }
  return 'Unknown';
};

export const isViewAllowedForRole = (action, role) => {
  const { SUPER_ADMIN, SERVICE_MANAGER, OPS_ADMIN, OPS_MANAGER, SALESMAN } = ROLES;
  let allowedRoles = [];
  switch (action) {
    case ROLE_SPECIFIC_VIEWS.SHOW_ADD_CALLOUT_BTN:
      allowedRoles = [SUPER_ADMIN, OPS_ADMIN, OPS_MANAGER];
      break;
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_ITEM_CONSUMPTION:
      allowedRoles = [SUPER_ADMIN, SERVICE_MANAGER];
      break;
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_UNFINISHED_TASK:
      allowedRoles = [SUPER_ADMIN, SERVICE_MANAGER, OPS_ADMIN, OPS_MANAGER];
      break;
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_PROJECT_PENDING_RENEWAL:
      allowedRoles = [SUPER_ADMIN, SERVICE_MANAGER, OPS_ADMIN, OPS_MANAGER, SALESMAN];
      break;
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_PROJECT_PENDING_UNINSTALLATION:
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_PARTIALLY_COMPALTED_TASKS:
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_PROJECT_ON_HOLD:
      allowedRoles = [SUPER_ADMIN, OPS_ADMIN, OPS_MANAGER, SALESMAN];
      break;
    case ROLE_SPECIFIC_VIEWS.DASHBOARD_INVOICE_DISCREPANCIES:
      allowedRoles = [SUPER_ADMIN];
      break;
    default:
      allowedRoles = [];
      break;
  }
  return allowedRoles.includes(role);
};

export const truncate = (str) => {
  const truncatedString = str.substring(0, MAX_LENGTH.CONTRACT_NAME);
  return truncatedString;
};

export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
};

export const deepCopyArrayOfObjects = (arr) => (isArray(arr) && arr.map((a) => ({ ...a }))) || [];

export const getUniqueObjectsFrom = (arr, key) =>
  (isArray(arr) && key && [...new Map(arr.map((item) => [item[key], item])).values()]) || arr;
