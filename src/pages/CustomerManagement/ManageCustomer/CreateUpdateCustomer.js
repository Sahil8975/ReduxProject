import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import commaNumber from 'comma-number';
import { Divider, Grid, Typography, styled } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { COMPONENTS, STATUS, REGX_TYPE, MAX_LENGTH, NOTE_TYPE, FontFamily } from '../../../utils/constants';
import NotesDialog from '../../../components/notesDialog';
import { NOTIFICATIONS } from '../../../utils/messages';
import { isArray, isObject, isValidStr } from '../../../utils/utils';
import { getSalesmen } from '../CustomerServices/CustomerViewServices';
import {
  getDeliveryModes,
  getBusinessIndustries,
  getBusinessSectors,
  getCustomerGroups,
  getCurrencies,
  getCustomersDDL,
  getIncoterms,
  getPaymentTerms,
  getCollectors,
  getOrganizationIdentificationTypes,
  getRegions,
  addCustomer,
  getSalesTaxGroups,
  uploadAttachment,
  getCustomerDetails,
  downloadAttachment,
  deleteAttachment,
  submitForApproval,
  resubmitForApproval,
  rejectCustomer,
  approveCustomer
} from '../CustomerServices/CreateUpdateCustomerServices';
import { getSaudiPostApi } from '../CustomerServices/AddLocationApis';
import RenderComponent from '../../../components/RenderComponent';
import UploadFile from '../../../components/UploadFile';
import useBoolean from '../../../hooks/useBoolean';
import { IS_DATA_LOADING } from '../../../redux/constants';
import DialogComponent from '../../../components/Dialog';
import { ROUTES } from '../../../routes/paths';
import AddLocation from './AddLocation';
import AddContacts from './AddContacts';
import CustomerIdDialog from './CustomerIdDialog';
import VatNumberDialog from './VatNumberDialog';
import CustomerNameDialog from './CustomerNameDialog';
import CustomerArabicNameDialog from './CustomerArabicNameDialog';
import SalesmanIdDialog from './SalesmanIdDialog';
import CollectorDialog from './CollectorDialog';

function CreateUpdateCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    expandAccordion,
    CRNumber: CRNum,
    customerId: custId,
    hasLocation,
    hasPrimaryLocation,
    isPrimaryLocation,
    locationId,
    legalEntityHSD,
    organizationId,
    isEdit = false,
    contactId,
    organizationIdentificationTypeValue,
    organizationIdentificationType,
    isNewLocation = false
  } = location.state;

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.LoginUserDetailsReducer?.userInfo);
  const customerData = useSelector((state) => state.CustomerDataReducer);
  const { legalEntities } = customerData;
  const { role } = userDetails;
  console.log('Roles', role);
  console.log(userDetails);
  const today = moment(new Date());
  const futureDate = today.add(50, 'years');
  const [error, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [salesmen, setSalesmen] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [businessSector, setBusinessSector] = useState([]);
  const [businessIndustries, setBusinessIndustries] = useState([]);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [incotermsList, setIncotermsList] = useState([]);
  const [collectorsList, setCollectorsList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [customerIdTypes, setCustomerIdTypes] = useState([]);
  const [salesTaxGroupsList, setSalesTaxGroupsList] = useState([]);
  const [showTaxDetails, setShowTaxDetails] = useBoolean(false);
  const [showPaymentDetails, setShowPaymentDetails] = useBoolean(false);
  const [showDocuments, setShowDocuments] = useBoolean(false);
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [showLocation, setShowLocation] = useBoolean(false);
  const [showContacts, setShowContacts] = useBoolean(false);
  const [showCustomerDetails, setShowCustomerDetails] = useBoolean(false);
  const [openCustomerIdDialog, setOpenCustomerIdDialog] = useState(false);
  const [openVatNumberDialog, setOpenVatNumberDialog] = useState(false);
  const [openCustomerNameDialog, setOpenCustomerNameDialog] = useState(false);
  const [openCustomerNameArabicDialog, setOpenCustomerNameArabicDialog] = useState(false);
  const [openSalesmanIdDialog, setOpenSalesmanIdDialog] = useState(false);
  const [openCollectorIdDialog, setOpenCollectorIdDialog] = useState(false);
  const [enableAddCustomer, setEnableAddCustomer] = useState(false);
  const [enableAddLocation, setEnableAddLocation] = useState(false);
  const [enableAddContacts, setEnableAddContacts] = useState(false);
  const [addLocationData, setAddLocationData] = useState({});
  const [locationInfo, setLocationInfo] = useState({});
  const [contactData, setContactData] = useState({});
  const [disableCustomer, setDisableCustomer] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableResubmit, setDisableResubmit] = useState(false);
  const [disableReject, setDisableReject] = useState(false);
  const [nonEdit, setNonEdit] = useState(false);
  const [defaultMapLocation, setDefaultMapLocation] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [disableLocation, setDisableLocation] = useState(false);
  const [oldCRNumber, setOldCRNumber] = useState('');
  const [redrafted, setRedrafted] = useState(false);
  const [isApprovedFlag, setIsApprovedFlag] = useState(false);
  const [statusCode, setStatusCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [approveBtnEnable, setApproveBtnEnable] = useState(false);
  const [resubmitted, setResubmitted] = useState(false);
  const [entityIdHSD, setEntityIdHSD] = useState({});
  const [locationNameHeader, setLocationNameHeader] = useState('');
  const [fetchCurrencyId, setFetchCurrencyId] = useState(false);
  const [newLocation, setNewLocation] = useState(false);

  const [organisationTimeBasedIdentificationType, setOrganisationTimeBasedIdentificationType] = useState([
    {
      id: 0,
      fieldType: 'OrganisationIdentificationType',
      fieldValue: '',
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);
  const [customerTimeBasedVAT, setCustomerTimeBasedVAT] = useState([
    {
      id: 0,
      fieldType: 'CustomerVAT',
      fieldValue: '',
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);
  const [customerTimeBasedName, setCustomerTimeBasedName] = useState([
    {
      id: 0,
      fieldType: 'CustomerName',
      fieldValue: 0,
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);
  const [customerTimeBasedArabicName, setCustomerTimeBasedArabicName] = useState([
    {
      id: 0,
      fieldType: 'CustomerArabicName',
      fieldValue: '',
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);
  const [customerTimeBasedSalesman, setCustomerTimeBasedSalesman] = useState([
    {
      id: 0,
      fieldType: 'Salesman',
      fieldValue: '',
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);
  const [customerTimeBasedOriginalCollector, setCustomerTimeBasedOriginalCollector] = useState([
    {
      id: 0,
      fieldType: 'OriginalCollector',
      fieldValue: '',
      associatedFieldType: '',
      associatedFieldValue: '',
      validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
      isEditable: true,
      isSelected: true
    }
  ]);

  const [payload, setPayload] = useState({
    id: 0,
    legalEntityId: 0,
    salesmanId: 0,
    customerClassificationId: 0,
    organizationId: 0,
    organizationIdValue: '',
    customerVAT: '',
    customerName: '',
    customerArabicName: '',
    customerShortName: '',
    invoicingMode: '',
    invoicingModeValue: '',
    legalEntityRegionId: 0,
    legalEntityBusinessSectorId: 0,
    legalEntityBusinessIndustryId: 0,
    customerGroupId: 0,
    deliveryModeId: 0,
    paymentTermId: null,
    gracePeriod: 0,
    incoTermId: null,
    collectorId: null,
    currencyId: null,
    creditLimit: 0,
    salesTaxGroupCode: null,
    isApplyCreditLimit: false,
    isApplyCreditPeriod: false,
    isApplyGracePeriod: false,
    crCopy: [],
    vatCopy: [],
    creditApplicationForm: [],
    isApproved: false,
    areApprovalButtonsEnabled: false,
    hasLocation: false,
    hasPrimaryLocation: false,
    isShowSubmit: false,
    isShowReSubmit: false,
    accountNumber: '',
    isHSDLegalEntity: false,
    isEditable: true,
    reason: ''
  });

  const { legalEntityId, customerClassificationId } = payload;

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const [genericAlertBox, setShowGenericAlertBox] = useState({
    open: false,
    title: 'Reason',
    titleType: '',
    content: '',
    proceedAction: '',
    showProceedBtn: false,
    cancelButtonText: '',
    proceedButtonText: 'Ok',
    additionalInfoForProceed: null
  });

  const emptyReasonBox = {
    maxWidth: 'sm',
    title: '',
    open: false,
    content: '',
    key: '',
    label: '',
    noteVal: '',
    maxChars: 0,
    noteType: 'Reason'
  };

  const [reasonBox, setReasonBox] = useState({ ...emptyReasonBox });

  const handleCloseNotesAlertBox = () => setReasonBox({ ...emptyReasonBox });

  const handleProceedNotesAlertBox = (updatedNote, rejectType) => {
    updatePayload({ reason: updatedNote });
    if (rejectType === 'reject') {
      checkMandatoryFields('reject', updatedNote, false);
    } else {
      checkMandatoryFields('rejectAndEscalate', updatedNote, true);
    }
    handleCloseNotesAlertBox();
  };

  const {
    TEXT_FIELD,
    AUTOCOMPLETE,
    BUTTON,
    SELECT_BOX,
    RADIO,
    CHECKBOX,
    ICON,
    TYPOGRAPHY,
    DATEPICKER,
    MULTI_SELECT_BOX,
    NONE
  } = COMPONENTS;

  const StyledGrid = styled(Grid)`
    border: 1px solid rgb(227, 232, 234);
    transition: border-color 0.3s ease;
    &:hover {
      border-color: #00ab55;
    }
  `;

  const eInvoiceList = [
    { id: 'EInvoicingEmail', name: 'E Invoicing Email' },
    { id: 'EInvoicingPortal', name: 'E Invoicing Portal' },
    { id: 'CustomerContact', name: 'Customer Contact' }
  ];

  const classification = [
    { name: 'Prospect Customer', value: 3 },
    { name: 'Cash Customer', value: 2 },
    { name: 'Credit Customer', value: 1 }
  ];

  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const isValidURL = (string) => {
    const res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)/g
    );
    return res !== null;
  };

  const getSalesmanMargin = () => {
    let margin;
    if (role === 'Salesman') {
      margin = '0rem';
    } else if (role !== 'Salesman' && isEdit) {
      margin = '-1rem';
    } else {
      margin = '0rem';
    }
    return margin;
  };

  const topComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: '2rem' },
      key: 'legalEntityId',
      label: 'Legal Entity',
      options: legalEntities,
      select: true,
      isRequired: true,
      isError: error && !payload?.legalEntityId,
      helperText: 'Please Select Legal Entity',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !isArray(legalEntities) || disableCustomer || nonEdit,
      columnWidth: 5.5
    },
    {
      control: ICON,
      groupStyle: { marginBottom: error ? '1.7rem' : '', marginLeft: '1rem' },
      key: 'editSalesmanId',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      handleClickIcon: () => setOpenSalesmanIdDialog(true),
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 1
    },
    {
      control: SELECT_BOX,
      key: 'salesmanId',
      label: 'Salesmen',
      options: salesmen,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      groupStyle: { marginBottom: '-0.5rem', marginLeft: getSalesmanMargin() },
      isRequired: true,
      isError: error && !payload?.salesmanId,
      helperText: 'Please Select Salesman',
      isDisabled: !legalEntityId || disableCustomer || isEdit,
      columnWidth: role === 'Salesman' ? 5.5 : 4.9
    },
    {
      control: RADIO,
      groupStyle: { marginTop: '-0.3rem', marginLeft: '2rem' },
      key: 'customerClassificationId',
      label: 'Classification',
      showLabel: true,
      options: classification,
      isRequired: true,
      isError: error && !customerClassificationId,
      helperText: 'Please Select Classification',
      isDisabled: disableCustomer,
      columnWidth: 12
    }
  ];
  const taxComps = [
    {
      control: ICON,
      groupStyle: { marginBottom: error ? '1.7rem' : '' },
      key: 'editCustomerId',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      columnWidth: 1,
      handleClickIcon: () => setOpenCustomerIdDialog(true),
      isDisabled: disableCustomer
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '-1rem' : '0rem' },
      key: 'organizationId',
      label: 'Organisation Id',
      options: customerIdTypes,
      select: true,
      isRequired: customerClassificationId !== 3,
      isError: error && customerClassificationId !== 3 && !payload?.organizationId,
      helperText: error && customerClassificationId !== 3 && 'Please Select Organisation Id',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || isEdit || disableCustomer,
      columnWidth: 5.5
    },
    {
      control: TEXT_FIELD,
      key: 'organizationIdValue',
      label: 'Value',
      columnWidth: 6,
      isRequired: customerClassificationId !== 3,
      groupStyle: { marginBottom: '0.5rem' },
      isError: error && customerClassificationId !== 3 && !payload?.organizationIdValue,
      helperText: error && customerClassificationId !== 3 && 'Please Enter Organisation Id Value',
      isDisabled: isEdit || disableCustomer
    },
    {
      control: NONE,
      columnWidth: 0
    },
    {
      control: ICON,
      groupStyle: { marginBottom: error ? '1.7rem' : '' },
      key: 'editVATNUmber',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      columnWidth: 1,
      handleClickIcon: () => setOpenVatNumberDialog(true),
      isDisabled: disableCustomer
    },
    {
      control: TEXT_FIELD,
      key: 'customerVAT',
      label: 'Customer VAT Number',
      columnWidth: 5.5,
      isRequired: customerClassificationId !== 3,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '-1rem' : '0rem' },
      isError: error && customerClassificationId !== 3 && !payload?.customerVAT,
      helperText: error && customerClassificationId !== 3 && 'Please Enter VAT Number',
      isDisabled: isEdit || disableCustomer
    }
  ];

  const customerComps = [
    {
      control: ICON,
      groupStyle: { marginLeft: '1rem', marginBottom: error || lengthError ? '1.7rem' : '' },
      key: 'editCustomerName',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      columnWidth: 1,
      handleClickIcon: () => setOpenCustomerNameDialog(true),
      isDisabled: disableCustomer
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '-1rem' : '1rem' },
      key: 'customerName',
      label: 'Customer Name',
      options: customers,
      columnWidth: 11,
      // handleKeyDown: (e) => enterKeyhandler(e),
      isRequired: true,
      isError: (error && !payload?.customerName) || (error && payload.customerName.length > 100),
      helperText:
        (error && !payload?.customerName && 'Please Enter Customer Name') ||
        (error && 'Customer name must be 100 characters long.'),
      isDisabled: isEdit || disableCustomer
    },
    {
      control: NONE,
      columnWidth: 0.3
    },
    {
      control: ICON,
      groupStyle: { marginLeft: '1rem', marginBottom: error || lengthError ? '1.7rem' : '' },
      key: 'editCustomerArabicName',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      columnWidth: 1,
      handleClickIcon: () => setOpenCustomerNameArabicDialog(true),
      isDisabled: disableCustomer
    },
    {
      control: TEXT_FIELD,
      key: 'customerArabicName',
      label: 'Customer Name (Arabic)',
      columnWidth: 11,
      controlStyle: { fontSize: '1.2rem' },
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '-1rem' : '1rem', fontSize: '2rem' },
      isError: lengthError && payload.customerArabicName.length > 130,
      helperText: lengthError && 'Customer arabic name must be 130 characters long.',
      isDisabled: isEdit || disableCustomer
      // isRequired: true,
    },

    {
      control: TEXT_FIELD,
      key: 'customerShortName',
      label: 'Customer short name',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '2.2rem' : '1rem' },
      isError: lengthError && payload.customerShortName.length > 50,
      helperText: lengthError && 'Customer short name must be 50 characters long.',
      isDisabled: disableCustomer
      // isRequired: true,
    },
    {
      control: NONE,
      columnWidth: 3
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '2.2rem' : '1rem' },
      key: 'legalEntityRegionId',
      label: 'Region',
      options: regions,
      select: true,
      isRequired: true,
      isError: error && !payload?.legalEntityRegionId,
      helperText: 'Please Select Region',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer || nonEdit,
      columnWidth: 5.5
    },
    {
      control: NONE,
      columnWidth: 3
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '2.2rem' : '1rem' },
      key: 'legalEntityBusinessSectorId',
      label: 'Business Sector',
      options: businessSector,
      select: true,
      isRequired: true,
      isError: error && !payload?.legalEntityBusinessSectorId,
      helperText: 'Please Select Business Sector',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer || nonEdit,
      columnWidth: 5.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'legalEntityBusinessIndustryId',
      label: 'Business Industry',
      options: businessIndustries,
      select: true,
      isRequired: true,
      isError: error && !payload?.legalEntityBusinessIndustryId,
      helperText: 'Please Select Business Industry',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer || nonEdit,
      columnWidth: 5.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '2.2rem' : '1rem' },
      key: 'customerGroupId',
      label: 'Customer Group',
      options: customerGroups,
      select: true,
      isRequired: true,
      isError: error && !payload?.customerGroupId,
      helperText: 'Please Select Customer Group',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 5.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'deliveryModeId',
      label: 'Mode of Delivery',
      options: deliveryModes,
      select: true,
      isRequired: true,
      isError: error && !payload?.deliveryModeId,
      helperText: 'Please Select Delivery Mode',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 5.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '2.2rem' : '1rem' },
      key: 'invoicingMode',
      label: 'E-Invoice Email/E-Invoice',
      options: eInvoiceList,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: disableCustomer,
      columnWidth: 5.5
      // isRequired: true,
      // isError: error && !payload?.projectStatusId,
      // helperText: 'Please select project status'
    },
    {
      control: TEXT_FIELD,
      key: 'invoicingModeValue',
      label: 'E-Invoicing Communication',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: payload.invoicingMode === 'CustomerContact' || disableCustomer,
      isError:
        (error &&
          payload.invoicingMode === 'EInvoicingEmail' &&
          !isValidEmail(payload.invoicingModeValue) &&
          payload.invoicingModeValue !== '') ||
        (error &&
          payload.invoicingMode === 'EInvoicingPortal' &&
          !isValidURL(payload.invoicingModeValue) &&
          payload.invoicingModeValue !== ''),
      helperText:
        (error &&
          payload.invoicingMode === 'EInvoicingEmail' &&
          !isValidEmail(payload.invoicingModeValue) &&
          'Please enter a valid email') ||
        (error &&
          payload.invoicingMode === 'EInvoicingPortal' &&
          !isValidURL(payload.invoicingModeValue) &&
          'Please enter a valid URL')
    }
  ];

  const paymentComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'paymentTermId',
      label: 'Terms of payment',
      options: paymentTerms,
      select: true,
      isRequired: customerClassificationId === 1,
      isError: error && customerClassificationId === 1 && !payload?.paymentTermId,
      helperText: error && customerClassificationId === 1 && 'Please Select Payment Term',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 4
    },
    {
      control: NONE,
      columnWidth: 6
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'currencyId',
      label: 'CUR',
      options: currencyList,
      select: true,
      isRequired: customerClassificationId === 1,
      isError: error && customerClassificationId === 1 && !payload?.currencyId,
      helperText: error && customerClassificationId === 1 && 'Please Select Currency',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 4
    },
    {
      control: TEXT_FIELD,
      key: 'creditLimit',
      label: 'Credit Limit',
      columnWidth: 3.4,
      isRequired: false,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.creditLimit.length > 12,
      helperText: lengthError && 'Max 12 digits before the decimal point.',
      isDisabled: disableCustomer
    },
    {
      control: CHECKBOX,
      key: 'isApplyCreditLimit',
      label: 'Apply Credit Limit Control',
      groupStyle: { marginTop: '-0.3rem' },
      columnWidth: 4,
      isDisabled: disableCustomer
    },
    {
      control: TEXT_FIELD,
      key: 'gracePeriod',
      label: 'Grace period',
      endAdornmentData: 'Days',
      groupStyle: { marginBottom: '0.5rem' },
      isRequired: customerClassificationId === 1,
      isError: error && customerClassificationId === 1 && !payload?.gracePeriod,
      helperText: error && customerClassificationId === 1 && 'Please Enter Grace Period',
      columnWidth: 4,
      isDisabled: disableCustomer
    },
    {
      control: CHECKBOX,
      key: 'isApplyGracePeriod',
      label: 'Apply Grace Period',
      groupStyle: { marginTop: '-0.3rem' },
      columnWidth: 4.5,
      isDisabled: disableCustomer
    },
    {
      control: CHECKBOX,
      key: 'isApplyCreditPeriod',
      label: 'Apply Credit Period',
      groupStyle: { marginTop: '-0.3rem', marginLeft: '-3.5rem' },
      columnWidth: 4,
      isDisabled: disableCustomer
    },

    {
      control: SELECT_BOX,
      key: 'salesTaxGroupCode',
      label: 'Sales Tax Group',
      options: salesTaxGroupsList,
      select: true,
      isRequired: customerClassificationId === 1,
      isError: error && customerClassificationId === 1 && !payload?.salesTaxGroupCode,
      helperText: error && customerClassificationId === 1 && 'Please Select Sales Tax Group',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 4
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'incoTermId',
      label: 'Incoterms',
      options: incotermsList,
      select: true,
      isRequired: customerClassificationId === 1,
      isError: error && customerClassificationId === 1 && !payload?.incoTermId,
      helperText: error && customerClassificationId === 1 && 'Please Select Incoterms',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 3.5
    },
    {
      control: NONE,
      columnWidth: 4.5
    },
    {
      control: ICON,
      groupStyle: { marginBottom: error ? '1.7rem' : '', marginLeft: '1rem' },
      key: 'editCollectorId',
      iconName: <EditIcon fontSize="small" />,
      tooltipTitle: '',
      handleClickIcon: () => setOpenCollectorIdDialog(true),
      isDisabled: !legalEntityId || disableCustomer,
      columnWidth: 1
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: isEdit ? '-1rem' : '0rem' },
      key: 'collectorId',
      label: 'Original collector',
      options: collectorsList,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      columnWidth: 4,
      isDisabled: isEdit || disableCustomer
      // isRequired: true,
      // isError: error && !payload?.projectStatusId,
      // helperText: 'Please select project status'
    }
  ];

  const buttonComps = [
    {
      control: BUTTON,
      key: 'save',
      btnTitle: 'Save',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => saveCustomer(),
      isDisabled: disableCustomer,
      columnWidth: 0.9
    }
    // {
    //   control: BUTTON,
    //   key: 'back',
    //   btnTitle: 'Back',
    //   color: 'warning',
    //   groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
    //   handleClickButton: () => navigate(ROUTES.CUSTOMERVIEW),
    //   // isDisabled: ,
    //   columnWidth: 0.9
    // }
  ];

  const submitButtons = [
    {
      control: BUTTON,
      key: 'submit',
      btnTitle: 'Submit',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '1rem' },
      handleClickButton: () => checkMandatoryFields('submit'),
      isDisabled: !payload.isShowSubmit,
      columnWidth: 1.2
    },
    {
      control: BUTTON,
      key: 'back',
      btnTitle: 'Back',
      color: 'warning',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => navigate(ROUTES.CUSTOMERVIEW),
      // isDisabled: ,
      columnWidth: 0.9
    }
  ];

  const resubmitButtons = [
    {
      control: BUTTON,
      key: 'resubmit',
      btnTitle: 'Resubmit',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => checkMandatoryFields('resubmit'),
      isDisabled: true,
      columnWidth: 1.2
    },
    {
      control: BUTTON,
      key: 'resubmitEscalate',
      btnTitle: 'Resubmit & Escalate',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => checkMandatoryFields('resubmitAndEscalate'),
      // isDisabled: true,
      columnWidth: 1.7
    },
    {
      control: BUTTON,
      key: 'back',
      btnTitle: 'Back',
      color: 'warning',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => navigate(ROUTES.CUSTOMERVIEW),
      // isDisabled: ,
      columnWidth: 0.9
    }
  ];

  const adminButtons = [
    // {
    //   control: BUTTON,
    //   key: 'submit',
    //   btnTitle: 'Submit',
    //   color: 'success',
    //   groupStyle: { marginRight: '1rem', marginBottom: '1rem' },
    //   handleClickButton: () =>checkMandatoryFields('submit'),
    //   isDisabled: !payload.isShowSubmit,
    //   columnWidth: 1.2
    // },
    {
      control: BUTTON,
      key: 'approve',
      btnTitle: 'Approve',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => checkMandatoryFields('approve'),
      isDisabled: true,
      columnWidth: 0.9
    },
    {
      control: BUTTON,
      key: 'reject',
      btnTitle: 'Reject',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: (key, ind) =>
        setReasonBox({
          ...reasonBox,
          key: 'reason',
          title: '* Reason',
          noteType: 'Reason',
          proceedButtonText: 'Ok',
          label: `Reason for rejection ( Max ${MAX_LENGTH.NOTES} chars )`,
          noteVal: payload?.reason || '',
          open: true
        }),
      isDisabled: true,
      columnWidth: 0.9
    },
    {
      control: BUTTON,
      key: 'escalate',
      btnTitle: 'Reject & Escalate',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: (key, ind) =>
        setReasonBox({
          ...reasonBox,
          key: 'reason',
          title: '* Reason',
          noteType: 'Reason',
          label: `Reason for rejection ( Max ${MAX_LENGTH.NOTES} chars )`,
          proceedButtonText: 'Ok',
          noteVal: payload?.reason || '',
          open: true
        }),
      isDisabled: true,
      columnWidth: 1.7
    },
    {
      control: BUTTON,
      key: 'back',
      btnTitle: 'Back',
      color: 'warning',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => navigate(ROUTES.CUSTOMERVIEW),
      // isDisabled: ,
      columnWidth: 0.9
    }
  ];

  const uploadBase64FileCRCopy = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader?.result?.replace('data:application/pdf;base64,', ''); // Removed this string from base64 as it is not needed
      const { name, type: fileType } = file;
      const attachments = [
        {
          id: 0,
          fileName: name,
          originalFileName: name,
          fileType,
          isDeleted: false,
          base64,
          extension: '.pdf', // uploading only pdf file here.
          filePath: '', // for preview,
          guid: null,
          documentCategory: 'CRCopy'
        }
      ];
      updatePayload({ crCopy: attachments });
      setIsFormModified.on();
    };
  };

  const uploadBase64FileVATCopy = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader?.result?.replace('data:application/pdf;base64,', ''); // Removed this string from base64 as it is not needed
      const { name, type: fileType } = file;
      const attachments = [
        {
          id: 0,
          fileName: name,
          originalFileName: name,
          fileType,
          isDeleted: false,
          base64,
          extension: '.pdf', // uploading only pdf file here.
          filePath: '', // for preview,
          guid: null,
          documentCategory: 'VATCopy'
        }
      ];
      updatePayload({ vatCopy: attachments });
      setIsFormModified.on();
    };
  };

  const uploadBase64FileCreditApplicationForm = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader?.result?.replace('data:application/pdf;base64,', ''); // Removed this string from base64 as it is not needed
      const { name, type: fileType } = file;
      const attachments = [
        {
          id: 0,
          fileName: name,
          originalFileName: name,
          fileType,
          isDeleted: false,
          base64,
          extension: '.pdf', // uploading only pdf file here.
          filePath: '', // for preview,
          guid: null,
          documentCategory: 'CreditApplicationForm'
        }
      ];
      updatePayload({ creditApplicationForm: attachments });
      setIsFormModified.on();
    };
  };

  // handle change selected file
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
  const handleDropMultipleCRCopy = useCallback((acceptedFiles) => {
    // Here we are only taking first selected file
    const file = acceptedFiles[0];
    if (file) {
      if (file && file.type === 'application/pdf') {
        uploadBase64FileCRCopy(file);
      }
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
  const handleDropMultipleVATCopy = useCallback((acceptedFiles) => {
    // Here we are only taking first selected file
    const file = acceptedFiles[0];
    if (file) {
      if (file && file.type === 'application/pdf') {
        uploadBase64FileVATCopy(file);
      }
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
  const handleDropMultipleCreditApplicationForm = useCallback((acceptedFiles) => {
    // Here we are only taking first selected file
    const file = acceptedFiles[0];
    if (file) {
      if (file && file.type === 'application/pdf') {
        uploadBase64FileCreditApplicationForm(file);
      }
    }
  });

  // handle remove selcted file
  const handleRemoveAttachment = (file) => {
    setShowGenericAlertBox({
      open: true,
      title: 'Are you sure?',
      titleType: STATUS.WARNING,
      content: 'Do you want to delete this attachment?',
      proceedAction: 'deleteAttachment',
      showProceedBtn: true,
      cancelButtonText: 'No',
      proceedButtonText: 'Yes',
      additionalInfoForProceed: file
    });
  };

  const checkMandatoryFields = (buttonType, reason, isEscalate) => {
    if (
      (customerClassificationId === 1 && !isArray(payload.crCopy)) ||
      (customerClassificationId === 2 && !isArray(payload.vatCopy)) ||
      (customerClassificationId === 1 && !isArray(payload.vatCopy)) ||
      (customerClassificationId === 1 && !isArray(payload.creditApplicationForm)) ||
      (customerClassificationId === 1 && role !== 'Salesman' && !payload.salesTaxGroupCode)
    ) {
      setError(true);
    } else {
      switch (buttonType) {
        case 'submit':
          handleSubmit();
          break;
        case 'resubmit':
          handleResubmit();
          break;
        case 'reject':
          handleReject(reason, isEscalate);
          break;
        case 'rejectAndEscalate':
          handleReject(reason, isEscalate);
          break;
        case 'approve':
          handleApprove();
          break;

        default:
          break;
      }
    }
  };

  const handleSubmit = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await submitForApproval(payload.id);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: 'Success',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
      setDisableSubmit(true);
    }
  };

  const handleApprove = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await approveCustomer({
      customerId: custId,
      isApproved: true
    });
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: 'Success',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    }
  };

  const handleResubmit = async (isEcalate = false) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await resubmitForApproval(payload.id, isEcalate);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: 'Success',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
      setDisableResubmit(true);
    }
  };

  const handleReject = async (reason, isEcalate = false) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await rejectCustomer(payload.id, isEcalate, reason);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: 'Success',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
      setDisableReject(true);
    }
  };

  const saveCustomer = async () => {
    const {
      id,
      legalEntityId,
      salesmanId,
      customerClassificationId,
      organizationId,
      organizationIdValue,
      customerVAT,
      customerName,
      customerArabicName,
      customerShortName,
      invoicingMode,
      invoicingModeValue,
      legalEntityRegionId,
      legalEntityBusinessSectorId,
      legalEntityBusinessIndustryId,
      customerGroupId,
      deliveryModeId,
      paymentTermId,
      gracePeriod,
      incoTermId,
      collectorId,
      currencyId,
      creditLimit,
      salesTaxGroupCode,
      isApplyCreditLimit,
      isApplyCreditPeriod,
      isApplyGracePeriod,
      hasLocation,
      hasPrimaryLocation,
      isShowSubmit,
      isShowReSubmit,
      accountNumber,
      isHSDLegalEntity,
      crCopy,
      vatCopy,
      creditApplicationForm,
      isApproved,
      areApprovalButtonsEnabled,
      isEditable
    } = payload;
    if (
      !legalEntityId ||
      !salesmanId ||
      !customerClassificationId ||
      (customerClassificationId !== 3 && !organizationId) ||
      (customerClassificationId !== 3 && !organizationIdValue) ||
      (customerClassificationId !== 3 && !customerVAT) ||
      !customerName ||
      customerName.length > 100 ||
      !legalEntityRegionId ||
      !legalEntityBusinessSectorId ||
      !legalEntityBusinessIndustryId ||
      !customerGroupId ||
      !deliveryModeId ||
      (payload.invoicingMode === 'EInvoicingEmail' &&
        !isValidEmail(payload.invoicingModeValue) &&
        payload.invoicingModeValue !== '') ||
      (payload.invoicingMode === 'EInvoicingPortal' &&
        !isValidURL(payload.invoicingModeValue) &&
        payload.invoicingModeValue !== '') ||
      (customerClassificationId === 1 && role !== 'Salesman' && !paymentTermId) ||
      (customerClassificationId === 1 && role !== 'Salesman' && !gracePeriod) ||
      (customerClassificationId === 1 && role !== 'Salesman' && !incoTermId) ||
      (customerClassificationId === 1 && role !== 'Salesman' && !currencyId) ||
      (customerClassificationId === 1 && role !== 'Salesman' && !salesTaxGroupCode) ||
      // (customerClassificationId === 1 && !isArray(payload.crCopy)) ||
      // (customerClassificationId === 2 && !isArray(payload.vatCopy)) ||
      // (customerClassificationId === 1 && !isArray(payload.vatCopy)) ||
      // (customerClassificationId === 1 && !isArray(payload.creditApplicationForm)) ||
      lengthError
    ) {
      setError(true);
      setShowTaxDetails.on();
      setShowPaymentDetails.on();
    } else {
      customerTimeBasedName.forEach((itm) => {
        if (typeof itm.fieldValue === 'object') {
          itm.fieldValue = itm.fieldValue.name;
        }
      });

      const isCustomerTimeBasedVAT =
        isArray(customerTimeBasedVAT) && customerTimeBasedVAT[0].fieldValue === '' ? [] : customerTimeBasedVAT;
      const isCustomerTimeBasedName =
        isArray(customerTimeBasedName) && customerTimeBasedName[0].fieldValue === '' ? [] : customerTimeBasedName;
      const isCustomerTimeBasedArabicName =
        isArray(customerTimeBasedArabicName) && customerTimeBasedArabicName[0].fieldValue === ''
          ? []
          : customerTimeBasedArabicName;
      const isCustomerTimeBasedOriginalCollector =
        isArray(customerTimeBasedOriginalCollector) && customerTimeBasedOriginalCollector[0].fieldValue === ''
          ? []
          : customerTimeBasedOriginalCollector;

      const payloadData = {
        customer: {
          id,
          legalEntityId,
          salesmanId,
          customerClassificationId,
          organisationTimeBasedIdentificationType,
          customerTimeBasedVAT: isCustomerTimeBasedVAT,
          customerTimeBasedName: isCustomerTimeBasedName,
          customerTimeBasedArabicName: isCustomerTimeBasedArabicName,
          customerTimeBasedOriginalCollector: isCustomerTimeBasedOriginalCollector,
          customerTimeBasedSalesman,
          customerShortName,
          invoicingMode,
          invoicingModeValue,
          legalEntityRegionId,
          legalEntityBusinessSectorId,
          legalEntityBusinessIndustryId,
          customerGroupId,
          deliveryModeId,
          paymentTermId,
          gracePeriod: parseInt(gracePeriod, 10),
          incoTermId,
          collectorId,
          currencyId,
          creditLimit: creditLimit !== 0 ? parseFloat(creditLimit.replace(/,/g, '')) : 0,
          salesTaxGroupCode,
          isApplyCreditLimit,
          isApplyCreditPeriod,
          isApplyGracePeriod,
          isApproved,
          areApprovalButtonsEnabled,
          hasLocation,
          hasPrimaryLocation,
          isShowSubmit,
          isShowReSubmit,
          accountNumber,
          isHSDLegalEntity,
          isEditable
        }
      };

      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await addCustomer(payloadData);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (!res.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok'
        });
      } else if (res.isSuccessful) {
        const { customerId, accountNumber, isShowSubmit, isShowReSubmit } = res.data;
        setSubmitted(isShowSubmit);
        setResubmitted(isShowReSubmit);
        if (!isEdit) {
          setAccountNum(accountNumber);
        }
        updatePayload({ id: customerId });
        setAddLocationData({
          ...res.data,
          CRNumber: payload.organizationId === 2 ? payload.organizationIdValue : '',
          oldCRNumber,
          legalEntityHSD: legalEntityId === 1,
          mapLocation: payload.legalEntityRegionId
        });
        if (isArray(payload.crCopy) && payload.crCopy[0].id === 0) {
          dispatch({ type: IS_DATA_LOADING, data: true });
          const res = await uploadAttachment({ customerAttachment: { ...payload.crCopy[0], customerId } });
          dispatch({ type: IS_DATA_LOADING, data: false });
          if (!res.isSuccessful) {
            setShowGenericAlertBox({
              open: true,
              titleType: STATUS.ERROR,
              title: 'Error',
              content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
              showProceedBtn: false,
              cancelButtonText: 'Ok'
            });
          }
        }
        if (isArray(payload.vatCopy) && payload.vatCopy[0].id === 0) {
          dispatch({ type: IS_DATA_LOADING, data: true });
          const res = await uploadAttachment({ customerAttachment: { ...payload.vatCopy[0], customerId } });
          dispatch({ type: IS_DATA_LOADING, data: false });
          if (!res.isSuccessful) {
            setShowGenericAlertBox({
              open: true,
              titleType: STATUS.ERROR,
              title: 'Error',
              content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
              showProceedBtn: false,
              cancelButtonText: 'Ok'
            });
          }
        }
        if (isArray(payload.creditApplicationForm) && payload.creditApplicationForm[0].id === 0) {
          dispatch({ type: IS_DATA_LOADING, data: true });
          const res = await uploadAttachment({
            customerAttachment: { ...payload.creditApplicationForm[0], customerId }
          });
          dispatch({ type: IS_DATA_LOADING, data: false });
          if (!res.isSuccessful) {
            setShowGenericAlertBox({
              open: true,
              titleType: STATUS.ERROR,
              title: 'Error',
              content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
              showProceedBtn: false,
              cancelButtonText: 'Ok'
            });
          }
        }
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.SUCCESS,
          title: 'Success',
          content: res?.message || 'Customer saved successfully.',
          showProceedBtn: false,
          cancelButtonText: 'Close'
        });
        setDisableCustomer(true);
        if (!isEdit) {
          setEnableAddLocation(true);
          setShowLocation.on();
          setNewLocation(true);
        }
      }
    }
  };

  // const deleteMltSlctOptn = (key, val) => {
  //   if (key === 'salesmanId' && val && isArray(payload.salesmanId)) {
  //     const selectedSalesman = payload.salesmanId.filter((slmn) => slmn.id !== val * 1);
  //     const selectedSalesmanIds = (isArray(selectedSalesman) && selectedSalesman.map((slmn) => slmn.id)) || [];
  //     setPayload({
  //       ...payload,
  //       salesmanId: selectedSalesman,
  //       salesmanIds: selectedSalesmanIds
  //     });
  //   }
  // };

  const getDdlsLists = (val, isDefault) => {
    getSalesmenDdl(val, isDefault);
    getOrganizationIdentificationTypesDdl(val, isDefault);
    // getCustomers(val, null);
    getRegionsDdl(val, isDefault);
    getBusinessSectorsDdl(val, isDefault);
    getBusinessIndustriesDdl(val, isDefault);
    getCustomerGroupsDdl(val, isDefault);
    getDeliveryModesDdl(val, isDefault);
    if (role !== 'Salesman') {
      getPaymentTermsDdl(val, isDefault);
      getCurrenciesDdl(val, isDefault);
      getIncotermsDdl(val, isDefault);
      getCollectorsDdl(val, isDefault);
      getSalesTaxDdl(val, isDefault);
    }
  };

  // const enterKeyhandler = (e) => {
  //   getCustomers(legalEntityId, payload.customerName);
  // };

  const callSaudiPostApi = async (CRNumber) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSaudiPostApi(CRNumber);
    dispatch({ type: IS_DATA_LOADING, data: false });
    const { KSABusinesses, success } = res;
    if (!success) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Location is not present for this CR Number.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    } else if (success) {
      // eslint-disable-next-line camelcase
      const { Title: title } = KSABusinesses[0];
      updatePayload({
        customerArabicName: title
      });
      const newData = [...customerTimeBasedArabicName];
      newData[0].fieldValue = title;
      setCustomerTimeBasedArabicName(newData);
    }
  };

  const handleOnBlur = (key, val) => {
    if (key === 'creditLimit') {
      if (val !== 0) {
        const numberWithoutCommaAndDecimal = val.replace(/,/g, ''); // Remove commas
        const formattedVal = commaNumber(Number(numberWithoutCommaAndDecimal).toFixed(2));
        updatePayload({ creditLimit: formattedVal });
      }
    } else if (key === 'organizationIdValue') {
      if (payload.organizationId * 1 === 2 && payload.organizationIdValue) {
        callSaudiPostApi(val);
      }
    }
  };

  const handleChangeData = (key, val) => {
    const timeBasedFields = [
      'salesmanId',
      'organizationId',
      'organizationIdValue',
      'customerVAT',
      'customerName',
      'customerArabicName',
      'collectorId'
    ];
    // if (key === 'salesmanId') {
    //   if (val.includes('selectAll') || val.includes('deselectAll')) {
    //     const tempObj = (isArray(val) && val.includes('selectAll') && salesmen) || (val.includes('deselectAll') && []);
    //     const tempIds =
    //       (isArray(val) && val.includes('selectAll') && salesmen.map((itm) => itm.id)) ||
    //       (val.includes('deselectAll') && []);
    //     updatePayload({ salesmanId: tempObj, salesmanIds: tempIds });
    //   } else {
    //     updatePayload({ salesmanId: val, salesmanIds: val.map((itm) => itm.id) });
    //   }
    // } else
    if (timeBasedFields.includes(key) && !isEdit) {
      if (key === 'salesmanId') {
        updatePayload({ [key]: val * 1 });
        const newData = [...customerTimeBasedSalesman];
        newData[0].fieldValue = val.toString();
        setCustomerTimeBasedSalesman(newData);
      } else if (key === 'organizationId') {
        updatePayload({ [key]: val * 1 });
        const orgainzationIdObj = customerIdTypes.find((itm) => itm.id === val * 1) || '';
        const newData = [...organisationTimeBasedIdentificationType];
        newData[0].fieldValue = val.toString();
        newData[0].associatedFieldType = orgainzationIdObj.code;
        setOrganisationTimeBasedIdentificationType(newData);
      } else if (key === 'organizationIdValue') {
        updatePayload({ [key]: val });
        const newData = [...organisationTimeBasedIdentificationType];
        newData[0].associatedFieldValue = val;
        setOrganisationTimeBasedIdentificationType(newData);
      } else if (key === 'customerVAT') {
        updatePayload({ [key]: val });
        const newData = [...customerTimeBasedVAT];
        newData[0].fieldValue = val;
        setCustomerTimeBasedVAT(newData);
      } else if (key === 'customerName') {
        updatePayload({ [key]: val });
        const newData = [...customerTimeBasedName];
        newData[0].fieldValue = val;
        setCustomerTimeBasedName(newData);
      } else if (key === 'customerArabicName') {
        updatePayload({ [key]: val });
        const newData = [...customerTimeBasedArabicName];
        newData[0].fieldValue = val;
        setCustomerTimeBasedArabicName(newData);
      } else if (key === 'collectorId') {
        updatePayload({ [key]: val });
        const newData = [...customerTimeBasedOriginalCollector];
        newData[0].fieldValue = val.toString();
        setCustomerTimeBasedOriginalCollector(newData);
      }
    } else if (key === 'legalEntityId') {
      updatePayload({ [key]: val * 1 });
      getDdlsLists(val, true);
    } else if (key === 'customerShortName') {
      // const isValidShortName = val.replace(/[^a-zA-Z0-9\s]/g, '');
      // updatePayload({ [key]: isValidShortName });
      updatePayload({ [key]: val });
      if (val.length > 50) {
        setLengthError(true);
      } else {
        setLengthError(false);
      }
    } else if (key === 'invoicingMode' && val === 'CustomerContact') {
      updatePayload({ invoicingMode: val, invoicingModeValue: '' });
    } else if (key === 'invoicingMode' && val === 'EInvoicingEmail') {
      updatePayload({ invoicingMode: val, invoicingModeValue: '' });
    } else if (key === 'invoicingMode' && val === 'EInvoicingPortal') {
      updatePayload({ invoicingMode: val, invoicingModeValue: '' });
    } else if (
      [
        'legalEntityRegionId',
        'legalEntityBusinessSectorId',
        'legalEntityBusinessIndustryId',
        'customerGroupId',
        'deliveryModeId',
        'paymentTermId',
        'incoTermId',
        'currencyId',
        'customerClassificationId'
      ].includes(key)
    ) {
      updatePayload({ [key]: val * 1 });
    } else if (key === 'gracePeriod') {
      if (!val || isValidStr(val, REGX_TYPE.NUM)) {
        val = (isValidStr(val, REGX_TYPE.NUM) && val) || 0;
        if (val !== 0) {
          const truncatedVal = (isValidStr(val, REGX_TYPE.NUM) && val.slice(0, 5)) || payload.gracePeriod;
          updatePayload({ [key]: truncatedVal });
        } else {
          updatePayload({ [key]: val });
        }
      }
    } else if (key === 'creditLimit') {
      const crLimitString = val.replace(/,/g, '');
      if (!crLimitString || isValidStr(crLimitString, REGX_TYPE.UNIT_PRICE_RX)) {
        val = (isValidStr(crLimitString, REGX_TYPE.UNIT_PRICE_RX) && crLimitString) || 0;
        if (val !== 0) {
          const stringVal = val.toString();
          const [beforeDecimal, afterDecimal] = stringVal.split('.');
          val =
            beforeDecimal.length > 12
              ? `${beforeDecimal.slice(0, 12)}${afterDecimal ? `.${afterDecimal}` : ''}`
              : stringVal;
          updatePayload({ [key]: val });
        } else {
          updatePayload({ [key]: val });
        }
      }
    } else if (key === 'invoicingModeValue') {
      updatePayload({ [key]: val });
      if (payload.invoicingMode === 'EInvoicingEmail' && !isValidEmail(val) && payload.invoicingModeValue !== '') {
        setError(true);
      } else if (
        payload.invoicingMode === 'EInvoicingPortal' &&
        !isValidURL(val) &&
        payload.invoicingModeValue !== ''
      ) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      updatePayload({ [key]: val });
    }
  };

  const getSalesmenDdl = async (legalEntityId, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSalesmen(legalEntityId, false);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setSalesmen(res.data);
      const defaultSalesman = (isArray(res.data) && res.data.filter((item) => item.isSelected === true)) || [];
      if (isArray(defaultSalesman) && isDefault) {
        updatePayload({ salesmanId: defaultSalesman[0].id });
        const newData = [...customerTimeBasedSalesman];
        newData[0].fieldValue = defaultSalesman[0].id.toString();
        setCustomerTimeBasedSalesman(newData);
      }
    }
  };

  const getDeliveryModesDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getDeliveryModes(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setDeliveryModes(res.data);
      const defaultDeliveryModeId = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultDeliveryModeId) && isDefault) {
        updatePayload({ deliveryModeId: defaultDeliveryModeId[0].id });
      }
    }
  };

  const getPaymentTermsDdl = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getPaymentTerms(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setPaymentTerms(res.data);
    }
  };

  const getRegionsDdl = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getRegions(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setRegions(res.data);
    }
  };

  const getCollectorsDdl = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCollectors(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setCollectorsList(res.data);
    }
  };

  const getOrganizationIdentificationTypesDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getOrganizationIdentificationTypes(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setCustomerIdTypes(res.data);
      const defaultOrganizationId = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultOrganizationId) && isDefault) {
        updatePayload({ organizationId: defaultOrganizationId[0].id });
      }
    }
  };

  const getBusinessSectorsDdl = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getBusinessSectors(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setBusinessSector(res.data);
    }
  };

  const getBusinessIndustriesDdl = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getBusinessIndustries(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setBusinessIndustries(res.data);
    }
  };

  const getIncotermsDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getIncoterms(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setIncotermsList(res.data);
      const defaultIncoTermId = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultIncoTermId) && isDefault) {
        updatePayload({ incoTermId: defaultIncoTermId[0].id });
      }
    }
  };

  const getCustomerGroupsDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomerGroups(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setCustomerGroups(res.data);
      const defaultCustomerGroupId = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultCustomerGroupId) && isDefault) {
        updatePayload({ customerGroupId: defaultCustomerGroupId[0].id });
      }
    }
  };

  const getCurrenciesDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCurrencies(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setCurrencyList(res.data);
      const defaultCurrencyId = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultCurrencyId) && isDefault) {
        updatePayload({ currencyId: defaultCurrencyId[0].id });
      }
    }
  };

  const getSalesTaxDdl = async (val, isDefault) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSalesTaxGroups(val);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setSalesTaxGroupsList(res.data);
      const defaultSalesTaxGroupCode = (isArray(res.data) && res.data.filter((item) => item.isDefault === true)) || [];
      if (isArray(defaultSalesTaxGroupCode) && isDefault) {
        updatePayload({ salesTaxGroupCode: defaultSalesTaxGroupCode[0].id });
      }
    }
  };

  // Download Attachment api call
  // const getCustomerAttachment = async (guid) => {
  //   dispatch({ type: IS_DATA_LOADING, data: true });
  //   const res = await downloadAttachment(guid);
  //   dispatch({ type: IS_DATA_LOADING, data: false });

  //   if (!res.isSuccessful) {
  //     setShowGenericAlertBox({
  //       open: true,
  //       titleType: STATUS.ERROR,
  //       title: 'Error',
  //       content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
  //       showProceedBtn: false,
  //       cancelButtonText: 'Ok'
  //     });
  //     return null; // Return null or handle the failure scenario
  //   }

  //   if (res.isSuccessful) {
  //     return res.data; // Return the base64 data
  //   }

  //   return null; // Handle any other case where data is not available
  // };

  const getFieldValues = (fieldArray) => {
    if (isArray(fieldArray)) {
      const selectedObj = fieldArray.find((itm) => itm.isSelected);
      if (selectedObj) {
        const { fieldValue, associatedFieldValue } = selectedObj;
        return { fieldValue, associatedFieldValue };
      }
    }
    return { fieldValue: null, associatedFieldValue: null };
  };

  const handleArrayState = (setterFunction, arrayToCheck, defaultValue) => {
    if (isArray(arrayToCheck) && arrayToCheck.length > 0) {
      setterFunction(arrayToCheck);
    } else {
      setterFunction(defaultValue);
    }
  };

  const getCustomerData = async (customerId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomerDetails(customerId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      const {
        id,
        accountNumber,
        customerTimeBasedName,
        customerTimeBasedArabicName,
        organisationTimeBasedIdentificationType,
        customerTimeBasedVAT,
        customerTimeBasedSalesman,
        customerTimeBasedOriginalCollector,
        legalEntityId,
        customerClassificationId,
        customerShortName,
        legalEntityRegionId,
        legalEntityBusinessSectorId,
        legalEntityBusinessIndustryId,
        customerGroupId,
        deliveryModeId,
        paymentTermId,
        gracePeriod,
        incoTermId,
        currencyId,
        creditLimit,
        salesTaxGroupCode,
        isApplyCreditLimit,
        isApplyCreditPeriod,
        isApplyGracePeriod,
        isApproved,
        invoicingMode,
        invoicingModeValue,
        hasLocation,
        hasPrimaryLocation,
        isShowSubmit,
        areApprovalButtonsEnabled,
        isShowReSubmit,
        customerStatus,
        isHSDLegalEntity,
        isEditable
      } = res.data?.customer;
      setIsApprovedFlag(isApproved);
      setStatusCode(customerStatus);
      setSubmitted(isShowSubmit);
      setResubmitted(isShowReSubmit);
      setApproveBtnEnable(areApprovalButtonsEnabled);
      const { customerAttachments } = res.data;
      setDefaultMapLocation(legalEntityRegionId);
      setAccountNum(accountNumber);
      getDdlsLists(legalEntityId, false);
      setEntityIdHSD({ ...entityIdHSD, isHSDLegalEntity });
      if (currencyId === null) {
        setFetchCurrencyId(true);
      }
      // const updatedAttachments = await Promise.all(
      //   customerAttachments.map(async (attachment) => {
      //     const { guid, documentCategory } = attachment;
      //     const base64 = await getCustomerAttachment(guid, documentCategory);
      //     return { ...attachment, base64 };
      //   })
      // );
      customerAttachments.forEach((itm) => {
        switch (itm.documentCategory) {
          case 'CRCopy':
            updatePayload({ crCopy: [itm] });
            break;
          case 'VATCopy':
            updatePayload({ vatCopy: [itm] });
            break;
          case 'CreditApplicationForm':
            updatePayload({ creditApplicationForm: [itm] });
            break;
          default:
            break;
        }
      });

      handleArrayState(setOrganisationTimeBasedIdentificationType, organisationTimeBasedIdentificationType, [
        {
          id: 0,
          fieldType: 'OrganisationIdentificationType',
          fieldValue: '',
          associatedFieldType: '',
          associatedFieldValue: '',
          validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
          isSelected: true,
          isEditable: null
        }
      ]);
      handleArrayState(setCustomerTimeBasedVAT, customerTimeBasedVAT, [
        {
          id: 0,
          fieldType: 'CustomerVAT',
          fieldValue: '',
          associatedFieldType: '',
          associatedFieldValue: '',
          validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
          isSelected: true,
          isEditable: null
        }
      ]);
      handleArrayState(setCustomerTimeBasedArabicName, customerTimeBasedArabicName, [
        {
          id: 0,
          fieldType: 'CustomerArabicName',
          fieldValue: '',
          associatedFieldType: '',
          associatedFieldValue: '',
          validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
          isSelected: true,
          isEditable: null
        }
      ]);
      handleArrayState(setCustomerTimeBasedOriginalCollector, customerTimeBasedOriginalCollector, [
        {
          id: 0,
          fieldType: 'OriginalCollector',
          fieldValue: '',
          associatedFieldType: '',
          associatedFieldValue: '',
          validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
          isSelected: true,
          isEditable: null
        }
      ]);
      handleArrayState(setCustomerTimeBasedName, customerTimeBasedName, [
        {
          id: 0,
          fieldType: 'CustomerName',
          fieldValue: '',
          associatedFieldType: '',
          associatedFieldValue: '',
          validFrom: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
          validTo: futureDate.format('YYYY-MM-DDTHH:mm:ss'),
          isSelected: true,
          isEditable: null
        }
      ]);
      setCustomerTimeBasedSalesman(customerTimeBasedSalesman);

      const { fieldValue: organizationId, associatedFieldValue: organizationIdValue } = getFieldValues(
        organisationTimeBasedIdentificationType
      );
      const { fieldValue: customerVAT } = getFieldValues(customerTimeBasedVAT);
      const { fieldValue: customerName } = getFieldValues(customerTimeBasedName);
      const { fieldValue: customerArabicName } = getFieldValues(customerTimeBasedArabicName);
      const { fieldValue: salesmanId } = getFieldValues(customerTimeBasedSalesman);
      const { fieldValue: collectorId } = getFieldValues(customerTimeBasedOriginalCollector);
      setOldCRNumber(organizationIdValue);
      setNonEdit(true);
      const gracePrd = gracePeriod !== 0 && gracePeriod !== null ? gracePeriod.toString() : '0';
      updatePayload({
        id,
        legalEntityId,
        salesmanId: salesmanId * 1,
        customerClassificationId,
        organizationId: organizationId * 1,
        organizationIdValue,
        customerVAT,
        customerName,
        customerShortName,
        customerArabicName,
        legalEntityRegionId,
        legalEntityBusinessSectorId,
        legalEntityBusinessIndustryId,
        customerGroupId,
        deliveryModeId,
        paymentTermId,
        gracePeriod: gracePrd,
        incoTermId,
        collectorId: collectorId * 1 || null,
        currencyId,
        creditLimit: commaNumber(Number(creditLimit).toFixed(2)),
        salesTaxGroupCode,
        isApplyCreditLimit,
        isApplyCreditPeriod,
        isApplyGracePeriod,
        areApprovalButtonsEnabled,
        isApproved,
        invoicingMode,
        invoicingModeValue,
        hasLocation,
        hasPrimaryLocation,
        isShowSubmit,
        isShowReSubmit,
        accountNumber,
        isHSDLegalEntity,
        isEditable
      });
    }
  };

  const expandAddLocation = () => {
    setShowCustomerDetails.off();
    setEnableAddCustomer(true);
    setDisableCustomer(true);
    setShowLocation.on();
    getCustomerData(custId);
    setEntityIdHSD({ ...entityIdHSD });
    setLocationInfo({
      custId,
      CRNum,
      hasLocation,
      locationId,
      hasPrimaryLocation,
      isPrimaryLocation,
      organizationIdentificationType,
      organizationIdentificationTypeValue,
      organizationId
    });
    setEnableAddLocation(true);
  };

  const expandAddContact = () => {
    setDisableCustomer(true);
    setShowCustomerDetails.off();
    getCustomerData(custId);
    setEnableAddCustomer(true);
    setEnableAddLocation(true);
    setDisableLocation(true);
    setShowContacts.on();
    setEnableAddContacts(true);
    setLocationInfo({
      custId,
      CRNum,
      hasLocation,
      hasPrimaryLocation,
      isPrimaryLocation,
      locationId,
      legalEntityHSD,
      organizationId
    });
    setContactData({
      isRouting: true,
      isEdit,
      contactId,
      customerId: custId,
      customerLocationId: locationId,
      isPrimaryLocation
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isNewLocation) {
      setNewLocation(true);
    } else {
      setNewLocation(false);
    }
  }, [isNewLocation]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setShowDocuments.on();
    setShowPaymentDetails.on();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (expandAccordion === 'AddCustomer') {
      setShowCustomerDetails.on();
      setEnableAddCustomer(true);
      if (isEdit && custId) {
        getCustomerData(custId);
      }
    } else if (expandAccordion === 'AddLocation') {
      expandAddLocation();
    } else if (expandAccordion === 'AddContact') {
      expandAddContact();
    }
    updatePayload({ invoicingMode: 'CustomerContact' });
    if (location.state.payload) {
      const { legalEntityId } = location.state?.payload;
      if (legalEntityId) {
        handleChangeData('legalEntityId', legalEntityId);
      }
    }
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (legalEntities.length === 1 && !isEdit) {
      updatePayload({ legalEntityId: legalEntities[0].id });
      getDdlsLists(legalEntities[0].id, true);
    }
  }, [legalEntities]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isArray(customerIdTypes) && payload.organizationId) {
      handleChangeData('organizationId', payload.organizationId);
    }
  }, [payload.organizationId]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setShowTaxDetails.on();
    setShowDocuments.on();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (fetchCurrencyId) {
      const currId = currencyList.find((itm) => itm.isDefault);
      if (currId) {
        updatePayload({ currencyId: currId.id });
      }
    }
  }, [currencyList]);

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
      case 'deleteAttachment':
        removeAttachment(additionalInfoForProceed);
        break;
      default:
        break;
    }
  };

  const removeAttachment = async (file) => {
    let key;
    if (file.documentCategory === 'CRCopy') {
      key = 'crCopy';
    } else if (file.documentCategory === 'VATCopy') {
      key = 'vatCopy';
    } else {
      key = 'creditApplicationForm';
    }
    if (file.id) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await deleteAttachment(file.id);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (!res.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok'
        });
      }
    }
    const filteredItems = payload[key]?.filter((_file) => _file !== file);
    updatePayload({ [key]: filteredItems || [] });
  };

  const handleCloseCustomerIdDialog = () => setOpenCustomerIdDialog(false);
  const handleCloseVatNumberDialog = () => setOpenVatNumberDialog(false);
  const handleCloseCustomerNameDialog = () => setOpenCustomerNameDialog(false);
  const handleCloseCustomerNameArabicDialog = () => setOpenCustomerNameArabicDialog(false);
  const handleCloseSalesmanIdDialog = () => setOpenSalesmanIdDialog(false);
  const handleCloseCollectorIdDialog = () => setOpenCollectorIdDialog(false);

  const proceedToCloseCustomerIdDialog = () => setOpenCustomerIdDialog(false);
  const proceedToCloseVatNumberDialog = () => setOpenVatNumberDialog(false);
  const proceedToCloseCustomerNameDialog = () => setOpenCustomerNameDialog(false);
  const proceedToCloseCustomerNameArabicDialog = () => setOpenCustomerNameArabicDialog(false);
  const proceedToCloseSalesmanIdDialog = () => setOpenSalesmanIdDialog(false);
  const proceedToCloseCollectorIdDialog = () => setOpenCollectorIdDialog(false);

  const docsTopMargin = role === 'Salesman' || (customerClassificationId && customerClassificationId === 2);

  const getPageHeading = () => {
    if (isEdit || disableCustomer) {
      return `Customer - ${accountNum}`;
    }
    return 'Add Customer';
  };

  const showAdminButtonsGrid =
    (role === 'Super Admin' &&
      (statusCode === 'REDRAFTED' || statusCode === 'APPROVED' || statusCode === 'REJECTED')) ||
    (role === 'Super Admin' && (statusCode === 'DRAFTED' || !isEdit));

  return (
    <Grid sx={{ padding: '0px 20px', width: '100%' }}>
      <NotesDialog
        noteProps={{ ...reasonBox }}
        handleClose={handleCloseNotesAlertBox}
        handleProceed={handleProceedNotesAlertBox}
      />
      <DialogComponent
        open={genericAlertBox.open}
        handleClose={handleCloseBackAlertBox}
        title={genericAlertBox.title}
        titleType={genericAlertBox.titleType}
        content={genericAlertBox.content}
        isCancelButton
        isProceedButton={genericAlertBox.showProceedBtn}
        cancelButtonText={genericAlertBox.cancelButtonText}
        proceedButtonText={genericAlertBox.proceedButtonText}
        handleProceed={handleProceedBackAlertBox}
      />
      <CustomerIdDialog
        open={openCustomerIdDialog}
        handleClose={handleCloseCustomerIdDialog}
        handleProceed={proceedToCloseCustomerIdDialog}
        customerIdTypes={customerIdTypes}
        payloadData={payload}
        setPayloadData={setPayload}
        organisationTimeBasedIdentificationType={organisationTimeBasedIdentificationType}
        setOrganisationTimeBasedIdentificationType={setOrganisationTimeBasedIdentificationType}
        isEdit={isEdit}
        callSaudiPostApi={callSaudiPostApi}
      />
      <VatNumberDialog
        open={openVatNumberDialog}
        handleClose={handleCloseVatNumberDialog}
        handleProceed={proceedToCloseVatNumberDialog}
        customerTimeBasedVAT={customerTimeBasedVAT}
        setCustomerTimeBasedVAT={setCustomerTimeBasedVAT}
        payloadData={payload}
        setPayloadData={setPayload}
        isEdit={isEdit}
      />
      <CustomerNameDialog
        open={openCustomerNameDialog}
        handleClose={handleCloseCustomerNameDialog}
        handleProceed={proceedToCloseCustomerNameDialog}
        customerTimeBasedName={customerTimeBasedName}
        customers={customers}
        setCustomers={setCustomers}
        setCustomerTimeBasedName={setCustomerTimeBasedName}
        payloadData={payload}
        setPayloadData={setPayload}
        isEdit={isEdit}
      />
      <CustomerArabicNameDialog
        open={openCustomerNameArabicDialog}
        handleClose={handleCloseCustomerNameArabicDialog}
        handleProceed={proceedToCloseCustomerNameArabicDialog}
        customerTimeBasedArabicName={customerTimeBasedArabicName}
        setCustomerTimeBasedArabicName={setCustomerTimeBasedArabicName}
        payloadData={payload}
        setPayloadData={setPayload}
        isEdit={isEdit}
      />
      <SalesmanIdDialog
        open={openSalesmanIdDialog}
        handleClose={handleCloseSalesmanIdDialog}
        handleProceed={proceedToCloseSalesmanIdDialog}
        customerTimeBasedSalesman={customerTimeBasedSalesman}
        setCustomerTimeBasedSalesman={setCustomerTimeBasedSalesman}
        payloadData={payload}
        setPayloadData={setPayload}
        salesmen={salesmen}
        isEdit={isEdit}
      />
      <CollectorDialog
        open={openCollectorIdDialog}
        handleClose={handleCloseCollectorIdDialog}
        handleProceed={proceedToCloseCollectorIdDialog}
        customerTimeBasedOriginalCollector={customerTimeBasedOriginalCollector}
        setCustomerTimeBasedOriginalCollector={setCustomerTimeBasedOriginalCollector}
        payloadData={payload}
        setPayloadData={setPayload}
        collectorsList={collectorsList}
        isEdit={isEdit}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={6.7} display="flex" justifyContent="flex-end">
              <Typography fontWeight="bold" variant="subtitle1">
                {getPageHeading()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ backgroundColor: 'rgb(227 232 234)' }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          mt={1}
          style={{
            border: '1px solid rgb(227 232 234)',
            marginLeft: '0.1rem',
            width: '99.9%',
            paddingRight: '0.5rem'
          }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            mb={1}
            style={{ color: (enableAddCustomer && 'inherit') || 'lightgray' }}
          >
            {showCustomerDetails ? (
              <ArrowDropDownIcon
                style={{ cursor: enableAddCustomer ? 'pointer' : 'default' }}
                onClick={() => enableAddCustomer && setShowCustomerDetails.toggle()}
              />
            ) : (
              <ArrowRightIcon
                style={{ cursor: enableAddCustomer ? 'pointer' : 'default' }}
                onClick={() => enableAddCustomer && setShowCustomerDetails.toggle()}
              />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              Customer Details
            </Typography>
          </Grid>
          {showCustomerDetails && (
            <Grid item xs={12}>
              <Grid item xs={12} mt={1} display="flex">
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid container spacing={2}>
                      {topComps?.map((comp, ind) => {
                        if (comp.key === 'editSalesmanId') {
                          if (role === 'Salesman' || !isEdit) {
                            return true;
                          }
                        }
                        return (
                          <RenderComponent
                            key={ind}
                            metaData={comp}
                            payload={payload}
                            ind={1}
                            handleChange={handleChangeData}
                            // deleteMltSlctOptn={deleteMltSlctOptn}
                            // handleBlur={handleOnBlur}
                          />
                        );
                      })}
                    </Grid>
                    {/* <Grid item xs={6} sx={{ marginLeft: '-0.5rem' }}> */}
                    <Grid
                      container
                      spacing={3}
                      mt={1}
                      style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '95.9%' }}
                    >
                      <Grid item xs={12} display="flex" alignItems="center" mb={1} sx={{ marginLeft: '-0.5rem' }}>
                        {showTaxDetails ? (
                          <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => setShowTaxDetails.toggle()} />
                        ) : (
                          <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={() => setShowTaxDetails.toggle()} />
                        )}
                        <Typography fontWeight="bold" variant="subtitle2">
                          Tax Details
                        </Typography>
                      </Grid>
                      {showTaxDetails && (
                        <Grid item xs={12} mt={1}>
                          <Grid container spacing={2}>
                            {taxComps?.map((comp, ind) => {
                              const penIcons = ['editCustomerId', 'editVATNUmber'];
                              if (penIcons.includes(comp.key) && !isEdit) {
                                return true;
                              }
                              return (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              );
                            })}
                          </Grid>
                        </Grid>
                      )}
                    </Grid>

                    <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                      {customerComps?.map((comp, ind) => {
                        const penIcons = ['editCustomerName', 'editCustomerArabicName'];
                        if (penIcons.includes(comp.key) && !isEdit) {
                          return true;
                        }
                        return (
                          <RenderComponent
                            key={ind}
                            metaData={comp}
                            payload={payload}
                            ind={1}
                            handleChange={handleChangeData}
                            handleBlur={handleOnBlur}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sx={{ marginTop: '5.4rem' }}>
                  <Grid item xs={12}>
                    {role !== 'Salesman' && customerClassificationId !== 2 ? (
                      <Grid
                        container
                        spacing={3}
                        style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
                      >
                        <Grid item xs={12} display="flex" alignItems="center" mb={1}>
                          {showPaymentDetails ? (
                            <ArrowDropDownIcon
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowPaymentDetails.toggle()}
                            />
                          ) : (
                            <ArrowRightIcon
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowPaymentDetails.toggle()}
                            />
                          )}
                          <Typography fontWeight="bold" variant="subtitle2">
                            Payment Details
                          </Typography>
                        </Grid>
                        {showPaymentDetails && (
                          <Grid container spacing={2} sx={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                            {paymentComps?.map((comp, ind) => {
                              if (comp.key === 'editCollectorId' && !isEdit) {
                                return true;
                              }
                              return (
                                <RenderComponent
                                  key={ind}
                                  metaData={comp}
                                  payload={payload}
                                  ind={1}
                                  handleChange={handleChangeData}
                                  handleBlur={handleOnBlur}
                                />
                              );
                            })}
                          </Grid>
                        )}
                      </Grid>
                    ) : null}
                    <Grid
                      container
                      spacing={3}
                      mt={1}
                      style={{
                        border: '1px solid rgb(227 232 234)',
                        marginLeft: '0.1rem',
                        width: '99.9%',
                        marginTop: docsTopMargin ? '-1.5rem' : '1rem'
                      }}
                    >
                      <Grid item xs={12} display="flex" alignItems="center" mb={1}>
                        {showDocuments ? (
                          <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => setShowDocuments.toggle()} />
                        ) : (
                          <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={() => setShowDocuments.toggle()} />
                        )}
                        <Typography fontWeight="bold" variant="subtitle2">
                          Customer Documents
                        </Typography>
                      </Grid>
                      {showDocuments && (
                        <Grid item xs={12} mt={1} mb={1} ml={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <UploadFile
                                showPreview
                                maxSize={3145728}
                                accept="application/pdf"
                                files={payload.crCopy}
                                onDrop={handleDropMultipleCRCopy}
                                onRemove={handleRemoveAttachment}
                                backgroundColor="transparent"
                                startIcon={<PhotoCamera />}
                                buttonLabel="CR Copy"
                                isRequired={customerClassificationId === 1}
                                uploadBtnStyles={{ display: 'inline-block', marginRight: '1rem' }}
                                filesStyles={{ display: 'inline-block', margin: 0 }}
                                noFileText="No File Uploaded"
                                isError={error && customerClassificationId === 1}
                                isDisabled={disableCustomer}
                                // showCloseBtn={!payload.projectId}
                                showCloseBtn
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <UploadFile
                                showPreview
                                maxSize={3145728}
                                accept="application/pdf"
                                files={payload.vatCopy}
                                onDrop={handleDropMultipleVATCopy}
                                onRemove={handleRemoveAttachment}
                                backgroundColor="transparent"
                                startIcon={<PhotoCamera />}
                                buttonLabel="VAT Copy"
                                isRequired={customerClassificationId === 1 || customerClassificationId === 2}
                                uploadBtnStyles={{ display: 'inline-block', marginRight: '1rem' }}
                                filesStyles={{ display: 'inline-block', margin: 0 }}
                                noFileText="No File Uploaded"
                                isError={
                                  (error && customerClassificationId === 1) || (error && customerClassificationId === 2)
                                }
                                isDisabled={disableCustomer}
                                // showCloseBtn={!payload.projectId}
                                showCloseBtn
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <UploadFile
                                showPreview
                                maxSize={3145728}
                                accept="application/pdf"
                                files={payload.creditApplicationForm}
                                onDrop={handleDropMultipleCreditApplicationForm}
                                onRemove={handleRemoveAttachment}
                                backgroundColor="transparent"
                                startIcon={<PhotoCamera />}
                                buttonLabel="Credit Application Form"
                                isRequired={customerClassificationId === 1}
                                uploadBtnStyles={{ display: 'inline-block', marginRight: '1rem' }}
                                filesStyles={{ display: 'inline-block', margin: 0 }}
                                noFileText="No File Uploaded"
                                isError={error && customerClassificationId === 1}
                                isDisabled={disableCustomer}
                                // showCloseBtn={!payload.projectId}
                                showCloseBtn
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    marginBottom: '0.5rem',
                    marginTop: '-2.5rem'
                  }}
                >
                  {buttonComps?.map((comp, ind) => (
                    <RenderComponent key={ind} metaData={comp} ind={1} />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          mt={1}
          style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            mb={1}
            style={{ color: (enableAddLocation && 'inherit') || 'lightgray' }}
          >
            {showLocation ? (
              <ArrowDropDownIcon
                style={{ cursor: enableAddLocation ? 'pointer' : 'default' }}
                onClick={() => enableAddLocation && setShowLocation.toggle()}
              />
            ) : (
              <ArrowRightIcon
                style={{ cursor: enableAddLocation ? 'pointer' : 'default' }}
                onClick={() => enableAddLocation && setShowLocation.toggle()}
              />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              {!newLocation ? `Location Details ${locationNameHeader}` : 'Add Location'}
            </Typography>
          </Grid>
          {showLocation && (
            <Grid item xs={12} mt={3}>
              <AddLocation
                locationData={addLocationData}
                locationInfo={locationInfo}
                entityIdHSD={entityIdHSD}
                setContactData={setContactData}
                setEnableAddContacts={setEnableAddContacts}
                setShowContacts={setShowContacts}
                defaultMapLocation={defaultMapLocation}
                disableLocation={disableLocation}
                setDisableLocation={setDisableLocation}
                isEdit={isEdit}
                locationNameHeader={locationNameHeader}
                setLocationNameHeader={setLocationNameHeader}
                setSubmitted={setSubmitted}
                setResubmitted={setResubmitted}
                newLocation={newLocation}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          mt={1}
          style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            mb={1}
            style={{ color: (enableAddContacts && 'inherit') || 'lightgray' }}
          >
            {showContacts ? (
              <ArrowDropDownIcon
                style={{ cursor: enableAddContacts ? 'pointer' : 'default' }}
                onClick={() => enableAddContacts && setShowContacts.toggle()}
              />
            ) : (
              <ArrowRightIcon
                style={{ cursor: enableAddContacts ? 'pointer' : 'default' }}
                onClick={() => enableAddContacts && setShowContacts.toggle()}
              />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              {isEdit ? 'Contact Details' : 'Add Contact'}
            </Typography>
          </Grid>
          {showContacts && (
            <Grid item xs={12} mt={3}>
              <AddContacts contactData={contactData} setApproveBtnEnable={setApproveBtnEnable} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {error && (
        <Grid item xs={12} align="center">
          <Typography variant="caption" color="red" fontFamily={FontFamily}>
            Please enter mandatory fields.
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sx={{ marginTop: error ? '-2rem' : '0rem' }}>
        {role === 'Salesman' && (statusCode === 'DRAFTED' || !isEdit) && (
          <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                {submitButtons?.map((comp, ind) => {
                  if (comp.key === 'submit') {
                    comp.isDisabled = !submitted || disableSubmit;
                  }
                  return <RenderComponent key={ind} metaData={comp} ind={1} />;
                })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {role === 'Salesman' && (statusCode === 'REDRAFTED' || statusCode === 'APPROVED' || statusCode === 'REJECTED') && (
          <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                {resubmitButtons?.map((comp, ind) => {
                  if (comp.key === 'resubmit' || comp.key === 'resubmitEscalate') {
                    comp.isDisabled = !resubmitted || disableResubmit;
                  }
                  return <RenderComponent key={ind} metaData={comp} ind={1} />;
                })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {role !== 'Salesman' && role !== 'Super Admin' && approveBtnEnable && (
          <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                {adminButtons?.map((comp, ind) => {
                  if (comp.key === 'approve' || comp.key === 'reject' || comp.key === 'escalate') {
                    comp.isDisabled = !approveBtnEnable || disableReject;
                  }
                  return <RenderComponent key={ind} metaData={comp} ind={1} />;
                })}
              </Grid>
            </Grid>
          </Grid>
        )}

        {role === 'Super Admin' && approveBtnEnable && !showAdminButtonsGrid && (
          <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                {adminButtons?.map((comp, ind) => {
                  if (comp.key === 'approve' || comp.key === 'reject' || comp.key === 'escalate') {
                    comp.isDisabled = !approveBtnEnable || disableReject;
                  }
                  return <RenderComponent key={ind} metaData={comp} ind={1} />;
                })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {role === 'Super Admin' && (statusCode === 'DRAFTED' || !isEdit) && (
          <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                {submitButtons?.map((comp, ind) => {
                  if (comp.key === 'submit') {
                    comp.isDisabled = !submitted || disableSubmit;
                  }
                  return <RenderComponent key={ind} metaData={comp} ind={1} />;
                })}
              </Grid>
              {approveBtnEnable && (
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                  {adminButtons?.map((comp, ind) => {
                    if (comp.key === 'approve' || comp.key === 'reject' || comp.key === 'escalate') {
                      comp.isDisabled = !approveBtnEnable || disableReject;
                    }
                    return <RenderComponent key={ind} metaData={comp} ind={1} />;
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {role === 'Super Admin' &&
          (statusCode === 'REDRAFTED' || statusCode === 'APPROVED' || statusCode === 'REJECTED') && (
            <Grid item xs={12} sx={{ marginLeft: '-0.5rem' }}>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                  {resubmitButtons?.map((comp, ind) => {
                    if (comp.key === 'resubmit' || comp.key === 'resubmitEscalate') {
                      comp.isDisabled = !resubmitted || disableResubmit;
                    }
                    return <RenderComponent key={ind} metaData={comp} ind={1} />;
                  })}
                </Grid>
                {approveBtnEnable && (
                  <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
                    {adminButtons?.map((comp, ind) => {
                      if (comp.key === 'approve' || comp.key === 'reject' || comp.key === 'escalate') {
                        comp.isDisabled = !approveBtnEnable || disableReject;
                      }
                      return <RenderComponent key={ind} metaData={comp} ind={1} />;
                    })}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
      </Grid>
    </Grid>
  );
}

export default CreateUpdateCustomer;
