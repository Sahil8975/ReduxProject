import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import { COMPONENTS } from '../../utils/constants';
import { getMobileWarehouse, getMobileWarehouseItems } from '../../services/mobileWarehouseService';
import { APIS, API_V1 } from '../../utils/apiList';
import './MobileWarehouseList.scss';
import { isArray } from '../../utils/utils';

function MobileWarehouseList() {
  const [warehouseList, setWarehouseList] = useState([]);
  const masterData = useSelector((state) => state.MasterDataReducer);
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [mobileWarehouseData, setMobileWarehouseData] = useState([]);
  const [mobileWarehouseItemList, setMobileWarehouseItemList] = useState([]);
  const [warehouseServicemens, setWarehouseServicemens] = useState([]);

  const emptyFilters = {
    warehouse: 'all',
    serviceman: 'all'
  };
  const [payload, setPayload] = useState({ ...emptyFilters });

  const getMobileWarehouseData = async () => {
    const res = getMobileWarehouse(`${API_V1}/${APIS.GET_MOBILE_WAREHOUSE_DATA}`);
    setMobileWarehouseData(res);
  };

  const getMobileWarehouseItemList = async () => {
    const res = getMobileWarehouseItems(`${API_V1}/${APIS.GET_MOBILE_WAREHOUSE_ITEM_LIST}`);
    setMobileWarehouseItemList(res);
  };

  const columnForSalesman = [
    {
      field: 'stockCode',
      header: 'Stock Code',
      sortable: true,
      filter: true
    },
    {
      field: 'description',
      header: 'Description',
      sortable: true,
      filter: true
    },
    {
      field: 'qty',
      header: 'Quantity',
      sortable: false,
      filter: false
    },
    {
      field: 'uom',
      header: 'UOM',
      sortable: true,
      filter: true
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE'];
  const numericFields = ['stockCode', 'qty'];

  const { SELECT_BOX } = COMPONENTS;
  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'warehouse',
      label: 'warehouse.warehouse',
      placeholder: 'warehouse.warehouse',
      options: mobileWarehouseItemList,
      select: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceman',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: warehouseServicemens,
      select: true
    }
  ];

  const getFilterData = (data, callApi) => {
    if (callApi) {
      getMobileWarehouseData();
      getMobileWarehouseItemList();
    } else {
      setMobileWarehouseData([]);
      setMobileWarehouseItemList([]);
    }
  };
  const getFilterDataPayloadChange = (key, val) => {
    if (key === 'warehouse') {
      if (val && isArray(masterData?.servicemens)) {
        const servicemens = masterData?.servicemens?.filter((sm) => sm.warehouse === val);
        if (isArray(servicemens)) {
          setWarehouseServicemens(servicemens);
          return;
        }
      }
      setPayload({ ...payload, [key]: val, serviceman: 'all' });
      setWarehouseServicemens([]);
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  const prepareMobileWarehouseData = () => {
    if (mobileWarehouseData) {
      const displayData = [];
      mobileWarehouseData.forEach((item) => {
        const { stockCode, description, qty, uom } = item;
        displayData.push({ stockCode, description, qty, uom });
      });
      if (displayData.length > 0) {
        setWarehouseList(displayData);
      }
    }
  };

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const handleFunnelFilter = () => {
    setFunnelFilters({
      stockCode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      description: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      uom: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  useEffect(() => {
    prepareMobileWarehouseData();
  }, [mobileWarehouseData]);

  return (
    <Grid className="mobile-warehouse-list-main-cls">
      <Grid container spacing={3}>
        <Grid mt={2} item xs={12}>
          <Typography variant="h4" align="center">
            Mobile Warehouse Item List
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
            rowData={warehouseList}
            headerData={columnForSalesman}
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
  );
}

export default MobileWarehouseList;
