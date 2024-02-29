import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Grid, Typography, Button, Container, Divider, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CommentIcon from '@mui/icons-material/Comment';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, MAX_LENGTH, STATUS, PATTERN, getDialogBoldContent } from '../../utils/constants';
import DialogComponent from '../../components/Dialog';
import CustomerDetails from './CustomerDetails';
import { handleContractNumberMasking, isArray, isValidStr } from '../../utils/utils';
import { ERRORS } from '../../utils/errorConstants';
import { NOTIFICATIONS } from '../../utils/messages';
import { IS_DATA_LOADING } from '../../redux/constants';
import { refreshCustomerData } from '../../services/projectService';
import { getSalesmensDdl } from '../../services/masterDataService';
import { getCoustomerDetails, createContract } from '../../services/contractService';
import { APIS, API_V1 } from '../../utils/apiList';
import useBoolean from '../../hooks/useBoolean';
import { ROUTES } from '../../routes/paths';
import NotesDialog from '../../components/notesDialog';

const ContractsCreation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const { country: countries, regions: allRegions, fundingTypes, legalEntity } = masterData;
  const { CUSTOMER_NAME_REQUIRED, CUSTOMER_NUMBER_REQUIRED } = ERRORS;
  const { TEXT_FIELD, BUTTON, SELECT_BOX, DATEPICKER, TYPOGRAPHY, ICON } = COMPONENTS;
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [regions, setRegions] = useState([]);
  const [errors, setErrors] = useState({});
  const [axFields, setAxFields] = useBoolean(false);
  const [financialDimensions, setFinancialDimensions] = useBoolean(false);
  const [isError, setIsError] = useBoolean(false);
  const [isBackBtn, setIsBackBtn] = useBoolean(false);
  const [confirm, setConfirm] = useBoolean(false);
  const [isSearch, setIsSearch] = useBoolean(false);
  const [openCustomerDetails, setOpenCustomerDetails] = useBoolean(false);
  const [customerGenNumber, setCustomerGenNumber] = useState('');
  const { GET_SALESMAN_DDL, REFRESH_CUST_DATA } = APIS;
  const [designation, setDesignation] = useState([]);
  const [selCountryId, setSelCountryId] = useState(0);
  const [selRegionId, setSelRegionId] = useState(0);
  const [salesmanList, setSalesmanList] = useState([]);
  const [isContract, setIsContract] = useBoolean(false);
  const [contractData, setContractData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [isContractExist, setIsContractExist] = useBoolean(false);
  const [accountNumber, setAccountNumber] = useState(0);
  const [transactionCurrencies, setTransactionCurrencies] = useState([]);
  const [payload, setPayload] = useState({
    countryId: 0,
    region: 0,
    contractName: '',
    accountNumber: '',
    customerName: '',
    commercialRegistrationNumber: '',
    contractSignedOn: moment().toISOString(),
    contractStartDate: moment().toISOString(),
    notes: ''
  });
  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs });

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

  const componentsSet1 = [
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '1.5rem', marginBottom: '0.3rem' },
      key: 'countryId',
      label: 'Country',
      placeholder: 'Country',
      options: countries,
      columnWidth: 6,
      isError: isError && !payload.countryId,
      helperText: isError && !payload.countryId && 'Country Required',
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: countries.length === 1
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '1.5rem', marginBottom: '0.3rem' },
      key: 'region',
      label: 'Region',
      placeholder: 'Region',
      options: regions,
      columnWidth: 6,
      isError: isError && !payload.region,
      helperText: isError && !payload.region && 'Region Required',
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: regions.length === 1
    },
    {
      control: TEXT_FIELD,
      key: 'accountNumber',
      label: 'Customer Number (Type number and hit Enter key to select Customer)',
      columnWidth: 9.2,
      groupStyle: { marginBottom: '0.3rem' },
      isError: errors.accountNumber || (isError && !payload.accountNumber),
      isDisabled: !payload.countryId || !payload.region,
      helperText: errors.accountNumber || (isError && !payload.accountNumber && 'Customer Number Required'),
      handleKeyDown: (e) => enterKeyhandler(e),
      isRequired: true
    },
    {
      control: BUTTON,
      key: 'searchCustomerNo',
      btnTitle: 'Search',
      color: 'success',
      handleClickButton: () => handleSearchCustomer(),
      columnWidth: 2.7,
      tooltipTitle: 'Click to search Customer'
    },
    {
      control: TEXT_FIELD,
      key: 'customerName',
      label: 'Customer Name',
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isRequired: true,
      tooltipTitle: payload?.customerName
    },
    {
      control: TEXT_FIELD,
      key: 'commercialRegistrationNumber',
      label: 'Commercial Registration Number',
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isDisabled: true
    }
  ];

  const componentsSet2 = [
    {
      control: TEXT_FIELD,
      key: 'contractName',
      label: 'Contract Name',
      columnWidth: 12,
      groupStyle: { marginBottom: '0.3rem', marginTop: '1.5rem' },
      isError:
        errors.contractName ||
        (isError && !payload.contractName) ||
        (isError && payload.contractName.length > MAX_LENGTH.CONTRACT_NAME),
      helperText:
        errors.contractName ||
        (isError && !payload.contractName && 'Contract Name Required') ||
        (isError &&
          payload.contractName.length > MAX_LENGTH.CONTRACT_NAME &&
          'Contract name must be less than 60 characters'),
      isRequired: true
    },
    {
      control: DATEPICKER,
      key: 'contractSignedOn',
      label: 'Contract Signed On',
      placeholder: 'Contract Signed On',
      columnWidth: 3.3,
      groupStyle: { marginBottom: '0.3rem' },
      isRequired: true
    },
    {
      control: DATEPICKER,
      key: 'contractStartDate',
      label: 'Contract Start Date',
      placeholder: 'Contract Start Date',
      columnWidth: 3.3,
      groupStyle: { marginBottom: '0.3rem' },
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'generalDiscount',
      label: 'General Discount',
      columnWidth: 3.3,
      groupStyle: { marginBottom: '0.3rem' },
      endAdornmentData: '%'
    },
    {
      control: SELECT_BOX,
      key: 'salesman',
      label: 'Salesman',
      placeholder: 'Salesman',
      options: salesmanList,
      columnWidth: 6,
      isError: isError && !payload.salesman,
      helperText: isError && !payload.salesman && 'Salesman Required',
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isRequired: true
    }
  ];

  const componentsSet3 = [
    {
      control: TEXT_FIELD,
      key: 'customerAddress',
      label: 'Customer Address',
      columnWidth: 8.5,
      groupStyle: { marginBottom: '-1rem', marginLeft: '3rem' },
      isRequired: true
    }
  ];

  const componentsSet5 = [
    {
      control: SELECT_BOX,
      key: 'designation',
      label: 'Designation',
      placeholder: 'Designation',
      options: designation,
      groupStyle: { marginBottom: '0.2rem', marginTop: '1.5rem' },
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
      key: 'signatoryNames',
      label: 'Name',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.2rem', marginTop: '1.5rem' },
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

  const componentsSet10 = [
    {
      control: TEXT_FIELD,
      key: 'signatoryPhone',
      label: 'Phone',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.2rem', marginTop: '1.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryMobile',
      label: 'Mobile',
      columnWidth: 6,
      groupStyle: { marginBottom: '0.2rem', marginTop: '1.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'signatoryEmail',
      label: 'Email',
      placeholder: 'Email',
      columnWidth: 11,
      groupStyle: { marginBottom: '0.3rem' },
      isDisabled: true
    },
    {
      control: ICON,
      key: 'signatoryNote',
      iconName: <CommentIcon />,
      tooltipTitle: payload?.notes ? 'Click to view Notes' : 'Click to add Notes',
      groupStyle: { marginTop: '0.3rem' },
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

  const componentsSet6 = [
    {
      control: TYPOGRAPHY,
      key: 'accountCurrency',
      label: 'Accounting Currency :',
      columnWidth: 3,
      groupStyle: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'centre',
        marginBottom: '2rem'
      }
    },
    {
      control: SELECT_BOX,
      key: 'trasactionCurrency',
      label: 'Transaction Currency',
      placeholder: 'Transaction Currency',
      options: transactionCurrencies,
      groupStyle: { marginBottom: '2rem' },
      columnWidth: 4,
      isError: isError && !payload.trasactionCurrency,
      helperText: isError && !payload.trasactionCurrency && ERRORS.TRANSACTION_CURRENCY_REQUIRED,
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false
    },
    {
      control: SELECT_BOX,
      key: 'fundingType',
      label: 'Funding Type',
      placeholder: 'Funding Type',
      options: fundingTypes,
      groupStyle: { marginBottom: '2rem' },
      columnWidth: 4,
      select: true,
      isError: isError && !payload.fundingType,
      helperText: isError && !payload.fundingType && ERRORS.FUNDING_TYPE_REQUIRED,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isRequired: true,
      isDisabled: fundingTypes.length === 1
    }
  ];

  const componentsSet8 = [
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
      key: 'fdCustomerName',
      label: 'Customer Name',
      columnWidth: 6
    }
  ];

  const componentsSet9 = [
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

  const note = {
    control: TEXT_FIELD,
    key: 'note',
    label: 'Note (Max 500 characters)',
    groupStyle: { marginTop: '1.5rem' },
    columnWidth: 12,
    isMultiline: true,
    textRows: 2,
    maxCharacterLimit: MAX_LENGTH.NOTE_CHARACTER_LIMIT
  };

  const validate = (fieldValues) => {
    const tempErrors = { ...errors };
    const { accountNumber, contractName } = fieldValues;
    if ('accountNumber' in fieldValues) {
      tempErrors.accountNumber =
        ((!accountNumber || accountNumber.split('_').pop() * 1 === 0) && CUSTOMER_NUMBER_REQUIRED) || '';
    }
    if ('contractName' in fieldValues) {
      tempErrors.contractName = (!contractName && CUSTOMER_NAME_REQUIRED) || '';
    }
    setErrors({
      ...tempErrors
    });
  };

  const getErrorMessage = (res, errorMsg = '') => {
    if (res.error) {
      return res.error;
    }

    if (isArray(res.errors)) {
      return res.errors[0] || errorMsg;
    }
    return NOTIFICATIONS.SOMETHING_WENT_WRONG;
  };

  const setCountryAndRegions = (val, region = 0) => {
    setSelCountryId(val || 0);
    if (val) {
      const filteredRegions = allRegions?.filter((rgn) => rgn.countryId === val * 1);
      setRegions(filteredRegions);
      if (filteredRegions.length === 1) {
        region = filteredRegions[0]?.id?.toString();
      }
    } else {
      setRegions([]);
    }
    setSelRegionId(region);
    return region;
  };

  const isValidGeneralDiscount = (val) => PATTERN.GENERAL_DISCOUNT.test(val);

  const getSignatories = (signatory) => ({
    signatoryNames: signatory?.contactName || '',
    signatoryPhone: signatory?.phone || '',
    signatoryMobile: signatory?.mobile || '',
    signatoryAddress: signatory?.customerAddress || '',
    signatoryEmail: signatory?.email || ''
  });

  const clearCustomerDetails = () => ({
    customerName: '',
    commercialRegistrationNumber: ''
  });

  const clearDates = () => ({
    contractSignedOn: moment().toISOString(),
    contractStartDate: moment().toISOString()
  });

  const clearContractDetails = () => ({
    contractName: '',
    generalDiscount: '',
    ...clearDates()
  });

  const clearFinacialDimentions = () => ({
    customerGroup: '',
    accountNumber: '',
    invoiceAccount: '',
    paymentTerm: '',
    crNumber: '',
    mainAccount: '',
    fdCustomerName: '',
    h1LegalEntity: '',
    h2Region: '',
    h3BusinessUnit: '',
    h4BusinessSector: '',
    h5BusinessIndustry: '',
    h6Department: ''
  });

  const clearAXDefault = () => ({
    trasactionCurrency: '',
    accountCurrency: ''
  });

  const clearContracts = () => ({
    ...clearCustomerDetails(),
    ...clearContractDetails(),
    customerAddress: '',
    accountNumber: '',
    designation: [],
    note: '',
    ...getSignatories({}),
    ...clearAXDefault(),
    ...clearFinacialDimentions()
  });

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
    if (key === 'region') {
      isUpdate = false;
      setSelRegionId(val);
      setDesignation([]);
      setPayload({
        ...payload,
        region: val,
        ...clearContracts()
      });
    }

    if (key === 'countryId') {
      const region = setCountryAndRegions(val);
      setDesignation([]);
      isUpdate = false;
      setPayload({
        ...payload,
        countryId: val,
        region,
        ...clearContracts()
      });
    }
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

    if (key === 'customerName' || key === 'customerAddress') isUpdate = false;

    if (key === 'contractName') {
      if (!val) {
        setPayload({
          ...payload,
          contractName: val
        });
      }
    }
    if (key === 'notes') {
      setPayload({
        ...payload,
        notes: val.substr(0, MAX_LENGTH.NOTES)
      });
    }
    if (key === 'accountNumber') {
      const valToUpdate = handleContractNumberMasking(customerGenNumber, val, MAX_LENGTH.CUSTOMER_NUMBER);
      setPayload({
        ...payload,
        ...clearContracts(),
        accountNumber: valToUpdate
      });
    } else if (isUpdate) {
      updatePayload({ [key]: val });
    }

    validate({ [key]: val });
  };

  const handleRefreshCustomerData = async () => {
    if (payload?.customerId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await refreshCustomerData(`${API_V1}/${REFRESH_CUST_DATA}=${payload?.customerId}`);
      if (res.isSuccessful) {
        const { data } = res;
        setShowAlertBox({
          open: true,
          titleType: STATUS.SUCCESS,
          title: 'Refresh customer data',
          content: res.message || getDialogBoldContent(payload?.customerName, '', 'refreshCustomer', data.response)
        });
        fetchCustomerDetails({ accountNumber: payload?.accountNumber }, false, false);
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

  const getSalesmanData = async () => {
    const res = await getSalesmensDdl(`${API_V1}/${GET_SALESMAN_DDL}?regionId=${selRegionId}`);
    if (res?.data && isArray(res?.data)) {
      setSalesmanList(res?.data);
    } else {
      setSalesmanList([]);
    }
  };

  const isValidaccountNumber = (num) => num?.match(/[1-9]/g) || null;

  const handleSearchCustomer = () => {
    if (isValidaccountNumber(payload?.accountNumber) && isDataLoaded) {
      setIsSearch.on();
      setConfirm.on();
    } else {
      setOpenCustomerDetails.on();
    }
  };

  const enterKeyhandler = (e) => {
    // Check string contain at least one number and which is greater than 1.
    if (isValidaccountNumber(e?.target?.value)) {
      if (isDataLoaded) {
        // Check already customer details are loaded or not. Confirm box will be depend on that.
        setTimeout(() => {
          setConfirm.on();
        }, 0);
      } else {
        fetchCustomerDetails({ accountNumber: payload?.accountNumber });
      }
    }
  };

  const navigateToContractEdition = (data) => {
    const paramId = data.id;
    navigate(
      `${ROUTES.CONTRACT_MANAGEMENT_EDIT_CONTRCAT}${data.contractNumber}`,
      { state: paramId },
      { replace: true }
    );
  };

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const confirmationBox = (content = '', titleType = '', title = '', maxWidth = 'md') => {
    setShowAlertBox({
      open: true,
      titleType,
      title,
      maxWidth,
      content
    });
  };
  const createNewContract = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const data = {
      contractNumber: '',
      contractName: payload?.contractName,
      salesManId: payload?.salesman,
      signedOn: payload?.contractSignedOn,
      startDate: payload?.contractStartDate,
      discount: payload?.generalDiscount ? Number(payload.generalDiscount) : 0,
      note: payload?.notes || '',
      currencyId: payload?.trasactionCurrency ? Number(payload?.trasactionCurrency) : 0,
      fundingTypeId: Number(payload?.fundingType),
      customerId: payload?.customerId,
      customerContactId: payload?.designation,
      h1_LegalEntity: payload?.h1LegalEntity,
      h2_Region: payload?.h2Region
    };

    const res = await createContract(`${API_V1}${ROUTES.CONTRACT_MANAGEMENT_CONTRACTS}`, data);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.isSuccessful) {
      setIsContract.on();
      setContractData(res);
      navigateToContractEdition(res.data);
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, t('dialog.error'));
    }
  };

  const handleClickSave = () => {
    const {
      countryId,
      region,
      accountNumber,
      contractName,
      customerName,
      salesman,
      customerAddress,
      designation,
      trasactionCurrency,
      fundingType
    } = payload;
    if (
      !countryId ||
      !region ||
      !accountNumber ||
      !contractName ||
      contractName.length > MAX_LENGTH.CONTRACT_NAME ||
      !customerName ||
      !customerAddress ||
      !salesman ||
      !designation ||
      !trasactionCurrency ||
      !fundingType
    ) {
      setIsError.on();
    } else {
      setIsError.off();
      createNewContract();
    }
  };

  const handleClickAxFields = () => (axFields ? setAxFields.off() : setAxFields.on());

  const handleClickFinancialDimensions = () =>
    financialDimensions ? setFinancialDimensions.off() : setFinancialDimensions.on();

  // Handle alert back button success method
  const handleDialogSubmit = () => {
    handleDialogClose();
    if (isBackBtn) {
      navigate(ROUTES.CONTRACTS);
    } else if (confirm && isSearch) {
      setOpenCustomerDetails.on();
    } else if (isContract) {
      navigateToContractEdition(contractData?.data);
    } else if (isContractExist) {
      fetchCustomerDetails({ accountNumber }, true);
    } else {
      fetchCustomerDetails({ accountNumber: payload?.accountNumber });
    }
  };

  // Handle alert back button close method
  const handleDialogClose = () => {
    if (isContract) {
      navigate(ROUTES.CONTRACTS);
    }
    setIsBackBtn.off();
    setConfirm.off();
    setIsSearch.off();
    setIsContract.off();
    setIsContractExist.off();
  };

  const handleCloseCustomerDetails = () => setOpenCustomerDetails.off();

  const getDimentionValue = (data, key) => data.filter((el) => el.name === key)[0]?.value || '';

  const fetchCustomerDetails = async (data, contractExist = false, openAlert = true) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    if (data?.accountNumber) {
      setAccountNumber(data?.accountNumber);
      const res = await getCoustomerDetails(
        `${API_V1}${ROUTES.CONTRACT_MANAGEMENT_CUSTOMER}${data.accountNumber}/newcontract?isIgnoreCustomerContractCheck=${contractExist}`
      );
      dispatch({ type: IS_DATA_LOADING, data: false });
      const backFillCountryId = data?.countryId?.toString() || selCountryId;
      const backFillRegionId = data?.regionId?.toString() || selRegionId;
      if (res.isSuccessful) {
        if (res.data) {
          const signatories = res?.data?.signatories || [];
          const primaryDesignation = signatories.filter((el) => el.isPrimary);
          const defaultDesignation = primaryDesignation.length ? primaryDesignation[0] : signatories[0];
          setTransactionCurrencies(res?.data?.transactionCurrencies);
          const transactionCurr = [];
          res.data?.transactionCurrencies.forEach((dt) => {
            if (dt.name === res.data?.accountCurrency) {
              transactionCurr.push(dt);
            }
          });
          const payloadData = {
            customerId: res?.data?.id,
            accountNumber: res?.data?.accountNumber || '',
            customerName: res?.data?.customerName || '',
            customerAddress: res?.data?.customerAddress || '',
            contractName: res?.data?.contractName || '',
            commercialRegistrationNumber: res?.data?.crNumber || '',
            generalDiscount: '',
            ...clearDates(),
            salesman: '',
            note: '',
            trasactionCurrency: transactionCurr[0]?.id || '',
            accountCurrency: res?.data?.accountCurrency,
            customerGroup: res?.data?.custGroup || '',
            invoiceAccount: res?.data?.invoiceAccount || '',
            paymentTerm: res?.data?.paymentTerms || '',
            crNumber: res?.data?.crNumber || '',
            mainAccount: res?.data?.mainAccount || '',
            fdCustomerName: res?.data?.customerName || '',
            h1LegalEntity: getDimentionValue(res?.data?.dimensions, 'H1_LegalEntity') || '',
            h2Region: getDimentionValue(res?.data?.dimensions, 'H2_Region') || '',
            h3BusinessUnit: getDimentionValue(res?.data?.dimensions, 'H3_BusinessUnit') || '',
            h4BusinessSector: getDimentionValue(res?.data?.dimensions, 'H4_BusinessSector') || '',
            h5BusinessIndustry: getDimentionValue(res?.data?.dimensions, 'H5_BusinessIndustry') || '',
            h6Department: getDimentionValue(res?.data?.dimensions, 'H6_Department') || '',
            designation: defaultDesignation?.id || '',
            ...getSignatories(defaultDesignation)
          };
          updatePayload({
            ...payloadData,
            countryId: backFillCountryId,
            region: backFillRegionId
          });
          setDesignation(signatories);
          validate({ accountNumber: res?.data?.accountNumber, contractName: res?.data?.contractName });
          setIsDataLoaded(true);
        } else {
          updatePayload({ ...clearContracts(), countryId: backFillCountryId, region: backFillRegionId });
        }
      } else if (res?.data && res?.data?.isContractActive) {
        updatePayload({ countryId: backFillCountryId, region: backFillRegionId });
        if (openAlert) {
          setIsContractExist.on();
        }
        setContractData(res);
      } else {
        confirmationBox(getErrorMessage(res), STATUS.ERROR, t('dialog.error'));
      }
    }
  };

  useEffect(() => {
    if (selCountryId) {
      let cusGeneratedNumber = '';
      let regionCode = '';
      const legalEntityId = countries.find((el) => el.id === selCountryId * 1)?.legalEntities[0];
      const legalEntityCode = legalEntity.find((ent) => ent.id === legalEntityId)?.name;
      if (selRegionId) {
        regionCode = regions.find((rgn) => rgn.id === selRegionId * 1)?.axCode;
      }
      cusGeneratedNumber = regionCode ? `${legalEntityCode}_${regionCode}_` : `${legalEntityCode}_`;
      setCustomerGenNumber(cusGeneratedNumber);
      updatePayload({ accountNumber: cusGeneratedNumber });
    }
  }, [selCountryId, selRegionId]);

  useEffect(() => {
    if (selRegionId) {
      getSalesmanData();
    }
  }, [selRegionId]);

  // Select Country and region by default onmount of component if only one option is available.
  useEffect(() => {
    let region = 0;
    let countryId = 0;
    let fundingType = 0;
    if (countries.length === 1) {
      region = setCountryAndRegions(countries[0].id.toString());
      countryId = countries[0]?.id?.toString();
    }
    const defaultFundingType = fundingTypes.filter((el) => el.isDefault);
    if (defaultFundingType.length) {
      fundingType = defaultFundingType[0]?.id || 0;
    }

    setPayload({
      ...payload,
      countryId,
      region,
      fundingType
    });
  }, []);

  const onaccountNumberSelection = (data) => {
    const { countryId, regionId } = data;
    setCountryAndRegions(countryId.toString(), regionId.toString());
    fetchCustomerDetails(data);
  };

  const getTitleType = () => (isBackBtn || confirm || isContractExist ? 'Warning' : 'Success');

  const getDialogContent = () => {
    let message = '';
    if (isBackBtn) {
      message = 'Contract is not saved. Do you still want to continue?';
    }
    if (confirm) {
      message = 'Do you want to change customer number?';
    }
    if (isContract) {
      message = getDialogBoldContent(
        payload?.customerName,
        contractData?.data?.contractNumber,
        'contractCreatedSuccessfully',
        ''
      );
    }
    if (isContractExist) {
      message = getErrorMessage(contractData);
    }
    return message;
  };

  const handleBack = () => {
    if (isFormModified) {
      setIsBackBtn.on();
    } else {
      navigate(ROUTES.CONTRACTS);
    }
  };

  return (
    <Grid sx={{ padding: '30px 20px', width: '100%', margin: '-35px auto' }}>
      {!openCustomerDetails ? (
        <>
          <DialogComponent
            open={isBackBtn || confirm || isContract || isContractExist}
            handleClose={handleDialogClose}
            handleProceed={handleDialogSubmit}
            titleType={getTitleType()}
            title={isBackBtn ? 'Redirecting to Contract List' : 'Add Contract'}
            content={getDialogContent()}
            maxWidth={isBackBtn || confirm ? 'sm' : 'md'}
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
          />
          <NotesDialog
            noteProps={{ ...notesBox }}
            handleClose={handleCloseNotesAlertBox}
            handleProceed={handleProceedNotesAlertBox}
          />
          {/* Grid container for heading */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight="bold" variant="subtitle1" align="center">
                Add New Contract
              </Typography>
            </Grid>
          </Grid>
          <Divider style={{ marginBottom: '2rem' }} />

          {/* Grid Container for form layout */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold" variant="subtitle2">
                Customer Details
              </Typography>
              <Grid container spacing={3}>
                {componentsSet1?.map((comp, ind) => (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                  />
                ))}{' '}
              </Grid>
              {/* <Grid container spacing={3}> */}
            </Grid>

            <Grid item xs={6}>
              <Typography fontWeight="bold" variant="subtitle2">
                Contract Details
              </Typography>
              <Grid container spacing={3}>
                {componentsSet2?.map((comp, ind) => (
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
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" marginTop="-1rem" marginBottom="-0.5rem">
            <Grid item xs={6} marginBottom="0.5rem">
              <Typography fontWeight="bold" variant="subtitle2">
                Customer Demographics
              </Typography>
            </Grid>
            <Grid container spacing={3} xs={6}>
              {componentsSet3?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              ))}{' '}
            </Grid>
          </Grid>
          {/* Grid contaier for signatory information */}
          <Grid container spacing={3} style={{ marginTop: 0 }}>
            <Grid item xs={12} display="flex" alignItems="center" marginBottom="-0.3rem">
              <Typography fontWeight="bold" variant="subtitle2">
                Signatory Information
              </Typography>
              <Tooltip title="Click to fetch new Signatory Details">
                <RenderComponent
                  metaData={{
                    control: BUTTON,
                    color: 'success',
                    variant: 'contained',
                    size: 'small',
                    groupStyle: { marginLeft: '4%' },
                    btnTitle: 'Refresh',
                    tooltipTitle: `Click to import customer data for: ${payload?.customerName}`,
                    handleClickButton: () => handleRefreshCustomerData(),
                    columnWidth: 1.1
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                {componentsSet5?.map((comp, ind) => (
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
                {componentsSet10?.map((comp, ind) => {
                  if (comp.key === 'signatoryNote') {
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
            </Grid>
          </Grid>

          {/* Grid Container for AX default fields */}
          <Grid container spacing={3} style={{ marginTop: 0 }}>
            <Grid item xs={12} display="flex" alignItems="center" mb={3}>
              {axFields ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickAxFields} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickAxFields} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                AX Default Fields
              </Typography>
            </Grid>
            {axFields && (
              <>
                <Grid item xs={12} sm={8} sx={{ marginLeft: '2rem' }}>
                  <Grid container spacing={3}>
                    {componentsSet6?.map((comp, ind) => (
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

          {/* Grid Container for financial dimensions fields */}
          <Grid container spacing={3} style={{ marginBottom: '1.5rem' }}>
            <Grid item xs={12} display="flex" alignItems="center" mb={1}>
              {financialDimensions ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickFinancialDimensions} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickFinancialDimensions} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                Financial Dimensions
              </Typography>
            </Grid>
            {financialDimensions && (
              <>
                <Grid
                  item
                  sx={{ marginLeft: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}
                >
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={3}>
                      {componentsSet8?.map((comp, ind) => (
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
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={3}>
                      {componentsSet9?.map((comp, ind) => (
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
          {/* Container for button */}
          <Grid container spacing={3} style={{ marginTop: '-1rem' }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  variant: 'contained',
                  size: 'medium',
                  color: 'warning',
                  handleClickButton: () => handleBack(),
                  btnTitle: 'Back',
                  columnWidth: 0.8
                }}
              />

              <RenderComponent
                metaData={{
                  control: BUTTON,
                  variant: 'contained',
                  size: 'medium',
                  color: 'success',
                  groupStyle: { marginLeft: '1.5rem' },
                  handleClickButton: () => handleClickSave(),
                  btnTitle: 'Save',
                  columnWidth: 0.8
                }}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <CustomerDetails
          open={openCustomerDetails}
          handleClose={handleCloseCustomerDetails}
          selectedCustomer={onaccountNumberSelection}
          selCountryId={selCountryId}
          selRegionId={selRegionId}
        />
      )}
    </Grid>
  );
};

export default ContractsCreation;
