import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Typography, Button } from '@mui/material';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import { COMPONENTS } from '../../utils/constants';
import { SEVICE_DASHBOARD_FILTER_MASTER_DATA } from '../../components/ServiceBoard/data';
import { POST_OFFICE } from '../../redux/constants';
import { ProjectEquivalencyTableData } from './Data';
import './ProjectEquivalencyList.scss';

function ProjectEquivalencyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectEquivalencyData, setProjectEquivalencyData] = useState([]);
  const masterData = useSelector((state) => state.MasterDataReducer);

  const emptyFilters = {
    country: 'all',
    region: 'all',
    projectClassification: null,
    businessType: 'all',
    businessSubType: 'all',
    projectBusinessCategory: 'all',
    fdBusinessUnit: null,
    projectType: 'all',
    hourCostCatID: null,
    hourCostCategoryDescription: null
  };
  const [payload, setPayload] = useState({ ...emptyFilters });

  const { AUTOCOMPLETE } = COMPONENTS;
  const {
    country,
    office,
    projectClassification,
    businessType,
    businessSubType,
    projectBusinessCategory,
    fdBusinessUnit,
    projectType,
    hourCostCatID,
    hourCostCatDescription
  } = masterData;

  const handleClickEdit = (val) => {
    navigate(`/projectEquivalency/edit/${val.id}`, { state: val }, { replace: true });
  };

  const FILTER_COMPONETS = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'country',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: country
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'region',
      label: 'Region',
      placeholder: 'Region',
      options: office
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectClassification',
      label: 'Project Classification',
      placeholder: 'Project Classification',
      options: projectClassification,
      columnWidth: 2,
      isDisabled: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'businessType',
      label: 'Business Type',
      placeholder: 'Business Type',
      options: businessType
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'businessSubType',
      label: 'Business Subtype',
      placeholder: 'Business Subtype',
      options: businessSubType
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectBusinessCategory',
      label: 'Project Business Category',
      placeholder: 'Project Business Category',
      options: projectBusinessCategory,
      columnWidth: 2,
      isDisabled: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '1.9rem', marginRight: '0.5rem' },
      key: 'fdBusinessUnit',
      label: 'FD Business Unit',
      placeholder: 'FD Business Unit',
      options: fdBusinessUnit,
      isDisabled: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectType',
      label: 'Project Type',
      placeholder: 'Project Type',
      options: projectType,
      isDisabled: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'hourCostCatID',
      label: 'Hour Cost Cat ID',
      placeholder: ' Hour Cost Cat ID',
      options: hourCostCatID,
      isDisabled: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'hourCostCategoryDescription',
      label: 'Hour Cost Category Description',
      placeholder: 'Hour Cost Category Description',
      options: hourCostCatDescription,
      columnWidth: 3,
      isDisabled: true
    }
  ];

  const columnForProjectEquivalency = [
    {
      field: 'country',
      header: 'Country',
      sortable: true,
      filter: true
    },
    {
      field: 'region',
      header: 'Region',
      sortable: true,
      filter: true
    },
    {
      field: 'projectClassification',
      header: 'Project Classification',
      sortable: true,
      filter: true
    },
    {
      field: 'businessType',
      header: 'Business Type',
      sortable: true,
      filter: true
    },
    {
      field: 'subType',
      header: 'Subtype',
      sortable: true,
      filter: true
    },
    {
      field: 'projectType',
      header: 'Project Type',
      sortable: true,
      filter: true
    },

    {
      field: 'code',
      header: 'Code',
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
      field: 'buCode',
      header: 'BU-Code',
      sortable: true,
      filter: true
    },
    {
      field: 'fdBusinessUnit',
      header: 'FD_Business Unit',
      sortable: true,
      filter: true
    },
    {
      field: 'projectGroup',
      header: 'Project Group',
      sortable: true,
      filter: true
    },
    {
      field: 'projectGroupDescription',
      header: 'Project Group Description',
      sortable: true,
      filter: true
    },
    {
      field: 'hourCostCatId',
      header: 'Hour_Cost Cat ID',
      sortable: true,
      filter: true
    },
    {
      field: 'hourCostCatDescription',
      header: 'Hour_Cost Category Description',
      sortable: true,
      filter: true
    },
    {
      field: 'edit',
      header: '',
      icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center' }} />,
      onClick: handleClickEdit,
      tooltipTitle: 'Click to Edit'
    }
  ];
  const headCellsType = [
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'NONE',
    'ICON'
  ];
  const numericFields = [
    'country',
    'region',
    'projectClassification',
    'businessType',
    'subType',
    'projectType',
    'code',
    'buCode',
    'fdBusinessUnit',
    'hourCostCatId'
  ];

  const getFilterData = (data, callApi) => {
    if (callApi) {
      getProjectEquivalencyData();
    } else {
      setProjectEquivalencyData([]);
    }
  };
  const getFilterDataPayloadChange = (key, val) => {
    console.log(key, val);
    if (key === 'country') {
      const country = SEVICE_DASHBOARD_FILTER_MASTER_DATA.OFFICE.find((office) => office.country === val);
      if (country) {
        dispatch({ type: POST_OFFICE, data: country.offices });
      }
      setPayload({ ...payload, [key]: val, region: 'all' });
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  const getProjectEquivalencyData = () => {
    if (ProjectEquivalencyTableData) {
      const displayData = [];
      ProjectEquivalencyTableData?.map((item) => {
        const {
          id,
          country,
          region,
          projectClassification,
          businessType,
          subType,
          projectType,
          code,
          projectBusinessCategory,
          buCode,
          fdBusinessUnit,
          projectGroup,
          projectGroupDescription,
          hourCostCatId,
          hourCostCatDescription
        } = item;
        return displayData.push({
          country,
          region,
          projectClassification,
          businessType,
          subType,
          projectType,
          code,
          projectBusinessCategory,
          buCode,
          fdBusinessUnit,
          projectGroup,
          projectGroupDescription,
          hourCostCatId,
          hourCostCatDescription,
          edit: null,
          id
        });
      });
      if (displayData.length > 0) {
        setProjectEquivalencyData(displayData);
      } else {
        setProjectEquivalencyData([]);
      }
    }
  };

  return (
    <Grid p={2}>
      <Grid p={1} container spacing={3}>
        <Grid justifyContent="flex-end" item xs={7}>
          <Typography variant="h4" align="center" display="inline">
            Project Equivalency
          </Typography>
        </Grid>

        <Grid item xs={5}>
          <Button
            onClick={() => navigate('/add-projectEquivalency')}
            variant="contained"
            size="small"
            style={{ float: 'right', boxShadow: 'none' }}
          >
            Add Project Equivalency
          </Button>
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

        {/* Grid layout for Project Equivalency */}
        <Grid mt={1} item xs={12}>
          <SimpleTable
            rowData={projectEquivalencyData}
            headerData={columnForProjectEquivalency}
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
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProjectEquivalencyList;
