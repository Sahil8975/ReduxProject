import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid, Typography, Container, Tabs, Tab, Box, Button, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IS_DATA_LOADING } from '../../redux/constants';
import MapView from './MapView';
import ServiceDetailsView from './ServiceDetailsView';
import Filters from '../../components/Filter/filter';
import DialogComponent from '../../components/Dialog';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, DATE_FORMAT, STATUS } from '../../utils/constants';
import { getFormattedDate, getPrevDay, getNextDay, isObject } from '../../utils/utils';
import { APIS, API_V1 } from '../../utils/apiList';
import { getServicemensDdl } from '../../services/masterDataService';
import { getScheduleMapViews } from '../../services/scheduleService';
import { getPreferredTimeList } from '../../services/projectService';
import { ROUTES } from '../../routes/paths';
import { NOTIFICATIONS } from '../../utils/messages';

import './ServiceOrderDetails.scss';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.object,
  value: PropTypes.string,
  index: PropTypes.string
};

function userListTabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function ServiceOrderDetails() {
  const { state } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { GET_SERVICEMAN_DDL, GET_SCHEDULE_MAPVIEW_ORDERS, PREFERRED_TIMES } = APIS;
  const masterData = useSelector((state) => state.MasterDataReducer);
  const [tabValue, setTabValue] = useState(0);
  const [scheduleOrdersData, setScheduleOrdersData] = useState({});
  const [servicemanVisitMarkers, setServicemanVisitMarkers] = useState([]);
  const [siteMarkers, setSiteMarkers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [projectStatusList, setProjectStatus] = useState([]);
  const [servicemanList, setServicemanList] = useState([]);
  const [preferredTimings, setPreferredTimings] = useState([]);
  const [servicemanData, setServicemanData] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [chData, setData] = useState('');
  const [selRegionId, setSelRegionId] = useState(0);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [startDate, setStartDate] = useState(new Date());
  const [cardFlag, setCardFlag] = useState(false);
  const [orderGroupBy, setOrderGroupBy] = useState('Group by Serviceman');

  const { SELECT_BOX, TEXT_FIELD, MULTI_SELECT_BOX, CHECKBOX, BUTTON } = COMPONENTS;
  const emptyFilters = {
    countryId: 'all',
    regionId: 'all',
    businessTypeId: 'all',
    ContractNameOrNumber: '',
    projectStatus: 'all',
    serviceOrderStatusId: 'all',
    preferredTimingId: 'all',
    lastProjectService: false,
    customerName: null,
    location: '',
    servicemen: []
  };
  const [payload, setPayload] = useState({});

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'countryId',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      isDisabled: true,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'regionId',
      label: 'serviceDashboard.region',
      placeholder: 'serviceDashboard.region',
      options: regions,
      isDisabled: true,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem', marginBottom: '0.3rem' },
      key: 'businessTypeId',
      label: 'serviceDashboard.business',
      placeholder: 'serviceDashboard.business',
      options: masterData?.businessType,
      isDisabled: true,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'ContractNameOrNumber',
      label: 'serviceDashboard.contractNameOrNumber',
      placeholder: 'serviceDashboard.contractNameOrNumber',
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectStatus',
      label: 'CreateProject.ProjectStatus',
      placeholder: 'CreateProject.ProjectStatus',
      options: projectStatusList,
      isDisabled: true,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceOrderStatusId',
      label: 'serviceDashboard.serviceStatus',
      placeholder: 'serviceDashboard.serviceStatus',
      options: masterData?.serviceOrderStatus,
      isDisabled: true,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerName',
      label: 'serviceDashboard.customerName',
      isDisabled: true,
      placeholder: 'serviceDashboard.customerName'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '2rem', marginRight: '0.5rem' },
      key: 'location',
      label: 'serviceDashboard.location',
      isDisabled: true,
      placeholder: 'serviceDashboard.location'
    },
    {
      control: MULTI_SELECT_BOX,
      key: 'servicemen',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: servicemanList,
      columnWidth: 3.2,
      maxMultipleOptions: 1,
      labelStyle: { marginTop: '-0.5rem' },
      isDisabled: true,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      controlStyle: { height: '2rem' }
    },
    {
      control: SELECT_BOX,
      key: 'preferredTimingId',
      label: 'Preferred Timing',
      placeholder: 'Preferred Timing',
      options: preferredTimings,
      groupStyle: { marginBottom: '0.5rem' },
      columnWidth: 1.6,
      isDisabled: true,
      select: true
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'lastProjectService',
      label: 'serviceDashboard.lastProjectService',
      placeholder: 'serviceDashboard.lastProjectService',
      isDisabled: true,
      columnWidth: 2
    }
  ];

  const passData = (data) => {
    setData(data);
  };
  const getErrorMessage = (res, errorMsg = '') => {
    if (isArray(res.errors)) {
      return res.errors[0] || errorMsg;
    }
    return NOTIFICATIONS.SOMETHING_WENT_WRONG;
  };

  const confirmationBox = (content = '', titleType = '', title = '') => {
    setShowAlertBox({
      open: true,
      titleType,
      title,
      content
    });
  };
  const handleCallback = (childD) => {
    setCardFlag(childD);
  };
  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const getServicemanIds = (filterData) => filterData?.servicemen?.map((e) => e.id);

  const getScheduleOrders = async (filterData = payload, startDate, groupBy = orderGroupBy) => {
    setStartDate(startDate);
    const payLoadData = {
      countryId: filterData?.countryId || 'all',
      regionId: filterData?.regionId || 'all',
      businessTypeId: filterData?.businessTypeId || 'all',
      contractSearchKey: filterData?.ContractNameOrNumber || '',
      projectStatusId: filterData?.projectStatus || 'all',
      serviceOrderStatusId: filterData?.serviceOrderStatusId || 'all',
      preferredTimingId: filterData?.preferredTimingId || 'all',
      customerName: filterData?.customerName || '',
      location: filterData?.location || '',
      servicemen: getServicemanIds(filterData) || [],
      isLastService: filterData?.lastProjectService || false,
      startDate,
      endDate: startDate,
      groupBy: groupBy === 'Group by Serviceman' ? 'servicemen' : 'customers'
    };
    const res = await getScheduleMapViews(`${API_V1}/${GET_SCHEDULE_MAPVIEW_ORDERS}`, payLoadData);
    if (res?.isSuccessful && res?.data?.schedule && isArray(res?.data?.schedule)) {
      setScheduleOrdersData(res.data.schedule);
      setServicemanData(res.data?.servicemen);
      setcustomerData(res.data?.customers);
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, t('dialog.error'));
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const getServiceManData = async () => {
    const res = await getServicemensDdl(`${API_V1}/${GET_SERVICEMAN_DDL}?regionId=${payload.regionId}`);
    if (res?.data && isArray(res?.data)) {
      setServicemanList(res?.data);
    } else {
      setServicemanList([]);
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

  const getFilterRegions = (val) => {
    const filteredRegions = masterData?.regions?.filter((rgn) => rgn.countryId === val * 1) || [];
    return filteredRegions;
  };

  const setCountryAndRegions = (val, region = 0) => {
    if (val) {
      const filteredRegions = getFilterRegions(val);
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

  useEffect(() => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const siteDetails = [];
    const { filterPayload, scheduleDate } = state;
    const filteredRegions = getFilterRegions(filterPayload?.countryId);
    const startDate = getFormattedDate(DATE_FORMAT.DATE_YEAR_FORMAT, scheduleDate);
    setRegions(filteredRegions);
    setTabValue(state?.tabValue || 0);
    setProjectStatus(filterPayload?.projectStatusList);
    setPayload({ ...filterPayload, scheduleDate });
    if (isArray(scheduleOrdersData)) {
      scheduleOrdersData.forEach((sch) => {
        if (isArray(sch?.cards)) {
          sch?.cards?.forEach((el) => {
            if (el.latitude && el.longitude) {
              const position = {
                id: el?.id,
                position: { lat: Number(el?.latitude), lng: Number(el?.longitude) },
                color: el?.cardColor,
                location: `${el.customerName}, ${el?.locationName}`
              };
              siteDetails.push(position);
            }
          });
        }
      });
    }
    setSiteMarkers(siteDetails);
    getScheduleOrders(filterPayload, startDate);
  }, []);

  const mapPinData = (customerResult, servicemenResult) => {
    const siteDetails = [];
    const siteServicemanVisit = [];
    if (isArray(customerResult)) {
      customerResult.forEach((el) => {
        if (el.latitude && el.longitude) {
          const position = {
            id: el?.id,
            position: { lat: Number(el?.latitude), lng: Number(el?.longitude) },
            color: el?.cardColor,
            location: `${el.customerName}, ${el?.locationName}`
          };
          siteDetails.push(position);
        }
      });
      setSiteMarkers(siteDetails);
    }

    if (isArray(servicemenResult)) {
      servicemenResult.forEach((el) => {
        if (el.latitude && el.longitude) {
          const position = {
            id: el?.id,
            position: { lat: Number(el?.latitude), lng: Number(el?.longitude) },
            color: el?.cardColor,
            location: `${el.servicemanName}, ${el.customerName}, ${el?.locationName}`
          };
          siteServicemanVisit.push(position);
        }
      });
      setServicemanVisitMarkers(siteServicemanVisit);
    }
  };

  useEffect(() => {
    if (chData) {
      if (isArray(scheduleOrdersData)) {
        const cardArray = scheduleOrdersData.flatMap((lane) => lane.cards.map((card) => card));

        // Generate servicemenResult if servicemanId is present in chData
        let servicemenResult = [];
        if (chData.servicemanId.length > 0) {
          servicemenResult = cardArray.filter((card) => chData.servicemanIds.includes(card.servicemanId));
          mapPinData([], servicemenResult);
        }

        // Generate customerResult if customerId is present in chData
        let customerResult = [];
        if (chData.customerId.length > 0) {
          customerResult = cardArray.filter((card) => chData.customerIds.includes(card.customerId));
          mapPinData(customerResult, []);
        }

        // Generate customerResult for customerId with servicemanId present in chData
        if (chData.servicemanId.length > 0 && chData.customerId.length > 0) {
          const validCustomerIds = servicemenResult.map((card) => card.customerId);
          customerResult = customerResult.filter((card) => validCustomerIds.includes(card.customerId));
          mapPinData(customerResult, []);
        }
      }
    }
  }, [chData]);

  useEffect(() => {
    if (selRegionId) {
      getServiceManData();
    }
  }, [selRegionId]);

  useEffect(() => {
    getPrefrredTimes();
  }, []);

  const handleChangeTab = (event, newValue) => setTabValue(newValue);

  const getFilterData = (data, callApi) => {
    if (callApi) {
      console.log('Filtered data: ', data);
    }
  };

  const getFilterDataPayloadChange = (key, val) => {
    if (key === 'regionId') {
      setSelRegionId(val);
    }
    if (key === 'countryId') {
      const region = setCountryAndRegions(val);
      setPayload({ ...payload, [key]: val, regionId: region || 'all' });
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };
  const navigateToScheduleViewer = () => {
    navigate(ROUTES?.SCHEDULEVIEWER, { state: { payload } });
  };

  const handlePrevDay = () => {
    setCardFlag(true);
    dispatch({ type: IS_DATA_LOADING, data: true });
    const d = getFormattedDate(DATE_FORMAT?.DATE_YEAR_FORMAT, getPrevDay(startDate));
    getScheduleOrders(payload, d, orderGroupBy);
  };
  const handleNextDay = () => {
    setCardFlag(true);
    dispatch({ type: IS_DATA_LOADING, data: true });
    const d = getFormattedDate(DATE_FORMAT?.DATE_YEAR_FORMAT, getNextDay(startDate));
    getScheduleOrders(payload, d, orderGroupBy);
  };
  return (
    <Grid className="service-order-list-cls">
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
      <Grid container spacing={3} xs={12}>
        <Grid item xs={7} sx={{ marginLeft: '-1rem' }}>
          <Typography fontWeight="bold" variant="subtitle1" display="flex" justifyContent="end">
            Service Details
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <></>
        </Grid>
      </Grid>

      {/* Grid Container for main form fields and components */}
      <Grid container spacing={3} mt={1}>
        <Grid container xs={12}>
          {/* Grid for Date Changed */}
          <Grid item xs={7} display="flex" justifyContent="end">
            <span>
              <Tooltip title={t(`serviceDashboard.backByDay`)}>
                <ArrowBackIosIcon onClick={handlePrevDay} className="service-arr-icn" />
              </Tooltip>
              <Typography className="schedule-date" variant="body1">
                {getFormattedDate(DATE_FORMAT.DATE_NAME_FORMAT, startDate)}
              </Typography>
              <Tooltip title={t(`serviceDashboard.nextByDay`)}>
                <ArrowForwardIosIcon onClick={handleNextDay} className="next-by-day service-arr-icn" />
              </Tooltip>
            </span>
          </Grid>
          <Grid item xs={5} display="flex" className="back-to-view-container">
            <RenderComponent
              metaData={{
                control: BUTTON,
                color: 'success',
                size: 'medium',
                columnWidth: 3,
                handleClickButton: () => navigateToScheduleViewer(),
                btnTitle: 'Back to Viewer'
              }}
            />
          </Grid>
        </Grid>
        {/* Grid for Filter Component */}
        {/* <Grid item xs={12} mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Filters
                components={FILTER_COMPONETS}
                apiUrl="dummyUrl"
                getFilterData={getFilterData}
                getFilterDataPayloadChange={getFilterDataPayloadChange}
                payload={payload}
                setPayload={setPayload}
                emptyFilters={emptyFilters}
                isDisabled
              />
            </Grid>
          </Grid>
        </Grid> */}

        {/* Grid for Tabs */}
        <Grid item xs={12} mt={3} className="schedule-order-tab-panel">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="User Management"
            style={{ paddingInline: '0.6rem' }}
          >
            <Tab style={{ fontWeight: '800' }} disableRipple label="Map View" {...userListTabProps(0)} />
            <Tab
              style={{ fontWeight: '800' }}
              disableRipple
              label="Service Details View"
              {...userListTabProps()}
              className="tab-panel-label"
            />
          </Tabs>
        </Grid>
        {/* Tab Grid for Map View */}
        <TabPanel style={{ width: '100%' }} value={tabValue} index={0}>
          {/* Map View Component */}
          <MapView
            payloadData={passData}
            servicemanVisitMarkers={servicemanVisitMarkers}
            siteMarkers={siteMarkers}
            servicemanData={servicemanData}
            customerData={customerData}
          />
        </TabPanel>
        <TabPanel style={{ width: '100%' }} value={tabValue} index={1}>
          {/* Service Details View Component */}
          <ServiceDetailsView
            data={scheduleOrdersData}
            passCardFlag={cardFlag}
            cardFlagCallback={handleCallback}
            startDate={startDate}
            groupBy={orderGroupBy}
            ordersGroupByHandle={(val) => {
              dispatch({ type: IS_DATA_LOADING, data: true });
              setOrderGroupBy(val);
              getScheduleOrders(payload, startDate, val);
            }}
          />
        </TabPanel>
      </Grid>
    </Grid>
  );
}

export default ServiceOrderDetails;
