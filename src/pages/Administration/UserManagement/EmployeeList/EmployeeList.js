import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Button, Paper, Container } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Filters from '../../../../components/Filter/filter';
import SimpleTable from '../../../../components/table/simpleTable';
import { COMPONENTS } from '../../../../utils/constants';
import RenderComponent from '../../../../components/RenderComponent';
import { isObject, isArray } from '../../../../utils/utils';
// import { getColorCode, getEmployees } from '../../../../services/employeeService';
import { getEmployees } from '../../../../services/employeeService';
import { APIS, API_V1 } from '../../../../utils/apiList';
import { getLegalEntities } from '../../../../services/masterDataService';
import { IS_DATA_LOADING, POST_LEGAL_ENTITIES } from '../../../../redux/constants';
import './EmployeeList.scss';

function EmployeeList({ handleClose, selectedEmployee }) {
  const { GET_EMPLOYEES } = APIS;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleActionDispatch = (type, data = []) => dispatch({ type, data });
  const masterData = useSelector((state) => state.MasterDataReducer);
  const [funnelFilters, setFunnelFilters] = useState(null);
  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;
  const [employeeData, setEmployeeData] = useState([]);
  const emptyFiltersData = {
    legalEntityId: 'all',
    employeeId: '',
    employeeName: '',
    pageIndex: 0,
    pageSize: 0,
    isIncludeUsers: false
  };
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);

  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'legalEntityId',
      label: 'employeeList.legalEntity',
      placeholder: 'employeeList.legalEntity',
      options: masterData?.legalEntity,
      isDisabled: masterData?.legalEntity?.length === 1,
      columnWidth: 2
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'employeeId',
      label: `${t('employeeList.employeeID')}`
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'employeeName',
      label: `${t('employeeList.employeeName')}`
    }
  ];
  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getEmployeeData({ ...emptyFilters, ...payload });
    } else {
      setEmployeeData([]);
    }
  };
  const getFilterDataPayloadChange = (key, val) => {
    setPayload({ ...payload, [key]: val });
  };

  const getLegalEntitiesList = async () => {
    const res = await getLegalEntities(`${API_V1}/${APIS.GET_LEGAL_ENTITIES}`);
    handleActionDispatch(POST_LEGAL_ENTITIES, res?.data || []);
  };

  const getEmployeeData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getEmployees(`${API_V1}/${GET_EMPLOYEES}`, payloadData);
    if (res && isObject(res)) {
      const employees = res?.data?.employees || [];
      if (isArray(employees)) {
        const displayData = [];
        employees.forEach((item) => {
          const {
            employeeId,
            axEmployeeId,
            employeeName,
            countryCode,
            legalEntityId,
            legalEntity,
            mobileNo,
            email,
            phoneNumberCode
          } = item;
          return displayData.push({
            axEmployeeId,
            employeeName,
            legalEntity,
            select: null,
            countryCode,
            mobileNo,
            email,
            employeeId,
            legalEntityId,
            phoneNumberCode
          });
        });
        setEmployeeData(displayData);
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        setEmployeeData([]);
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    }
  };
  const selecteEmployee = async (data) => {
    selectedEmployee({ ...data });
    handleClose();
  };

  const columnForEmployee = [
    {
      field: 'axEmployeeId',
      header: `${t('employeeList.employeeID')}`,
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'employeeName',
      header: `${t('employeeList.employeeName')}`,
      sortable: true,
      filter: true,
      style: { width: '60%' }
    },
    {
      field: 'legalEntity',
      header: `${t('employeeList.legalEntityCode')}`,
      sortable: true,
      filter: true,
      style: { width: '20%' }
    },
    {
      field: 'select',
      header: '',
      icon: <ArrowCircleRightOutlinedIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: selecteEmployee,
      tooltipTitle: 'Click to Select',
      placement: 'left',
      style: { width: '10%' }
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'ICON'];
  const numericFields = ['axEmployeeId', 'legalEntity'];

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const funnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      employeeId: funnelFilterObj(),
      employeeName: funnelFilterObj(),
      legalEntity: funnelFilterObj()
    });
  };

  useEffect(() => {
    getLegalEntitiesList();
    getEmployeeData();
  }, []);

  useEffect(() => {
    let legalEntityId = 0;

    if (masterData?.legalEntity?.length === 1) {
      legalEntityId = masterData?.legalEntity[0]?.id.toString();
    }
    if (legalEntityId) {
      setEmptyFilter({ ...emptyFiltersData, legalEntityId: legalEntityId || 'all' });
    }
    setPayload({
      ...payload,
      legalEntityId: legalEntityId || 'all'
    });
  }, []);

  return (
    <Paper>
      <Container
        style={{
          padding: '1rem',
          boxShadow: `0px 0px 2.5px 2.5px #F8F9FA`,
          marginTop: 0,
          borderRadius: '15px',
          maxWidth: '1200px'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Typography variant="h6" align="center">
              {t('employeeList.employeeList')}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <RenderComponent
              metaData={{
                control: BUTTON,
                color: 'warning',
                handleClickButton: () => handleClose(),
                btnTitle: 'close',
                columnWidth: 2.2,
                startIcon: <CloseIcon />
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
          {/* DataTable Layout */}
          <Grid item xs={12}>
            <SimpleTable
              rowData={employeeData}
              headerData={columnForEmployee}
              paginator
              rows={10}
              showGridlines
              responsiveLayout="scroll"
              resizableColumns
              columnResizeMode="expand"
              size="small"
              dataKey="axEmployeeId"
              editMode="row"
              numericFields={numericFields}
              headCellsType={headCellsType}
              clearFilter={clearFunnelFilter}
              filterData={funnelFilters}
            />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

EmployeeList.propTypes = {
  handleClose: PropTypes.func,
  selectedEmployee: PropTypes.object
};

export default EmployeeList;
