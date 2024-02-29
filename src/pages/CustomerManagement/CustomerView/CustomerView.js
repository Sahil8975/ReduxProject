import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Grid, Typography } from '@mui/material';
import SplitPane from 'react-split-pane';
import Filters from '../../../components/Filter/filter';
import CustomerDataTable from './CustomerDataTable';
import CustomerLocation from './CustomerLocation';
import { isArray } from '../../../utils/utils';
import { COMPONENTS, STATUS } from '../../../utils/constants';
import { NOTIFICATIONS } from '../../../utils/messages';
import {
  IS_DATA_LOADING,
  GET_SALESMEN,
  GET_LEGALENTITIES,
  GET_CUSTOMER_CLASSIFICATIONS,
  GET_CUSTOMER_GROUPS
} from '../../../redux/constants';
import {
  getCustomerGroups,
  getSalesmen,
  getLegalEntitiesByRegion,
  getCustomerClassifications,
  getFilteredCustomers,
  getLocations
} from '../CustomerServices/CustomerViewServices';
import DialogComponent from '../../../components/Dialog';
import LocationContacts from './LocationContacts';

function CustomerView() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.LoginUserDetailsReducer?.userInfo);
  const customerData = useSelector((state) => state.CustomerDataReducer);
  const { regionIds } = userDetails;
  const { legalEntities, salesmen, customerClassificactions, customerGroups } = customerData;

  // const [salesmen, setSalesmen] = useState([]);
  // const [classifications, setClassifications] = useState([]);
  // const [customerGroups, setCustomerGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState('');
  const [contactData, setContactData] = useState([]);
  const [showCustomerContact, setShowCustomerContact] = useState(false);
  const [showLocationContact, setShowLocationContact] = useState(false);
  const [activeLocation, setActiveLocation] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [customerContacts, setCustomerContacts] = useState([]);
  const [locationContacts, setLocationContacts] = useState([]);

  const [expandedCustomer, setExpandedCustomer] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [expandedLocation, setExpandedLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [expandedContact, setExpandedContact] = useState(false);
  const [activeContact, setActiveContact] = useState(null);

  const [routeData, setRouteData] = useState({});
  const [locationId, setLocationId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState(false);
  const [error, setError] = useState(false);
  const [hasRunEffect, setHasRunEffect] = useState(false);

  const { RADIO, SELECT_BOX, MULTI_SELECT_BOX, TEXT_FIELD } = COMPONENTS;

  const emptyFiltersData = {
    salesmenId: [],
    salesmanIds: [],
    legalEntityId: '',
    isApproved: null,
    accountNumber: '',
    customerName: '',
    classificationId: 'all',
    customerGroupId: 'all',
    pageIndex: 1,
    pageSize: 10
  };

  const [payload, setPayload] = useState({ ...emptyFiltersData });

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const handleActionDispatch = (type, data = []) => dispatch({ type, data });

  const [genericAlertBox, setShowGenericAlertBox] = useState({
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

  const customerType = [
    { name: 'Approved Customers', value: 'true' },
    { name: 'Pending Approval Customers', value: 'false' },
    { name: 'All Customers', value: 'null' }
  ];

  const filterComponents = [
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '1rem', marginBottom: '-0.5rem' },
      key: 'legalEntityId',
      label: 'Legal Entity',
      options: legalEntities,
      select: true,
      isRequired: true,
      isError: error && !payload?.legalEntityId,
      helperText: 'Please select legal entity',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: !isArray(legalEntities),
      columnWidth: 2.5
    },
    {
      control: MULTI_SELECT_BOX,
      key: 'salesmenId',
      label: 'Salesmen',
      options: salesmen,
      selectAll: true,
      labelStyle: { marginTop: '-0.5rem' },
      groupStyle: { marginBottom: '-0.5rem', marginLeft: '1rem', marginTop: '1rem' },
      controlStyle: { height: '2rem' },
      isRequired: true,
      isError: error && !isArray(payload?.salesmanIds),
      helperText: 'Please select salesman',
      isDisabled: !payload.legalEntityId,
      maxMultipleOptions: 1,
      columnWidth: 3.1
    },
    {
      control: RADIO,
      groupStyle: { marginLeft: '1rem', marginTop: '0.5rem', marginBottom: '-0.5rem' },
      key: 'isApproved',
      label: 'Customer Type',
      showLabel: false,
      options: customerType,
      isRequired: true,
      isError: error && !payload?.isApproved,
      helperText: 'Please select customer type',
      columnWidth: 5.5
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.5rem' },
      key: 'accountNumber',
      label: 'Account Number',
      columnWidth: 2
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginBottom: '0.5rem', marginLeft: '1rem', marginTop: '0.5rem' },
      key: 'customerName',
      label: 'Name',
      columnWidth: 2.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: '1rem', marginTop: '0.7rem' },
      key: 'classificationId',
      label: 'Classification',
      placeholder: 'Classification',
      options: customerClassificactions,
      select: true,
      isSelecteAllAllow: true,
      isEmptyOptionAllowed: false,
      isDisabled: !payload.legalEntityId,
      columnWidth: 2
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginLeft: '1rem', marginTop: '0.7rem' },
      key: 'customerGroupId',
      label: 'Group',
      placeholder: 'Group',
      options: customerGroups,
      select: true,
      isSelecteAllAllow: true,
      isEmptyOptionAllowed: false,
      isDisabled: !payload.legalEntityId,
      columnWidth: 2
    }
  ];

  const getSalesmensDdl = async (legalEntityId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSalesmen(legalEntityId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      // setSalesmen(res?.data);
      handleActionDispatch(GET_SALESMEN, res?.data || []);
      const defaultSalesman = (isArray(res.data) && res.data.filter((item) => item.isSelected === true)) || [];
      if (isArray(defaultSalesman)) {
        updatePayload({ salesmenId: defaultSalesman, salesmanIds: defaultSalesman.map((itm) => itm.id) });
      }
    }
  };

  const getLegalEntitiesDdl = async (regionIds) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getLegalEntitiesByRegion(regionIds);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      handleActionDispatch(GET_LEGALENTITIES, res?.data || []);
    }
  };

  const getClassifications = async (legalEntityId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomerClassifications(legalEntityId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      // setClassifications(res.data);
      handleActionDispatch(GET_CUSTOMER_CLASSIFICATIONS, res?.data || []);
    }
  };

  const getCustomerGroupDdl = async (legalEntityId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomerGroups(legalEntityId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      // setCustomerGroups(res.data);
      handleActionDispatch(GET_CUSTOMER_GROUPS, res?.data || []);
    }
  };

  const getCustomerLocations = async (customerId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getLocations(customerId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      setLocationData(res.data.locations);
      if (isArray(res.data.customerContacts)) {
        setCustomerContacts(res.data.customerContacts);
      } else {
        setCustomerContacts([]);
      }
    }
  };

  const getCustomersData = async (payloadData, isGetRecords) => {
    // localStorage.setItem('filterPayload', JSON.stringify({ ...payload }));
    const {
      salesmanIds,
      legalEntityId,
      accountNumber,
      customerName,
      classificationId,
      customerGroupId,
      isApproved,
      pageIndex,
      pageSize
    } = payloadData;
    localStorage.setItem('filterPayload', JSON.stringify({ ...payloadData }));
    if (!isArray(salesmanIds) || !legalEntityId) {
      setError(true);
    } else {
      let approval = null;
      if (isApproved === 'true') {
        approval = true;
      } else if (isApproved === 'false') {
        approval = false;
      }

      const data = isGetRecords
        ? payloadData
        : {
            salesmanIds,
            legalEntityId,
            accountNumber,
            customerName,
            classificationId,
            customerGroupId,
            isApproved: approval,
            pageIndex,
            pageSize
          };

      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await getFilteredCustomers(data);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (!res.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: res.error || (isArray(res.errors) && res.errors[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok'
        });
      } else if (res.isSuccessful) {
        setCustomersData(res.data?.customers);
        setTotalRecords(res.data?.totalRecords);
      }
    }
  };

  const getRecords = (isNext, data) => {
    if (!isNext) {
      getCustomersData(data, true);
      setPayload({ ...payload, pageIndex: payload.pageIndex - 1 });
    } else {
      getCustomersData(data, true);
      setPayload({ ...payload, pageIndex: payload.pageIndex + 1 });
    }
  };

  const clearSelections = () => {
    setExpandedCustomer(false);
    setCurrentCustomer(null);
    setExpandedLocation(false);
    setCurrentLocation(null);
    setExpandedContact(false);
    setActiveContact(null);
    setShowCustomerContact(false);
    setShowLocationContact(false);
  };

  const clearStates = () => {
    clearSelections();
    setCustomersData([]);
    setLocationData([]);
    setCustomerContacts([]);
    setLocationContacts([]);
    setContactData([]);
  };

  const getFilterData = (data, callApi) => {
    if (callApi) {
      clearStates();
      getCustomersData(payload, false);
    } else {
      localStorage.removeItem('filterPayload');
      clearStates();
      setTotalRecords('');
      updatePayload({ isApproved: 'null' });
      if (legalEntities.length === 1) {
        const defaultSalesman = (isArray(salesmen) && salesmen.filter((item) => item.isSelected === true)) || [];
        updatePayload({
          legalEntityId: legalEntities[0].id,
          salesmenId: defaultSalesman,
          salesmanIds: defaultSalesman.map((itm) => itm.id)
        });
        const clearPayload = {
          legalEntityId: legalEntities[0].id,
          salesmanIds: defaultSalesman.map((itm) => itm.id),
          salesmenId: defaultSalesman,
          isApproved: null,
          accountNumber: '',
          customerName: '',
          classificationId: 'all',
          customerGroupId: 'all',
          pageIndex: 1,
          pageSize: 10
        };
        getCustomersData(clearPayload, false); // On clear default filter data will get call
      } else {
        handleActionDispatch(GET_SALESMEN, []);
      }
    }
  };

  const removeDuplicates = (arr) => {
    const idCount = arr.reduce((acc, curr) => {
      acc[curr.id] = (acc[curr.id] || 0) + 1;
      return acc;
    }, {});

    return arr.filter((item) => idCount[item.id] === 1);
  };

  const getFilterDataPayloadChange = (key, val) => {
    updatePayload({ pageIndex: 1 });
    if (key === 'salesmenId') {
      if (val.includes('selectAll') || val.includes('deselectAll')) {
        const tempObj = (isArray(val) && val.includes('selectAll') && salesmen) || (val.includes('deselectAll') && []);
        const tempIds =
          (isArray(val) && val.includes('selectAll') && salesmen.map((itm) => itm.id)) ||
          (val.includes('deselectAll') && []);
        updatePayload({ salesmenId: tempObj, salesmanIds: tempIds });
      } else {
        // if salesmen id exist twice then remove it from val array
        const uniqueArray = removeDuplicates(val);
        updatePayload({ salesmenId: uniqueArray, salesmanIds: uniqueArray.map((itm) => itm.id) });
      }
    } else if (key === 'legalEntityId') {
      updatePayload({
        legalEntityId: val,
        salesmenId: [],
        salesmanIds: [],
        classificationId: 'all',
        customerGroupId: 'all'
      });
      // setSalesmen([]);
      handleActionDispatch(GET_SALESMEN, []);
      getCustomerGroupDdl(val);
      getClassifications(val);
      getSalesmensDdl(val);
    } else if (key === 'isApproved') {
      updatePayload({ [key]: val });
      if (payload.salesmanIds && payload.legalEntityId) {
        getCustomersData({ ...payload, isApproved: val }, false);
      }
    } else {
      updatePayload({ [key]: val });
    }
  };

  const deleteMltSlctOptn = (key, val) => {
    if (key === 'salesmenId' && val && isArray(payload.salesmenId)) {
      const selectedSalesman = payload.salesmenId.filter((slmn) => slmn.id !== val * 1);
      const selectedSalesmanIds = (isArray(selectedSalesman) && selectedSalesman.map((slmn) => slmn.id)) || [];
      setPayload({
        ...payload,
        salesmenId: selectedSalesman,
        salesmanIds: selectedSalesmanIds
      });
    }
  };

  let isBack = false;
  useEffect(() => {
    const filterPayload = JSON.parse(localStorage.getItem('filterPayload'));
    let approval = null;
    if (filterPayload) {
      isBack = true;
      if (filterPayload.isApproved === 'true') {
        approval = true;
      } else if (filterPayload.isApproved === 'false') {
        approval = false;
      }
      const {
        accountNumber,
        classificationId,
        customerGroupId,
        customerName,
        legalEntityId,
        pageIndex,
        pageSize,
        salesmanIds,
        salesmenId
      } = filterPayload;
      const payloadData = {
        accountNumber,
        classificationId,
        customerGroupId,
        customerName,
        isApproved: approval,
        legalEntityId,
        pageIndex,
        pageSize,
        salesmanIds,
        salesmenId
      };
      updatePayload({ ...payloadData });
      getCustomersData(payloadData, false);
    }
    localStorage.removeItem('filterPayload');
  }, []);

  useEffect(() => {
    updatePayload({ isApproved: 'null' });
    if (!isArray(legalEntities) && isArray(regionIds)) {
      getLegalEntitiesDdl(regionIds);
    }
  }, []);

  useEffect(() => {
    if (!isBack && legalEntities.length === 1) {
      updatePayload({ legalEntityId: legalEntities[0].id });
      getCustomerGroupDdl(legalEntities[0].id);
      getClassifications(legalEntities[0].id);
      getSalesmensDdl(legalEntities[0].id);
    }
  }, [legalEntities]);

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
  };

  useEffect(() => {
    if (showCustomerContact) {
      setContactData(customerContacts);
    } else {
      setContactData(locationContacts);
    }
  }, [showCustomerContact, customerContacts, locationContacts]);

  useEffect(() => {
    if (payload.legalEntityId && isArray(payload.salesmanIds) && !hasRunEffect) {
      getCustomersData(payload, false);
      setHasRunEffect(true);
    }
  }, [payload.legalEntityId, payload.salesmenId, hasRunEffect]);

  return (
    <Grid sx={{ padding: '10px 20px', width: '100%' }}>
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
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ marginTop: '0rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight="bold" variant="subtitle1" align="center" sx={{ fontFamily: 'Montserrat ' }}>
                Customer View
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ backgroundColor: 'rgb(227 232 234)' }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Filters
          components={filterComponents}
          getFilterData={getFilterData}
          getFilterDataPayloadChange={getFilterDataPayloadChange}
          payload={payload}
          setPayload={setPayload}
          emptyFilters={emptyFiltersData}
          deleteMltSlctOptn={deleteMltSlctOptn}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <CustomerDataTable
            customersData={customersData}
            getCustomerLocations={getCustomerLocations}
            getRecords={getRecords}
            payload={payload}
            setPayload={setPayload}
            totalRecords={totalRecords}
            setShowCustomerContact={setShowCustomerContact}
            setCustomerContacts={setCustomerContacts}
            expandedCustomer={expandedCustomer}
            setExpandedCustomer={setExpandedCustomer}
            currentCustomer={currentCustomer}
            setCurrentCustomer={setCurrentCustomer}
            setShowLocationContact={setShowLocationContact}
            setExpandedLocation={setExpandedLocation}
            setCurrentLocation={setCurrentLocation}
            setActiveContact={setActiveContact}
            setExpandedContact={setExpandedContact}
            setRouteData={setRouteData}
            setCustomerId={setCustomerId}
            setPrimaryLocation={setPrimaryLocation}
            setLocationId={setLocationId}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomerLocation
            locationData={locationData}
            customerContacts={customerContacts}
            setActiveLocation={setActiveLocation}
            activeLocation={activeLocation}
            setShowCustomerContact={setShowCustomerContact}
            expandedLocation={expandedLocation}
            setExpandedLocation={setExpandedLocation}
            currentLocation={currentLocation}
            setCustomerContacts={setCustomerContacts}
            setLocationContacts={setLocationContacts}
            setCurrentLocation={setCurrentLocation}
            showCustomerContact={showCustomerContact}
            setShowLocationContact={setShowLocationContact}
            showLocationContact={showLocationContact}
            routeData={routeData}
            setLocationId={setLocationId}
            customerId={customerId}
            setPrimaryLocation={setPrimaryLocation}
          />
        </Grid>
        <Grid item xs={3}>
          <LocationContacts
            contactData={contactData}
            showCustomerContact={showCustomerContact}
            expandedContact={expandedContact}
            setExpandedContact={setExpandedContact}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            showLocationContact={showLocationContact}
            locationId={locationId}
            customerId={customerId}
            primaryLocation={primaryLocation}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomerView;
