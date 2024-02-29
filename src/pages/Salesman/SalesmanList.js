import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Grid, Typography } from '@mui/material';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import { COMPONENTS } from '../../utils/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { isObject, isArray } from '../../utils/utils';
import { IS_DATA_LOADING } from '../../redux/constants';
import { getSalesman } from '../../services/SalesmanService';
import './SalesmanList.scss';

function SalesmanList() {
  const { GET_SALESMAN } = APIS;
  const dispatch = useDispatch();
  const [salesmanData, setSalesmanData] = useState([]);
  const masterData = useSelector((state) => state.MasterDataReducer);
  const [regions, setRegions] = useState([]);
  const emptyFiltersData = {
    userIds: [],
    countryId: 'all',
    regionId: 'all',
    pageIndex: 0,
    pageSize: 0
  };
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);

  const [funnelFilters, setFunnelFilters] = useState(null);

  const getSalesmanData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSalesman(`${API_V1}/${GET_SALESMAN}`, payloadData);
    if (res && isObject(res)) {
      const salesman = res?.data?.salesmans || [];
      if (isArray(salesman)) {
        const displayData = [];
        salesman?.map((item) => {
          const { salesmanName, shortName, mobileNumber, regions, id } = item;
          return displayData.push({
            salesmanName,
            shortName,
            mobileNumber,
            regions,
            id
          });
        });
        setSalesmanData(displayData);
      } else {
        setSalesmanData([]);
      }
      dispatch({ type: IS_DATA_LOADING, data: false });
    }
  };

  const columnForSalesman = [
    {
      field: 'salesmanName',
      header: 'Name',
      sortable: true,
      filter: true,
      style: { width: '17%' }
    },
    {
      field: 'shortName',
      header: 'Short Name',
      sortable: true,
      filter: true,
      style: { width: '12%' }
    },
    {
      field: 'mobileNumber',
      header: 'Mobile Number',
      sortable: true,
      filter: true,
      style: { width: '15%' }
    },
    {
      field: 'regions',
      header: 'Region',
      sortable: true,
      filter: true,
      style: { width: '50%', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE'];
  const numericFields = ['shortName', 'mobileNumber'];

  const { SELECT_BOX } = COMPONENTS;
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
      isDisabled: !payload?.countryId || regions?.length === 1,
      options: regions,
      select: true
    }
  ];

  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getSalesmanData({ ...emptyFilters, ...payload });
    } else {
      setSalesmanData([]);
      getSalesmanData({
        userIds: [],
        countryId: 'all',
        regionId: 'all'
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

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const funnelFiltersObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      salesmanName: funnelFiltersObj(),
      shortName: funnelFiltersObj(),
      mobileNumber: funnelFiltersObj(),
      regions: funnelFiltersObj()
    });
  };

  useEffect(() => {
    getSalesmanData();
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
    <Grid style={{ padding: '10px 20px', width: '100%', margin: '-35px auto' }}>
      <Grid container spacing={3}>
        <Grid mt={2} item xs={12}>
          <Typography fontWeight="bold" variant="subtitle1" align="center">
            Salesmen
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* Filter Section */}
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
        <Grid item xs={12}>
          <SimpleTable
            rowData={salesmanData}
            headerData={columnForSalesman}
            paginator
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="fit"
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
  );
}

export default SalesmanList;
