import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import parse from 'html-react-parser';
import {
  Grid,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  FormHelperText,
  FormControl,
  Tooltip
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AlarmIcon from '@mui/icons-material/Alarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CallIcon from '@mui/icons-material/Call';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Cancelled
import RotateRightIcon from '@mui/icons-material/RotateRight'; // Inprogress
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PanToolIcon from '@mui/icons-material/PanTool';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CommentIcon from '@mui/icons-material/Comment';
import RenderComponent from '../../components/RenderComponent';
import {
  COMPONENTS,
  REGX_TYPE,
  STATUS,
  DAYS,
  MONTHS,
  MONTH_NUMBERS,
  PROJECT_STATUS_AX,
  DATE_FORMAT,
  STATUS as DIALOG_STATUS,
  MAX_LENGTH,
  getDialogBoldContent,
  ICON_COLOR
} from '../../utils/constants';
import { getFormattedDate, isArray, isObject, isValidStr, truncate } from '../../utils/utils';
import { ROUTES } from '../../routes/paths';
import { APIS, API_V1 } from '../../utils/apiList';
import { ProjectDetailsData } from '../contracts/Data';
import UploadFile from '../../components/UploadFile';
import SearchProjectDetails from './SearchProjectDetails';
import useBoolean from '../../hooks/useBoolean';
import { NOTIFICATIONS } from '../../utils/messages';
import DialogComponent from '../../components/Dialog';
import { IS_DATA_LOADING } from '../../redux/constants';
import {
  serviceFreqTypeOpts,
  serviceFrequencyMonthlyTypes1,
  serviceFrequencyYearlyTypes,
  numberInWords
} from './constants';
import {
  getNewProjectDetails,
  getExistingProjectDetails,
  getProjectTypeList,
  getProjectStatusList,
  getSingotoriesInformation,
  getProjectNumberList,
  getPreferredTimeList,
  addNewProject,
  updateProject,
  getServiceFrequencyList,
  getServiceOccurrencesList,
  createServiceOrders,
  getProjectDetailsFromPrevProject,
  getServiceOrdersByProjectId,
  removeServiceSubjectTask,
  removeServiceOrder,
  saveFirstServiceDateAndProjectZones,
  refreshCustomerData,
  copyServiceDetails
} from '../../services/projectService';
import { getSalesmensDdl, getServicemensDdl } from '../../services/masterDataService';
import ServiceGrid from './ServiceGrid';
import NotesDialog from '../../components/notesDialog';
import ServiceSubjectGrid from './ServiceSubjectGrid';

function ProjectCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const MAX_CHAR = { NAME: 60, AGREEMENT_NO: 50 };
  const { scheduledInvoiceFrequency, invoiceFrequency, sendInvoiceTo } = useSelector(
    (state) => state.MasterDataReducer
  );

  const { TEXT_FIELD, BUTTON, SELECT_BOX, DATEPICKER, TYPOGRAPHY, RADIO, CHECKBOX, MULTI_SELECT_BOX, NONE, ICON } =
    COMPONENTS;
  const {
    PROJECT_MANAGEMENT_CONTRACT,
    GET_PROJECT_DETAILS,
    NEW_PROJECT_DETAILS,
    PROJECT_TYPES,
    PROJECT_STATUSES,
    CUSTOMER_MANAGEMENT_LOCATION,
    SIGNOTORIES,
    PROJECTS,
    PREFERRED_TIMES,
    ADD_NEW_PROJECT,
    UPDATE_PROJECTS,
    SERVICE_FREQUENCIES,
    GET_SALESMAN_DDL,
    GET_SERVICEMAN_DDL,
    SERVICE_OCCURRENCES,
    CREATE_SERVICE_ORDERS,
    GET_PROJECT_DETAILS_FROM_PREVIOUS_PROJECT,
    GET_SERVICE_ORDERS_WITH_PROJECT_ID,
    REMOVE_SERVICE_ORDER,
    REMOVE_SERVICE_ORDER_TASK,
    UPDATE_ZONE_FIRST_SERVICE_DATE,
    REFRESH_CUST_DATA,
    COPY_SERVICE_ORDER
  } = APIS;
  const { CONTRACTS, CONTRACT_MANAGEMENT_EDIT_CONTRCAT, ADD_SERVICE_SUBJECT } = ROUTES;
  const [error, setError] = useBoolean(false);
  const [projectTableData, setProjectTableData] = useState([]);
  const [servicemens, setServicemens] = useState([]);
  const [salesmens, setSalesmens] = useState([]);
  const [defSignatory, setDefSignatory] = useState();
  const [existingData, setExistingData] = useState({});
  const { contractId: contractIdFromLocState, projectId: projectIdFromLocState } = location?.state;
  const [payload, setPayload] = useState({
    contractId: contractIdFromLocState || null,
    projectId: projectIdFromLocState || '',
    invoiceAddressId: null,
    invoiceFrequencyId: 0,
    invoiceByNoOfServices: 0,
    businessSubTypeId: null,
    projectExecutionTypeId: '',
    salesManId: 0,
    serviceManId: 0,
    signatoryId: 0,
    contractNumber: '',
    contractName: '',
    agreementNumber: '',
    notes: '',
    discount: 0,
    projectValue: 0.0,
    isEmailNotificationRequired: false,
    projectGroup: '',
    projectBusinessCategory: '',
    businessUnit: '',
    accountNumber: '',
    invoiceAccount: '',
    customerGroup: '',
    paymentTerm: '',
    crNumber: '',
    mainAccount: '',
    customerName: '',
    customerShortName: '',
    legalEntity: '',
    legalEntityId: 0,
    h2Region: '',
    h3BusinessUnit: '',
    h4BusinessSector: '',
    h5BusinessIndustry: '',
    h6Department: '',
    accountCurrency: '',
    projectStatusId: 1,
    contractStatus: '',
    generatedEndDate: '',
    projectClassification: '',
    regionName: '',
    regionId: '',
    projectTypeId: 2,
    previousProjectNumber: null,
    isAdditionalServicemanRequired: false,
    additionalServicemans: [],
    additionalServicemanIds: [],
    email: '',
    isNoOfServicesPicked: false,
    projectEndDate: '',
    locations: [],
    isDeviceAllowed: true,
    isPermitNeeded: false,
    preferredTimingId: null,
    isPONeeded: false,
    projectSignedOn: projectIdFromLocState ? '' : new Date(),
    projectStartDate: projectIdFromLocState ? '' : new Date(),
    firstServiceDate: projectIdFromLocState ? '' : new Date(),
    isRenewedProject: false,
    additionalEmails: '',
    noOfServices: 0,
    folderPath: '',
    attachments: [],
    projectZones: [],
    projectNumber: '',
    locationId: '',
    locationName: '',
    manualEntryDate: '',
    transactionCurrency: '',
    projectStatus: '',
    frequency: '',
    frequencyId: 0,
    dailyIncrementValue: 0,
    weeklyIncrementValue: 0,
    specificWeekdays: [],
    specificMonthDay: 0,
    monthlyIncrementValue: 0,
    specificWeek: 0,
    specificWeekdayMonthly: 0,
    specificMonth: 0,
    hasServiceOrders: false,
    createFromPrevProjId: null
  });
  const [singotories, setSingotories] = useState([]);
  const [additionalServicemenList, setAdditionalServicemenList] = useState(servicemens);
  const [axFields, setAxFields] = useBoolean(false);
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [showSignatoryInfo, setShowSignatoryInfo] = useBoolean(false);
  const [showProjectDetailInfo, setShowProjectDetailInfo] = useBoolean(false);
  const [isErrorBox, setIsErrorBox] = useBoolean(false);
  const [occurance, setOccurance] = useState({});
  const [showServiceFreq, setShowServiceFreq] = useBoolean(projectIdFromLocState || false);
  const [openSearchProjectDetails, setOpenSearchProjectDetails] = useBoolean(false);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [freqSetting, setFreqSetting] = useBoolean(false);
  const [genericAlertBox, setShowGenericAlertBox] = useState({
    open: false,
    title: '',
    titleType: '',
    content: '',
    proceedAction: '',
    showProceedBtn: false,
    cancelButtonText: '',
    proceedButtonText: '',
    maxWidth: '',
    color: '',
    additionalInfoForProceed: null
  });
  const [projectTypes, setProjectTypes] = useState([]);
  const [serviceFrequency, setServiceFrequency] = useState([]);
  const [previousProjects, setPreviousProjects] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [preferredTimings, setPreferredTimings] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [serviceGridData, setServiceGridData] = useState({});
  const [isProjectCompleted, setProjectCompleted] = useState(false);

  const emptyNotesBox = {
    maxWidth: 'sm',
    title: 'Notes',
    open: false,
    content: '',
    key: '',
    label: '',
    noteVal: '',
    maxChars: MAX_LENGTH.NOTES
  };
  const [notesBox, setShowNotesBox] = useState({ ...emptyNotesBox });
  const handleCloseNotesAlertBox = () => {
    setIsFormModified.on();
    setShowNotesBox({ ...notesBox, ...emptyNotesBox });
  };
  const { notes } = payload;

  const getProjectStatus = (status) => {
    if (isArray(statusList)) {
      const res = status && statusList.find((st) => st.id === status * 1);
      return res?.name || '';
    }
  };

  useEffect(() => {
    setProjectCompleted(payload.projectStatus === PROJECT_STATUS_AX.COMPLETED);
    if (payload.projectStatus === PROJECT_STATUS_AX.PENDING_AX_SYNC) {
      setFreqSetting.on();
    } else {
      setFreqSetting.off();
    }
  }, [payload.projectStatus]);

  useEffect(() => {
    if (isArray(serviceOrders)) {
      setServiceOrders([]);
    }
  }, [payload.frequencyId, payload.serviceFrequencyMonthlyTypes, payload.serviceFrequencyYearlyTypes]);

  useEffect(() => {
    if (isArray(serviceOrders)) {
      setServiceOrders([
        ...serviceOrders.map((ord) => ({ ...ord, additionalServicemanIds: payload.additionalServicemanIds }))
      ]);
    }
  }, [payload.additionalServicemanIds]);

  useEffect(() => {
    if (projectIdFromLocState && isArray(servicemens)) {
      getServices(projectIdFromLocState);
    }
  }, [servicemens]);

  // useEffect(() => {
  //   if (!payload.additionalEmails && !payload.email) {
  //     updatePayload({ isEmailNotificationRequired: false });
  //   }
  // }, [payload.additionalEmails]);

  useEffect(() => {
    if (!isArray(serviceOrders)) {
      updatePayload({ hasServiceOrders: false });
    }
  }, [serviceOrders]);

  useEffect(() => {
    if (!projectIdFromLocState) {
      if (payload.email) {
        updatePayload({ isEmailNotificationRequired: true });
      } else {
        updatePayload({ isEmailNotificationRequired: false });
      }
    }
  }, [payload.email]);

  useEffect(() => {
    if (projectIdFromLocState && payload.email && payload.isEmailNotificationRequired) {
      updatePayload({ isEmailNotificationRequired: true });
    } else if (projectIdFromLocState && payload.email && payload.isEmailNotificationRequired === false) {
      updatePayload({ isEmailNotificationRequired: false });
    }
  }, [payload.email, payload.isEmailNotificationRequired]);

  useEffect(() => {
    if (payload.projectStatus) {
      setProjectCompleted(payload.projectStatus === PROJECT_STATUS_AX.COMPLETED);
    }
  }, []);

  useEffect(() => {
    getServicemenList();
    getSalesmenList();
  }, [payload.regionId]);

  useEffect(() => {
    setDefaultSignatory();
  }, [singotories]);

  useEffect(() => {
    if (payload) {
      getServiceOccurrences({ ...payload, projectEndDate: '', noOfServices: 0 });
    }
  }, [payload.isNoOfServicesPicked]);

  useEffect(() => {
    if (isArray(servicemens)) {
      const tempAddntlSrvcmn = servicemens.filter((srvcmn) => srvcmn.id !== payload.serviceManId * 1);
      if (isArray(payload.additionalServicemanIds)) {
        const additionalServicemans = servicemens.filter((mn) => payload.additionalServicemanIds.includes(mn.id)) || [];
        updatePayload({ additionalServicemans });
      }
      setAdditionalServicemenList(tempAddntlSrvcmn);
      deleteMltSlctOptn('additionalServicemans', payload.serviceManId);
    } else if (!projectIdFromLocState) {
      setAdditionalServicemenList([]);
      updatePayload({ additionalServicemans: [], additionalServicemanIds: [] });
    }
  }, [payload.serviceManId, servicemens]);

  useEffect(() => {
    if (payload.contractId) {
      getProjectData();
      getProjectTypes();
      getServiceFrequencies();
      getStatuses();
      getPrefrredTimes();
      if (projectIdFromLocState) {
        getExistingProjectData(projectIdFromLocState);
        // getServices(projectIdFromLocState);
      } else {
        getNewProjectData();
      }
    } else {
      navigate(CONTRACTS);
    }
    // TODO: this is temporary change for development mode
    // navigate(
    //   ADD_SERVICE_SUBJECT,
    //   {
    //     state: {
    //       projectNumber: 'HSDPAB_0010_044_001',
    //       locationName: 'Business Office',
    //       legalEntityId: 1,
    //       businessSubTypeId: null,
    //       contractId: 2198,
    //       projectId: '3169',
    //       servicemens: [
    //         { id: 3, name: 'Anurag', textColor: '#000000', backColor: '#ff3c00' },
    //         { id: 22, name: 'Rahulp', textColor: '#fff', backColor: '#36edd5' }
    //       ],
    //       preferredTimings: [
    //         { id: 5, name: 'Early Morning', toBeNotified: false, displaySequence: 1 },
    //         { id: 2, name: 'Morning', toBeNotified: false, displaySequence: 2 },
    //         { id: 3, name: 'Day', toBeNotified: false, displaySequence: 3 },
    //         { id: 4, name: 'Night', toBeNotified: false, displaySequence: 4 },
    //         { id: 6, name: 'Late Night', toBeNotified: false, displaySequence: 5 },
    //         { id: 1, name: 'Not Specified', toBeNotified: false, displaySequence: 6 }
    //       ]
    //     }
    //   },
    //   { replace: true }
    // );
  }, []);

  // handle change selected file
  const handleDropMultiple = useCallback((acceptedFiles) => {
    // Here we are only taking first selected file
    const file = acceptedFiles[0];
    if (file) {
      if (file && file.type === 'application/pdf') {
        uploadBase64File(file);
      }
    }
  });

  const handleProceedNotesAlertBox = (updatedNote) => {
    updatePayload({ notes: updatedNote });
    handleCloseNotesAlertBox();
  };

  const deleteMltSlctOptn = (key, val) => {
    if (
      key === 'additionalServicemans' &&
      val &&
      isArray(payload.additionalServicemans) &&
      (!payload.projectId || projectIdFromLocState)
    ) {
      const additionalServicemans = payload.additionalServicemans.filter((srvcmn) => srvcmn.id !== val * 1);
      const additionalServicemanIds = additionalServicemans.map((v) => v.id);
      updatePayload({ additionalServicemans, additionalServicemanIds });
    }
  };

  const handleCloseAlertBox = () => {
    setShowAlertBox({ open: false, titleType: '', title: '', content: '' });
    if (payload?.projectStatus !== PROJECT_STATUS_AX.ACTIVE) {
      navigateToEditContract();
    }
  };

  const handleCloseBackAlertBox = () =>
    setShowGenericAlertBox({
      open: false,
      title: '',
      titleType: '',
      content: '',
      proceedAction: '',
      showProceedBtn: false,
      cancelButtonText: '',
      proceedButtonText: '',
      additionalInfoForProceed: null
    });

  const handleProceedBackAlertBox = () => {
    handleCloseBackAlertBox();
    const { proceedAction, additionalInfoForProceed } = genericAlertBox;
    switch (proceedAction) {
      case 'navigateToEditContract':
        navigateToEditContract();
        break;
      case 'deleteServiceOrderTask':
        deleteServiceSubjectTask(additionalInfoForProceed);
        break;
      case 'removeServiceOrder':
        deleteServiceOrder(additionalInfoForProceed);
        break;
      case 'removeServiceOrderOnUI':
        removeServiceOrderOnUI(additionalInfoForProceed.serviceOrderInd);
        break;
      case 'saveNewProjectCall':
        saveNewProject();
        break;
      case 'getProjectDetailsById':
        getProjectDetailsById(additionalInfoForProceed);
        break;
      default:
        break;
    }
  };

  const executionType = [
    { name: 'Regular', value: 2, isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState) },
    { name: 'Trial', value: 1, isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState) }
  ];
  const getHelperText = (key) => {
    switch (key) {
      case 'agreementNumber':
        return payload.agreementNumber
          ? payload.agreementNumber.length > MAX_CHAR.AGREEMENT_NO &&
              `Agreement / LPO Number should not be more than ${MAX_CHAR.AGREEMENT_NO} characters`
          : '';
      default:
        return '';
    }
  };

  const projectDetailsCol1 = [
    {
      control: RADIO,
      groupStyle: { marginTop: '1rem', marginBottom: '0.2rem', marginLeft: '0.1rem' },
      key: 'projectExecutionTypeId',
      label: 'Execution Type',
      showLabel: true,
      options: executionType,
      columnWidth: 5,
      isRequired: true,
      isError: error && !payload?.projectExecutionTypeId,
      helperText: 'Please select execution type',
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState
    },
    {
      control: BUTTON,
      key: 'discrete',
      btnTitle: 'Discrete',
      color: 'success',
      groupStyle: { marginTop: '2.7rem', marginLeft: '-4rem' },
      columnWidth: 2.5,
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState
    },
    {
      control: NONE,
      groupStyle: { marginTop: '2.5rem', marginBottom: '0.5rem' },
      columnWidth: 4
    },
    {
      control: SELECT_BOX,
      key: 'locationId',
      label: 'Location',
      placeholder: 'Location',
      options: payload.locations,
      columnWidth: 9.5,
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isError: error && !payload?.locationId,
      helperText: 'Please select valid project location',
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState
    },
    {
      control: BUTTON,
      key: 'refresh',
      btnTitle: 'Refresh',
      color: 'success',
      tooltipTitle: `Click to import customer data for: ${payload?.customerName}`,
      columnWidth: 2.2,
      // isDisabled: isProjectCompleted || payload.projectId || !payload.locationId,
      handleClickButton: () => handleRefreshCustomerData()
    },
    {
      control: CHECKBOX,
      key: 'isDeviceAllowed',
      label: 'Is device allowed at this location?',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 12,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: TEXT_FIELD,
      key: 'name',
      label: 'Name',
      placeholder: 'Customer Short Name | Location Name',
      columnWidth: 12,
      groupStyle: { marginBottom: '0.5rem' },
      isRequired: true,
      isError:
        error &&
        (!payload?.name ||
          (payload.name && payload.name.length > MAX_CHAR.NAME) ||
          !isValidStr(payload.name, REGX_TYPE.CONTRACT)),
      helperText:
        payload.name && payload.name.length > MAX_CHAR.NAME
          ? `Name should not be more than ${MAX_CHAR.NAME} characters`
          : 'Please enter valid name',
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'salesManId',
      label: 'Salesman',
      placeholder: 'Salesman',
      options: salesmens,
      columnWidth: 6,
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isError: error && !payload?.salesManId,
      helperText: 'Please select valid salesman',
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'serviceManId',
      label: 'Serviceman',
      placeholder: 'Serviceman',
      options: servicemens,
      select: true,
      columnWidth: 6,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isError: error && !payload?.serviceManId,
      helperText: 'Please select valid serviceman',
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: TEXT_FIELD,
      key: 'agreementNumber',
      label: 'Agreement / LPO Number',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState),
      isError: error && payload.agreementNumber && payload.agreementNumber.length > MAX_CHAR.AGREEMENT_NO,
      helperText: getHelperText('agreementNumber')
    }
  ];
  const projectDetailsCol2 = [
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '2.8rem', marginBottom: '0.2rem' },
      key: 'projectTypeId',
      label: 'Project Type',
      placeholder: 'Project Type',
      options: projectTypes,
      columnWidth: 6,
      select: true,
      isRequired: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginTop: '2.8rem', marginBottom: '0.2rem' },
      key: 'regionName',
      label: 'Region',
      columnWidth: 6,
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      key: 'previousProjectNumber',
      label: 'Select Project Number',
      tooltipTitle: 'Select a Project Number',
      placement: 'top-start',
      placeholder: 'Select Project Number',
      columnWidth: 6,
      options: previousProjects,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState
    },
    {
      control: BUTTON,
      key: 'createFromPrevProject',
      btnTitle: 'Create From Previous Project',
      color: 'success',
      handleClickButton: () => createProjectFromPrevId(payload.previousProjectNumber),
      columnWidth: 4.5,
      isDisabled: isProjectCompleted || payload.projectId || projectIdFromLocState || !payload.previousProjectNumber,
      tooltipTitle: 'Click to populate data for selected Project'
    },
    {
      control: CHECKBOX,
      key: 'isPermitNeeded',
      label: 'Is permit needed for this location?',
      columnWidth: 6,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: SELECT_BOX,
      key: 'preferredTimingId',
      label: 'Preferred Timing',
      placeholder: 'Preferred Timing',
      options: preferredTimings,
      groupStyle: { marginBottom: '0.5rem' },
      columnWidth: 6,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: TEXT_FIELD,
      key: 'projectNumber',
      label: 'Number',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'projectStatusId',
      label: 'Project Status',
      placeholder: 'Project Status',
      options: statusList,
      columnWidth: 6,
      select: true,
      isRequired: true,
      isError: error && !payload?.projectStatusId,
      helperText: 'Please select project status',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !projectIdFromLocState
    },
    {
      control: CHECKBOX,
      key: 'isAdditionalServicemanRequired',
      label: 'Additional Servicemen',
      groupStyle: { marginBottom: '-0.5rem' },
      columnWidth: 4.2,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: MULTI_SELECT_BOX,
      key: 'additionalServicemans',
      label: 'Additional Servicemen',
      placeholder: 'Additional Servicemen',
      columnWidth: 7.8,
      options: additionalServicemenList,
      labelStyle: { marginTop: '-0.5rem' },
      groupStyle: { marginBottom: '-0.5rem' },
      controlStyle: { height: '2rem' },
      isDisabled:
        isProjectCompleted || !payload.isAdditionalServicemanRequired || (payload.projectId && !projectIdFromLocState),
      maxMultipleOptions: 1
    },
    {
      control: CHECKBOX,
      key: 'isPONeeded',
      label: 'Is PO necessary for execution?',
      groupStyle: { marginTop: '-0.5rem' },
      columnWidth: 6,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    }
  ];

  const projectDatesComps = [
    {
      control: DATEPICKER,
      key: 'projectSignedOn',
      label: 'Project Signed On',
      placeholder: 'Project Signed On',
      columnWidth: 1.3,
      groupStyle: { marginTop: '1rem' },
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
      // isRequired: true
    },
    {
      control: DATEPICKER,
      key: 'projectStartDate',
      label: 'Project Start Date',
      placeholder: 'Project Start Date',
      columnWidth: 1.3,
      groupStyle: { marginTop: '1rem' },
      isRequired: true,
      isError: error && !payload?.projectStartDate,
      helperText: 'Please select valid project start date',
      maxDate: payload?.projectEndDate ? new Date(payload?.projectEndDate) : undefined,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: TEXT_FIELD,
      key: 'discount',
      label: 'Discount',
      columnWidth: 1,
      groupStyle: { marginTop: '1rem' },
      endAdornmentData: '%',
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    },
    {
      control: TEXT_FIELD,
      key: 'projectValue',
      label: 'Project Value',
      columnWidth: 1.5,
      endAdornmentData: payload.transactionCurrency,
      groupStyle: { marginTop: '1rem' },
      isDisabled: isProjectCompleted || payload.projectTypeId === 2 || payload.projectId
    }
  ];

  const notesNsaveProjComps = [
    {
      control: ICON,
      key: 'specialAttentionNotes',
      iconName: <CommentIcon />,
      groupStyle: { marginTop: '1.3rem', marginLeft: '0.5rem' },
      tooltipTitle: payload?.notes ? 'Click to view Notes' : 'Click to enter Notes',
      columnWidth: 1,

      handleClickIcon: (key, ind) =>
        setShowNotesBox({
          ...notesBox,
          key: 'notes',
          label: `Notes ( Max ${MAX_LENGTH.NOTES} chars )`,
          noteVal: payload?.notes || '',
          open: true
        })
    }
  ];

  const signotoryComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '0.5rem', marginBottom: '0.2rem' },
      key: 'signatoryId',
      label: 'Designation',
      placeholder: 'Designation',
      options: singotories,
      columnWidth: 3,
      isError: error && !payload.signatoryId,
      helperText: error && !payload.signatoryId && 'Designation Required',
      select: true,
      isEmptyOptionAllowed: false,
      isSelecteAllAllow: false,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState),
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginTop: '0.5rem', marginBottom: '0.2rem' },
      key: 'contactName',
      label: 'Name',
      columnWidth: 5,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'customerAddress',
      label: 'Address',
      groupStyle: { marginBottom: '0.2rem' },
      columnWidth: 8,
      isDisabled: true
    },
    {
      control: NONE,
      groupStyle: { marginBottom: '0.5rem' },
      columnWidth: 4
    },
    {
      control: TEXT_FIELD,
      key: 'phone',
      label: 'Phone',
      columnWidth: 3,

      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'mobile',
      label: 'Mobile',
      columnWidth: 3,
      // groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'email',
      label: 'Email',
      columnWidth: 3,
      // groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true
    },
    {
      control: CHECKBOX,
      key: 'isEmailNotificationRequired',
      label: 'Notify by Email',
      columnWidth: 3,
      groupStyle: { marginBottom: '-1rem', marginTop: '-0.3rem' },
      isDisabled:
        isProjectCompleted ||
        (!payload.additionalEmails && !payload.email) ||
        (payload.projectId && !projectIdFromLocState) ||
        (!payload.email && !payload.additionalEmails)
    },
    {
      control: TEXT_FIELD,
      key: 'additionalEmails',
      label: 'Additional Emails',
      columnWidth: 8,
      groupStyle: { marginBottom: '0.5rem' },
      isMultiline: true,
      textRows: 1,
      isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState)
    }
  ];
  // Component for service frequency
  const servcFrqType1Comps = [
    {
      control: DATEPICKER,
      key: 'firstServiceDate',
      label: 'First Service Date',
      placeholder: 'First Service Date',
      columnWidth: 5,
      isRequired: true,
      showTodayButton: false,
      minDate: new Date(payload?.projectStartDate),
      maxDate: payload?.projectEndDate ? new Date(payload?.projectEndDate) : undefined,
      isDisabled: isProjectCompleted || payload.isBlockFirstServiceDate || payload.hasServiceOrders || freqSetting
    },
    {
      control: RADIO,
      key: 'isNoOfServicesPicked',
      label: 'Fixed:',
      showLabel: true,
      options: serviceFreqTypeOpts,
      columnWidth: 6,
      isDisabled: isProjectCompleted || payload.hasServiceOrders || freqSetting
    }
  ];

  const servcFrqType4Comps = [
    {
      control: TEXT_FIELD,
      key: 'noOfServices',
      label: 'Number of Services',
      placeholder: 'Number of Services',
      columnWidth: 4,
      handleKeyDown: (e) => handleOnBlur('noOfServices', e.target.value),
      groupStyle: {
        marginTop: '1.8rem',
        visibility: (!payload.isNoOfServicesPicked && 'hidden') || 'inherit'
      },
      isRequired: true,
      isDisabled: isProjectCompleted || payload.hasServiceOrders
    },
    {
      control: DATEPICKER,
      key: 'projectEndDate',
      label: 'Generated End Date',
      placeholder: 'Generated End Date',
      columnWidth: 5,
      groupStyle: {
        marginTop: '1.8rem',
        visibility: (!payload.isNoOfServicesPicked && 'hidden') || 'inherit'
      },
      isDisabled: true
    },
    {
      control: DATEPICKER,
      key: 'projectEndDate',
      label: 'Project End Date',
      placeholder: 'Project End Date',
      columnWidth: 6,
      groupStyle: { marginTop: '-0.2rem', visibility: (payload.isNoOfServicesPicked && 'hidden') || 'inherit' },
      isRequired: true,
      minDate: new Date(payload?.firstServiceDate),
      isError: error && !payload?.projectEndDate,
      helperText: 'Please select project end date',
      isDisabled: isProjectCompleted || payload.hasServiceOrders || freqSetting
    },
    {
      control: TEXT_FIELD,
      key: 'noOfServices',
      label: 'Generated Service Count',
      columnWidth: 6,
      groupStyle: { marginTop: '-0.2rem', visibility: (payload.isNoOfServicesPicked && 'hidden') || 'inherit' },
      isDisabled: true
    }
  ];
  const serviceFreqDrpdwn = {
    control: SELECT_BOX,
    key: 'frequencyId',
    label: 'Service Frequency',
    placeholder: 'Service Frequency',
    options: serviceFrequency,
    columnWidth: 12,
    select: true,
    isRequired: true,
    isSelecteAllAllow: false,
    isEmptyOptionAllowed: true,
    isDisabled:
      isProjectCompleted ||
      freqSetting ||
      (payload.isNoOfServicesPicked && !payload.noOfServices) ||
      (!payload.isNoOfServicesPicked && !payload.projectEndDate)
  };

  // Component set for service frequency === daily
  const byDayServiceFreq = [
    {
      control: TEXT_FIELD,
      key: 'dailyIncrementValue',
      label: 'Recur Every',
      placeholder: '',
      columnWidth: 2.2,
      endAdornmentData: 'Day(s)',
      isRequired: true,
      handleKeyDown: (e) => handleOnBlur('dailyIncrementValue', e.target.value),
      isError: error && !payload?.dailyIncrementValue,
      helperText: 'Please enter value',
      isDisabled: isProjectCompleted
    }
  ];

  // Component set for service frequency === weekly
  const byWeekServiceFreq = [
    {
      control: TEXT_FIELD,
      key: 'weeklyIncrementValue',
      label: 'Recur Every',
      placeholder: '',
      columnWidth: 2.2,
      endAdornmentData: 'Week(s)',
      isRequired: true,
      handleKeyDown: (e) => handleOnBlur('weeklyIncrementValue', e.target.value),
      isError: error && !payload?.weeklyIncrementValue,
      helperText: 'Please enter value',
      isDisabled: isProjectCompleted
    },
    {
      control: TYPOGRAPHY,
      groupStyle: { marginTop: '0.3rem' },
      key: 'on',
      label: 'ON (Max 2 selection)',
      columnWidth: 2
    }
  ];

  // Component set for service frequency === monthly
  const nthDayMonthComps = [
    {
      control: TEXT_FIELD,
      key: 'specificMonthDay',
      label: 'Recur Every',
      placeholder: '',
      columnWidth: 2,
      endAdornmentData: 'Day',
      isRequired: true,
      handleKeyDown: (e) => handleOnBlur('specificMonthDay', e.target.value),
      isError: error && !payload?.specificMonthDay,
      helperText: 'Please enter value',
      groupStyle: { marginLeft: '1.7rem' },
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'monthlyIncrementValue',
      label: 'Of Month',
      placeholder: '',
      options: MONTH_NUMBERS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.monthlyIncrementValue,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    }
  ];

  // Component set for service frequency === yearly
  const monthOfYearComps = [
    {
      control: TEXT_FIELD,
      key: 'specificMonthDay',
      label: 'Recur Every',
      placeholder: '',
      columnWidth: 2,
      endAdornmentData: 'Day',
      isRequired: true,
      handleKeyDown: (e) => handleOnBlur('specificMonthDay', e.target.value),
      isError: error && !payload?.specificMonthDay,
      helperText: 'Please enter value',
      groupStyle: { marginLeft: '1.7rem' },
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'specificMonth',
      label: 'Of Month',
      placeholder: '',
      options: MONTHS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificMonth,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    }
  ];

  const axFieldsCompSet = [
    {
      control: TYPOGRAPHY,
      label: 'Business Unit:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'bussinessUnit',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Account Number:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'accountNumber',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'CR Number:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'crNumber',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Project Group:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'projectGroup',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Invoice Account:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'invoiceAccount',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Main Account:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'mainAccount',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Project Business Category:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'projectBussinessCategory',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Customer Group:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'customerGroup',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Legal Entity:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'legalEntity',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Project Classification:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'projectClassification',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Payment Terms:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'paymentTerms',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      label: 'Customer Name:',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex' }
    },
    {
      control: TYPOGRAPHY,
      key: 'customerName',
      columnWidth: 2,
      groupStyle: { display: 'inline-flex', marginBottom: '0.5rem' }
    }
  ];

  // service frequency radio for months
  const byMonthServiceFreq = {
    control: RADIO,
    key: 'serviceFrequencyMonthlyTypes',
    label: '',
    showLabel: true,
    options: serviceFrequencyMonthlyTypes1,
    columnWidth: 12,
    groupStyle: { marginTop: '-0.3rem' },
    isDisabled: isProjectCompleted
  };
  // service frequency radio for yearlt
  const byYearServiceFreq = {
    control: RADIO,
    key: 'serviceFrequencyYearlyTypes',
    label: '',
    showLabel: true,
    options: serviceFrequencyYearlyTypes,
    columnWidth: 12,
    groupStyle: { marginTop: '-0.3rem' },
    isDisabled: isProjectCompleted
  };

  const specificDayOfMonthComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '1.7rem' },
      key: 'specificWeek',
      label: 'Occurrence',
      placeholder: 'First / Second / Third',
      options: numberInWords,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificWeek,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'specificWeekdayMonthly',
      label: 'Day',
      placeholder: 'Monday / Tuesday',
      options: DAYS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificWeekdayMonthly,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'monthlyIncrementValue',
      label: 'Of Month',
      placeholder: '',
      options: MONTH_NUMBERS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.monthlyIncrementValue,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    }
  ];

  const specificDayOfMonthOfYearComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '1.7rem' },
      key: 'specificWeek',
      label: 'Occurrence',
      placeholder: 'First / Second / Third',
      options: numberInWords,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificWeek,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'specificWeekdayMonthly',
      label: 'Day',
      placeholder: 'Monday / Tuesday',
      options: DAYS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificWeekdayMonthly,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    },
    {
      control: SELECT_BOX,
      key: 'specificMonth',
      label: 'Of Month',
      placeholder: '',
      options: MONTHS,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isError: error && !payload?.specificMonth,
      helperText: 'Please select value',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    }
  ];
  const serviceDetailsViewComps = [
    {
      control: DATEPICKER,
      key: 'manualEntryDate',
      label: 'Manual Schedule Date Entry',
      placeholder: 'Project Signed On',
      showTodayButton: false,
      columnWidth: 3.5,
      minDate: new Date(payload?.firstServiceDate),
      isDisabled: isProjectCompleted || freqSetting
    },
    {
      control: ICON,
      groupStyle: { marginTop: '0.2rem' },
      key: '',
      iconName: <AddIcon />,
      tooltipTitle: 'Click to add Grid',
      color: 'success',
      columnWidth: 1,
      handleClickIcon: () => addManualServiceEntry(),
      isDisabled: isProjectCompleted || !payload.manualEntryDate
    },
    {
      control: TEXT_FIELD,
      key: 'zone',
      label: 'Zone',
      columnWidth: 3
    },
    {
      control: ICON,
      groupStyle: { marginTop: '0.2rem' },
      key: '',
      iconName: <AddIcon />,
      tooltipTitle: 'Click to add Zone',
      color: 'success',
      handleClickIcon: () => addZone(),
      isDisabled: isProjectCompleted || !payload.zone,
      columnWidth: 1
    }
  ];

  const serviceSubTableIcons = [
    {
      control: ICON,
      groupStyle: { marginLeft: '-1rem' },
      iconName: <Chip icon={<ErrorOutlineIcon />} label="Empty Service" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<AddCircleOutlineIcon />} label="Custom Task" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<AccessAlarmIcon />} label="Scheduled" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<CallIcon />} label="Callout" />,
      columnWidth: 2.1
    },
    {
      control: ICON,
      iconName: <Chip icon={<RotateRightIcon />} label="In Progress" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<CheckCircleIcon style={{ color: 'rgb(0, 171, 85)' }} />} label="Completed" />,
      columnWidth: 2
    },

    {
      control: ICON,
      iconName: <Chip icon={<HighlightOffIcon style={{ color: 'rgb(245, 124, 0)' }} />} label="Cancelled" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<PanToolIcon style={{ color: 'rgb(255, 72, 66)' }} />} label="Customer Hold" />,
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: (
        <Chip icon={<ProductionQuantityLimitsIcon style={{ color: 'rgb(255, 72, 66)' }} />} label="Stock Hold" />
      ),
      columnWidth: 2
    },
    {
      control: ICON,
      iconName: <Chip icon={<MonetizationOnIcon style={{ color: 'rgb(255, 72, 66)' }} />} label="Credit Hold" />,
      columnWidth: 2
    }
  ];

  const handleBack = () => {
    if (isFormModified) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Redirecting to Edit Contract?',
        content: 'Redirecting to Edit Contract. Do you still want to continue?',
        showProceedBtn: true,
        proceedAction: 'navigateToEditContract',
        cancelButtonText: 'No',
        proceedButtonText: 'Yes'
      });
    } else {
      navigateToEditContract();
    }
  };

  const saveServiceComps = [
    {
      control: BUTTON,
      key: '',
      color: 'warning',
      btnTitle: 'Back',
      handleClickButton: () => handleBack(),
      columnWidth: 0.8
    },
    {
      control: BUTTON,
      key: 'saveAndClose',
      btnTitle: 'Save & Close',
      color: 'success',
      groupStyle: { marginLeft: '1rem' },
      handleClickButton: () => saveServiceOrders(false),
      isDisabled: isProjectCompleted || !isArray(serviceOrders),
      columnWidth: 1.2
    },
    {
      control: BUTTON,
      key: 'saveAndAddServiceSubject',
      btnTitle: 'Save & Add Service Subject',
      color: 'success',
      groupStyle: { marginLeft: '1rem' },
      handleClickButton: () => saveServiceOrders(true),
      isDisabled: isProjectCompleted || !isArray(serviceOrders),
      columnWidth: 2
    },
    {
      control: BUTTON,
      key: 'addServiceSubject',
      btnTitle: 'Add Service Subject',
      color: 'success',
      groupStyle: { marginLeft: '1rem' },
      handleClickButton: () => navigateToAddServiceSubject(),
      isDisabled: isProjectCompleted || !isArray(serviceOrders),
      columnWidth: 1.8
    },
    {
      control: BUTTON,
      key: 'close',
      btnTitle: 'Close',
      color: 'warning',
      groupStyle: { marginLeft: '1rem' },
      handleClickButton: () => navigate(ROUTES.CONTRACTS),
      columnWidth: 0.8
    }
  ];

  const saveupdateProjectComp = {
    control: BUTTON,
    key: 'saveProject',
    tooltipTitle: `${(projectIdFromLocState && 'Update') || 'Save'} project details`,
    btnTitle: `${projectIdFromLocState ? 'Update' : 'Save'}`,
    color: 'success',
    handleClickButton: () => checkErrorsAndSaveProject(),
    isDisabled: isProjectCompleted || (payload.projectId && !projectIdFromLocState),
    columnWidth: 2.7
  };

  const saveFirstServiceDateAndZoneComp = {
    control: BUTTON,
    tooltipTitle: 'Save Zone',
    columnWidth: 10,
    btnTitle: 'Save Zone',
    groupStyle: { marginLeft: '2rem' },
    color: 'success',
    isDisabled: isProjectCompleted || !payload.projectId || !payload.firstServiceDate,
    handleClickButton: () => handleSaveFirstServiceDateAndProjectZones()
  };

  const addManualServiceEntry = () => {
    let newServiceEntry;

    if (payload.manualEntryDate) {
      const existingServOrder = serviceOrders.find(
        (itm) => moment(itm.scheduledDate).format('yyyy-MM-DD') === moment(payload.manualEntryDate).format('yyyy-MM-DD')
      );

      const {
        manualEntryDate,
        isPermitNeeded,
        preferredTimingId,
        isDeviceAllowed,
        serviceManId,
        isPONeeded,
        additionalServicemen,
        additionalServicemanIds
      } = payload;

      if (existingServOrder) {
        const { preferredTimingId, additionalServicemen, servicemanId } = existingServOrder;
        const sortedAdditionalServicemans =
          (isArray(additionalServicemen) && additionalServicemen.sort((a, b) => a.name.localeCompare(b.name))) || [];
        newServiceEntry = {
          scheduledDate: manualEntryDate,
          serviceOrderStatusId: 100,
          isManualEntry: true,
          isPermitNeeded,
          isPermitReceived: isPermitNeeded,
          isDeviceAllowed,
          isPONeeded,
          preferredTimingId: preferredTimingId || null,
          servicemanId,
          additionalServicemanIds: sortedAdditionalServicemans.map((v) => v.id),
          additionalServicemen: sortedAdditionalServicemans,
          isServiceOrderEditable: true
        };
      } else if (payload.hasServiceOrders) {
        const { additionalServicemen, preferredTimingId, servicemanId } = serviceGridData;
        const sortedAdditionalServicemans =
          (isArray(additionalServicemen) && additionalServicemen.sort((a, b) => a.name.localeCompare(b.name))) || [];
        newServiceEntry = {
          scheduledDate: manualEntryDate,
          serviceOrderStatusId: 100,
          isManualEntry: true,
          isPermitNeeded,
          isPermitReceived: isPermitNeeded,
          isDeviceAllowed,
          isPONeeded,
          preferredTimingId: preferredTimingId || null,
          servicemanId,
          additionalServicemen: sortedAdditionalServicemans,
          additionalServicemanIds: sortedAdditionalServicemans.map((v) => v.id),
          isServiceOrderEditable: true
        };
      } else {
        newServiceEntry = {
          scheduledDate: manualEntryDate,
          serviceOrderStatusId: 100,
          isManualEntry: true,
          isPermitNeeded,
          isPermitReceived: isPermitNeeded,
          isDeviceAllowed,
          isPONeeded,
          preferredTimingId: preferredTimingId || null,
          servicemanId: serviceManId,
          additionalServicemen,
          additionalServicemanIds,
          isServiceOrderEditable: true
        };
      }
    }
    const updatedServiceDates = [...serviceOrders, newServiceEntry];
    setServiceOrders(updatedServiceDates.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)));
    const endDate = getFormattedDate(DATE_FORMAT.DATE_DAY_FORMAT, payload.projectEndDate);
    if (!payload.projectEndDate) {
      updatePayload({ projectEndDate: payload.manualEntryDate, manualEntryDate: null });
      return true;
    }
    if (payload.projectEndDate && new Date(payload.projectEndDate) < new Date(payload.manualEntryDate)) {
      updatePayload({ projectEndDate: payload.manualEntryDate, manualEntryDate: null });
      return true;
    }
    updatePayload({ manualEntryDate: null });
  };

  const addZone = () => {
    const { zone, projectZones } = payload;
    const newZone = zone.trim();
    const isDuplicateZone = isArray(projectZones) && projectZones.find((zn) => zn.zone.trim() === newZone);
    if (isDuplicateZone && isDuplicateZone?.isDeleted === true) {
      const existingZones = [];
      if (isArray(projectZones)) {
        projectZones.forEach((itm) => {
          if (itm.zone.trim() !== newZone && itm.isDeleted !== true) {
            existingZones.push(itm);
          }
        });
      }
      const updatedZone = { ...isDuplicateZone, isDeleted: false };
      updatePayload({ projectZones: [...existingZones, updatedZone], zone: '' });
    } else if (isDuplicateZone && isDuplicateZone?.isDeleted === false) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Duplicate zone',
        content: 'Entered zone is already created for current project.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    } else {
      updatePayload({ projectZones: [...projectZones, { id: 0, zone: newZone, isDeleted: false }], zone: '' });
    }
  };
  const handleZoneDelete = (zone) => {
    const { projectZones } = payload;
    if (zone.isZoneAssigned) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Not Allowed',
        content: getDialogBoldContent(zone.zone, '', 'zoneDetails', ''),
        showProceedBtn: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
      return;
    }
    projectZones.find((itm) => itm.zone === zone.zone).isDeleted = true;
    updatePayload({ projectZones });
  };

  const handleSaveFirstServiceDateAndProjectZones = async () => {
    if (payload.projectId) {
      const res = await saveFirstServiceDateAndProjectZones(`${API_V1}/${UPDATE_ZONE_FIRST_SERVICE_DATE}`, {
        projectId: payload.projectId,
        firstServiceDate: payload.firstServiceDate,
        projectZones: payload.projectZones
      });
      if (res?.isSuccessful) {
        updatePayload({ projectZones: res?.data.projectZones });
      } else {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: isArray(res.error) ? res.error : res.error || NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Close'
        });
      }
    }
  };
  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const handleOnBlur = (key, val) => {
    if (key) {
      const updateFields = { [key]: val };
      if (
        [
          // 'firstServiceDate',
          'noOfServices',
          // 'projectEndDate',
          // 'frequencyId',
          'dailyIncrementValue',
          'weeklyIncrementValue',
          // 'specificWeekdays',
          'specificMonthDay'
          // 'monthlyIncrementValue',
          // 'specificWeek',
          // 'specificWeekdayMonthly',
          // 'specificMonth',
          // 'serviceFrequencyMonthlyTypes',
          // 'serviceFrequencyYearlyTypes'
        ].includes(key)
      ) {
        if ((key === 'frequencyId' && val !== '2') || payload?.frequencyId !== '2') {
          getServiceOccurrences({ ...payload, ...updateFields, [key]: val });
        } else if (payload?.specificWeekdays.length) {
          getServiceOccurrences({ ...payload, ...updateFields, [key]: val });
        }
      }
      updatePayload({ ...updateFields });
    }
  };

  const clearFrequencyFields = () => {
    updatePayload({
      dailyIncrementValue: 0,
      weeklyIncrementValue: 0,
      specificWeekdays: [],
      specificMonthDay: 0,
      monthlyIncrementValue: 0,
      specificWeek: 0,
      specificWeekdayMonthly: 0,
      specificMonth: 0
    });
  };

  const handleChangeData = (key, val) => {
    setIsFormModified.on();
    if (key === 'frequencyId') {
      const updateFields = {
        [key]: val,
        noOfServices: val === '' ? '' : payload.noOfServices
      };
      updatePayload({ ...updateFields });

      if (val === '') {
        clearFrequencyFields();
      }
    } else if (key === 'additionalEmails') {
      const updateFields = { [key]: val };
      if (!val && !payload.email) {
        updateFields.isEmailNotificationRequired = false;
      }
      updatePayload({ ...updateFields });
    } else if (key) {
      let updateFields = { [key]: val };
      if (['discount', 'dailyIncrementValue', 'weeklyIncrementValue', 'monthlyIncrementValue'].includes(key)) {
        if (!val || isValidStr(val, REGX_TYPE.DISCOUNT)) {
          val = (isValidStr(val, REGX_TYPE.DISCOUNT) && val) || '';
          updateFields[key] = val === '' ? 0 : val;
        } else {
          return true;
        }
      }
      if (key === 'previousProjectNumber') {
        const temporaryNumber = previousProjects.find((itm) => itm.id === Number(val));
        updateFields.newProjectNumber = temporaryNumber?.name;
        if (val === '') {
          updateFields.previousProjectNumber = null;
        }
      } else if (key === 'noOfServices') {
        if (!val || isValidStr(val, REGX_TYPE.NO_OF_SERVICES_RX)) {
          val = (isValidStr(val, REGX_TYPE.NO_OF_SERVICES_RX) && val) || 0;
          if (!val) {
            updateFields.projectEndDate = '';
          }
          updateFields[key] = val;
        } else {
          return true;
        }
      } else if (key === 'name') {
        if (!val || val?.length > MAX_CHAR.NAME || !isValidStr(payload.name, REGX_TYPE.CONTRACT)) {
          setError.on();
          updateFields[key] = val;
        }
      } else if (key === 'agreementNumber') {
        if (!val || isValidStr(val, REGX_TYPE.AGREEMENT_LPO_NUM_RX)) {
          val = (isValidStr(val, REGX_TYPE.AGREEMENT_LPO_NUM_RX) && val) || '';
          updateFields[key] = val;
        } else {
          return true;
        }
      } else if (key === 'locationId') {
        getSingotoriesInfo(val);
        getPreviousProjects(val);
        updateFields.name = '';
        updateFields.createdFromPreviousProject = false;
        if (isArray(payload.locations) && (payload.customerShortName || payload.customerName) && val) {
          const location = payload.locations.find((loc) => loc.id === val * 1);
          if (location) {
            const projectName = `${payload.customerShortName || payload.customerName} | ${location.name}`;
            updateFields.name = projectName;
            updateFields.locationName = location.name;
          }
        }
      } else if (key === 'signatoryId') {
        if (!val) {
          updateFields[key] = 0;
        }

        const signatoryInfo = singotories.find((sig) => sig.id === val * 1);
        const { contactName, customerAddress, email, mobile, phone } = signatoryInfo || {
          contactName: '',
          customerAddress: '',
          email: '',
          mobile: '',
          phone: ''
        };
        updateFields = {
          ...updateFields,
          contactName,
          customerAddress,
          email,
          mobile,
          phone,
          [key]: val
        };
      } else if (key === 'isNoOfServicesPicked') {
        updateFields[key] = val === 'true';
      } else if (key === 'additionalServicemans') {
        let updatedVal = val;
        if (isArray(updatedVal)) {
          if (isArray(payload?.additionalServicemanIds)) {
            payload?.additionalServicemanIds.forEach((itm) => {
              if (updatedVal.filter((ele) => ele.id === itm).length === 2) {
                updatedVal = updatedVal.filter((num) => num.id !== itm);
              }
            });
          }
          const sortedArray = updatedVal.sort((a, b) => a.name.localeCompare(b.name));
          if (isArray(sortedArray)) {
            updateFields.additionalServicemanIds = sortedArray.map((v) => v.id);
            updateFields.additionalServicemans = sortedArray;
          } else {
            updateFields.additionalServicemanIds = [];
            updateFields.additionalServicemans = [];
          }
        } else {
          updateFields.additionalServicemanIds = [];
          updateFields.additionalServicemans = [];
        }
        // updateFields.additionalServicemanIds = val.map((v) => v.id);
      } else if (key === 'notes' && val.length > 500) {
        updateFields[key] = val.substr(0, MAX_LENGTH.NOTES);
      } else if (key === 'zone' && val.length > 200) {
        updateFields[key] = val.substr(0, 200);
      } else if (['projectStartDate', 'firstServiceDate', 'projectSignedOn'].includes(key)) {
        if (val === null) {
          updateFields[key] = payload?.[key];
        }
        if (key === 'projectStartDate' || 'firstServiceDate') {
          updateFields.manualEntryDate = null;
        }
      } else if (key === 'isAdditionalServicemanRequired' && !val) {
        updateFields.additionalServicemans = [];
        updateFields.additionalServicemanIds = [];
      } else if (key === 'preferredTimingId' && !val) {
        updateFields.preferredTimingId = null;
      } else if (!projectIdFromLocState && ['isPermitNeeded', 'isDeviceAllowed', 'isPONeeded'].includes(key)) {
        setServiceOrders([...serviceOrders.map((ord) => ({ ...ord, [key]: val }))]);
      }

      if (['frequencyId', 'serviceFrequencyMonthlyTypes', 'serviceFrequencyYearlyTypes'].includes(key)) {
        updateFields.dailyIncrementValue = 0;
        updateFields.weeklyIncrementValue = 0;
        updateFields.specificWeekdays = [];
        updateFields.specificMonthDay = 0;
        updateFields.monthlyIncrementValue = 0;
        updateFields.specificWeek = 0;
        updateFields.specificWeekdayMonthly = 0;
        updateFields.specificMonth = 0;
      }
      if (
        [
          'firstServiceDate',
          // 'noOfServices',
          'projectEndDate',
          'frequencyId',
          // 'dailyIncrementValue',
          // 'weeklyIncrementValue',
          'specificWeekdays',
          // 'specificMonthDay',
          'monthlyIncrementValue',
          'specificWeek',
          'specificWeekdayMonthly',
          'specificMonth',
          'serviceFrequencyMonthlyTypes',
          'serviceFrequencyYearlyTypes'
        ].includes(key)
      ) {
        if (key === 'projectEndDate') {
          if (val === null) {
            updateFields.projectEndDate = '';
          }
          if (payload.frequencyId && !payload.isNoOfServicesPicked && val) {
            getServiceOccurrences({ ...payload, ...updateFields, [key]: val });
          }
        } else if ((key === 'frequencyId' && val !== '2') || payload?.frequencyId !== '2') {
          getServiceOccurrences({ ...payload, ...updateFields, [key]: val });
        } else if (payload?.specificWeekdays.length) {
          getServiceOccurrences({ ...payload, ...updateFields, [key]: val });
        }
      }
      updatePayload({ ...updateFields });
    }
  };

  const handleChecked = (id) => (e) => {
    let tempCheckedDays = [];
    if (!e.target.checked) {
      tempCheckedDays = payload.specificWeekdays.filter((dy) => dy !== id);
    } else {
      tempCheckedDays = [...payload.specificWeekdays, id];
    }
    if (tempCheckedDays.length > 2) {
      tempCheckedDays.shift();
    }
    updatePayload({ specificWeekdays: [...tempCheckedDays] });
    getServiceOccurrences({ ...payload, specificWeekdays: [...tempCheckedDays] });
  };

  const getServiceFrequencies = async () => {
    const serviceFreq = await getServiceFrequencyList(`${API_V1}/${SERVICE_FREQUENCIES}`);
    if (!serviceFreq?.isSuccessful) {
      getServiceFrequencies();
    } else if (isObject(serviceFreq) && serviceFreq.data) {
      setServiceFrequency(serviceFreq.data);
    }
  };

  const getProjectTypes = async () => {
    const projectTypes = await getProjectTypeList(`${API_V1}/${PROJECT_TYPES}`);
    if (!projectTypes?.isSuccessful) {
      getProjectTypes();
    } else if (isObject(projectTypes) && projectTypes.data) {
      setProjectTypes(projectTypes.data);
    }
  };

  const getPreviousProjects = async (locId) => {
    if (locId) {
      const previousProjects = await getProjectNumberList(
        `${API_V1}/${PROJECTS}?locationId=${locId}&contractId=${payload.contractId}`
      );
      if (isObject(previousProjects) && previousProjects.isSuccessful && previousProjects.data?.projects) {
        setPreviousProjects(previousProjects.data?.projects);
      } else {
        setPreviousProjects([]);
      }
    } else {
      setPreviousProjects([]);
    }
  };

  const getStatuses = async () => {
    const projectStatuses = await getProjectStatusList(`${API_V1}/${PROJECT_STATUSES}`);
    const notToInclude = ['Created', 'Discrete', 'Financially Closed']; // 'PendingAXSync'
    if (!projectStatuses?.isSuccessful) {
      getStatuses();
    } else if (isObject(projectStatuses) && projectStatuses.data) {
      if (projectStatuses.data) {
        const projectData = projectStatuses?.data.filter((itm) => !notToInclude.includes(itm.name));
        setStatusList(projectData);
      }
    }
  };
  const getPrefrredTimes = async () => {
    const prefrredTimes = await getPreferredTimeList(`${API_V1}/${PREFERRED_TIMES}`);
    if (!prefrredTimes?.isSuccessful) {
      getPrefrredTimes();
    } else if (isObject(prefrredTimes) && prefrredTimes.data) {
      setPreferredTimings(prefrredTimes.data);
    }
  };

  const getSingotoriesInfo = async (locId) => {
    if (locId) {
      const singotories = await getSingotoriesInformation(
        `${API_V1}/${CUSTOMER_MANAGEMENT_LOCATION}/${locId}/${SIGNOTORIES}`
      );
      if (!singotories?.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: t('dialog.error'),
          content:
            singotories.error ||
            (isArray(singotories.errors) && singotories.errors[0]) ||
            NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
      } else if (isObject(singotories) && singotories.data) {
        setSingotories(singotories.data);
      }
    } else {
      setSingotories([]);
    }
  };

  const createProjectFromPrevId = (projectId) => {
    if (payload?.projectNumber) {
      setShowGenericAlertBox({
        open: true,
        titleType: DIALOG_STATUS.WARNING,
        title: 'Are You Sure?',
        content: 'Data will get reset. Do you want to continue?',
        proceedAction: 'getProjectDetailsById',
        showProceedBtn: true,
        cancelButtonText: 'No',
        proceedButtonText: 'Yes',
        additionalInfoForProceed: projectId
      });
    } else {
      getProjectDetailsById(projectId);
    }
  };

  const getProjectDetailsById = async (projectId) => {
    updatePayload({ isRenewedProject: true });
    dispatch({ type: IS_DATA_LOADING, data: true });
    const projectDetails = await getProjectDetailsFromPrevProject(
      `${API_V1}/${GET_PROJECT_DETAILS_FROM_PREVIOUS_PROJECT}/?projectId=${projectId}`
    );
    setOccurance(projectDetails.data.occuranceSettings);

    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!projectDetails?.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: t('dialog.error'),
        content:
          projectDetails.error ||
          (isArray(projectDetails.errors) && projectDetails.errors[0]) ||
          NOTIFICATIONS.SOMETHING_WENT_WRONG,
        isProceedButton: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    } else if (isObject(projectDetails) && projectDetails.data) {
      const prevProjectData = {
        ...projectDetails.data,
        projectExecutionTypeId: payload.projectExecutionTypeId
      };
      bindProjectData({
        ...prevProjectData,
        hasServiceOrders: false,
        createdFromPreviousProject: true
      });
    }
  };

  const getNewProjectData = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const newProjectDetails = await getNewProjectDetails(
      `${API_V1}/${PROJECT_MANAGEMENT_CONTRACT}/${payload.contractId}/${NEW_PROJECT_DETAILS}`
    );
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!newProjectDetails?.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: t('dialog.error'),
        content:
          newProjectDetails.error ||
          (isArray(newProjectDetails.errors) && newProjectDetails.errors[0]) ||
          NOTIFICATIONS.SOMETHING_WENT_WRONG,
        isProceedButton: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    } else if (isObject(newProjectDetails) && newProjectDetails.data) {
      bindProjectData(newProjectDetails.data);
    }
  };

  const bindProjectData = (projectData) => {
    const {
      id,
      contractNumber,
      contractName,
      locationName,
      customerId,
      customerName,
      customerShortName,
      locations,
      salesManId,
      regionId,
      regionName,
      bussinessUnit,
      projectGroup,
      projectBussinessCategory,
      projectClassification,
      accountNumber,
      invoiceAccount,
      customerGroup,
      paymentTerms,
      crNumber,
      notes,
      additionalEmails,
      isEmailNotificationRequired,
      attachments,
      mainAccount,
      legalEntity,
      contractStatus,
      legalEntityId = 0,
      businessSubTypeId = null,
      transactionCurrency,
      name = '',
      // projectExecutionTypeId = 0,
      projectExecutionTypeId,
      isDeviceAllowed = true,
      isPermitNeeded = false,
      preferredTimingId = null,
      projectNumber = '',
      projectStatusId = 1,
      projectStatus,
      serviceManId = 0,
      isPONeeded = false,
      agreementNumber = '',
      additionalServicemanIds = [],
      signatoryId = 0,
      discount = 0,
      projectValue = 0.0,
      locationId = 0,
      projectSignedOn = new Date(),
      projectStartDate = new Date(),
      firstServiceDate = new Date(),
      noOfServices = 0,
      projectEndDate,
      isNoOfServicesPicked = false,
      isBlockFirstServiceDate = false,
      projectZones = [],
      designations,
      hasServiceOrders,
      createdFromPreviousProject = false
    } = projectData;
    updatePayload({
      contractNumber,
      contractName,
      customerId,
      customerName,
      customerShortName,
      locations,
      locationName,
      salesManId,
      regionId,
      regionName,
      notes: notes || '',
      bussinessUnit,
      projectGroup,
      projectBussinessCategory,
      projectClassification,
      accountNumber,
      invoiceAccount,
      customerGroup,
      paymentTerms,
      crNumber,
      mainAccount,
      legalEntity,
      legalEntityId,
      businessSubTypeId,
      transactionCurrency,
      name,
      projectExecutionTypeId,
      isDeviceAllowed,
      isPermitNeeded,
      preferredTimingId,
      projectNumber,
      projectStatusId,
      projectStatus,
      contractStatus,
      serviceManId,
      signatoryId,
      isPONeeded,
      agreementNumber,
      isAdditionalServicemanRequired: isArray(additionalServicemanIds),
      additionalServicemanIds,
      additionalServicemans: [],
      discount,
      attachments: attachments || [],
      projectValue,
      locationId,
      projectSignedOn: createdFromPreviousProject ? payload.projectSignedOn || new Date() : projectSignedOn,
      projectStartDate: createdFromPreviousProject ? payload.projectStartDate || new Date() : projectStartDate,
      additionalEmails,
      isEmailNotificationRequired,
      firstServiceDate,
      noOfServices,
      projectEndDate,
      isNoOfServicesPicked,
      isBlockFirstServiceDate,
      projectZones,
      hasServiceOrders,
      createdFromPreviousProject,
      createFromPrevProjId: createdFromPreviousProject ? id : ''
    });
    setDefSignatory(signatoryId);
    if (isArray(designations)) {
      setSingotories([...designations]);
    }
    // if (createdFromPreviousProject) {
    //   getServices(id);
    // }
  };

  const getExistingProjectData = async (projectId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const newProjectDetails = await getExistingProjectDetails(
      `${API_V1}/${GET_PROJECT_DETAILS}/?projectId=${projectId}`
    );
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!newProjectDetails?.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: t('dialog.error'),
        content:
          newProjectDetails.error ||
          (isArray(newProjectDetails.errors) && newProjectDetails.errors[0]) ||
          NOTIFICATIONS.SOMETHING_WENT_WRONG,
        isProceedButton: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    } else if (isObject(newProjectDetails) && newProjectDetails.data) {
      bindProjectData({ ...newProjectDetails.data });
      setExistingData(newProjectDetails.data);
    }
  };
  const navigateToEditContract = () =>
    navigate(
      `${CONTRACT_MANAGEMENT_EDIT_CONTRCAT}${payload.contractId}`,
      { state: payload.contractId },
      { replace: true }
    );

  const navigateToAddServiceSubject = () => {
    const { projectId, projectNumber, locationName, legalEntityId, businessSubTypeId, contractId } = payload;
    navigate(
      ADD_SERVICE_SUBJECT,
      {
        state: {
          projectId,
          projectNumber,
          locationName,
          legalEntityId,
          businessSubTypeId,
          contractId,
          servicemens,
          preferredTimings
        }
      },
      { replace: true }
    );
  };

  const getSalesmenList = async () => {
    const res = await getSalesmensDdl(`${API_V1}/${GET_SALESMAN_DDL}?regionId=${payload.regionId}`);
    if (res?.data && isArray(res?.data)) {
      setSalesmens(res?.data);
      return true;
    }
    setSalesmens([]);
  };

  const getServicemenList = async () => {
    const res = await getServicemensDdl(`${API_V1}/${GET_SERVICEMAN_DDL}?regionId=${payload.regionId}`);
    if (res?.data && isArray(res?.data)) {
      setServicemens(res?.data);
      return true;
    }
    setServicemens([]);
  };

  const getProjectData = () => {
    if (ProjectDetailsData) {
      const displayData = [];
      ProjectDetailsData?.map((item) => {
        const {
          scheduledDayDate,
          serviceDayDate,
          status,
          invoiceDate,
          invoiceNumber,
          onAccountLineNumber,
          amount,
          receiptDate,
          receiptNumber,
          paymentAmount,
          creditNoteDate,
          creditNoteNumber,
          creditAmount
        } = item;
        return displayData.push({
          scheduledDayDate,
          serviceDayDate,
          status,
          depricateScheduled: null,
          printScheduled: null,
          editScheduled: null,
          invoiceDate,
          invoiceNumber,
          onAccountLineNumber,
          amount,
          depricateInvoice: null,
          printInvoice: null,
          editInvoice: null,
          receiptDate,
          receiptNumber,
          paymentAmount,
          creditNoteDate,
          creditNoteNumber,
          creditAmount
        });
      });
      if (displayData.length > 0) {
        setProjectTableData(displayData);
      }
    }
  };

  const navigateToEditProject = (projectId, contractId) =>
    navigate(`${ROUTES.EDIT_PROJECT}/${projectId}`, { state: { contractId, projectId } }, { replace: true });

  const handleAPIRes = async (savedProject) => {
    const {
      isSuccessful,
      message,
      data: { projectId }
    } = savedProject;
    const { createdFromPreviousProject, contractId, previousProjectNumber } = payload;
    const successMessage = `${message} ${
      createdFromPreviousProject ? '. Fetching service orders from previous project' : ''
    }`;
    if (!isSuccessful) {
      setShowAlertBox({
        open: true,
        maxWidth: 'md',
        titleType: STATUS.ERROR,
        title: savedProject ? t('dialog.success') : t('addUser.error'),
        content: parse(successMessage) || t('addUser.somethingWentWrong')
      });
    }
    if (isSuccessful && createdFromPreviousProject) {
      await copyServiceDetails(`${API_V1}/${COPY_SERVICE_ORDER}`, {
        projectId,
        previousProjectId: previousProjectNumber
      });
      navigateToEditProject(projectId, contractId);
    }
    if (!savedProject?.data.isServiceOrdersAvailable) {
      updatePayload({ generatedEndDate: '', projectEndDate: '', noOfServices: 0 });
    }
    if (projectIdFromLocState) {
      getServices(projectIdFromLocState);
    }
    if (isSuccessful && savedProject?.data) {
      const { projectId, projectNumber, projectStatus } = savedProject.data;
      const projectStatusId = isArray(statusList) && statusList.filter((itm) => itm.name === projectStatus)?.[0]?.id;
      updatePayload({ projectId, projectNumber, projectStatus, projectStatusId });
      getPreviousProjects(payload.locationId);
      setShowServiceFreq.on();
    }
  };
  const showMissingPayloadAlert = (content) => {
    setShowGenericAlertBox({
      open: true,
      titleType: STATUS.ERROR,
      title: t('dialog.error'),
      content,
      showProceedBtn: false,
      cancelButtonText: 'Ok',
      color: 'success'
    });
  };

  const deleteServiceSubjectTask = async (payload) => {
    const { serviceOrderInd, serviceSubjectInd, serviceOrderId, taskId, serviceSubjectId } = payload;
    if (serviceOrderId) {
      const res = await removeServiceSubjectTask(
        `${API_V1}/${REMOVE_SERVICE_ORDER_TASK}?serviceorderId=${serviceOrderId}&serviceSubjectId=${serviceSubjectId}&taskId=${taskId}`
      );
      if (res.isSuccessful) {
        if (isArray(serviceOrders[serviceOrderInd].serviceSubjectTasks)) {
          serviceOrders[serviceOrderInd].serviceSubjectTasks.splice(serviceSubjectInd, 1);
        }
        setServiceOrders([...serviceOrders]);
      }
    } else {
      showMissingPayloadAlert('Selected task id is not valid');
    }
  };

  const deleteServiceOrder = async (payload) => {
    const { serviceOrderInd, serviceOrderId } = payload;
    if (serviceOrderId) {
      const res = await removeServiceOrder(`${API_V1}/${REMOVE_SERVICE_ORDER}=${serviceOrderId}`);
      if (res.isSuccessful) {
        removeServiceOrderOnUI(serviceOrderInd);
        if (!isArray(serviceOrders)) {
          updatePayload({ hasServiceOrders: false });
        }
      }
    } else {
      showMissingPayloadAlert('Selected task id is not valid');
    }
  };

  const removeServiceOrderOnUI = (serviceOrderInd) => {
    serviceOrders.splice(serviceOrderInd, 1);
    setServiceOrders([...serviceOrders]);
  };

  const saveNewProject = () => {
    let newData;
    if (payload.newProjectNumber) {
      newData = {
        ...payload,
        firstServiceDate: payload.projectStartDate,
        projectNumber: payload.newProjectNumber,
        occuranceSettings: occurance
      };
    } else {
      newData = { ...payload, firstServiceDate: payload.projectStartDate };
    }

    updatePayload({ firstServiceDate: payload.projectStartDate });
    const apiToCall = projectIdFromLocState
      ? updateProject(`${API_V1}/${UPDATE_PROJECTS}`, payload)
      : addNewProject(`${API_V1}/${ADD_NEW_PROJECT}`, newData);
    apiToCall.then((res) => {
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (res?.errorCode) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          maxWidth: 'md',
          title: t('dialog.error'),
          content: res.error,
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
        if (isObject(existingData)) {
          const tempAddnServmn =
            isArray(servicemens) &&
            servicemens.filter((srvcmn) => existingData?.additionalServicemanIds.includes(srvcmn.id));
          updatePayload({
            ...existingData,
            isAdditionalServicemanRequired: isArray(existingData.additionalServicemanIds),
            additionalServicemans: isArray(existingData.additionalServicemanIds) ? tempAddnServmn : []
          });
        }
      } else {
        handleAPIRes(res);
      }
    });
  };

  const checkErrorsAndSaveProject = () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const {
      projectExecutionTypeId,
      locationId,
      projectStartDate,
      name,
      salesManId,
      serviceManId,
      projectStatusId,
      agreementNumber,
      isAdditionalServicemanRequired,
      additionalServicemans,
      signatoryId
    } = payload;
    if (isAdditionalServicemanRequired && !isArray(additionalServicemans)) {
      updatePayload({ isAdditionalServicemanRequired: false });
    }
    if (
      !projectExecutionTypeId ||
      !locationId ||
      !projectStartDate ||
      !name ||
      (name && name.length > MAX_CHAR.NAME) ||
      !salesManId ||
      !serviceManId ||
      !projectStatusId ||
      (agreementNumber && agreementNumber.length > MAX_CHAR.AGREEMENT_NO) ||
      !signatoryId
    ) {
      if (!signatoryId) {
        setShowSignatoryInfo.on();
        console.log('arrowopen');
      }
      setError.on();
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      setError.off();
      if (isArray(serviceOrders) && payload.projectStartDate && serviceOrders[0]?.scheduledDate) {
        if (
          moment(payload.projectStartDate).format('yyyy-MM-DD') >
          moment(serviceOrders[0]?.scheduledDate).format('yyyy-MM-DD')
        ) {
          setShowGenericAlertBox({
            open: true,
            titleType: DIALOG_STATUS.WARNING,
            title: 'Warning',
            content:
              'Project start date > First Service Schedule Date. All service orders will get deleted. Do you want to Continue?',
            cancelButtonText: 'No',
            proceedButtonText: 'Yes',
            proceedAction: 'saveNewProjectCall',
            showProceedBtn: true
          });
          dispatch({ type: IS_DATA_LOADING, data: false });
        } else {
          saveNewProject();
        }
      } else {
        saveNewProject();
      }
    }
  };

  const uploadBase64File = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader?.result?.replace('data:application/pdf;base64,', ''); // Removed this string from base64 as it is not needed
      const { name, type: fileType } = file;
      const attachments = [
        {
          fileName: name,
          fileType,
          extension: '.pdf', // uploading only pdf file here.
          fileBase64: base64,
          filePath: '', // for preview
          originalFileName: name
        }
      ];
      updatePayload({ attachments });
      setIsFormModified.on();
    };
  };

  // handle remove selcted file
  const handleRemove = (file) => {
    payload.attachments?.filter((_file) => _file !== file);
    const filteredItems = [];
    updatePayload({ attachments: filteredItems });
    setIsFormModified.on();
  };

  const handleClickShowServiceFreq = () => {
    if (payload.projectId) {
      setShowServiceFreq.toggle();
    }
  };

  const handleCloseSearchProjectDetails = () => setOpenSearchProjectDetails.off();

  const getProjectDetails = () => setOpenSearchProjectDetails.off();

  const getStatus = (status) => {
    const res = status && statusList.find((st) => st.id === status * 1);
    return (res && `(${res.name})`) || '';
  };

  const getServiceOccurrences = async (payload = payload) => {
    if (payload.hasServiceOrders) {
      return;
    }
    // setServiceOrders([]);
    const {
      firstServiceDate,
      noOfServices,
      projectEndDate,
      frequencyId,
      dailyIncrementValue,
      weeklyIncrementValue,
      specificWeekdays,
      specificMonthDay,
      monthlyIncrementValue,
      specificWeek,
      specificWeekdayMonthly,
      specificMonth,
      isNoOfServicesPicked
    } = payload;
    if (firstServiceDate && frequencyId && (noOfServices || projectEndDate)) {
      setOccurance({
        frequency: '',
        frequencyId,
        dailyIncrementValue,
        weeklyIncrementValue,
        specificWeekdays,
        specificMonthDay,
        monthlyIncrementValue,
        specificWeek,
        specificWeekdayMonthly,
        specificMonth
      });

      const apiPayload = {
        startdate: firstServiceDate,
        enddate: isNoOfServicesPicked ? '' : projectEndDate,
        noOfServices: (isNoOfServicesPicked && noOfServices) || 0,
        occuranceRequest: {
          frequency: '',
          frequencyId,
          dailyIncrementValue,
          weeklyIncrementValue,
          specificWeekdays,
          specificMonthDay,
          monthlyIncrementValue,
          specificWeek,
          specificWeekdayMonthly,
          specificMonth
        }
      };

      if (
        frequencyId &&
        ((weeklyIncrementValue && specificWeekdays.length > 0) || // by week
          dailyIncrementValue || // by day
          (monthlyIncrementValue && specificMonthDay) ||
          (monthlyIncrementValue && specificWeek && specificWeekdayMonthly) || // by months
          (specificMonth && specificWeek && specificWeekdayMonthly) ||
          (specificMonth && specificMonthDay)) // by days
      ) {
        const res = await getServiceOccurrencesList(`${API_V1}/${SERVICE_OCCURRENCES}`, apiPayload);
        if (res?.data && !isArray(res?.data?.occurances)) {
          setServiceOrders([]);
          updatePayload({ noOfServices: '0' });
        }
        if (res?.data && isArray(res?.data?.occurances)) {
          const { occurances, noOfServices, projectEndDate } = res?.data;
          setServiceOrders([
            ...occurances.map((occ) => {
              occ.isDeviceAllowed = payload.isDeviceAllowed;
              occ.isPermitNeeded = payload.isPermitNeeded;
              occ.isPermitReceived = payload.isPermitNeeded;
              occ.isPONeeded = payload.isPONeeded;
              occ.servicemanId = payload.serviceManId;
              occ.preferredTimingId = payload.preferredTimingId;
              occ.additionalServicemanIds = payload.additionalServicemanIds;
              occ.additionalServicemen = payload.additionalServicemans;
              occ.isServiceOrderEditable = true;
              return occ;
            })
          ]);

          updatePayload({
            noOfServices,
            projectEndDate: (projectEndDate && getFormattedDate('', new Date(projectEndDate))) || ''
          });
          return true;
        }
      }
    }
  };

  const getServices = (projectId = projectIdFromLocState) => {
    const res = getServiceOrdersByProjectId(`${API_V1}/${GET_SERVICE_ORDERS_WITH_PROJECT_ID}=${projectId}`).then(
      (res) => {
        dispatch({ type: IS_DATA_LOADING, data: false });
        if (res?.errorCode) {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.ERROR,
            title: t('dialog.error'),
            content: res.error,
            showProceedBtn: false,
            cancelButtonText: 'Ok',
            color: 'success'
          });
        } else {
          res.data.forEach((ord) => {
            if (isArray(ord.additionalServicemanIds)) {
              ord.additionalServicemen = ord.additionalServicemanIds.map((mn) =>
                servicemens.find((ad) => ad.id === mn)
              );
            }
          });
          res.data.forEach((ord) => {
            if (isArray(ord.additionalServicemen)) {
              ord.additionalServicemen = ord.additionalServicemen.sort((a, b) => a.name.localeCompare(b.name));
            }
          });
          setServiceOrders(res.data);
          if (isArray(res.data)) {
            const { additionalServicemanIds, additionalServicemen, preferredTimingId, servicemanId } = res?.data[0];
            setServiceGridData({ additionalServicemanIds, additionalServicemen, preferredTimingId, servicemanId });
          }
        }
      }
    );
  };

  const checkForDuplicateServicOrder = () => {
    const duplicateServiceOrders = serviceOrders.filter(
      (ord, index, self) =>
        index !==
        self.findIndex(
          (selfOrd) =>
            selfOrd.preferredTimingId === ord.preferredTimingId &&
            selfOrd.servicemanId === ord.servicemanId &&
            getFormattedDate(DATE_FORMAT.DATE_DAY_FORMAT, selfOrd.scheduledDate) ===
              getFormattedDate(DATE_FORMAT.DATE_DAY_FORMAT, ord.scheduledDate)
        )
    );
    return isArray(duplicateServiceOrders);
  };

  const saveServiceOrders = async (isServiceSubject) => {
    if (checkForDuplicateServicOrder()) {
      setShowGenericAlertBox({
        open: true,
        title: 'Duplicate Service order',
        content: 'Duplicate service order found.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
      return true;
    }
    const {
      projectId,
      firstServiceDate,
      projectEndDate,
      isNoOfServicesPicked,
      frequencyId,
      noOfServices,
      projectZones,
      serviceFrequencyMonthlyTypes,
      serviceFrequencyYearlyTypes,
      dailyIncrementValue,
      weeklyIncrementValue,
      specificMonthDay,
      monthlyIncrementValue,
      specificWeekdays,
      specificWeek,
      specificWeekdayMonthly,
      specificMonth
    } = payload;

    if (
      (isNoOfServicesPicked === false && projectEndDate === '') ||
      (frequencyId === '1' && !dailyIncrementValue) ||
      (frequencyId === '2' && !weeklyIncrementValue) ||
      (frequencyId === '2' && weeklyIncrementValue && !isArray(specificWeekdays)) ||
      (frequencyId === '3' &&
        serviceFrequencyMonthlyTypes === 'recurEveryDay' &&
        (!specificMonthDay ||
          specificMonthDay.length === 0 ||
          !monthlyIncrementValue ||
          monthlyIncrementValue.length === 0)) ||
      (frequencyId === '3' &&
        serviceFrequencyMonthlyTypes === 'recurEveryMonth' &&
        (!specificWeek ||
          specificWeek.length === 0 ||
          !monthlyIncrementValue ||
          monthlyIncrementValue.length === 0 ||
          !specificWeekdayMonthly ||
          specificWeekdayMonthly.length === 0)) ||
      (frequencyId === '4' &&
        serviceFrequencyYearlyTypes === 'monthOfYear' &&
        (!specificMonth || specificMonth.length === 0 || !specificMonthDay || specificMonthDay.length === 0)) ||
      (frequencyId === '4' &&
        serviceFrequencyYearlyTypes === 'dayOfMonthOfYear' &&
        (!specificWeek ||
          specificWeek.length === 0 ||
          !specificWeekdayMonthly ||
          specificWeekdayMonthly.length === 0 ||
          !specificMonth ||
          specificMonth.length === 0))
    ) {
      setError.on();
    } else {
      setError.off();

      const occuranceSettings = frequencyId === 0 ? null : occurance;
      const apiPayload = {
        projectId,
        firstServiceDate,
        projectEndDate,
        isNoOfServicesPicked,
        isProjectEndDatePicked: !isNoOfServicesPicked,
        frequencyId,
        noOfServices,
        projectZones,
        serviceOrders,
        occuranceSettings
      };

      const res = await createServiceOrders(`${API_V1}/${CREATE_SERVICE_ORDERS}`, apiPayload);
      if (!res?.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          title: 'Error',
          titleType: DIALOG_STATUS.ERROR,
          content: (isArray(res?.errors) && res?.errors[0]) || 'Something went wrong, please try in sometime..!!',
          showProceedBtn: false,
          cancelButtonText: 'Close'
        });
      }

      dispatch({ type: IS_DATA_LOADING, data: true });
      setTimeout(() => {
        if (isServiceSubject) {
          handleCloseBackAlertBox();
          navigateToAddServiceSubject();
        } else {
          navigateToEditContract();
        }
      }, 5000);
    }
  };

  const handleRefreshCustomerData = async () => {
    if (payload.customerId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await refreshCustomerData(`${API_V1}/${REFRESH_CUST_DATA}=${payload.customerId}`);
      if (res.isSuccessful) {
        const { data } = res;
        getSingotoriesInfo(payload.locationId);
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.SUCCESS,
          title: 'Refresh customer data',
          content: res.message || getDialogBoldContent(payload?.customerName, '', 'refreshCustomer', data.response),
          cancelButtonText: 'Close',
          showProceedBtn: false,
          maxWidth: 'md'
        });
      }
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Please select Customer.',
        cancelButtonText: 'Close',
        showProceedBtn: false
      });
    }
  };

  const setDefaultSignatory = () => {
    let signatoryId = 0;
    if (isArray(singotories)) {
      const primarySignotory = singotories.find((sign) => sign.isPrimary);
      if (primarySignotory) {
        signatoryId = primarySignotory.id;
      }
      if (defSignatory) {
        signatoryId = defSignatory;
      } else {
        signatoryId = singotories[0].id;
      }
    }
    updatePayload({ signatoryId });
    handleChangeData('signatoryId', signatoryId);
    setIsFormModified.off();
  };
  const getServiceFreqCollapsIcon = () =>
    showServiceFreq ? (
      <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickShowServiceFreq} />
    ) : (
      <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickShowServiceFreq} />
    );

  const getColor = () => `${payload.projectId ? 'inherit' : 'lightgray'}`;

  const navigateToEditServiceSubject = (serviceSubjectObjId) => {
    const { projectId, projectNumber, locationName, legalEntityId, businessSubTypeId, contractId } = payload;
    navigate(
      `${ROUTES.EDIT_SERVICE_SUBJECT}/${serviceSubjectObjId}`,
      {
        state: {
          serviceSubjectObjId,
          projectId,
          projectNumber,
          locationName,
          legalEntityId,
          businessSubTypeId,
          contractId
        }
      },
      { replace: true }
    );
  };

  return (
    <Grid sx={{ padding: '30px 20px', width: '100%', margin: '-35px auto' }}>
      <DialogComponent
        open={alertBox.open}
        handleClose={handleCloseAlertBox}
        title={alertBox.title}
        maxWidth="md"
        color="success"
        titleType={alertBox.titleType}
        content={alertBox.content}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
      />
      <DialogComponent
        open={genericAlertBox.open}
        handleClose={handleCloseBackAlertBox}
        title={genericAlertBox.title}
        maxWidth={genericAlertBox.maxWidth}
        color={genericAlertBox.color}
        titleType={genericAlertBox.titleType}
        content={genericAlertBox.content}
        isCancelButton
        isProceedButton={genericAlertBox.showProceedBtn}
        cancelButtonText={genericAlertBox.cancelButtonText}
        proceedButtonText={genericAlertBox.proceedButtonText}
        handleProceed={handleProceedBackAlertBox}
      />
      <NotesDialog
        noteProps={{ ...notesBox }}
        handleClose={handleCloseNotesAlertBox}
        handleProceed={handleProceedNotesAlertBox}
      />
      {!openSearchProjectDetails ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Typography fontWeight="bold" variant="subtitle1">
                {projectIdFromLocState ? 'Edit' : 'Add New'} Project -
              </Typography>
            </Grid>
            <Grid item xs={10} sx={{ marginLeft: '-6rem' }}>
              <Typography fontWeight="bold" variant="subtitle1">
                {projectIdFromLocState ? (
                  <>
                    {payload.projectNumber} ({payload.projectStatus}) : {payload.locationName} - {payload.customerName}
                  </>
                ) : (
                  <>
                    {payload.contractNumber} ({payload.contractStatus}) : {payload.contractName} -{' '}
                    {payload.customerName}
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
          <Divider style={{ marginTop: '0.7rem' }} />

          {/* Grid container for first section region/preferred timing/execution type */}
          <Grid container spacing={3} style={{ marginTop: '0rem' }}>
            {projectIdFromLocState ? (
              <Grid item xs={12} display="flex" alignItems="center" mb={1}>
                {showProjectDetailInfo ? (
                  <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => setShowProjectDetailInfo.toggle()} />
                ) : (
                  <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={() => setShowProjectDetailInfo.toggle()} />
                )}
                <Typography fontWeight="bold" variant="subtitle2">
                  Project Details
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography fontWeight="bold">Project Details </Typography>
              </Grid>
            )}
            {(showProjectDetailInfo || !projectIdFromLocState) && (
              <>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={3}>
                    {projectDetailsCol1?.map((comp, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={comp}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                      />
                    ))}{' '}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={3}>
                    {projectDetailsCol2?.map((comp, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={comp}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                        deleteMltSlctOptn={deleteMltSlctOptn}
                      />
                    ))}{' '}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          {/* Grid container for project signatory information */}
          {/* <Grid container spacing={3} mt={1} style={{ border: '1px solid rgb(50 59 69)' }}> */}
          <Grid
            container
            spacing={3}
            mt={1}
            style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
          >
            <Grid item xs={12} display="flex" alignItems="center" mb={1}>
              {showSignatoryInfo ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => setShowSignatoryInfo.toggle()} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={() => setShowSignatoryInfo.toggle()} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                Signatory Information
              </Typography>
            </Grid>
            {showSignatoryInfo && (
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {signotoryComps?.map((comp, ind) => (
                    <RenderComponent
                      key={ind}
                      metaData={comp}
                      payload={payload}
                      ind={1}
                      handleChange={handleChangeData}
                    />
                  ))}{' '}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {projectDatesComps?.map((comp, ind) => {
                  if (comp.key === 'projectStartDate' && payload.isBlockFirstServiceDate) {
                    comp.isDisabled = true;
                  }
                  return (
                    <RenderComponent
                      key={ind}
                      metaData={comp}
                      payload={payload}
                      ind={1}
                      handleChange={handleChangeData}
                    />
                  );
                })}
                {notesNsaveProjComps?.map((comp, ind) => {
                  if (comp.key === 'specialAttentionNotes') {
                    comp.color = (payload?.notes && 'primary') || '';
                  }
                  return (
                    <RenderComponent
                      key={ind}
                      metaData={comp}
                      payload={payload}
                      ind={1}
                      handleChange={handleChangeData}
                    />
                  );
                })}{' '}
              </Grid>

              <Grid
                item
                xs={12}
                mt={1}
                sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'centre', marginTop: '-0.5rem' }}
              >
                <Grid item xs={8} sx={{ display: 'flex' }}>
                  <UploadFile
                    showPreview
                    maxSize={3145728}
                    accept="application/pdf"
                    files={payload.attachments}
                    onDrop={handleDropMultiple}
                    onRemove={handleRemove}
                    backgroundColor="transparent"
                    startIcon={<PhotoCamera />}
                    buttonLabel="Upload Project pdf"
                    isRequired
                    uploadBtnStyles={{ display: 'inline-block', marginRight: '1rem' }}
                    filesStyles={{ display: 'inline-block', margin: 0 }}
                    noFileText="No File Uploaded"
                    isDisabled={payload.projectId && !projectIdFromLocState}
                    // showCloseBtn={!payload.projectId}
                    showCloseBtn
                    isFileUploadMandatory={false}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '8px', marginTop: '-0.5rem' }}
                >
                  <RenderComponent metaData={{ ...saveupdateProjectComp }} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* <Divider style={{ marginTop: '1rem' }} /> */}

          {/* Grid Container for service frequency setting / Invoice recipient & frequency setting */}
          <Grid
            container
            spacing={3}
            mt={1}
            style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
          >
            {/* <Grid item xs={12} display="flex" alignItems="center" mb={1}> */}
            <Grid item xs={12} style={{ color: getColor() }} mb={2}>
              {getServiceFreqCollapsIcon()}
              <Typography
                fontWeight="bold"
                variant="subtitle2"
                style={{ marginTop: '-1.8rem', marginLeft: '1.5rem', marginBottom: '0.5rem' }}
              >
                Service Frequency Settings
              </Typography>
            </Grid>

            {showServiceFreq && (
              <>
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={3}>
                    {servcFrqType1Comps?.map((comp, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={comp}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                      />
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={3} style={{ marginLeft: '-7rem' }}>
                    {servcFrqType4Comps?.map((comp, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={comp}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                        handleBlur={handleOnBlur}
                      />
                    ))}
                  </Grid>
                </Grid>
                {!payload.hasServiceOrders && (
                  <Grid container spacing={3} mt={1.5} style={{ marginLeft: '0.1rem' }}>
                    <Grid item xs={12} sm={2}>
                      <Grid container spacing={3}>
                        <RenderComponent
                          metaData={serviceFreqDrpdwn}
                          payload={payload}
                          ind={1}
                          handleChange={handleChangeData}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      {/* Service Frequency Daily Component */}
                      {payload?.frequencyId === '1' ? (
                        <Grid container spacing={3}>
                          {byDayServiceFreq?.map((comp, ind) => (
                            <RenderComponent
                              key={ind}
                              metaData={comp}
                              payload={payload}
                              ind={1}
                              handleChange={handleChangeData}
                              handleBlur={handleOnBlur}
                            />
                          ))}
                        </Grid>
                      ) : null}

                      {/* Service Frequency Weekly Component */}

                      {payload?.frequencyId === '2' ? (
                        <>
                          {/* Service Frequency Normal ON Typo container */}
                          <Grid container spacing={3}>
                            {byWeekServiceFreq?.map((comp, ind) => (
                              <RenderComponent
                                key={ind}
                                metaData={comp}
                                payload={payload}
                                ind={1}
                                handleChange={handleChangeData}
                                handleBlur={handleOnBlur}
                              />
                            ))}
                          </Grid>

                          {/* Service Frequency Days Container */}
                          <Grid item xs={9}>
                            <FormControl required error={error && !isArray(payload.specificWeekdays)}>
                              <div style={{ display: 'flex' }}>
                                {DAYS?.map((item, i) => (
                                  <FormControlLabel
                                    key={i}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        checked={payload.specificWeekdays.includes(item.id) || false}
                                        onClick={handleChecked(item.id)}
                                        size="small"
                                      />
                                    }
                                    label={item.name}
                                  />
                                ))}
                              </div>
                              {error && <FormHelperText>Please select week day(s)</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </>
                      ) : null}

                      {/* Service Frequency Monthly */}
                      {payload?.frequencyId === '3' ? (
                        <>
                          <Grid container spacing={3}>
                            <RenderComponent
                              // key={ind}
                              metaData={byMonthServiceFreq}
                              payload={payload}
                              ind={1}
                              handleChange={handleChangeData}
                            />
                          </Grid>
                          {/* {payload?.serviceFrequencyMonthlyTypes === 'Day of every month' ? ( */}
                          {payload?.serviceFrequencyMonthlyTypes === 'recurEveryDay' ? (
                            <Grid container spacing={3} sx={{ marginTop: '0.1rem' }}>
                              {nthDayMonthComps.map((comp, ind) => (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              ))}
                            </Grid>
                          ) : null}

                          {/* {payload?.serviceFrequencyMonthlyTypes === 'Service frequency month OR' ? ( */}
                          {payload?.serviceFrequencyMonthlyTypes === 'recurEveryMonth' ? (
                            <Grid container spacing={3} sx={{ marginTop: '0.1rem' }}>
                              {specificDayOfMonthComps?.map((comp, ind) => (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              ))}
                            </Grid>
                          ) : null}
                        </>
                      ) : null}

                      {/* Service Frequency Yearly */}
                      {payload?.frequencyId === '4' ? (
                        <>
                          <Grid container spacing={3}>
                            <RenderComponent
                              metaData={byYearServiceFreq}
                              payload={payload}
                              ind={1}
                              handleChange={handleChangeData}
                            />
                          </Grid>

                          {payload?.serviceFrequencyYearlyTypes === 'monthOfYear' ? (
                            <Grid container spacing={3} sx={{ marginTop: '0.1rem' }}>
                              {monthOfYearComps?.map((comp, ind) => (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              ))}
                            </Grid>
                          ) : null}

                          {payload?.serviceFrequencyYearlyTypes === 'dayOfMonthOfYear' ? (
                            <Grid container spacing={3} sx={{ marginTop: '0.1rem' }}>
                              {specificDayOfMonthOfYearComps?.map((comp, ind) => (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              ))}
                            </Grid>
                          ) : null}
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                )}
                {/* <Divider style={{ marginTop: '1rem' }} /> */}
                <Grid container spacing={3} mt={0.5} style={{ marginLeft: '0.1rem' }}>
                  <Grid item xs={12} sm={12}>
                    <Typography fontWeight="bold" variant="subtitle2">
                      Service Order Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Grid container spacing={2} sx={{ marginTop: '-0.3rem' }}>
                      {serviceDetailsViewComps.map((comp, ind) => (
                        <RenderComponent
                          key={ind}
                          metaData={comp}
                          payload={payload}
                          ind={1}
                          handleChange={handleChangeData}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4.5}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: '-13rem',
                      marginTop: '-1rem'
                    }}
                  >
                    <Grid item xs={12} sm={3}>
                      <Typography variant="contained">Added Zones:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {isArray(payload?.projectZones) &&
                        payload.projectZones.map((item, ind) =>
                          !item.isDeleted ? (
                            <Chip
                              key={ind}
                              variant="outlined"
                              label={item.zone}
                              onDelete={() => handleZoneDelete(item)}
                            />
                          ) : null
                        )}
                    </Grid>
                  </Grid>
                  {projectIdFromLocState && (
                    <Grid item xs={12} sm={1.5} sx={{ marginLeft: '5rem' }}>
                      <RenderComponent metaData={{ ...saveFirstServiceDateAndZoneComp }} />
                    </Grid>
                  )}
                </Grid>
                <Grid container spacing={3} mt={1} style={{ marginLeft: '0.1rem', marginTop: '0rem' }}>
                  <Grid item xs={12} sm={1}>
                    <Grid item xs={12} sm={12} sx={{ marginTop: '0.2rem' }}>
                      <Tooltip title="Legends for Status & Service Type">
                        <Typography variant="contained">Legends:</Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={11} style={{ marginLeft: '-2.4rem' }}>
                    {serviceSubTableIcons.map((icn, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={icn}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                      />
                    ))}
                  </Grid>
                </Grid>
                <Grid container spacing={3} mt={1} style={{ marginTop: '0rem' }}>
                  <Grid item xs={12}>
                    <ServiceGrid
                      isPermitNeeded={payload.isPermitNeeded}
                      isDeviceAllowed={payload.isDeviceAllowed}
                      isPONeeded={payload.isPONeeded}
                      additionalServicemans={payload.additionalServicemanIds}
                      serviceOrders={serviceOrders}
                      setServiceOrders={setServiceOrders}
                      preferredTimings={preferredTimings}
                      servicemens={servicemens}
                      projectId={projectIdFromLocState}
                      hasServiceOrders={payload.hasServiceOrders}
                      setShowGenericAlertBox={setShowGenericAlertBox}
                      isProjectCompleted={isProjectCompleted}
                      projectEndDate={payload?.projectEndDate}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>

          {/* Grid Container for AX default fields */}
          <Grid
            container
            spacing={3}
            mt={2}
            style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
          >
            <Grid item xs={12} display="flex" alignItems="center" mb={2}>
              {axFields ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => setAxFields.toggle()} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={() => setAxFields.toggle()} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                AX Default Fields
              </Typography>
            </Grid>
            {axFields && (
              <>
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={3}>
                    {axFieldsCompSet?.map((comp, ind) => (
                      <RenderComponent
                        key={ind}
                        metaData={comp}
                        payload={payload}
                        ind={1}
                        handleChange={handleChangeData}
                      />
                    ))}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>

          {/* Grid container for button layout */}
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} display="flex" justifyContent="flex-end" alignItems="center">
              {saveServiceComps.map((comp, ind) => {
                if (
                  payload.hasServiceOrders &&
                  (comp.key === 'saveAndClose' || comp.key === 'saveAndAddServiceSubject')
                ) {
                  return true;
                }
                if (!payload.hasServiceOrders && (comp.key === 'addServiceSubject' || comp.key === 'close')) {
                  return true;
                }
                return (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={1001}
                    handleChange={handleChangeData}
                  />
                );
              })}
            </Grid>
          </Grid>

          {(projectIdFromLocState && (
            <Grid container spacing={3} mt={1} style={{ marginTop: '0rem' }}>
              <Grid item xs={12} sm={12} style={{ marginLeft: '1rem' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Mapped Service Subjects:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ServiceSubjectGrid
                  projectIdFromLocState={projectIdFromLocState}
                  navigateToEditServiceSubject={navigateToEditServiceSubject}
                />
              </Grid>
            </Grid>
          )) || <></>}
        </>
      ) : (
        <SearchProjectDetails
          open={openSearchProjectDetails}
          handleClose={handleCloseSearchProjectDetails}
          selectedCustomer={getProjectDetails}
        />
      )}
    </Grid>
  );
}

export default ProjectCreation;
