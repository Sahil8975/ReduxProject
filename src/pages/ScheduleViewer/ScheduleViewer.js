import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Button, Popover, Tooltip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import RenderComponent from '../../components/RenderComponent';
import { IS_DATA_LOADING } from '../../redux/constants';

import ServiceBoard from '../../components/ServiceBoard/ServiceBoard';
import ServiceMens from '../../components/ServiceBoard/ServiceMens';
import ServiceTypes from '../../components/ServiceBoard/ServiceTypes';
import Filters from '../../components/Filter/filter';
import DialogComponent from '../../components/Dialog';

import { APIS, API_V1 } from '../../utils/apiList';
import { NOTIFICATIONS } from '../../utils/messages';

import { serviceDataEn, serviceDataAr, laneStyle, sortByOptions } from '../../components/ServiceBoard/data';

import { getScheduleOrdersList } from '../../services/scheduleService';
import { getServicemensDdl } from '../../services/masterDataService';
import { getProjectStatusList, getPreferredTimeList } from '../../services/projectService';

import { MAX_LANES, LANGUAGE_CODES, COMPONENTS, DATE_FORMAT, STATUS } from '../../utils/constants';
import {
  getFormattedDate,
  getStartOfWeek,
  getEndOfWeek,
  getPrevWeekDate,
  getNextWeekDate,
  getPrevMonthDate,
  getNextMonthDate,
  isSameDate,
  isObject,
  isArray
} from '../../utils/utils';
import useSettings from '../../hooks/useSettings';
import { ROUTES } from '../../routes/paths';
import '../../components/ServiceBoard/ServiceBoard.css';

const ScheduleViewer = () => {
  const { SERVICEORDERDETAILS } = ROUTES;
  const { t } = useTranslation();
  const { lang } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { GET_SCHEDULE_ORDERS, GET_SERVICEMAN_DDL, PROJECT_STATUSES, PREFERRED_TIMES } = APIS;

  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();

  const [serviceData, setServiceData] = useState(serviceDataEn);
  const serviceDataLen = serviceData.length;
  const [isError, setIsError] = useState(false);
  const [serviceOrderData, setServiceOrderData] = useState([]);
  const [servicemenAnchorEl, setServicemenAnchorEl] = useState(null);
  const [serviceTypeAnchorEl, setServiceTypeAnchorEl] = useState(null);
  const [cardDialog, setCardDialog] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selRegionId, setSelRegionId] = useState(0);
  const [servicemanList, setServicemanList] = useState([]);
  const [preferredTimings, setPreferredTimings] = useState([]);
  const [todaysData, setTodaysData] = useState({});
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [projectStatusList, setProjectStatusList] = useState([]);
  const [country, setCountry] = useState(0);
  const [region, setRegion] = useState(0);
  const { TEXT_FIELD, SELECT_BOX, CHECKBOX, MULTI_SELECT_BOX, BUTTON } = COMPONENTS;
  const emptyFiltersData = {
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
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);
  const [sortPayload, setSortPayload] = useState({
    sortBy: '1'
  });

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'countryId',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      isDisabled: masterData?.country?.length === 1,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'regionId',
      label: 'serviceDashboard.region',
      placeholder: 'serviceDashboard.region',
      options: regions,
      isDisabled: !payload?.countryId || regions?.length === 1,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem', marginBottom: '0.3rem' },
      key: 'businessTypeId',
      label: 'serviceDashboard.business',
      placeholder: 'serviceDashboard.business',
      options: masterData?.businessType,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'ContractNameOrNumber',
      label: 'serviceDashboard.contractNameOrNumber'
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectStatus',
      label: 'CreateProject.ProjectStatus',
      placeholder: 'CreateProject.ProjectStatus',
      options: projectStatusList,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceOrderStatusId',
      label: 'serviceDashboard.serviceStatus',
      placeholder: 'serviceDashboard.serviceStatus',
      options: masterData?.serviceOrderStatus,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerName',
      label: 'serviceDashboard.customerName'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '2rem', marginRight: '0.5rem' },
      key: 'location',
      label: 'serviceDashboard.location'
    },
    {
      control: MULTI_SELECT_BOX,
      key: 'servicemen',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: servicemanList,
      columnWidth: 3.1,
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      maxMultipleOptions: 1,
      isError: isError && payload.servicemen.length > 10,
      helperText: isError && payload.servicemen.length > 10 && 'Max 10 allowed',
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' }
    },
    {
      control: SELECT_BOX,
      key: 'preferredTimingId',
      label: 'Preferred Timing',
      placeholder: 'Preferred Timing',
      options: preferredTimings,
      groupStyle: { marginBottom: '0.5rem', marginLeft: '0.6rem' },
      columnWidth: 1.5,
      select: true
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '1rem', marginRight: '-2rem', marginTop: '-0.3rem' },
      key: 'lastProjectService',
      label: 'serviceDashboard.lastProjectService',
      placeholder: 'serviceDashboard.lastProjectService',
      columnWidth: 1.8
    }
  ];

  const sortByData = {
    control: SELECT_BOX,
    groupStyle: { marginTop: '1.5rem', marginBottom: '1rem' },
    key: 'sortBy',
    label: 'serviceDashboard.sortBy',
    placeholder: 'serviceDashboard.sortBy',
    options: sortByOptions,
    columnWidth: 6,
    select: true,
    isSelecteAllAllow: false,
    isEmptyOptionAllowed: true
  };

  const checkValidUpdateForStart = (value) => {
    switch (true) {
      case value < 0:
        return 0;
      case value > serviceDataLen - MAX_LANES:
        return serviceDataLen - MAX_LANES;
      default:
        return value;
    }
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

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const getPrefrredTimes = async () => {
    const prefrredTimes = await getPreferredTimeList(`${API_V1}/${PREFERRED_TIMES}`);
    if (!prefrredTimes?.isSuccessful) {
      getPrefrredTimes();
    } else if (isObject(prefrredTimes) && prefrredTimes.data) {
      setPreferredTimings(prefrredTimes.data);
    }
  };

  const getServiceManData = async () => {
    const res = await getServicemensDdl(`${API_V1}/${GET_SERVICEMAN_DDL}?regionId=${payload.regionId}`);
    if (res?.data && isArray(res?.data)) {
      setServicemanList(res?.data);
    } else {
      setServicemanList([]);
    }
  };

  const handleChangeData = (key, val) => {
    if (key === 'sortBy') {
      setSortPayload({ sortBy: val });
      const { startDate, endDate, countryId, regionId } = payload;
      dispatch({ type: IS_DATA_LOADING, data: true });
      getScheduleOrders(payload, startDate, endDate, countryId, regionId, false, val);
    }
  };

  const handleServicemenClick = (e) => {
    setServicemenAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const setEmptyFilterData = (startDate, endDate) => {
    setEmptyFilter({ ...emptyFilters, startDate, endDate });
  };

  const handleServicemenClose = () => setServicemenAnchorEl(null);

  const servicemenOpen = Boolean(servicemenAnchorEl);

  const handleServiceTypeClick = (e) => {
    setServiceTypeAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleServiceTypeClose = () => setServiceTypeAnchorEl(null);

  const serviceTypeOpen = Boolean(serviceTypeAnchorEl);

  const getStartAndLastWeek = (currentDate) => {
    const startDate = getStartOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT, currentDate);
    const endDate = getEndOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT, currentDate);
    setPayload({
      ...payload,
      startDate,
      endDate
    });
    setEmptyFilterData(startDate, endDate);
    dispatch({ type: IS_DATA_LOADING, data: true });
    getScheduleOrders(payload, startDate, endDate);
  };

  const handleNextMonth = () => {
    getStartAndLastWeek(getNextMonthDate(payload.startDate));
  };

  const handlePrevMonth = () => {
    getStartAndLastWeek(getPrevMonthDate(payload.startDate));
  };

  const handleNextWeek = () => {
    getStartAndLastWeek(getNextWeekDate(payload.startDate));
  };

  const handlePrevWeek = () => {
    getStartAndLastWeek(getPrevWeekDate(payload.startDate));
  };

  const handleCardDialogOpen = () => setCardDialog(true);

  const getFilterData = (data, callApi) => {
    if (payload.servicemen.length > 10) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch({ type: IS_DATA_LOADING, data: true });
      if (callApi) {
        getScheduleOrders(payload, payload?.startDate, payload?.endDate);
      } else {
        getScheduleOrders(
          emptyFilters,
          emptyFilters?.startDate,
          emptyFilters?.endDate,
          emptyFilters?.countryId,
          emptyFilters?.regionId
        );
        if (masterData?.country?.length !== 1) {
          setRegions([]);
        }
      }
    }
  };

  const deleteMltSlctOptn = (key, val) => {
    if (key === 'servicemen' && val && isArray(payload.servicemen)) {
      const selectedServiceman = payload.servicemen.filter((srvcmn) => srvcmn.id !== val * 1);
      setPayload({
        ...payload,
        servicemen: selectedServiceman
      });
    }
  };

  const setCountryAndRegions = (val, region = 0) => {
    if (val) {
      const filteredRegions = masterData?.regions?.filter((rgn) => rgn.countryId === val * 1) || [];
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

  useEffect(() => {
    setServiceData(lang === LANGUAGE_CODES.AR ? serviceDataAr : serviceDataEn);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(
      'filterPayload',
      JSON.stringify({ ...payload, projectStatusList, regions, sortBy: sortPayload?.sortBy })
    );
  }, [payload]);

  const formatScheduleOrderdata = (orderData, isCurrentWeek = false) => {
    const data = orderData.map((e) => {
      if (isArray(e.cards)) {
        e.cards.map((cr) => (cr.callGetScheduleOrders = callGetScheduleOrders));
      }
      return { ...e, style: laneStyle, callGetScheduleOrders };
    });
    if (isCurrentWeek) {
      const serviceData = data.filter((el) => isSameDate(el.scheduleDate))[0] || {};
      setTodaysData(serviceData);
    }
    setServiceOrderData(data);
  };

  const getServicemanIds = (filterData) => filterData?.servicemen?.map((e) => e.id);

  const getScheduleOrders = async (
    filterData = payload,
    startDate,
    endDate,
    countryId = payload?.countryId,
    regionId = payload?.regionId,
    isCurrentWeek = false,
    sortOrder = '1'
  ) => {
    const payLoadData = {
      countryId: countryId || 'all',
      regionId: regionId || 'all',
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
      endDate,
      sortBy: sortOrder === '1' ? 'servicemen' : 'customers'
    };
    const res = await getScheduleOrdersList(`${API_V1}/${GET_SCHEDULE_ORDERS}`, payLoadData);
    if (res?.data && isArray(res?.data)) {
      formatScheduleOrderdata(res.data, isCurrentWeek);
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, t('dialog.error'));
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const handleCardClick = (cardId, cardDetails, laneId) => {
    console.log('CardClick');
  };

  const getProjectStatus = async (status = false) => {
    const res = await getProjectStatusList(`${API_V1}/${PROJECT_STATUSES}?isExcludeInActives=${status}`);
    const notToInclude = ['Created', 'PendingAXSync', 'Discrete', 'Financially Closed'];
    if (res.isSuccessful) {
      if (isArray(res.data)) {
        const statusList = res?.data.filter((itm) => !notToInclude.includes(itm.name));
        setProjectStatusList(statusList);
      }
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, t('dialog.error'));
    }
  };

  useEffect(() => {
    if (state?.payload) {
      const { payload: orderDetailPayload } = state;
      setEmptyFilter({
        ...emptyFilters,
        countryId: orderDetailPayload.countryId,
        regionId: orderDetailPayload.regionId
      });
    }
  }, [country, region]);

  useEffect(() => {}, [state?.payload]);

  useEffect(() => {
    let regionId = 0;
    let countryId = 0;
    let isGetScheduleOrders = false;
    if (masterData?.country?.length === 1) {
      countryId = masterData?.country[0]?.id.toString();
      regionId = setCountryAndRegions(countryId);
      setCountry(countryId);
      setRegion(regionId);
    }
    if (state?.payload) {
      const { payload: orderDetailPayload } = state;
      setRegions(orderDetailPayload.regions);
      setProjectStatusList(orderDetailPayload?.projectStatusList);
      setPayload(orderDetailPayload);
      setEmptyFilterData(orderDetailPayload?.startDate, orderDetailPayload?.endDate);
      setSortPayload({ sortBy: orderDetailPayload?.sortBy });
      getScheduleOrders(
        orderDetailPayload,
        orderDetailPayload?.startDate,
        orderDetailPayload?.endDate,
        orderDetailPayload?.countryId,
        orderDetailPayload?.regionId,
        false,
        orderDetailPayload?.sortBy
      );
    } else {
      let startDate = getStartOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT);
      let endDate = getEndOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT);
      const filterPayload = JSON.parse(localStorage.getItem('editSchedData'));
      if (filterPayload) {
        startDate = !filterPayload.startDate ? startDate : filterPayload.startDate;
        endDate = !filterPayload.endDate ? endDate : filterPayload.endDate;
        setCountryAndRegions(filterPayload.countryId);
        setPayload({
          ...filterPayload,
          countryId: filterPayload.countryId || 'all',
          regionId: filterPayload.regionId || 'all',
          startDate,
          endDate
        });
        getScheduleOrders(filterPayload, startDate, endDate, filterPayload.countryId, filterPayload.regionId, true);
        isGetScheduleOrders = true;
        localStorage.removeItem('editSchedData');
      } else {
        setPayload({
          ...payload,
          countryId: countryId || 'all',
          regionId: regionId || 'all',
          startDate,
          endDate
        });
      }
      if (countryId) {
        setEmptyFilter({
          ...emptyFiltersData,
          countryId: countryId || 'all',
          regionId: regionId || 'all',
          startDate,
          endDate
        });
      } else {
        setEmptyFilterData(startDate, endDate);
      }
      dispatch({ type: IS_DATA_LOADING, data: true });
      getProjectStatus();
      if (!isGetScheduleOrders) {
        getScheduleOrders(payload, startDate, endDate, countryId || 'all', regionId || 'all', true);
      }
    }
  }, []);

  useEffect(() => {
    getServiceManData();
  }, [selRegionId]);

  useEffect(() => {
    getPrefrredTimes();
    getProjectStatus();
  }, []);

  const handleClose = () => {
    setCardDialog(false);
  };

  const navigateToServiceOrderDetail = () => {
    navigate(SERVICEORDERDETAILS, {
      state: {
        scheduleDate: todaysData?.scheduleDate,
        tabValue: 0,
        filterPayload: { ...payload, projectStatusList, regions, sortBy: sortPayload?.sortBy }
      }
    });
  };

  const callGetScheduleOrders = () => {
    let startDate = getStartOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT);
    let endDate = getEndOfWeek(DATE_FORMAT.DATE_YEAR_FORMAT);
    const filterPayload = JSON.parse(localStorage.getItem('editSchedData'));
    if (filterPayload) {
      startDate = !filterPayload.startDate ? startDate : filterPayload.startDate;
      endDate = !filterPayload.endDate ? endDate : filterPayload.endDate;
      getScheduleOrders(filterPayload, startDate, endDate, filterPayload.countryId, filterPayload.regionId, true);
      localStorage.removeItem('editSchedData');
    }
  };

  // TODO: This is the solution for multiselect dropdown for already selected  values (22120111)
  useEffect(() => {
    if (isArray(servicemanList) && isArray(payload.servicemen)) {
      const selectedServicemen = servicemanList.filter((m, i) => payload.servicemen.map((m) => m.id).includes(m.id));
      setPayload({ ...payload, servicemen: selectedServicemen });
    }
  }, [servicemanList]);

  return (
    <Grid className="schedule-service-main-cls">
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
      <Grid container spacing={3} xs={12}>
        <Grid item xs={6.5}>
          <Typography fontWeight="bold" variant="subtitle1" display="flex" justifyContent="end">
            Schedule Viewer
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <></>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Filters
            components={FILTER_COMPONETS}
            getFilterData={getFilterData}
            getFilterDataPayloadChange={getFilterDataPayloadChange}
            payload={payload}
            setPayload={setPayload}
            emptyFilters={emptyFilters}
            deleteMltSlctOptn={deleteMltSlctOptn}
          />
        </Grid>
        <Grid item xs={5} md={4} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span className="mt-1rm scheduler-arrow-icon" style={{ marginTop: '-0.2rem' }}>
            <Tooltip title={t(`serviceDashboard.backByMonth`)}>
              <span>
                <ArrowBackIosIcon onClick={handlePrevMonth} className="arr-icn" />
                <ArrowBackIosIcon onClick={handlePrevMonth} className="arr-icn" />
              </span>
            </Tooltip>
            <Tooltip title={t(`serviceDashboard.backByWeek`)}>
              <ArrowBackIosIcon onClick={handlePrevWeek} className="arr-icn ml-1rm" />
            </Tooltip>
          </span>
          <span>
            <RenderComponent
              metaData={{
                control: BUTTON,
                groupStyle: { marginTop: '0.2rem' },
                color: 'success',
                columnWidth: 12,
                btnTitle: `Map View: ${getFormattedDate(DATE_FORMAT.DATE_NAME_FORMAT)}`,
                handleClickButton: () => navigateToServiceOrderDetail()
              }}
            />
          </span>
          <span className="mt-1rm scheduler-arrow-icon" style={{ marginRight: '2rem', marginTop: '-0.2rem' }}>
            <Tooltip title={t(`serviceDashboard.nextByWeek`)}>
              <ArrowForwardIosIcon onClick={handleNextWeek} className="arr-icn scheduler-forward-icon" />
            </Tooltip>
            <Tooltip title={t(`serviceDashboard.nextByMonth`)}>
              <span>
                <ArrowForwardIosIcon onClick={handleNextMonth} className="arr-icn" />
                <ArrowForwardIosIcon onClick={handleNextMonth} className="arr-icn" />
              </span>
            </Tooltip>
          </span>
        </Grid>
        <Grid item xs={1} md={1} sx={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '1.6rem' }}>
          <Tooltip title={t(`serviceDashboard.serviceMen`)} arrow>
            <SupervisedUserCircleIcon
              className="mt-half-rm mr-1rm pointer-cls"
              style={{ float: 'right', marginTop: '0.4rem' }}
              onClick={handleServicemenClick}
            />
          </Tooltip>
          <Popover
            id="servicemen"
            open={servicemenOpen}
            anchorEl={servicemenAnchorEl}
            onClose={handleServicemenClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            className="service-men-popover"
          >
            <ServiceMens servicemenList={servicemanList} />
          </Popover>
          <Tooltip title={t('serviceDashboard.serviceStatus')} arrow>
            <HomeRepairServiceIcon
              className="mt-half-rm mr-1rm pointer-cls"
              style={{ float: 'right', marginTop: '0.4rem' }}
              onClick={handleServiceTypeClick}
            />
          </Tooltip>
          <Popover
            id="serviceType"
            open={serviceTypeOpen}
            anchorEl={serviceTypeAnchorEl}
            onClose={handleServiceTypeClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            className="service-type-popover"
          >
            <ServiceTypes />
          </Popover>
        </Grid>
        <Grid container xs={6} md={3} spacing={3} style={{ paddingTop: '2px' }}>
          <RenderComponent metaData={sortByData} payload={sortPayload} ind={1} handleChange={handleChangeData} />
        </Grid>
      </Grid>
      <Grid container className="service-board-grid schedule-viewer">
        <ServiceBoard
          data={serviceOrderData}
          onCardClick={handleCardClick}
          filterPayload={{ ...payload, projectStatusList, regions, sortBy: sortPayload?.sortBy }}
        />
      </Grid>
    </Grid>
  );
};

export default ScheduleViewer;
