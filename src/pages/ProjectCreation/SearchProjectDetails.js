import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, Paper, Container } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Filters from '../../components/Filter/filter';
import SimpleTable from '../../components/table/simpleTable';
import { COMPONENTS } from '../../utils/constants';
import { SearchProjectDetailsData } from '../contracts/Data';
import './SearchProjectDetails.scss';

function SearchProjectDetails({ handleClose, selectedCustomer }) {
  const { t } = useTranslation();
  const [funnelFilters, setFunnelFilters] = useState(null);
  const { TEXT_FIELD } = COMPONENTS;
  const [projectData, setProjectData] = useState([]);
  const emptyFilters = {
    projectNumber: null,
    projectName: null
  };
  const [payload, setPayload] = useState({ ...emptyFilters });
  const FILTER_COMPONETS = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectNumber',
      label: 'Project Number'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectName',
      label: 'Project Name'
    }
  ];
  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getProjectData();
    } else {
      setProjectData([]);
    }
  };
  const getFilterDataPayloadChange = (key, val) => {
    setPayload({ ...payload, [key]: val || '' });
  };

  const getProjectData = async () => {
    if (SearchProjectDetailsData) {
      const displayData = [];
      SearchProjectDetailsData?.map((item) => {
        const { projectNumber, projectName, projectBusinessCategory, executionType } = item;
        return displayData.push({
          projectNumber,
          projectName,
          projectBusinessCategory,
          executionType
        });
      });
      setProjectData(displayData);
    } else {
      setProjectData([]);
    }
  };

  const columnForProject = [
    {
      field: 'projectNumber',
      header: 'Project Number',
      sortable: true,
      filter: true
    },
    {
      field: 'projectName',
      header: 'Project Name',
      sortable: true,
      filter: true
    },
    {
      field: 'projectBusinessCategory',
      header: 'Project Business Category',
      sortable: true,
      filter: true
    },
    {
      field: 'executionType',
      header: 'Execution Type',
      sortable: true,
      filter: true
    },
    {
      field: 'select',
      header: '',
      icon: <ArrowCircleRightOutlinedIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: selectedCustomer,
      tooltipTitle: 'Click to Select'
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'ICON'];
  const numericFields = ['projectNumber'];

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const handleFunnelFilter = () => {
    setFunnelFilters({
      projectNumber: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      projectName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      projectBusinessCategory: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      executionType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

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
          <Grid item xs={9} style={{ display: 'flex', marginTop: '0.5rem' }}>
            <Typography variant="h6">Talmik Towers, HSDCJD_00012 (Active), Impact BIBO | General Contract</Typography>
          </Grid>
          <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button
              style={{ boxShadow: 'none' }}
              size="small"
              variant="contained"
              onClick={handleClose}
              startIcon={<CloseIcon />}
            >
              {t('employeeList.close')}
            </Button>
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
              rowData={projectData}
              headerData={columnForProject}
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
              isResetFilter
            />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

SearchProjectDetails.propTypes = {
  handleClose: PropTypes.func,
  selectedCustomer: PropTypes.func
};

export default SearchProjectDetails;
