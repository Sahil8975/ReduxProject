import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Button } from '@mui/material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { color } from '@material-ui/system';
import SimpleTable from '../../components/table/simpleTable';
import DialogComponent from '../../components/Dialog';
import { isObject, isArray } from '../../utils/utils';
import Filters from '../../components/Filter/filter';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, STATUS } from '../../utils/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { IS_DATA_LOADING } from '../../redux/constants';
import { getCustomer, updateShortName } from '../../services/CustomerService';
import './CustomersList.scss';

function CustomersList() {
  const { GET_CUSTOMERS } = APIS;
  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [custData, setCustData] = useState([]);
  const [regions, setRegions] = useState([]);
  const emptyFiltersData = {
    countryId: 'all',
    regionId: 'all',
    accountNumber: '',
    customerName: '',
    customerAddress: '',
    customerContact: '',
    pageIndex: 0,
    pageSize: 0
  };
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);

  const columnData = [
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
      style: { width: '30%' }
    },
    {
      field: 'shortName',
      header: 'Short Name',
      sortable: false,
      filter: true,
      style: { width: '25%' }
    }
  ];
  const headCellsType = ['NONE', 'NO_ELLIPSIS', 'NO_ELLIPSIS', 'TEXTFIELD'];
  const numericFields = ['accountNumber'];

  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;
  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'countryId',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      isDisabled: masterData?.country?.length === 1,
      select: true,
      columnWidth: 1.6
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'regionId',
      label: 'Region',
      placeholder: 'Region',
      options: regions,
      isDisabled: !payload?.countryId || regions?.length === 1,
      select: true
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
      getCustomerData({ ...emptyFilters, ...payload });
    } else {
      setCustData([]);
      getCustomerData({
        countryId: 'all',
        regionId: 'all',
        accountNumber: '',
        customerName: '',
        customerAddress: '',
        customerContact: ''
      });
      if (masterData?.country.length !== 1) {
        setRegions([]);
      }
    }
  };

  const setCountryAndRegions = (val, region = 0) => {
    if (val) {
      const filteredRegions = masterData?.regions?.filter((rgn) => rgn.countryId === val * 1);
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
      const region = setCountryAndRegions(val);
      setPayload({ ...payload, [key]: val, regionId: region || 'all' });
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  const getCustomerData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getCustomer(`${API_V1}/${GET_CUSTOMERS}`, payloadData);
    if (res && isObject(res)) {
      const customers = res?.data?.customers || [];
      if (isArray(customers)) {
        const displayData = [];
        customers?.map((item) => {
          const { accountNumber, customerName, addressEn, shortName, id } = item;
          return displayData.push({
            accountNumber,
            customerName,
            addressEn,
            shortName,
            id
          });
        });
        setCustData(displayData);
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        setCustData([]);
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    }
  };

  let changedShortName = [];
  const handleChangeShortName = (options, id) => {
    const item = changedShortName.find((customer) => customer.id === id);
    if (item) {
      item.shortName = options.shortName;
    } else {
      changedShortName.push(options);
    }
  };

  const handSaveAllClick = async () => {
    if (isArray(changedShortName)) {
      const tempPayload = { shortNames: changedShortName };
      const res = await updateShortName(`${API_V1}/${APIS.UPDATE_CUSTOMER_SHORT_NAME}`, tempPayload);
      if (isObject(res)) {
        setShowConfirmBox(false);
        changedShortName = [];
      }
    }
  };

  const clearFunnelFilter = () => handleFunnelFilter();
  const handleCloseSaveShortNameDialog = () => setShowConfirmBox(false);

  const handleFunnelFilter = () => {
    setFunnelFilters({
      accountNumber: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      customerName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      addressEn: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      shortName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  useEffect(() => {
    let regionId = 0;
    let countryId = 0;

    if (masterData?.country?.length === 1) {
      countryId = masterData?.country[0]?.id.toString();
      regionId = setCountryAndRegions(countryId);
    }
    if (countryId) {
      setEmptyFilter({ ...emptyFiltersData, countryId: countryId || 'all', regionId: regionId || 'all' });
    }
    setPayload({
      ...payload,
      countryId: countryId || 'all',
      regionId: regionId || 'all'
    });
  }, []);

  return (
    <Grid className="customer-list-main-cls">
      <DialogComponent
        open={showConfirmBox}
        handleClose={handleCloseSaveShortNameDialog}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
        title="Success!"
        titleType={STATUS.SUCCESS}
        content="Short Names Saved Successfully!"
        color="success"
      />
      <Grid container spacing={3}>
        <Grid item xs={6.5} style={{ display: 'flex', justifyContent: 'flex-end' }} mb={2}>
          <Typography fontWeight="bold" variant="subtitle1">
            Customer List
          </Typography>
        </Grid>
        <Grid
          item
          xs={5.5}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '-0.8rem' }}
          mb={2}
        >
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              handleClickButton: () => handSaveAllClick(),
              btnTitle: 'Save Short Name(s)',
              columnWidth: 3.2,
              textTransform: 'none'
            }}
          />
        </Grid>
        <Grid item xs={12}>
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
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable
            rowData={custData}
            headerData={columnData}
            paginator
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            dataKey="accountNumber"
            editMode="row"
            numericFields={numericFields}
            headCellsType={headCellsType}
            handleChangeShortName={handleChangeShortName}
            clearFilter={clearFunnelFilter}
            filterData={funnelFilters}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomersList;
