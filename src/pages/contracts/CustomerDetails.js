import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Button, Paper, Container } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Filters from '../../components/Filter/filter';
import SimpleTable from '../../components/table/simpleTable';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, getDialogBoldContent, MAX_LENGTH, STATUS } from '../../utils/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { isObject, isArray, handleContractNumberMasking } from '../../utils/utils';
import { IS_DATA_LOADING } from '../../redux/constants';
import { refreshCustomerData } from '../../services/projectService';
import { getCustomer } from '../../services/CustomerService';
import './CustomerDetails.scss';
import DialogComponent from '../../components/Dialog';

function CustomerDetails({ handleClose, selectedCustomer, selCountryId, selRegionId }) {
  const { t } = useTranslation();
  const { GET_CUSTOMERS, REFRESH_CUST_DATA } = APIS;
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const { country: countries, regions: allRegions, legalEntity } = masterData;
  const [regions, setRegions] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(0);
  const [customerGenNumber, setCustomerGenNumber] = useState('');
  const [funnelFilters, setFunnelFilters] = useState(null);
  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;
  const [customerData, setCustomerData] = useState([]);
  const [alertBox, setShowAlertBox] = useState({ open: false, titleType: '', title: '', content: '' });
  const emptyFilters = {
    countryId: selCountryId || 'all',
    regionId: selRegionId || 'all',
    legalEntityId: 'all',
    name: '',
    employeeNumber: '',
    pageIndex: 0,
    pageSize: 0,
    accountNumber: customerGenNumber,
    customerName: null,
    customerAddress: null,
    customerContact: null
  };
  const [payload, setPayload] = useState({ ...emptyFilters });

  const handleCloseAlertBox = () => {
    setShowAlertBox({ open: false, titleType: '', title: '', content: '' });
  };

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'countryId',
      label: 'Country',
      placeholder: 'Country',
      options: masterData?.country,
      select: true,
      isDisabled: selCountryId,
      columnWidth: 2
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'regionId',
      label: 'Region',
      placeholder: 'Region',
      options: regions,
      select: true,
      isDisabled: selRegionId
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'accountNumber',
      label: 'Customer Number'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerName',
      label: 'Customer Name'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerAddress',
      label: 'Customer Address'
    }
  ];
  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getCustomerData();
    } else {
      setCustomerData([]);
      if (!selCountryId && !selRegionId) {
        setRegions([]);
        setSelectedCountryId(0);
        setSelectedRegionId(0);
        setCustomerGenNumber('');
      }
      if (!selRegionId) {
        setSelectedRegionId(0);
        setCustomerGenNumber('');
      }
    }
  };

  const setRegionOptions = (val, region = 0) => {
    setSelectedCountryId(val || 0);
    if (val) {
      const filteredRegions = allRegions?.filter((rgn) => rgn.countryId === val * 1);
      setRegions(filteredRegions);
      if (filteredRegions.length === 1) {
        region = filteredRegions[0]?.id?.toString();
      }
    } else {
      setRegions([]);
    }
    return region;
  };

  const getFilterDataPayloadChange = (key, val) => {
    if (key === 'countryId') {
      const region = setRegionOptions(val);
      setSelectedRegionId(region);
      setPayload({ ...payload, [key]: val || 0, regionId: region || 'all' });
    } else if (key === 'regionId') {
      setPayload({ ...payload, [key]: val || 0 });
      setSelectedRegionId(val);
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
    if (key === 'accountNumber') {
      const valToUpdate = handleContractNumberMasking(customerGenNumber, val, MAX_LENGTH.CUSTOMER_NUMBER);
      setPayload({
        ...payload,
        accountNumber: valToUpdate
      });
    }
  };

  const handleRefreshCustomerData = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await refreshCustomerData(`${API_V1}/${REFRESH_CUST_DATA}=${0}`);
    if (res.isSuccessful) {
      const { data } = res;
      getFilterData(emptyFilters, true);
      setShowAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: 'Refresh customer data',
        content: res.message || getDialogBoldContent('all customers.', '', 'refreshCustomer', data.response)
      });
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const getCustomerData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomer(`${API_V1}/${GET_CUSTOMERS}`, payloadData);
    if (res && isObject(res)) {
      const customers = res?.data?.customers || [];
      if (isArray(customers)) {
        const displayData = [];
        customers?.map((item) => {
          const { accountNumber, customerName, addressEn, shortName, id, countryId, regionId } = item;
          return displayData.push({
            accountNumber,
            customerName,
            addressEn,
            shortName,
            id,
            countryId,
            regionId
          });
        });
        setCustomerData(displayData);
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        setCustomerData([]);
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    }
  };

  const selectCustomer = async (data) => {
    selectedCustomer({ ...data });
    handleClose();
  };

  const columnForCustomer = [
    {
      field: 'accountNumber',
      header: 'Number',
      sortable: true,
      filter: true,
      style: { width: '15%' }
    },
    {
      field: 'customerName',
      header: 'Name',
      sortable: true,
      filter: true,
      style: { width: '30%' }
    },
    {
      field: 'addressEn',
      header: 'Address',
      sortable: true,
      filter: true,
      style: { width: '25%' }
    },
    {
      field: 'shortName',
      header: 'Short Name',
      sortable: false,
      filter: true,
      style: { width: '20%' }
    },
    {
      field: 'Select',
      header: 'Action',
      icon: <ArrowCircleRightOutlinedIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: selectCustomer,
      tooltipTitle: 'Click to Select',
      placement: 'left',
      style: { width: '10%' }
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NO_ELLIPSIS', 'NONE', 'ICON'];
  const numericFields = ['accountNumber'];

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const clearFunnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      accountNumber: clearFunnelFilterObj(),
      name: clearFunnelFilterObj(),
      address: clearFunnelFilterObj(),
      customerShortName: clearFunnelFilterObj()
    });
  };

  useEffect(() => {
    getCustomerData();
    setRegionOptions(selCountryId);
  }, []);

  useEffect(() => {
    if (selCountryId) {
      setSelectedCountryId(selCountryId);
    }
    if (selRegionId) {
      setSelectedRegionId(selRegionId);
    }
    if (selectedCountryId) {
      if (selectedCountryId === 'all') {
        setCustomerGenNumber('');
        setPayload({ ...payload, accountNumber: '' });
      } else {
        let regionCode = '';
        const legalEntityId = countries.find((el) => el.id === selectedCountryId * 1)?.legalEntities[0];
        const legalEntityCode = legalEntity.find((ent) => ent.id === legalEntityId)?.name;
        if (selectedRegionId) {
          regionCode = regions.find((rgn) => rgn.id === selectedRegionId * 1)?.axCode;
        }
        const cusGeneratedNumber = regionCode ? `${legalEntityCode}_${regionCode}_` : `${legalEntityCode}_`;
        setCustomerGenNumber(cusGeneratedNumber);
        setPayload({ ...payload, accountNumber: cusGeneratedNumber });
      }
    } else {
      setCustomerGenNumber('');
      setPayload({ ...payload, accountNumber: '' });
    }
  }, [selCountryId, selRegionId, selectedCountryId, selectedRegionId, customerGenNumber]);

  return (
    <Paper>
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
      <Grid sx={{ padding: '30px 20px', width: '100%', margin: '-35px auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Typography fontWeight="bold" variant="subtitle1" align="center">
              Customer List
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.4rem' }}>
            <RenderComponent
              metaData={{
                control: BUTTON,
                size: 'medium',
                color: 'success',
                handleClickButton: () => handleRefreshCustomerData(),
                btnTitle: 'Refresh',
                startIcon: <RefreshIcon />,
                columnWidth: 2.1
              }}
            />

            <RenderComponent
              metaData={{
                control: BUTTON,
                variant: 'contained',
                color: 'warning',
                groupStyle: { marginLeft: '1rem' },
                handleClickButton: () => handleClose(),
                btnTitle: 'Close',
                startIcon: <CloseIcon />,
                columnWidth: 1.8
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Filters
              components={FILTER_COMPONETS}
              apiUrl="dummyUrl"
              getFilterData={getFilterData}
              getFilterDataPayloadChange={getFilterDataPayloadChange}
              setRegions={setRegions}
              payload={payload}
              setPayload={setPayload}
              emptyFilters={emptyFilters}
            />
          </Grid>
          {/* DataTable Layout */}
          <Grid item xs={12}>
            <SimpleTable
              rowData={customerData}
              headerData={columnForCustomer}
              paginator
              rows={10}
              showGridlines
              responsiveLayout="scroll"
              resizableColumns
              columnResizeMode="expand"
              size="small"
              dataKey="id"
              editMode="row"
              numericFields={numericFields}
              headCellsType={headCellsType}
              clearFilter={clearFunnelFilter}
              filterData={funnelFilters}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

CustomerDetails.propTypes = {
  handleClose: PropTypes.func,
  selectedCustomer: PropTypes.func,
  selCountryId: PropTypes.number,
  selRegionId: PropTypes.number
};

export default CustomerDetails;
