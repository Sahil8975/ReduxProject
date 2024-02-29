import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, Divider, Accordion, AccordionSummary } from '@mui/material';
import { ArrowRight } from '@mui/icons-material/';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SimpleTable from '../../components/table/simpleTable';
import ContractData from './selected-contract-data.json';
import ProjectData from './project-data.json';
import './TerminateProject.scss';

function TerminateProject() {
  const [projectData, setProjectData] = useState(ProjectData);
  const showContracts = true;
  const contractData = ContractData;
  const editingRows = {};
  const numericFields = ['id', 'status', 'contractNo', 'signOn', 'startDate'];
  const numericFieldsForProject = ['id', 'status', 'projectNo', 'signOn', 'startDate', 'endDate'];
  const columnDataForContract = [
    {
      field: 'id',
      header: 'ID',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'status',
      header: 'Status',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'contractNo',
      header: 'Contract Number',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'signOn',
      header: 'Sign On',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'startDate',
      header: 'Start Date',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'salesman',
      header: 'Salesman',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'countryRegin',
      header: 'Country / Region',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'customerName',
      header: 'CustomerName',
      editorElement: null,
      sortable: true,
      filter: true
    }
  ];

  const columnDataForProject = [
    {
      field: 'id',
      header: 'ID',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'status',
      header: 'Status',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'projectNo',
      header: 'Project Number',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'signOn',
      header: 'Sign On',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'startDate',
      header: 'Start Date',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'endDate',
      header: 'End Date',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'business',
      header: 'Business',
      editorElement: null,
      sortable: true,
      filter: true
    },
    {
      field: 'location',
      header: 'Location',
      editorElement: null,
      sortable: true,
      filter: true
    }
  ];
  const headCellsTypeContractData = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
  const headCellsTypeProjectData = ['NONE', 'NONE', 'NONE', 'DATE', 'DATE', 'DATE', 'NONE', 'NONE'];
  return (
    <Grid className="terminate_project_main_cls">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Terminate All Projects
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem' }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Contract Number"
            size="small"
            InputProps={{
              endAdornment: <SearchIcon style={{ cursor: 'pointer' }} />
            }}
          />
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} item xs={12} sm={9}>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            style={{ marginLeft: '0.5rem' }}
            variant="contained"
            size="small"
            onClick={() => setProjectData([])}
          >
            Terminate All
          </Button>
          <Button startIcon={<ClearIcon />} style={{ marginLeft: '0.5rem' }} variant="contained" size="small">
            Close
          </Button>
        </Grid>

        {/* Contrct details collapsible section */}
        <Grid hidden={!(showContracts === 'panel1' || showContracts === true)} item xs={12}>
          <Accordion style={{ boxShadow: 'none' }} fullWidth>
            <AccordionSummary
              style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              expandIcon={<ArrowRight />}
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography variant="h6">Contract Details</Typography>
            </AccordionSummary>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SimpleTable
                  rowData={contractData}
                  headerData={columnDataForContract}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  rows={10}
                  showGridlines
                  responsiveLayout="scroll"
                  columnResizeMode="expand"
                  size="small"
                  editingRows={editingRows}
                  dataKey="id"
                  editMode="row"
                  numericFields={numericFields}
                  headCellsType={headCellsTypeContractData}
                />
              </Grid>
            </Grid>
          </Accordion>
        </Grid>

        {/* Project details grid section */}
        <Grid item xs={12}>
          <Typography variant="h6">Project Details</Typography>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable
            rowData={projectData}
            headerData={columnDataForProject}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rows={10}
            paginator
            showGridlines
            responsiveLayout="scroll"
            columnResizeMode="expand"
            size="small"
            editingRows={editingRows}
            dataKey="id"
            editMode="row"
            numericFields={numericFieldsForProject}
            headCellsType={headCellsTypeProjectData}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TerminateProject;
