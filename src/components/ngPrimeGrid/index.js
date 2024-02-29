import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Grid, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, connect, useSelector } from 'react-redux';
import { jsonData } from '../../utils/tableData';
import Filters from '../Filter/filter';
import RenderComponent from '../RenderComponent';
import { COMPONENTS } from '../../utils/constants';
import { SEVICE_DASHBOARD_FILTER_MASTER_DATA } from '../ServiceBoard/data';
import { POST_OFFICE } from '../../redux/constants';
import '../../Styles/app.scss';

function PrimeGrid({ handleClose }) {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(ThemeSettingChange());
  // });
  const emptyFilters = { code: null, desc: null, qty: null, uom: null, hqty: null, hand: null, ovan: null, fvan: null };
  const [payload, setPayload] = useState({ ...emptyFilters });
  const [tableData, setTableData] = useState(jsonData);
  const [selected, setSelected] = useState(null);
  const onRowEditComplete = (e) => {
    const _tableData = [...tableData];
    const { newData, index } = e;
    _tableData[index] = newData;
    setTableData(_tableData);
  };
  const textEditor = (options) => (
    <InputText
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      style={{ minWidth: '11rem' }}
    />
  );

  const globalFilter = null;

  const detailsBody = () => <Button variant="contained">Details</Button>;

  const { TEXT_FIELD, AUTOCOMPLETE, BUTTON } = COMPONENTS;
  const FILTER_COMPONETS = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'stockCode',
      label: 'Stock Code'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'description',
      label: 'Description'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'qty',
      label: 'Qty',
      placeholder: 'Qty'
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'invUOM',
      label: 'Inv UOM',
      placeholder: 'Inv UOM',
      options: masterData?.office
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'holdQty',
      label: 'Hold Qty'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'onHhand',
      label: 'On-hand'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'onvan',
      label: 'On-van'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'fromvan',
      label: 'From-van'
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'business',
      label: 'serviceDashboard.business',
      placeholder: 'serviceDashboard.business',
      options: masterData?.business
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'Status',
      label: 'Status',
      placeholder: 'Status',
      options: masterData?.projectStatus
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'expirationDateOffset',
      label: 'Expiration date offset',
      placeholder: 'Expiration date offset',
      options: masterData?.projectStatus
    }
  ];
  const getFilterData = (data, callApi) => {
    if (callApi) {
      console.log('Filtered data: ', data);
    }
  };
  const getFilterDataPayloadChange = (key, val) => {
    if (key === 'country') {
      const country = SEVICE_DASHBOARD_FILTER_MASTER_DATA.OFFICE.find((office) => office.country === val);
      if (country) {
        dispatch({ type: POST_OFFICE, data: country.offices });
      }
      setPayload({ ...payload, [key]: val || 0 });
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  return (
    <div className="materialPicking_main_cls">
      <Grid container spacing={4}>
        <Grid item xs={7}>
          <Typography fontWeight="bold" variant="subtitle1" align="end">
            Service Requirement List
          </Typography>
        </Grid>
        <Grid item xs={5} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
          <RenderComponent
            metaData={{
              control: BUTTON,
              size: 'medium',
              color: 'success',
              handleClickButton: () => handleClose(),
              startIcon: <CloseIcon />,
              btnTitle: 'Close',
              columnWidth: '2.3'
            }}
          />
        </Grid>
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
        <Grid item xs={12}>
          <DataTable
            value={tableData}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            paginator
            rows={10}
            selection={selected}
            onSelectionChange={(e) => setSelected(e.value)}
            editMode="row"
            onRowEditComplete={onRowEditComplete}
            reorderableColumns
            dataKey="code"
            // onRowReorder={onRowReorder}
            scrollable
            scrollHeight="400px"
            filterDisplay="menu"
            globalFilterFields={['code', 'desc', 'qty', 'uom', 'hqty', 'hand', 'ovan', 'fvan']}
            rowsPerPageOptions={[10, 20, 50, 100]}
            globalFilter={globalFilter}
            style={{ marginTop: '10px' }}
            // filters={filters1}
          >
            {/* <Column columnKey="rowreorder" field="rowreorder" rowReorder style={{ width: '3em' }} /> */}
            <Column
              columnKey="selection"
              field="selection"
              selectionMode="multiple"
              reorderable={false}
              style={{
                minWidth: '3rem',
                width: '3rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem'
              }}
            />
            <Column
              columnKey="code"
              field="code"
              header="Stock Code"
              sortable
              editor={(options) => textEditor(options)}
              reorderable={false}
              filter
              filterclear
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="desc"
              field="desc"
              header="Description"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                // Making Ellipsis for lengthy descriptions
                // If I set display to inline-block it moves text up (though negligible difference when viewed)
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem'
              }}
            />
            <Column
              columnKey="qty"
              field="qty"
              header="Qty"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="uom"
              field="uom"
              header="Inv UOM"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem'
              }}
            />
            <Column
              columnKey="hqty"
              field="hqty"
              header="Hold Qty"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="hand"
              field="hand"
              header="On-hand"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="ovan"
              field="ovan"
              header="Van-Stock"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="fvan"
              field="fvan"
              header="From-Van"
              sortable
              editor={(options) => textEditor(options)}
              filter
              style={{
                minWidth: '12rem',
                width: '12rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
            />
            <Column
              columnKey="edit"
              rowEditor
              headerstyle={{ width: '10%', minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'center' }}
              style={{
                minWidth: '5rem',
                maxWidth: '5rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem',
                justifyContent: 'center'
              }}
              reorderable={false}
            />
            <Column
              columnKey="details"
              body={detailsBody}
              style={{
                minWidth: '6rem',
                width: '6rem',
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem'
              }}
            />
          </DataTable>
        </Grid>
      </Grid>
    </div>
  );
}

function mapStateToProps(state) {
  const { theme } = state.ThemeReducer;
  return {
    theme
  };
}
PrimeGrid.propTypes = {
  handleClose: PropTypes.func
};

export default connect(mapStateToProps)(PrimeGrid);
