import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Divider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowRight } from '@mui/icons-material/';
import PageviewIcon from '@mui/icons-material/Pageview';
import SimpleTable from '../../components/table/simpleTable';
import ProjectExpirationData from './ProjectExpirationData.json';
import Filters from '../../components/Filter/filter';
import { COMPONENTS } from '../../utils/constants';
import { SEVICE_DASHBOARD_FILTER_MASTER_DATA } from '../../components/ServiceBoard/data';
import { POST_OFFICE } from '../../redux/constants';
import './ProjectExpiration.scss';

function ProjectExpiration() {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const editingRows = {};
  const [showFilter, setShowFilter] = useState(true);
  const [projectExpirationData, setProjectExpirationData] = useState([...ProjectExpirationData]);
  const numericFields = ['projectNo', 'expiry', 'status'];
  const emptyFilters = {
    country: 'all',
    region: 'all',
    business: 'all',
    Status: 'all',
    expirationDateOffset: null,
    showExpiredProjects: null
  };
  const [payload, setPayload] = useState({ ...emptyFilters });

  const handleAction = () => console.log('View Project');

  const columnDataForProjects = [
    {
      field: 'projectNo',
      header: 'Project Number',
      editorElement: null,
      style: { width: '10%' },
      sortable: true,
      filter: true
    },
    {
      field: 'customer',
      header: 'Customer',
      editorElement: null,
      style: { width: '10%' },
      sortable: true,
      filter: true
    },
    {
      field: 'location',
      header: 'Location',
      editorElement: null,
      style: { width: '10%' },
      sortable: true,
      filter: true
    },
    {
      field: 'expiry',
      header: 'Expiry',
      editorElement: null,
      style: { width: '10%' },
      sortable: true,
      filter: true
    },
    {
      field: 'status',
      header: 'Status',
      editorElement: null,
      style: { width: '15%' },
      sortable: true,
      filter: true
    },
    {
      field: 'action',
      header: 'Action',
      style: { width: '10%' },
      icon: <PageviewIcon style={{ cursor: 'pointer', textAlign: 'center' }} />,
      onClick: handleAction,
      tooltipTitle: 'View Project'
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'ICON'];

  const { AUTOCOMPLETE, CHECKBOX } = COMPONENTS;
  const FILTER_COMPONETS = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'country',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'region',
      label: 'Region',
      placeholder: 'Region',
      options: masterData?.office
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
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'showExpiredProjects',
      label: 'Show expired projects',
      placeholder: 'Show expired projects',
      columnWidth: 3
    }
  ];
  const getFilterData = (data, callApi) => {
    if (callApi) {
      setProjectExpirationData([...ProjectExpirationData]);
    } else {
      setProjectExpirationData([]);
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

  return (
    <div className="project_expiration_main_cls">
      <Grid style={{ marginTop: '0rem' }} container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Project Expiration
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
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
        <Grid item xs={12} sm={4}>
          <Accordion
            expanded={showFilter}
            style={{ boxShadow: 'none', marginTop: '-13px' }}
            fullWidth
            onClick={() => setShowFilter(!showFilter)}
          >
            <AccordionSummary
              style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              expandIcon={<ArrowRight />}
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography variant="h4">{t('ProjectExpiration.ExpirationOverview')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sm={12}>
                <Divider style={{ backgroundColor: '#c7d2fe' }} />
                {/* Expire project grid */}
                <Grid container spacing={3} style={{ marginTop: '1rem' }}>
                  <Grid item xs={12} sm={12}>
                    <Grid
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #c7d2fe',
                        borderRadius: '5px',
                        padding: '5px'
                      }}
                    >
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        {t('ProjectExpiration.ExpiredProjects')}
                      </Typography>
                      <Chip label="81450" style={{ backgroundColor: '#637381', color: '#FFF' }} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Grid
                        style={{
                          border: '1px solid #c7d2fe',
                          overflow: 'scroll',
                          height: '200px',
                          borderRadius: '5px',
                          padding: '0px 5px 5px 5px',
                          alignItems: 'center'
                        }}
                        item
                        xs={12}
                        sm={12}
                      >
                        {[...Array(15)]?.map((g, ind) => (
                          <Grid key={ind} item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              17-12-2015 <span style={{ fontWeight: 'bold' }}>(15)</span>
                            </Typography>
                            <Chip label="103" style={{ backgroundColor: '#637381', color: '#FFF' }} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      {/* Project expiration tabular layout */}
      <Grid container spacing={3} style={{ marginTop: '1rem' }}>
        <Grid item xs={12}>
          <SimpleTable
            rowData={projectExpirationData}
            headerData={columnDataForProjects}
            paginator
            rowsPerPageOptions={[10, 20, 50, 100]}
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            editingRows={editingRows}
            dataKey="id"
            editMode="row"
            numericFields={numericFields}
            headCellsType={headCellsType}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ProjectExpiration;
