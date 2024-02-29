import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Grid, Typography } from '@mui/material';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import { COMPONENTS } from '../../utils/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { isObject, isArray } from '../../utils/utils';
import { IS_DATA_LOADING } from '../../redux/constants';
import { getServiceman } from '../../services/ServicemanService';
import './ServicemanList.scss';

function ServicemanList() {
  const dispatch = useDispatch();
  const { GET_SERVICEMAN } = APIS;
  const [servicemanData, setServicemanData] = useState([]);
  const [regions, setRegions] = useState([]);
  const emptyFiltersData = {
    userIds: [],
    countryId: 'all',
    regionId: 'all',
    businessTypeId: 'all',
    pageIndex: 0,
    pageSize: 0
  };
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);
  const [funnelFilters, setFunnelFilters] = useState(null);
  const masterData = useSelector((state) => state.MasterDataReducer);

  const columnForServiceman = [
    {
      field: 'name',
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
      field: 'businessType',
      header: 'Business Type',
      sortable: true,
      filter: true,
      style: { width: '13%' }
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
      style: { width: '42%', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
  const numericFields = ['shortName', 'businessType', 'mobileNumber'];

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
      options: regions,
      isDisabled: !payload?.countryId || regions?.length === 1,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'businessTypeId',
      label: 'Business Type',
      placeholder: 'Business Type',
      options: masterData?.businessType,
      select: true
    }
  ];
  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getServicemanData({ ...emptyFilters, ...payload });
    } else {
      setServicemanData([]);
      getServicemanData({
        userIds: [],
        countryId: 'all',
        regionId: 'all',
        businessTypeId: 'all'
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

  const getServicemanData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getServiceman(`${API_V1}/${GET_SERVICEMAN}`, payloadData);
    if (res && isObject(res)) {
      const serviceman = res?.data?.servicemans || [];
      if (isArray(serviceman)) {
        const displayData = [];
        serviceman?.map((item) => {
          const { id, name, shortName, businessType, mobileNumber, regions } = item;
          return displayData.push({
            name,
            shortName,
            businessType,
            mobileNumber,
            regions,
            id
          });
        });
        setServicemanData(displayData);
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        setServicemanData([]);
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    }
  };

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const handleFunnelFilter = () => {
    setFunnelFilters({
      servicemanName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      shortName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      businessType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      mobileNumber: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  useEffect(() => {
    getServicemanData();
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
    <Grid className="serviceman-list-main-cls">
      <Grid container spacing={5}>
        <Grid mt={2} item xs={12}>
          <Typography fontWeight="bold" variant="subtitle1" align="center">
            Servicemen
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
            rowData={servicemanData}
            headerData={columnForServiceman}
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

export default ServicemanList;
