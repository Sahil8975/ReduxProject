import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Divider } from '@mui/material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import SimpleTable from '../../../components/table/simpleTable';
import { API_V1 } from '../../../utils/apiList';
import { isArray } from '../../../utils/utils';
import { getCountryListData } from './CountryListService';
import { ROUTES } from '../../../routes/paths';
import './countrylist.scss';

function CountryList() {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState(null);
  const editingRows = {};
  const [funnelFilters, setFunnelFilters] = useState(null);
  const headCellsType = ['NONE', 'NONE'];
  const numericfields = ['name', 'currency'];

  const countryheaders = [
    {
      field: 'name',
      header: 'Country Name',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'currency',
      header: 'Currency',
      editorElement: null,
      sortable: true,
      filter: true
    }
  ];

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const handleFunnelFilter = () => {
    setFunnelFilters({
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      currency: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  const getCountryList = async () => {
    const res = await getCountryListData(`${API_V1}${ROUTES.CURRENCY_LIST}?countryId=0`); // As discussed country id hardcode for now
    if (res?.data && isArray(res?.data)) {
      const list = res?.data.map((el) => ({ name: el.countryName, currency: el.currencyCode }));
      setTableData(list);
    } else {
      setTableData(null);
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <Grid className="countryListMainCls">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle1" align="center">
            {t('CountryList.CountryList')}
          </Typography>
        </Grid>
        {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained">{t('CountryList.AddNewCountry')}</Button>
        </Grid> */}
        <Grid item xs={12}>
          <Divider style={{ backgroundColor: '#c7d2fe' }} />
        </Grid>
        <Grid item xs={12}>
          <SimpleTable
            rowData={tableData}
            headerData={countryheaders}
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            editingRows={editingRows}
            dataKey="id"
            editMode="row"
            headCellsType={headCellsType}
            numericFields={numericfields}
            isGlobalFilter={false}
            clearFilter={clearFunnelFilter}
            filterData={funnelFilters}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CountryList;
