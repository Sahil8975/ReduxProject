import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Button, Paper, Container } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import DoneIcon from '@mui/icons-material/Done';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Filters from '../../components/Filter/filter';
import SimpleTable from '../../components/table/simpleTable';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, MAX_LENGTH } from '../../utils/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { isObject, isArray, handleContractNumberMasking } from '../../utils/utils';
import { IS_DATA_LOADING } from '../../redux/constants';
import { getServicemensDdl } from '../../services/masterDataService';
import {
  getCustomerData,
  getMaterialPickingListData,
  getStockedDetailedListData
} from '../../services/materialPickingListService';
import '../contracts/CustomerDetails.scss';
import useBoolean from '../../hooks/useBoolean';
import MaterialPickingDetails from './MaterialPickingDetails';

function MaterialPickingList({ selectedCustomer, selCountryId, selRegionId }) {
  const { t } = useTranslation();
  const { GET_SERVICEMAN_DDL, GET_CUSTOMERS_DDL, GET_MPL, GET_STOCK_DETAILED_LIST } = APIS;
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const { country: countries, regions: allRegions, legalEntity } = masterData;
  const [regions, setRegions] = useState([]);
  const [servicemanList, setServicemanList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(0);
  const [customerGenNumber, setCustomerGenNumber] = useState('');
  const [funnelFilters, setFunnelFilters] = useState(null);
  const { SELECT_BOX, BUTTON, DATEPICKER, AUTOCOMPLETE, RADIO } = COMPONENTS;
  const emptymaterialPickingData = { leaveDates: [], period: '', servicemanId: '', servicemanName: '' };
  const [stockList, setStockList] = useState([]);
  const emptyStockDetails = { stockItem: {}, list: [], servicemanId: '' };
  const [stockDetails, setStockDetails] = useState({ ...emptyStockDetails });
  const [materialPickingData, setMaterialPickingData] = useState({ ...emptymaterialPickingData });
  const [mplDetailedBox, setMplDetailedBox] = useBoolean(false);
  const [demandPlanObj, setDemandPlanObj] = useState({});
  const [demandPlanList, setDemandPlanList] = useState([
    { name: 'Demand Plan 1', id: 'demandPlan1' },
    { name: 'Demand Plan 2', id: 'demandPlan2' }
  ]);

  const statusList = [
    { name: 'Status 1', id: 'status1' },
    { name: 'Status 2', id: 'status2' }
  ];

  const demandPlanOptions = [
    { name: 'New Demand Plan', value: 'newDemandPlan' },
    { name: 'Demand Plan', value: 'demandPlan' }
  ];

  const [selectedDemandPlan, setSelectedDemandPlan] = useState(demandPlanOptions[0].value);

  const isNewDemandPlan = selectedDemandPlan === demandPlanOptions[0].value;

  const { period, servicemanName } = materialPickingData;

  const emptyFilters = {
    countryId: selCountryId || 'all',
    regionId: selRegionId || 'all',
    servicemanId: '',
    customer: 'all',
    startDate: '',
    endDate: ''
  };
  const [payload, setPayload] = useState({ ...emptyFilters });

  const { countryId, regionId, servicemanId, startDate, endDate } = payload;

  const getDetails = async (data) => getStockedDetailedList(data);

  const columns = [
    {
      field: 'stockCode',
      header: 'Stock Code',
      sortable: true,
      style: { width: '10%' }
    },
    {
      field: 'description',
      header: 'Description',
      sortable: true,
      style: { width: '25%' }
    },
    {
      field: 'requiredQuantity',
      header: 'Quantity',
      sortable: true,
      style: { width: '5%' }
    },
    {
      field: 'uom',
      header: 'Inv UOM',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'holdQuantity',
      header: 'Hold Qty',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'availableQuantity',
      header: 'Available Qty',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'warehouseName',
      header: 'Warehouse Name',
      sortable: false,
      style: { width: '10%' }
    },
    {
      field: 'mobileWarehouseInv',
      header: 'MW Inv',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'fromMobileWarehouse',
      header: 'From MW',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'isFulfilled',
      header: 'Fulfilled',
      icon: <DoneIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      icon2: <CloseIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      sortable: false,
      style: { width: '5%' },
      tooltipTitle: 'Fillfilled',
      tooltipTitle2: 'Not Fullfilled'
    },
    {
      field: 'status',
      header: 'Status',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'details',
      header: 'Details',
      icon: <ArrowCircleRightOutlinedIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: getDetails,
      tooltipTitle: 'Click to Select',
      placement: 'left',
      style: { width: '5%' }
    }
  ];

  const columns2 = [
    {
      field: 'stockCode',
      header: 'Stock Code',
      sortable: true,
      style: { width: '10%' }
    },
    {
      field: 'description',
      header: 'Description',
      sortable: true,
      style: { width: '25%' }
    },
    {
      field: 'requiredQuantity',
      header: 'Quantity',
      sortable: true,
      style: { width: '5%' }
    },
    {
      field: 'uom',
      header: 'Inv UOM',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'demand',
      header: 'Demand',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'receivedQuantity',
      header: 'Rcvd Qty',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'trNo',
      header: 'TR No',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'toNo',
      header: 'TO No',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'holdQuantity',
      header: 'Hold Qty',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'availableQuantity',
      header: 'Available Qty',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'warehouseName',
      header: 'Warehouse Name',
      sortable: false,
      style: { width: '10%' }
    },
    {
      field: 'mobileWarehouseInv',
      header: 'MW Inv',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'fromMobileWarehouse',
      header: 'From MW',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'disputed',
      header: 'Disputed',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'isFulfilled',
      header: 'Fulfilled',
      icon: <DoneIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      icon2: <CloseIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      sortable: false,
      style: { width: '5%' },
      tooltipTitle: 'Fillfilled',
      tooltipTitle2: 'Not Fullfilled'
    },
    {
      field: 'status',
      header: 'Status',
      sortable: false,
      style: { width: '5%' }
    },
    {
      field: 'details',
      header: 'Details',
      icon: <ArrowCircleRightOutlinedIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: getDetails,
      tooltipTitle: 'Click to Select',
      placement: 'left',
      style: { width: '5%' }
    }
  ];

  const headCellsType = ['NONE', 'NO_ELLIPSIS', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'ICON', 'ICON'];

  const numericFields = [
    'stockCode',
    'requiredQuantity',
    'holdQuantity',
    'availableQuantity',
    'mobileWarehouseInv',
    'fromMobileWarehouse'
  ];

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
      columnWidth: 1.5,
      isRequired: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'regionId',
      label: 'Region',
      placeholder: 'Region',
      options: regions,
      select: true,
      isDisabled: selRegionId,
      columnWidth: 1.5,
      isRequired: true
    },
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'startDate',
      label: 'From Date',
      placeholder: 'From Date',
      columnWidth: 1.3,
      isRequired: true,
      minDate: new Date()
    },
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'endDate',
      label: 'To Date',
      placeholder: 'To Date',
      columnWidth: 1.5,
      isRequired: true,
      minDate: (startDate && new Date(startDate)) || new Date()
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'servicemanId',
      label: 'Serviceman',
      placeholder: 'Serviceman',
      options: servicemanList,
      select: true,
      isSelecteAllAllow: false,
      columnWidth: 1.5,
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customer',
      label: 'Customer Name',
      placeholder: 'Customer Name',
      options: customers,
      columnWidth: 1.5
    }
  ];

  const demandPlanComps = [
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'startDate',
      label: 'From Date',
      placeholder: 'From Date',
      columnWidth: 1.5,
      isRequired: true,
      minDate: new Date()
    },
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'endDate',
      label: 'To Date',
      placeholder: 'To Date',
      columnWidth: 1.5,
      isRequired: true,
      minDate: (demandPlanObj.startDate && new Date(demandPlanObj.startDate)) || new Date()
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'status',
      label: 'Status',
      placeholder: 'Status',
      options: statusList,
      select: true,
      isSelecteAllAllow: false,
      columnWidth: 1.5
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'demandPlanNo',
      label: 'Demand Plan No',
      placeholder: 'Demand Plan No',
      options: demandPlanList,
      select: true,
      isSelecteAllAllow: false,
      columnWidth: 1.5,
      isRequired: true
    },
    {
      control: BUTTON,
      groupStyle: { marginRight: '1.5rem' },
      btnTitle: 'Display',
      color: 'success',
      handleClickButton: () => console.log('Display demand plan data !'),
      columnWidth: 1.2
    }
  ];

  const clearStockData = () => {
    setMaterialPickingData({ ...emptymaterialPickingData });
    setStockList([]);
    setStockDetails({ ...emptyStockDetails });
  };

  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getMaterialPickingList();
    } else {
      clearStockData();
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
    } else if (key === 'startDate') {
      setPayload({ ...payload, [key]: val || '', endDate: '' });
    } else if (key === 'customer') {
      setPayload({ ...payload, [key]: val || '', customerId: val?.id?.toString() || 'all' });
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  const getServicemenList = async () => {
    const res = await getServicemensDdl(`${API_V1}/${GET_SERVICEMAN_DDL}?regionId=${regionId || 'all'}`);
    if (res?.data && isArray(res?.data)) {
      setServicemanList(res?.data);
    } else {
      setServicemanList([]);
    }
  };

  const getCustomers = async () => {
    const res = await getCustomerData(`${API_V1}/${GET_CUSTOMERS_DDL}`, { countryId, regionId, userId: '' });
    if (res?.data && isArray(res?.data)) {
      setCustomers(res?.data);
    } else {
      setCustomers([]);
    }
  };

  const getMaterialPickingList = async (payloadData = payload) => {
    if (!startDate || !endDate || !servicemanId) {
      return;
    }
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getMaterialPickingListData(`${API_V1}/${GET_MPL}`, payloadData);
    if (res && res?.data) {
      const { leaveDates, period, servicemanId, servicemanName, stockList } = res.data;
      if (isArray(stockList)) {
        const filteredData = stockList.map((stock) => {
          const {
            stockCode,
            description,
            requiredQuantity,
            uom,
            holdQuantity,
            availableQuantity,
            warehouseName,
            mobileWarehouseInv,
            fromMobileWarehouse,
            isFulfilled,
            productId
          } = stock;
          return {
            stockCode,
            description,
            requiredQuantity,
            uom,
            holdQuantity,
            availableQuantity,
            warehouseName,
            mobileWarehouseInv,
            fromMobileWarehouse,
            isFulfilled: isFulfilled || 'icon2',
            productId
          };
        });
        setStockList(filteredData);
      } else {
        setStockList([]);
      }
      setMaterialPickingData({ leaveDates, period, servicemanId, servicemanName });
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      clearStockData();
      dispatch({ type: IS_DATA_LOADING, data: false });
    }
  };

  const getStockedDetailedList = async (stockData) => {
    const { productId } = stockData;
    if (!productId) {
      return;
    }
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getStockedDetailedListData(`${API_V1}/${GET_STOCK_DETAILED_LIST}`, { ...payload, productId });
    if (res && res?.data) {
      setStockDetails({ stockItem: stockData, list: res?.data, servicemanId });
      dispatch({ type: IS_DATA_LOADING, data: false });
      setMplDetailedBox.on();
    } else {
      clearStockData();
      dispatch({ type: IS_DATA_LOADING, data: false });
    }
  };

  const clearFunnelFilter = () => handleFunnelFilter();

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

  const handleCreatTransferOrder = () => alert('Creat Transfer Order clicked !!');

  useEffect(() => {
    getMaterialPickingList(emptyFilters);
    setRegionOptions(selCountryId);
  }, []);

  // useEffect(() => {
  //   if (isArray(servicemanList)) {
  //     setPayload({ ...payload, servicemanId: servicemanList[0].id });
  //   } else {
  //     setPayload({ ...payload, servicemanId: '' });
  //   }
  // }, [servicemanList]);

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

  const handleCloseMplDetailedBox = () => setMplDetailedBox.off();

  const handleProceedMplDetailedBox = () => setMplDetailedBox.off();

  const handleChangeData = async (key, val, ind) => {
    if (key) {
      const updateFields = { [key]: val };
      if (key === 'startDate') {
        updateFields.endDate = '';
      }
      setDemandPlanObj((existingObj) => ({ ...existingObj, ...updateFields }));
    }
  };

  useEffect(() => {
    getServicemenList();
    getCustomers();
  }, [selectedRegionId]);

  useEffect(() => {
    getCustomers();
  }, [selectedCountryId]);

  return (
    <Paper>
      <Grid sx={{ padding: '30px 20px', width: '100%', margin: '-35px auto' }}>
        <MaterialPickingDetails
          mplDetailsProps={{ stockDetails, open: mplDetailedBox }}
          handleClose={handleCloseMplDetailedBox}
          handleProceed={handleProceedMplDetailedBox}
        />
        <Grid container spacing={3}>
          <Grid
            item
            xs={7}
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '-0.5rem' }}
          >
            <Typography fontWeight="Bold" variant="subtitle1" align="center">
              Demand Plan
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={6} style={{ display: 'flex' }}>
              {period && (
                <Typography>
                  Period: <strong>{period}</strong>
                </Typography>
              )}
              {servicemanName && (
                <Typography sx={{ marginLeft: '2rem' }}>
                  Serviceman: <strong>{servicemanName}</strong>
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ float: 'right' }}>
            <RenderComponent
              metaData={{
                control: RADIO,
                groupStyle: { marginTop: '1rem' },
                key: 'selectedDemandPlan',
                label: '',
                showLabel: true,
                options: demandPlanOptions,
                columnWidth: 12
              }}
              payload={{ selectedDemandPlan }}
              handleChange={(key, value) => setSelectedDemandPlan(value)}
            />
          </Grid>
          <Grid item xs={12}>
            {selectedDemandPlan === demandPlanOptions[0].value ? (
              <Filters
                components={FILTER_COMPONETS}
                apiUrl="dummyUrl"
                getFilterData={getFilterData}
                getFilterDataPayloadChange={getFilterDataPayloadChange}
                setRegions={setRegions}
                payload={payload}
                setPayload={setPayload}
                emptyFilters={emptyFilters}
                isDisabled={!countryId || !regionId || !servicemanId || !startDate || !endDate}
              />
            ) : (
              <Grid item xs={12} mt={2} mb={1}>
                <Grid container spacing={3}>
                  {demandPlanComps?.map((comp, ind) => (
                    <RenderComponent
                      key={ind}
                      metaData={{ ...comp }}
                      payload={demandPlanObj}
                      ind={ind}
                      handleChange={handleChangeData}
                    />
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* DataTable Layout */}
          <Grid item xs={12}>
            <SimpleTable
              rowData={stockList}
              headerData={isNewDemandPlan ? columns : columns2}
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
          <Grid item xs={12} style={{ float: 'right' }}>
            <RenderComponent
              metaData={{
                control: BUTTON,
                groupStyle: { float: 'right' },
                color: 'success',
                handleClickButton: () => handleCreatTransferOrder(),
                btnTitle: 'Create Transfer Order',
                columnWidth: 2.5
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

MaterialPickingList.propTypes = {
  selectedCustomer: PropTypes.func,
  selCountryId: PropTypes.number,
  selRegionId: PropTypes.number
};

export default MaterialPickingList;
