import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Button, Checkbox, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { COMPONENTS, rowsPerPageOptions, contractListPageOptions, THEME, MAX_LENGTH } from '../../utils/constants';
import useSettings from '../../hooks/useSettings';
import RenderComponent from '../RenderComponent';
import Loader from '../LoaderComponent/Loader';
import ngPrimeGrid from '../ngPrimeGrid';
import '../../Styles/app.scss';

export default function SimpleTable({
  rowData,
  headerData,
  editOption,
  showActionColumn,
  type,
  title,
  btnLabel,
  numericFields,
  headCellsType,
  // isActionBtn = false,
  // actionBtnText,
  // btnStyle,
  // handleActionBtnClick,
  handleChangeShortName,
  clearFilter,
  filterData,
  dataKey,
  onRowClick,
  isContractPaginator,
  isResetFilter = false,
  // placement,
  // tooltipTitle,
  ...other
}) {
  const isDataLoading = useSelector((state) => state.MasterDataReducer?.isDataLoading);
  const { themeMode } = useSettings();
  const [tableData, setTableData] = useState();
  const [editingRows, setEditingRows] = useState({});
  const [filterState, setFilterState] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const { t } = useTranslation();

  const { TEXT_FIELD, DATEPICKER } = COMPONENTS;

  const onRowEditChange = (e) => {
    setEditingRows(e.data);
  };

  const onRowEditComplete = (e) => {
    const _tableData = [...tableData];
    const { newData, index } = e;
    _tableData[index] = newData;
    setTableData(_tableData);
  };
  const globalFilter = null;
  // const header = (
  //   <div className="datatable-crud-demo">
  //     <div className="table-header">
  //       {/* {isActionBtn && (
  //         <Button {...btnStyle} size="small" variant="contained" onClick={handleActionBtnClick}>
  //           {actionBtnText}
  //         </Button>
  //       )} */}
  //     </div>
  //   </div>
  // );

  const setActiveRowIndex = (index) => {
    const editingRow = {
      ...editingRows,
      ...{ [`${tableData[index].id}`]: true }
    };
    setEditingRows(editingRow);
  };

  const switchEditor = (editorFlag, options) => {
    switch (editorFlag) {
      case 'text':
        return (
          <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
            style={{ minWidth: '12rem' }}
          />
        );
      case 'checkbox':
        return <Checkbox checked={options.value} onChange={(e) => options.editorCallback(e.target.checked)} />;
      default:
        return (
          <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
            style={{ minWidth: '12rem' }}
          />
        );
    }
  };

  const addNewProject = () => {
    const currentTableData = tableData;
    currentTableData.unshift({ id: Math.floor(Math.random() * 10000) });
    setTableData(currentTableData);
    setActiveRowIndex(0);
  };

  const isEmpty = (obj) => Object.keys(obj).length === 0;
  if (isEmpty(filterState)) {
    const filterSetData = {};
    headerData?.map((headerElement) => {
      filterSetData[headerElement.field] = {
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      };
      return null;
    });
    setFilterState(filterSetData);
  }
  const ActionBody = (options) => {
    switch (type) {
      case 'text':
        return (
          <Typography onClick={() => handleClick(options)} style={{ cursor: 'pointer' }}>
            {title}
          </Typography>
        );
      case 'button':
        return (
          <Button variant="contained" size="small">
            {title}
          </Button>
        );
      default:
        return undefined;
    }
  };

  const editIcon = () => <EditIcon />;

  const handleChangeDate = (key, value, options) => {
    // find id and index from json and update that value
    // Find index of specific object using findIndex method.
    const objIndex = rowData.indexOf(options);
    if (objIndex !== -1) {
      rowData[objIndex][key] = value;
    }
    setIsUpdate(true);
  };
  useEffect(() => {
    if (isUpdate) {
      console.log('calling..date change');
      setIsUpdate(false);
    }
  }, [isUpdate]);

  const handleChangeTextfield = (key, value, options) => {
    const objIndex = rowData.indexOf(options);
    if (objIndex !== -1) {
      rowData[objIndex][key] = value;
    }
    setIsUpdate(true);
    const tempOptions = { id: options?.id, shortName: options?.shortName };
    handleChangeShortName(tempOptions, options?.id);
  };
  const handleClickLink = (rowData) => console.log('rowData...', rowData);

  const truncateString = (str, n) => {
    if (str?.length > n) {
      return `${str.substring(0, n)} ...`;
    }
    return str;
  };

  const isValid = (val) => val?.length > 25;

  const handleChangeBody = (options, idx) => {
    const key = Object.keys(options)[idx];
    const newVal = { key, value: options[key] };
    switch (headCellsType[idx]) {
      case 'BUTTON':
        return (
          <Tooltip title={newVal.value}>
            <Button variant="contained" tooltip={newVal.value}>
              {newVal.value}
            </Button>
          </Tooltip>
        );
      case 'NO_ELLIPSIS':
        return (
          <Tooltip title={newVal?.value}>
            <Typography style={{ fontSize: '13px' }}>{truncateString(newVal?.value, 50)}</Typography>
          </Tooltip>
        );
      case 'NONE':
        return (
          <Tooltip title={newVal?.value}>
            <Typography style={{ fontSize: '13px' }}>{newVal?.value}</Typography>
          </Tooltip>
        );
      case 'TEXTFIELD':
        if (newVal) {
          return (
            <Grid style={{ marginTop: '0.1rem', marginBottom: '0.1rem' }}>
              <RenderComponent
                metaData={{
                  control: TEXT_FIELD,
                  groupStyle: { paddingTop: '0rem' },
                  key: `${newVal?.key}`,
                  label: '',
                  placeholder: '',
                  columnWidth: 12,
                  size: 'large',
                  tooltipTitle: t('simpleTable.max25chars'),
                  placement: 'left',
                  isError: isValid(newVal.value) && `${newVal.value}`,
                  helperText: isValid(newVal.value) && t('simpleTable.max25chars'),
                  maxCharacterLimit: MAX_LENGTH?.MAX_CHARACTER_LIMIT
                }}
                payload={{ [newVal?.key]: newVal?.value }}
                ind={1}
                handleChange={(key, val) => handleChangeTextfield(key, val, options)}
              />
            </Grid>
          );
        }
        break;
      case 'LINK':
        return (
          <Tooltip title={newVal.value}>
            <Typography
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '13px',
                color: 'blue'
              }}
              onClick={() => handleClickLink(options)}
            >
              {newVal.value}
            </Typography>
          </Tooltip>
        );
      case 'DATE':
        return (
          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <RenderComponent
              metaData={{
                control: DATEPICKER,
                key: `${newVal?.key}`,
                label: `${newVal?.key}`,
                placeholder: `${newVal?.key}`,
                columnWidth: 12,
                size: 'large'
              }}
              payload={{ [newVal?.key]: newVal?.value }}
              ind={1}
              handleChange={(key, val) => handleChangeDate(key, val, options)}
            />
          </div>
        );
      case 'ICON':
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip
              title={(newVal.value === 'icon2' && headerData[idx].tooltipTitle2) || headerData[idx].tooltipTitle}
              placement={headerData[idx].placement}
            >
              <span
                onClick={() => headerData[idx].onClick && headerData[idx].onClick(options)}
                onKeyDown={() => headerData[idx].onClick && headerData[idx].onClick(options)}
                role="button"
                tabIndex={0}
              >
                {(newVal.value === 'icon2' && headerData[idx].icon2) || headerData[idx].icon}
              </span>
            </Tooltip>
          </div>
        );
      default:
        return undefined;
    }
  };

  const handleClick = (options) => console.log('selected row...', options);
  return (
    <Grid container spacing={1}>
      <Helmet>
        <link
          rel="stylesheet"
          href={`https://unpkg.com/primereact/resources/themes/lara-${themeMode}-indigo/theme.css`}
        />
      </Helmet>
      {btnLabel && (
        <Grid item display="flex" justifyContent="flex-end" xs={12} lg={12}>
          <Button variant="contained" size="small" onClick={addNewProject}>
            {btnLabel}
          </Button>
        </Grid>
      )}
      <Grid item xs={12} lg={12}>
        <DataTable
          className={themeMode === THEME.DARK ? 'dark-mode' : ''}
          filters={filterData}
          // header={header}
          globalFilter={globalFilter}
          value={rowData}
          removableSort
          editingRows={editingRows}
          dataKey={dataKey}
          rowHover
          onRowEditChange={onRowEditChange}
          onRowEditComplete={onRowEditComplete}
          onRowClick={onRowClick}
          filterDisplay="menu"
          responsiveLayout="scroll"
          emptyMessage={isDataLoading ? 'LOADING...' : 'NO DATA FOUND'}
          rowsPerPageOptions={isContractPaginator ? contractListPageOptions : rowsPerPageOptions}
          headerStyles={{ textAlign: 'center' }}
          // scrollable
          {...other}
        >
          {headerData?.map((headerElement, idx) => (
            <Column
              key={idx}
              // frozen={headerElement.isFrozen}
              // style={{
              //   position: `${headerElement.isFrozen ? 'sticky' : ''}`
              // }}
              editor={(options) => switchEditor(headerElement.editorElement, options)}
              {...headerElement}
              bodyStyle={{
                textAlign: `${numericFields && numericFields.includes(headerElement.field) ? 'center' : ''}`
              }}
              className={numericFields && numericFields.includes(headerElement.field) ? 'd-data-cls' : ''}
              body={(options) => handleChangeBody(options, idx)}
            />
          ))}
          {editOption ? <Column field="Action" header="Action" body={(options) => editIcon(options)} /> : null}
          {showActionColumn ? (
            <Column
              field="Action"
              header="Action"
              columnKey="actionKey"
              body={(options) => ActionBody(options)}
              style={{
                paddingBottom: '0.1rem',
                paddingTop: '0.1rem'
              }}
            />
          ) : null}
        </DataTable>
        {isResetFilter && (
          <Grid className="reset-dataTable-filter-cls" item xs={3}>
            <Button onClick={clearFilter} variant="contained" size="small">
              Reset
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

SimpleTable.propTypes = {
  rowData: PropTypes.object,
  headerData: PropTypes.object,
  editOption: PropTypes.bool,
  showActionColumn: PropTypes.bool,
  type: PropTypes.bool,
  title: PropTypes.string,
  btnLabel: PropTypes.string,
  numericFields: PropTypes.object,
  headCellsType: PropTypes.object,
  // isActionBtn: PropTypes.bool,
  // actionBtnText: PropTypes.string,
  // btnStyle: PropTypes.object,
  // handleActionBtnClick: PropTypes.func,
  handleChangeShortName: PropTypes.func,
  clearFilter: PropTypes.func,
  filterData: PropTypes.object,
  dataKey: PropTypes.string,
  onRowClick: PropTypes.func,
  isContractPaginator: PropTypes.bool,
  isResetFilter: PropTypes.bool
};
