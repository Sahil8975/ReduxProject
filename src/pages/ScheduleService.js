import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import SplitPane from 'react-split-pane';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';
import moment from 'moment';
import { Grid, Stack, Button, MenuItem, TextField, Popover, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import RenderComponent from '../components/RenderComponent';

import ServiceBoard from '../components/ServiceBoard/ServiceBoard';
import ServiceMens from '../components/ServiceBoard/ServiceMens';
import ServiceTypes from '../components/ServiceBoard/ServiceTypes';
import Filters from '../components/Filter/filter';
import { serviceDataEn, serviceDataAr, SEVICE_DASHBOARD_FILTER_MASTER_DATA } from '../components/ServiceBoard/data';
import DialogComponent from '../components/Dialog';
import PrimeGrid from '../components/ngPrimeGrid';

import { MAX_LANES, GROUP_BY, LANGUAGE_CODES, COMPONENTS, DATE_FORMAT } from '../utils/constants';
import { sortListOfObjects, getFormattedDate } from '../utils/utils';
import useSettings from '../hooks/useSettings';
import { POST_OFFICE } from '../redux/constants';

import '../components/ServiceBoard/ServiceBoard.css';
import { ROUTES } from '../routes/paths';

export default function ServiceDashboard() {
  const { SERVICEORDERDETAILS } = ROUTES;
  const { t } = useTranslation();
  const { lang } = useSettings();
  const theme = useTheme();
  const navigate = useNavigate();
  const backgroundColor = theme.palette.background.default;

  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();

  const { SERVICE_MEN, CUSTOMER } = GROUP_BY;
  const emptyFilters = {
    country: 'all',
    region: 'all',
    business: 'all',
    contract: 'all',
    projectStatus: 'all',
    status: 'all',
    lastProjectService: null,
    customerName: null,
    location: 'all',
    serviceman: 'all'
  };
  const [payload, setPayload] = useState({ ...emptyFilters });
  const [serviceData, setServiceData] = useState(serviceDataEn);
  const serviceDataLen = serviceData.length;
  const [start, setStart] = useState(0);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(SERVICE_MEN);
  const [servicemenAnchorEl, setServicemenAnchorEl] = useState(null);
  const [serviceTypeAnchorEl, setServiceTypeAnchorEl] = useState(null);
  const [cardDialog, setCardDialog] = useState(false);

  const { TEXT_FIELD, SELECT_BOX, CHECKBOX, BUTTON } = COMPONENTS;
  const [sortPayload, setSortPayload] = useState({
    sortBy: '1'
  });

  const sortByOptions = [
    {
      id: '1',
      name: SERVICE_MEN
    },
    {
      id: '2',
      name: CUSTOMER
    }
  ];

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'country',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'region',
      label: 'serviceDashboard.region',
      placeholder: 'serviceDashboard.region',
      options: masterData?.region,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'business',
      label: 'serviceDashboard.business',
      placeholder: 'serviceDashboard.business',
      options: masterData?.businessType,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'contract',
      label: 'serviceDashboard.contract',
      placeholder: 'serviceDashboard.contract',
      options: masterData?.contracts,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectStatus',
      label: 'CreateProject.ProjectStatus',
      placeholder: 'CreateProject.ProjectStatus',
      options: masterData?.projectStatus,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'status',
      label: 'serviceDashboard.status',
      placeholder: 'serviceDashboard.status',
      options: masterData?.status,
      select: true
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'lastProjectService',
      label: 'serviceDashboard.lastProjectService',
      placeholder: 'serviceDashboard.lastProjectService',
      columnWidth: 2
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerName',
      label: 'serviceDashboard.customerName'
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'location',
      label: 'serviceDashboard.location',
      placeholder: 'serviceDashboard.location',
      options: masterData?.location,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceMan',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: masterData?.servicemens,
      select: true
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

  const handleChangeData = (key, val) => {
    if (key === 'sortBy') {
      setSortPayload({ sortBy: val });
    }
  };
  const handleServicemenClick = (e) => {
    setServicemenAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleServicemenClose = () => setServicemenAnchorEl(null);

  const servicemenOpen = Boolean(servicemenAnchorEl);

  const handleServiceTypeClick = (e) => {
    setServiceTypeAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleServiceTypeClose = () => setServiceTypeAnchorEl(null);

  const serviceTypeOpen = Boolean(serviceTypeAnchorEl);

  const handleNextDay = () => {
    setStart(checkValidUpdateForStart(start + 1));
  };

  const handlePrevDay = () => {
    setStart(checkValidUpdateForStart(start - 1));
  };

  const handleNextWeek = () => {
    setStart(checkValidUpdateForStart(start + MAX_LANES));
  };

  const handlePrevWeek = () => {
    setStart(checkValidUpdateForStart(start - MAX_LANES));
  };

  const changeData = () => {
    if (isArray(serviceData)) {
      const tempData = serviceData.slice(start, MAX_LANES + start);
      if (sortBy === CUSTOMER) {
        // Sorting on address field
        tempData.forEach((lane) => {
          lane.cards = sortListOfObjects(lane.cards, 'address');
        });
      }
      setData(tempData);
    }
  };

  const handleSortByChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    alert(`${val} group by is selected`);
    changeData();
  };

  const handleCardDialogClose = () => setCardDialog(false);

  const handleCardDialogOpen = () => setCardDialog(true);

  const handleCardClick = (cardId, cardDetails, laneId) => {
    handleCardDialogOpen();
    console.log(`${cardId} clicked from ${laneId}: `, cardDetails);
  };

  const getFilterData = (data, callApi) => {
    if (callApi) {
      console.log('Filtered data: ', data);
    }
  };

  const getFilterDataPayloadChange = (key, val) => {
    console.log(key, val);
    if (key === 'country') {
      const country = SEVICE_DASHBOARD_FILTER_MASTER_DATA.OFFICE.find((office) => office.country === val);
      if (country) {
        dispatch({ type: POST_OFFICE, data: country.offices });
      }
    }
    setPayload({ ...payload, [key]: val || '' });
  };

  const callGetScheduleOrders = () => console.log('callGetScheduleOrders called !!');

  useEffect(changeData, [start, serviceData]);

  useEffect(() => {
    setServiceData(lang === LANGUAGE_CODES.AR ? serviceDataAr : serviceDataEn);
  }, [lang]);

  return (
    <Grid className="schedule-service-main-cls">
      <Grid container>
        <DialogComponent
          open={cardDialog}
          handleClose={handleCardDialogClose}
          handleProceed={handleCardDialogClose}
          title="Customer and contact details"
          proceedButtonText="Ok"
        />
        <Grid item xs={12}>
          <Filters
            components={FILTER_COMPONETS}
            apiUrl="dummyUrl"
            getFilterData={getFilterData}
            getFilterDataPayloadChange={getFilterDataPayloadChange}
            payload={payload}
            setPayload={setPayload}
            emptyFilters={emptyFilters}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack>
            <span className="ml-1rm mt-1rm">
              <ArrowBackIosIcon onClick={handlePrevWeek} className={`arr-icn ${start === 0 && 'disabled'}`} />
              <ArrowBackIosIcon onClick={handlePrevWeek} className={`arr-icn ${start === 0 && 'disabled'}`} />
              <ArrowBackIosIcon onClick={handlePrevDay} className={`arr-icn ml-1rm ${start === 0 && 'disabled'}`} />
              <ArrowForwardIosIcon
                onClick={handleNextDay}
                className={`arr-icn mr-1rm ml-1rm ${
                  (start > serviceDataLen || start + MAX_LANES >= serviceDataLen) && 'disabled'
                }`}
              />
              <ArrowForwardIosIcon
                onClick={handleNextWeek}
                className={`arr-icn ${
                  (start > serviceDataLen - start || start + MAX_LANES >= serviceDataLen) && 'disabled'
                }`}
              />
              <ArrowForwardIosIcon
                onClick={handleNextWeek}
                className={`arr-icn ${
                  (start > serviceDataLen - start || start + MAX_LANES >= serviceDataLen) && 'disabled'
                }`}
              />
            </span>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <RenderComponent
            metaData={{
              control: BUTTON,
              variant: 'contained',
              size: 'medium',
              // groupStyle: { marginRight: '1rem' },
              handleClickButton: () => navigate(SERVICEORDERDETAILS),
              btnTitle: `Map View: ${getFormattedDate(DATE_FORMAT.DATE_NAME_FORMAT)}`
            }}
          />
          <Tooltip title={t(`serviceDashboard.serviceMen`)} arrow>
            <SupervisedUserCircleIcon
              className="mt-half-rm mr-1rm pointer-cls"
              style={{ float: 'right' }}
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
            <ServiceMens />
          </Popover>
          <Tooltip title={t('serviceDashboard.serviceStatus')} arrow>
            <HomeRepairServiceIcon
              className="mt-half-rm mr-1rm pointer-cls"
              style={{ float: 'right' }}
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
        <Grid container xs={12} md={3} spacing={3} style={{ paddingTop: '2px' }}>
          <RenderComponent metaData={sortByData} payload={sortPayload} ind={1} handleChange={handleChangeData} />
        </Grid>
      </Grid>
      <Grid container className="service-board-grid schedule-service">
        <SplitPane split="vertical" minSize={400} defaultSize={400} maxSize={800}>
          <ServiceBoard data={data} onCardClick={handleCardClick} callGetScheduleOrders={callGetScheduleOrders} />
          <div style={{ marginTop: '1rem' }}>
            <PrimeGrid />
          </div>
        </SplitPane>
      </Grid>
    </Grid>
  );
}
