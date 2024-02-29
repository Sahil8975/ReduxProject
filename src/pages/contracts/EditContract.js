import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Typography, Button, Container, Divider, Tooltip } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CommentIcon from '@mui/icons-material/Comment';
import RenderComponent from '../../components/RenderComponent';
import {
  COMPONENTS,
  STATUS,
  PATTERN,
  MAX_LENGTH,
  PROJECT_STATUS,
  NOTE_TYPE,
  getDialogBoldContent
} from '../../utils/constants';
import { isArray, isObject } from '../../utils/utils';
import { NOTIFICATIONS, ERRORS } from '../../utils/messages';
import DialogComponent from '../../components/Dialog';
import UploadFile from '../../components/UploadFile';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import { IS_DATA_LOADING } from '../../redux/constants';
import { getSignatoryInformation, getSalesmensDdl } from '../../services/masterDataService';
import { getCustomer } from '../../services/CustomerService';
import { refreshCustomerData } from '../../services/projectService';
import {
  getContractDetails,
  updateContrcat,
  uploadAttachment,
  removeAttachment,
  getProjects
} from '../../services/contractService';
import { APIS, API_V1 } from '../../utils/apiList';
import { ROUTES } from '../../routes/paths';
import useBoolean from '../../hooks/useBoolean';
import NotesDialog from '../../components/notesDialog';

const { GET_SALESMAN_DDL, SEARCH_PROJECTS, REFRESH_CUST_DATA } = APIS;

function EditContract() {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const { country: countries, regions: allRegions, currencyCode, fundingTypes } = masterData;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contractId = location?.state;
  const { GET_CUSTOMERS, GET_SIGNATORYINFORMATION } = APIS;
  const { TEXT_FIELD, SELECT_BOX, TYPOGRAPHY, ICON, BUTTON } = COMPONENTS;
  const [payload, setPayload] = useState({});
  const emptyFilters = {
    contractId: 0,
    statusId: 0,
    projectNumber: '',
    businessTypeId: 0,
    businessSubTypeId: 0,
    servicemanId: 0,
    location: '',
    lastServicByServicemanId: 0,
    notes: '',
    attachments: []
  };
  const [projectFilters, setProjectFilters] = useState({ ...emptyFilters });

  // const [filterPayload, setFilterPayload] = useState({ ...emptyFilters });
  const [isTopGrid, setIsTopGrid] = useState(false);
  const [isAxDefaultFields, setIsDefaultFields] = useState(true);
  const [multipleImages, setMultipleImages] = useState({ images: [] });
  const [isBackBtn, setIsBackBtn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [signatoryData, setSignatoryData] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [getCustomerId, setGetCustomerId] = useState();
  const [salesmanList, setSalesmanList] = useState([]);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [uploadedId, setUplodedId] = useState(0);
  const [confirm, setConfirm] = useBoolean(false);
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [transactionCurrencies, setTransactionCurrencies] = useState([]);
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

  const handleProceedNotesAlertBox = (updatedNote) => {
    updatePayload({ notes: updatedNote });
    handleCloseNotesAlertBox();
  };

  const navigateToEditProject = (project) => {
    navigate(
      `${ROUTES.EDIT_PROJECT}/${project?.id}`,
      { state: { contractId, projectId: project?.id } },
      { replace: true }
    );
  };

  const clearFunnelFilter = () => {
    setFunnelFilters({
      projectStatus: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      projectNumber: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      projectExecutionType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      customerLocation: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      businessCategory: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      serviceman: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      projectEndDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'statusId',
      label: 'serviceDashboard.status',
      placeholder: 'serviceDashboard.status',
      options: masterData?.projectStatuses,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      columnWidth: 2.1
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectNumber',
      label: 'Project Number'
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'businessTypeId',
      label: 'Business Type',
      placeholder: 'Business Type',
      options: masterData?.businessType,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'businessSubTypeId',
      label: 'Business Sub Type',
      placeholder: 'Business Sub Type',
      options: masterData?.businessSubType,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'servicemanId',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: masterData?.servicemens,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    }
  ];

  const columnDataforProjectist = [
    {
      field: 'projectStatus',
      header: 'Status',
      sortable: true,
      filter: true
    },
    {
      field: 'projectNumber',
      header: 'Project Number',
      sortable: true,
      filter: true
    },
    {
      field: 'projectExecutionType',
      header: 'Execution Type',
      sortable: true,
      filter: true
    },
    {
      field: 'customerLocation',
      header: 'Project Location',
      sortable: true,
      filter: true
    },
    {
      field: 'businessCategory',
      header: 'Business Category',
      sortable: true,
      filter: true
    },
    {
      field: 'serviceman',
      header: 'Serviceman',
      sortable: true,
      filter: true
    },
    {
      field: 'projectEndDate',
      header: 'Project End Date',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'action',
      header: 'Action',
      icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: navigateToEditProject,
      placement: 'left',
      tooltipTitle: 'Click to edit Project',
      style: { width: '5%' }
    }
  ];

  const numericFields = ['projectStatus', 'projectNumber', 'projectExecutionType'];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'ICON'];

  const componentsSet1 = [
    {
      control: TYPOGRAPHY,
      groupStyle: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '3rem' },
      key: 'accountCurrency',
      label: 'Accounting Currency:',
      columnWidth: 3
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'trasactionCurrency',
      label: 'Transaction Currency',
      placeholder: 'Transaction Currency',
      options: transactionCurrencies,
      columnWidth: 4,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      select: true,
      isRequired: true,
      isError: isError && !payload.trasactionCurrency,
      helperText: isError && !payload.trasactionCurrency && ERRORS.TRANSACTION_CURRENCY_REQUIRED
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'fundingType',
      label: 'Funding Type',
      placeholder: 'Funding Type',
      options: fundingTypes,
      columnWidth: 4,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isRequired: true,
      isError: isError && !payload.fundingType,
      helperText: isError && !payload.fundingType && ERRORS.FUNDING_TYPE_REQUIRED,
      isDisabled: fundingTypes.length === 1
    }
  ];

  const componentsSet3 = [
    {
      control: TYPOGRAPHY,
      key: 'accountNumber',
      label: 'Account Number',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'invoiceAccount',
      label: 'Invoice Account',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'customerGroup',
      label: 'Customer Group',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'paymentTerm',
      label: 'Payment Term',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'crNumber',
      label: 'CR Number',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'mainAccount',
      label: 'Main Account',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'customerName',
      label: 'Customer Name',
      columnWidth: 6
    }
  ];

  const componentsSet4 = [
    {
      control: TYPOGRAPHY,
      key: 'h1LegalEntity',
      label: 'H1 Legal Entity',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'h2Region',
      label: 'H2 Region',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'h3BusinessUnit',
      label: 'H3 Business Unit',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'h4BusinessSector',
      label: 'H4 Business Sector',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'h5BusinessIndustry',
      label: 'H5 Business Industry',
      columnWidth: 6
    },
    {
      control: TYPOGRAPHY,
      key: 'h6Department',
      label: 'H6 Department',
      columnWidth: 6
    }
  ];

  const componentsSet5 = [
    {
      control: SELECT_BOX,
      key: 'designation',
      label: 'Designation',
      placeholder: 'Designation',
      options: designation,
      groupStyle: { marginBottom: '0.3rem', marginTop: '1.5rem' },
      columnWidth: 6,
      isError: isError && !payload.designation,
      helperText: isError && !payload.designation && 'Designation Required',
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryName',
      label: 'Name',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.3rem', marginTop: '1.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryAddress',
      label: 'Address',
      columnWidth: 12,
      isDisabled: true
    }
  ];

  const componentsSet6 = [
    {
      control: TEXT_FIELD,
      key: 'signatoryPhone',
      label: 'Phone',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.3rem', marginTop: '1.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryMobile',
      label: 'Mobile',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.3rem', marginTop: '1.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryEmail',
      label: 'Email',
      placeholder: 'Email',
      columnWidth: 11,
      isDisabled: true
    },
    {
      control: ICON,
      groupStyle: { marginTop: '0.3rem' },
      key: 'signatoryNote',
      iconName: <CommentIcon />,
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

  const componentsSet7 = [
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'salesman',
      label: 'Salesman',
      placeholder: 'Salesman',
      options: salesmanList,
      columnWidth: 4,
      isError: isError && !payload.salesman,
      helperText: isError && !payload.salesman && 'Salesman Required',
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'generalDiscount',
      label: 'General Discount',
      columnWidth: 2.5,
      groupStyle: { height: '3rem', paddingLeft: '1rem', marginLeft: '7.7rem' },
      endAdornmentData: '%'
    }
  ];

  const note = {
    control: TEXT_FIELD,
    key: 'note',
    label: 'Note (Max 500 characters)',
    groupStyle: { marginTop: '1rem' },
    columnWidth: 12,
    isMultiline: true,
    textRows: 2,
    maxCharacterLimit: MAX_LENGTH.NOTE_CHARACTER_LIMIT
  };

  const handleClickTopGridIcon = () => setIsTopGrid(!isTopGrid);

  const handleClickAxDefaultFields = () => setIsDefaultFields(!isAxDefaultFields);

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const handleDialogClose = () => {
    setConfirm.off();
  };

  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs });

  const isValidGeneralDiscount = (val) => PATTERN.GENERAL_DISCOUNT.test(val);

  const getErrorMessage = (res, errorMsg = '') => {
    if (isArray(res.errors)) {
      return res.errors[0] || errorMsg;
    }
    return NOTIFICATIONS.SOMETHING_WENT_WRONG;
  };

  const updateSignatories = (val) => {
    const selectedSignatory = (designation?.filter((item) => item.id === val * 1))[0] || {};
    setPayload({
      ...payload,
      ...getSignatories(selectedSignatory),
      designation: val
    });
  };

  const handleChangeData = (key, val, ind) => {
    setIsFormModified.on();
    let isUpdate = true;
    if (key === 'designation') {
      isUpdate = false;
      updateSignatories(val);
    }
    if (key === 'generalDiscount') {
      isUpdate = false;
      if (val === '' || isValidGeneralDiscount(val)) {
        setPayload({
          ...payload,
          generalDiscount: val
        });
      }
    }
    if (key === 'notes') {
      setPayload({
        ...payload,
        notes: val.substr(0, MAX_LENGTH.NOTES)
      });
    }
    if (isUpdate) {
      updatePayload({ [key]: val });
    }
  };

  const confirmationBox = (content = '', titleType = '', title = '') => {
    setShowAlertBox({
      open: true,
      titleType,
      title,
      content
    });
  };

  const handleDropMultiple = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file && file.type === 'application/pdf') {
        uploadBase64File(file);
      }
    }
  });

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
          extension: '.pdf',
          fileBase64: base64,
          filePath: '',
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

  // Handle alert back button success method
  const handleBackBtnDialogSubmit = () => {
    setIsBackBtn(false);
    navigate(ROUTES.CONTRACTS);
  };

  // Handle alert back button close method
  const handleBackBtnDialogClose = () => {
    setIsBackBtn(false);
  };

  const getCustomerData = async (payloadData = payload) => {
    const res = await getCustomer(`${API_V1}/${GET_CUSTOMERS}`, payloadData);
    if (res && isObject(res)) {
      const customers = res?.data?.customers || [];
      if (isArray(customers)) {
        let id;
        customers.forEach((item) => {
          id = item.id;
          return id;
        });
        setGetCustomerId(id);
      } else {
        setGetCustomerId('');
      }
    }
  };

  const getSignatories = (signatory) => ({
    signatoryName: signatory?.contactName || '',
    signatoryPhone: signatory?.phone || '',
    signatoryMobile: signatory?.mobile || '',
    signatoryAddress: signatory?.customerAddress || '',
    signatoryEmail: signatory?.email || ''
  });

  const getDimentionValue = (data, key) => data.filter((el) => el.name === key)[0]?.value || '';

  const getContractInfo = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getContractDetails(`${API_V1}${ROUTES.CONTRACT_DETAILS}?contractId=${contractId}`);
    if (res.data) {
      let fundingType = 0;
      const signatories = res?.data?.signatories || [];
      const primaryDesignation = signatories.filter((el) => el.id === res?.data?.customerLocationContactId);
      const defaultDesignation = primaryDesignation.length ? primaryDesignation[0] : {};
      const defaultFundingType = fundingTypes.filter((el) => el.id === res?.data?.fundingTypeId);
      setTransactionCurrencies(res?.data?.transactionCurrencies);
      const transactionCurr = [];
      res.data?.transactionCurrencies.forEach((dt) => {
        if (dt.name === res.data?.accountCurrency) {
          transactionCurr.push(dt);
        }
      });
      if (defaultFundingType.length) {
        fundingType = defaultFundingType[0]?.id || 0;
      }
      const country = countries.filter((el) => el.id === res?.data?.countryId)[0] || {};
      const regions = allRegions.filter((el) => el.id === res?.data?.regionId)[0] || {};
      const payloadData = {
        countryId: res?.data?.countryId,
        regionId: res?.data?.regionId,
        customerId: res?.data?.customerId,
        accountNumber: res?.data?.accountNumber || '',
        customerName: res?.data?.customerName || '',
        contractNumber: res?.data?.contractNumber,
        contractStatus: res?.data?.contractStatus,
        customerAddress: res?.data?.customerAddress || '',
        contractName: res?.data?.contractName || '',
        signedOn: res?.data?.signedOn,
        startDate: res?.data?.startDate,
        salesman: res?.data?.salesmanId?.toString(),
        commercialRegistrationNumber: res?.data?.crNumber || '',
        notes: res?.data?.note,
        generalDiscount: res?.data?.discount,
        attachments: res?.data?.attachments || [],
        trasactionCurrency: res?.data?.currencyId || transactionCurr[0].id || '',
        accountCurrency: res?.data?.accountCurrency,
        fundingType,
        customerGroup: res?.data?.custGroup || '',
        invoiceAccount: res?.data?.invoiceAccount || '',
        paymentTerm: res?.data?.paymentTerms || '',
        crNumber: res?.data?.crNumber || '',
        mainAccount: res?.data?.mainAccount || '',
        fdCustomerName: res?.data?.fdCustomerName || '',
        h1LegalEntity: getDimentionValue(res?.data?.dimensions, 'H1_LegalEntity') || '',
        h2Region: getDimentionValue(res?.data?.dimensions, 'H2_Region') || '',
        h3BusinessUnit: getDimentionValue(res?.data?.dimensions, 'H3_BusinessUnit') || '',
        h4BusinessSector: getDimentionValue(res?.data?.dimensions, 'H4_BusinessSector') || '',
        h5BusinessIndustry: getDimentionValue(res?.data?.dimensions, 'H5_BusinessIndustry') || '',
        h6Department: getDimentionValue(res?.data?.dimensions, 'H6_Department') || '',
        designation: defaultDesignation?.id || '',
        countryName: country?.name || '',
        regionName: regions?.name || '',
        ...getSignatories(defaultDesignation)
      };
      updatePayload(payloadData);
      setDesignation(signatories);
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };
  const getSignatoryData = async () => {
    const payloadData = { customerId: 16118 };
    const res = await getSignatoryInformation(`${API_V1}/${GET_SIGNATORYINFORMATION}`, payloadData);
    const tempDesignation = [];
    if (res && isObject(res)) {
      const signatoryinformation = res?.data;
      if (isArray(signatoryinformation)) {
        setSignatoryData(signatoryinformation);
        signatoryinformation.forEach((item) =>
          tempDesignation.push({ id: item.id, name: item.name, primaryAddress: item.isPrimary_Address })
        );
      }
    }
    if (isArray(tempDesignation)) {
      setDesignation(tempDesignation);
    }
  };

  const getSalesmanData = async () => {
    const res = await getSalesmensDdl(`${API_V1}/${GET_SALESMAN_DDL}?regionId=${payload?.regionId}`);
    if (res?.data && isArray(res?.data)) {
      setSalesmanList(res?.data);
    } else {
      setSalesmanList([]);
    }
  };

  const updateContractDetails = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });

    const data = {
      contractInputs: {
        contractId,
        customerContactId: payload?.designation,
        salesmanId: payload?.salesman ? Number(payload?.salesman) : 0,
        discount: payload?.generalDiscount ? Number(payload.generalDiscount) : 0,
        note: payload?.notes,
        transactionCurrencyId: payload?.trasactionCurrency ? Number(payload?.trasactionCurrency) : 0,
        fundingTypeId: Number(payload?.fundingType),
        attachments: payload?.attachments
      }
    };
    const res = await updateContrcat(`${API_V1}${ROUTES.UPDATE_CONTRACT}`, data);
    if (res?.isSuccessful) {
      const message = getDialogBoldContent(payload?.contractNumber, '', 'contractNumber', '');
    } else {
      confirmationBox(res?.error || NOTIFICATIONS.SOMETHING_WENT_WRONG, STATUS.ERROR, t('dialog.error'));
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const handleClickSave = () => {
    const { salesman, designation, trasactionCurrency, fundingType } = payload;
    if (!salesman || !designation || !trasactionCurrency || !fundingType) {
      setIsError(true);
    } else {
      setIsError(false);
      setConfirm.on();
    }
  };

  const getFilterData = (filters, callApi) => {
    let tempProjectFilters = {};
    if (callApi) {
      tempProjectFilters = { ...emptyFilters, ...projectFilters };
    } else {
      tempProjectFilters = { ...emptyFilters, contractId };
    }
    getProjectList({ ...tempProjectFilters });
    setProjectFilters({ ...tempProjectFilters });
  };

  const getFilterDataPayloadChange = (key, val) => {
    if (!val && ['statusId', 'businessTypeId', 'businessSubTypeId', 'servicemanId'].includes(key)) {
      val = 0;
    }
    setProjectFilters({ ...projectFilters, [key]: val });
  };

  const handleRefreshCustomerData = async () => {
    if (payload?.customerId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await refreshCustomerData(`${API_V1}/${REFRESH_CUST_DATA}=${payload?.customerId}`);
      if (res.isSuccessful) {
        const { data } = res;
        getContractInfo();
        setShowAlertBox({
          open: true,
          titleType: STATUS.SUCCESS,
          title: 'Refresh customer data',
          content: res.message || getDialogBoldContent(payload?.customerName, '', 'refreshCustomer', data.response)
        });
      }
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      setShowAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Please select Customer.'
      });
    }
  };

  const getProjectList = async (filterPayload = projectFilters) => {
    if (filterPayload.contractId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await getProjects(`${API_V1}/${SEARCH_PROJECTS}`, filterPayload);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (res.isSuccessful && isArray(res?.data)) {
        const projectData = res.data.map((project) => {
          const {
            projectStatus,
            projectNumber,
            customerLocation,
            projectExecutionType,
            businessCategory,
            serviceman,
            projectEndDate,
            id
          } = project;
          return {
            projectStatus,
            projectNumber,
            projectExecutionType,
            customerLocation,
            businessCategory,
            serviceman,
            projectEndDate,
            id
          };
        });
        setProjectData(projectData);
        return true;
      }
    }
    setProjectData([]);
  };

  useEffect(() => {
    // TODO - Project list
    // getCustomerData();
    // getSignatoryData();
  }, [designation, payload?.designation]);

  useEffect(() => {
    getContractInfo();
  }, []);

  useEffect(() => {
    const tempProjectFilters = { ...emptyFilters, contractId };
    getProjectList({ ...tempProjectFilters });
    setProjectFilters({ ...tempProjectFilters });
  }, [contractId]);

  useEffect(() => {
    if (payload.regionId) {
      getSalesmanData();
    }
  }, [payload.regionId]);

  useEffect(() => {
    if (isArray(salesmanList) && payload?.salesman) {
      setPayload({
        ...payload,
        salesman: payload?.salesman
      });
    }
  }, [salesmanList]);

  const handleDialogSubmit = () => {
    setConfirm.off();
    updateContractDetails();
  };

  const handleBack = () => {
    if (isFormModified) {
      setIsBackBtn(true);
    } else {
      navigate(ROUTES.CONTRACTS);
    }
  };

  return (
    <Grid sx={{ padding: '30px 20px', width: '100%', margin: '-35px auto', overflowX: 'hidden' }}>
      <DialogComponent
        open={isBackBtn}
        handleClose={handleBackBtnDialogClose}
        handleProceed={handleBackBtnDialogSubmit}
        titleType="Warning"
        title="Redirecting to Contract List"
        content="Redirecting to Contract List. Do you want to continue?"
        isProceedButton
        isCancelButton
        proceedButtonText="Yes"
        cancelButtonText="No"
      />
      <DialogComponent
        open={alertBox.open}
        handleClose={handleCloseAlertBox}
        title={alertBox.title}
        titleType={alertBox.titleType}
        content={alertBox.content}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
        color="success"
      />
      <DialogComponent
        open={confirm}
        handleClose={handleDialogClose}
        handleProceed={handleDialogSubmit}
        titleType="Warning"
        title="Edit Contract"
        content="Do you want to update this contract?"
        isProceedButton
        isCancelButton
        proceedButtonText="Yes"
        cancelButtonText="No"
      />
      <NotesDialog
        noteProps={{ ...notesBox }}
        handleClose={handleCloseNotesAlertBox}
        handleProceed={handleProceedNotesAlertBox}
      />
      {/* Grid container for heading */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle1">
            Edit Contract - {payload?.contractNumber} ({payload.contractStatus}) : {payload.accountNumber} -{' '}
            {payload.customerName}
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: '0.5rem' }} />

      {/* Grid for expandable section */}
      <Grid item xs={12} display="flex" alignItems="center" mb={1.5}>
        {isTopGrid ? (
          <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickTopGridIcon} />
        ) : (
          <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickTopGridIcon} />
        )}
        <Typography fontWeight="bold" variant="subtitle2">
          Contract Details
        </Typography>
      </Grid>

      {/* Grid for FormFields */}
      {isTopGrid && (
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Customer Number</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.accountNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', wordWrap: 'break-word' }}>
              <Typography variant="subtitle2">Customer Name</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.customerName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Country / Region</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload.countryName} / {payload.regionName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Customer Address</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.customerAddress}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Commercial Registration Number</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.commercialRegistrationNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', wordWrap: 'break-word' }}>
              <Typography variant="subtitle2">Contract Name</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.contractName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Contract Signed On</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.signedOn}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <Typography variant="subtitle2">Contract Start Date</Typography>
              <Typography variant="subtitle2" style={{ color: '#637381' }}>
                {payload?.startDate}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {componentsSet7?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              ))}
            </Grid>
          </Grid>

          {/* Grid Container for AX Defaults fields and Financial dimensions */}
          <Grid item xs={12} display="flex" alignItems="center" mb={3} sx={{ marginTop: '1rem' }}>
            {isAxDefaultFields ? (
              <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickAxDefaultFields} />
            ) : (
              <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickAxDefaultFields} />
            )}{' '}
            <Typography fontWeight="bold" variant="subtitle2">
              AX Default Fields
            </Typography>
          </Grid>

          {isAxDefaultFields && (
            <>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3}>
                  {componentsSet1?.map((comp, ind) => (
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

              {/* Financial dimension grid */}
              <Grid container spacing={3} mt={0.5} ml={0.1}>
                <Grid item xs={12} mb={2}>
                  <Typography fontWeight="bold" variant="subtitle2">
                    Financial Dimensions
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    {componentsSet3?.map((comp, ind) => (
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
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    {componentsSet4?.map((comp, ind) => (
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
              </Grid>
            </>
          )}
        </Grid>
      )}
      <Divider style={{ marginBottom: '2rem' }} />

      {/* Grid for Customer Demographics */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle2">
            Customer Demographics
          </Typography>
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography fontWeight="bold" variant="subtitle2">
            Signatory Information
          </Typography>
          <Tooltip title="Click to fetch new Signatory Details">
            <RenderComponent
              metaData={{
                control: BUTTON,
                variant: 'outlined',
                color: 'success',
                size: 'small',
                tooltipTitle: `Click to import customer data for: ${payload?.customerName}`,
                groupStyle: { marginLeft: '3%' },
                btnTitle: 'Refresh',
                handleClickButton: () => handleRefreshCustomerData(),
                columnWidth: 1
              }}
            />
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            {componentsSet5?.map((comp, ind) => (
              <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
            ))}{' '}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            {componentsSet6?.map((comp, ind) => {
              if (comp.key === 'signatoryNote') {
                comp.color = (payload?.notes && 'primary') || '';
              }
              return (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              );
            })}{' '}
          </Grid>
        </Grid>
      </Grid>

      {/* Container for upload file */}
      <Grid container spacing={3} mt={2} sx={{ marginLeft: '0.1rem' }}>
        <UploadFile
          showPreview
          maxSize={3145728}
          accept="application/pdf"
          files={payload?.attachments || []}
          onDrop={handleDropMultiple}
          onRemove={handleRemove}
          startIcon={<PhotoCamera />}
          buttonLabel="Upload Contract File (PDF Only)"
          uploadBtnStyles={{ display: 'inline-block', marginRight: '1rem' }}
          filesStyles={{ display: 'inline-block', margin: 0 }}
          isRequired
          noFileText="No File Uploaded"
        />
      </Grid>

      {/* Container for cost center */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle2">
            Cost Center
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle2">
            Add Cost Center
          </Typography>
        </Grid>
      </Grid>
      {/* Container for button */}
      <Grid container spacing={3} mt={1} mb={2}>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'warning',
              handleClickButton: () => handleBack(),
              btnTitle: 'Back',
              columnWidth: 0.8
            }}
          />

          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              handleClickButton: () => handleClickSave(),
              btnTitle: 'Save',
              groupStyle: { marginLeft: '1rem' },
              columnWidth: 0.8
            }}
          />
        </Grid>
      </Grid>

      <Divider />
      {/* Grid container for project table and filter */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={6.5}>
          <Typography fontWeight="Bold" variant="subtitle1" align="right" marginRight="3rem">
            Projects
          </Typography>
        </Grid>
        <Grid item xs={5.5} display="flex" justifyContent="flex-end" alignItems="center" marginTop="-0.8rem">
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              handleClickButton: () => navigate(ROUTES.ADD_PROJECT, { state: { contractId } }, { replace: true }),
              btnTitle: 'Add Project',
              columnWidth: 3
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Filters
            components={FILTER_COMPONETS}
            apiUrl="dummyUrl"
            getFilterData={getFilterData}
            getFilterDataPayloadChange={getFilterDataPayloadChange}
            payload={projectFilters}
            setPayload={setProjectFilters}
            emptyFilters={emptyFilters}
          />
        </Grid>

        <Grid item xs={12}>
          <SimpleTable
            rowData={projectData}
            headerData={columnDataforProjectist}
            paginator
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="fit"
            size="small"
            dataKey="projectNumber"
            editMode="row"
            numericFields={numericFields}
            headCellsType={headCellsType}
            clearFilter={clearFunnelFilter}
            filterData={funnelFilters}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EditContract;
