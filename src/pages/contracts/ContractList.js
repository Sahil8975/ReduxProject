import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Button, Divider } from '@mui/material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SimpleTable from '../../components/table/simpleTable';
import Filters from '../../components/Filter/filter';
import DialogComponent from '../../components/Dialog';
import { isArray, isObject } from '../../utils/utils';
import { COMPONENTS, PROJECT_STATUS, STATUS } from '../../utils/constants';
import RenderComponent from '../../components/RenderComponent';
import { GET_BUSINESS_SUB_TYPES, IS_DATA_LOADING } from '../../redux/constants';
import { APIS, API_V1 } from '../../utils/apiList';
import { getBusinessSubTypes } from '../../services/masterDataService';
import { getContractList, getProjects } from '../../services/contractService';
import { getProjectStatusList } from '../../services/projectService';
import { NOTIFICATIONS } from '../../utils/messages';
import { ROUTES } from '../../routes/paths';

import './ContractList.scss';

function ContractList() {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // filter component state
  let paramId;
  let editId;
  const { GET_BUSINESS_SUB_TYPES, SEARCH_PROJECTS, PROJECT_STATUSES } = APIS;
  const [contractData, setContractListData] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [rowSelected, setRowSelected] = useState(null);
  const [projectRowSelected, setProjectRowSelected] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedContract, setSelectedContract] = useState({});
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [country, setCountry] = useState(0);
  const [region, setRegion] = useState(0);
  const [statusList, setStatusList] = useState([]);
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const emptyFiltersData = {
    countryId: country || 'all',
    regionId: region || 'all',
    contractNumber: '',
    customerNumberOrName: '',
    pageIndex: 0,
    pageSize: 0
  };
  const emptyProjectFilters = {
    contractId: 0,
    statusId: 0,
    projectNumber: '',
    businessTypeId: 0,
    businessSubTypeId: 0,
    servicemanId: 0,
    location: '',
    lastServicByServicemanId: 0
  };
  const [projectFilters, setProjectFilters] = useState({ ...emptyProjectFilters });
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);

  const clearFunnelFilter = () => handleFunnelFilter();

  const clearFunnelFilterForProjects = () => handleFunnelFiltersForProjects();

  const clearFunnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      contractNumber: clearFunnelFilterObj(),
      customer: clearFunnelFilterObj(),
      activeProjects: clearFunnelFilterObj(),
      notes: clearFunnelFilterObj()
    });
  };

  const handleFunnelFiltersForProjects = () => {
    setFunnelFilters({
      projectStatus: clearFunnelFilterObj(),
      projectNumber: clearFunnelFilterObj(),
      customerLocation: clearFunnelFilterObj(),
      projectExecutionType: clearFunnelFilterObj(),
      projectGroup: clearFunnelFilterObj(),
      lastServiceDate: clearFunnelFilterObj(),
      lastServiceBy: clearFunnelFilterObj(),
      lastServiceNote: clearFunnelFilterObj()
    });
  };

  useEffect(() => {
    getContractListData();
    getStatuses();
  }, []);

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const getContractListData = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getContractList(`${API_V1}${ROUTES.CONTRACT_MANAGEMENT_SEARCH_CONTRACT}`, payloadData);
    if (res?.errorCode) {
      setShowAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: t('dialog.error'),
        content: res.error || NOTIFICATIONS.SOMETHING_WENT_WRONG
      });
    } else {
      if (res && isObject(res)) {
        const contracts = res?.data?.contracts || [];
        if (isArray(contracts)) {
          const displayData = [];
          contracts.map((item) => {
            const { contractNumber, customerName: customer, activeProjects, notes, projects, contractId } = item;
            return displayData.push({
              contractNumber,
              customer,
              activeProjects,
              notes,
              projects,
              contractId
            });
          });
          setContractListData(displayData);
          clearProjectListSelection();
        } else {
          setContractListData([]);
        }
      }
      dispatch({ type: IS_DATA_LOADING, data: false });
    }
  };
  const navigateToContractEdition = (options) => {
    paramId = options.contractId;
    navigate(`/contracts-projects/contracts/edit/${options.contractNumber}`, { state: paramId }, { replace: true });
  };

  const navigateToEditProject = (project) =>
    navigate(
      `${ROUTES.EDIT_PROJECT}/${project?.id}`,
      { state: { contractId: selectedContract.contractId, projectId: project?.id } },
      { replace: true }
    );

  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;

  const FILTER_COMPONETS1 = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'countryId',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      isDisabled: masterData?.country?.length === 1,
      isSelecteAllAllow: masterData?.country?.length !== 1,
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
      isSelecteAllAllow: regions?.length !== 1,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'contractNumber',
      label: 'Contract Number'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customerNumberOrName',
      label: 'Customer Name or Number'
    }
  ];

  const PROJECT_FILTER_COMPONENTS = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'projectNumber',
      label: 'Project Number',
      columnWidth: 1.4
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'location',
      label: 'Location'
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'statusId',
      label: 'serviceDashboard.status',
      placeholder: 'serviceDashboard.status',
      options: statusList,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      columnWidth: 1.8
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'businessTypeId',
      label: 'Business Type',
      placeholder: 'Business Type',
      options: masterData?.businessType,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      columnWidth: 1.3
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'businessSubTypeId',
      label: 'Business Sub Type',
      placeholder: 'Business Sub Type',
      options: masterData?.businessSubType,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'servicemanId',
      label: 'serviceDashboard.serviceman',
      placeholder: 'serviceDashboard.serviceman',
      options: masterData?.servicemens,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    }
  ];

  const columnDataforContractList = [
    {
      field: 'contractNumber',
      header: 'Contract Number',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'customer',
      header: 'Customer',
      sortable: true,
      filter: true,
      style: { width: '20%' }
    },
    {
      field: 'activeProjects',
      header: 'Active/Total Projects',
      sortable: true,
      filter: true,
      style: { width: '15%' }
    },
    {
      field: 'notes',
      header: 'Notes',
      sortable: true,
      filter: true,
      style: { width: '50%' }
    },
    {
      field: 'action',
      header: 'Action',
      icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: navigateToContractEdition,
      tooltipTitle: 'Click to edit Contract',
      placement: 'left',
      style: { width: '5%' }
    }
  ];

  const columnDataforProjectList = [
    {
      field: 'projectStatus',
      header: 'Status',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'projectNumber',
      header: 'Project Number',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'customerLocation',
      header: 'Location',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'projectExecutionType',
      header: 'Execution Type',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'projectGroup',
      header: 'Project Group',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'lastServiceDate',
      header: 'Last Service Date',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'lastServiceBy',
      header: 'Last Service By',
      sortable: true,
      filter: true,
      style: { width: '10%' }
    },
    {
      field: 'lastServiceNote',
      header: 'Last Service Note',
      sortable: true,
      filter: true,
      style: { width: '25%' }
    },
    {
      field: 'action',
      header: 'Action',
      icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: navigateToEditProject,
      tooltipTitle: 'Click to edit Project',
      placement: 'left',
      style: { width: '5%' }
    }
  ];

  const clearProjectListSelection = () => {
    setProjectData([]);
    // setSelectedContract({});
    setProjectRowSelected(null);
  };

  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getContractListData({ ...emptyFilters, ...payload });
      setProjectData([]);
      // setSelectedContract({});
    } else {
      setContractListData([]);
      clearProjectListSelection();
      getContractListData({
        contractNumber: '',
        countryId: 'all',
        regionId: 'all',
        customerNumberOrName: ''
      });
      if (masterData?.country.length !== 1) {
        setRegions([]);
      }
    }
  };

  const getFilterDataForProjects = (filters, callApi) => {
    let tempProjectFilters = {};
    if (callApi) {
      tempProjectFilters = { ...emptyProjectFilters, ...projectFilters };
    } else {
      tempProjectFilters = { ...emptyProjectFilters, contractId: selectedContract.contractId };
    }
    getProjectList({ ...tempProjectFilters });
    setProjectFilters({ ...tempProjectFilters });
  };

  const handleActionDispatch = (type, data = []) => dispatch({ type, data });

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
      clearProjectListSelection();
    } else if (key === 'regionId') {
      clearProjectListSelection();
    } else {
      if (key === 'businessTypeId') {
        getBusinessSubList(val);
      }
      setPayload({ ...payload, [key]: val });
    }
  };

  const getFilterDataPayloadChangeForProject = (key, val) => {
    if (!val && ['statusId', 'businessTypeId', 'businessSubTypeId'].includes(key)) {
      val = 0;
    }
    setProjectFilters({ ...projectFilters, [key]: val });
  };

  const getStatuses = async () => {
    const projectStatuses = await getProjectStatusList(`${API_V1}/${PROJECT_STATUSES}`);
    const notToInclude = ['Financially Closed']; // 'PendingAXSync'
    if (!projectStatuses?.isSuccessful) {
      getStatuses();
    } else if (isObject(projectStatuses) && projectStatuses.data) {
      if (projectStatuses.data) {
        const projectInfo = projectStatuses?.data.filter((itm) => !notToInclude.includes(itm.name));
        setStatusList(projectInfo);
      }
    }
  };

  const getBusinessSubList = async (id) => {
    const res = await getBusinessSubTypes(`${API_V1}/${GET_BUSINESS_SUB_TYPES}?businessId=${id}`);
    handleActionDispatch(GET_BUSINESS_SUB_TYPES, res?.data);
  };

  const getProjectList = async (filterePayload = projectFilters) => {
    if (filterePayload.contractId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await getProjects(`${API_V1}/${SEARCH_PROJECTS}`, filterePayload);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (res.isSuccessful && isArray(res?.data)) {
        const projectData = res.data.map((project) => {
          const {
            projectStatus,
            projectNumber,
            customerLocation,
            projectExecutionType,
            projectGroup,
            lastServiceDate,
            lastServiceBy,
            lastServiceNote,
            id
          } = project;
          return {
            projectStatus,
            projectNumber,
            customerLocation,
            projectExecutionType,
            projectGroup,
            lastServiceDate,
            lastServiceBy,
            lastServiceNote,
            id
          };
        });
        setProjectData(projectData);
        return true;
      }
    }
    setProjectData([]);
  };

  const navigateToContractAddition = () => {
    navigate(ROUTES.ADD_CONTRACT, { replace: true });
  };
  const onRowClick = (event) => {
    const {
      data: { contractNumber, contractId }
    } = event;
    setSelectedContract({ contractId, contractNumber });
  };
  const numericFields = ['contractNumber', 'activeProjects'];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NO_ELLIPSIS', 'ICON'];
  const projectNumericFields = [
    'projectStatus',
    'projectNumber',
    'projectExecutionType',
    'lastServiceDate',
    'lastServiceBy'
  ];
  const projectHeadCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'ICON'];

  useEffect(() => {
    const tempProjectFilters = { ...projectFilters, contractId: selectedContract.contractId };
    setProjectFilters({ ...tempProjectFilters });
    getProjectList({ ...tempProjectFilters });
  }, [selectedContract.contractId]);

  useEffect(() => {
    let region = 0;
    let country = 0;

    if (masterData?.country?.length === 1) {
      country = masterData?.country[0]?.id.toString();
      region = setCountryAndRegions(country);
      setCountry(country);
      setRegion(region);
    }
    if (country) {
      setEmptyFilter({ ...emptyFiltersData, countryId: country || 'all', regionId: region || 'all' });
    }
    setPayload({
      ...payload,
      countryId: country || 'all',
      regionId: region || 'all'
    });
  }, []);

  return (
    <Grid className="contract_list_main_cls">
      <DialogComponent
        open={alertBox.open}
        handleClose={handleCloseAlertBox}
        title={alertBox.title}
        titleType={alertBox.titleType}
        content={alertBox.content}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
        color="success"
      />
      <Grid container spacing={3}>
        {/* Grid for open project and add contract section */}
        <Grid item xs={6.7} display="flex" justifyContent="flex-end" className="contract-list-label">
          <Typography fontWeight="bold" variant="subtitle1">
            {t('Contract List')}
          </Typography>
        </Grid>
        <Grid item xs={5.3} display="flex" justifyContent="flex-end" alignItems="center" marginTop="-0.8rem">
          <RenderComponent
            metaData={{
              control: BUTTON,
              variant: 'contained',
              color: 'success',
              size: 'small',
              handleClickButton: () => navigateToContractAddition(),
              btnTitle: 'Add New Contract',
              // groupStyle: { height: '2.5rem', marginLeft: '-5rem' }
              columnWidth: 3.4,
              columnHeight: 2
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ backgroundColor: 'rgb(227 232 234)' }} />
        </Grid>
        {/* Grid for filter section 1 */}
        <Grid item xs={12}>
          <Filters
            components={FILTER_COMPONETS1}
            apiUrl="dummyUrl"
            getFilterData={getFilterData}
            getFilterDataPayloadChange={getFilterDataPayloadChange}
            payload={payload}
            setPayload={setPayload}
            emptyFilters={emptyFiltersData}
            handleFunnelFilter={handleFunnelFilter}
          />
        </Grid>
        {/* Grid for all contract list */}
        <Grid item xs={12}>
          <SimpleTable
            rowData={contractData}
            headerData={columnDataforContractList}
            paginator
            isContractPaginator
            rows={5}
            selectionMode="single"
            selection={rowSelected}
            onSelectionChange={(e) => {
              setRowSelected(e.value);
              setProjectRowSelected(null);
            }}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="fit"
            size="small"
            editingRows={editingRows}
            onRowClick={onRowClick}
            dataKey="contractNumber"
            editMode="row"
            numericFields={numericFields}
            headCellsType={headCellsType}
            clearFilter={clearFunnelFilter}
            filterData={funnelFilters}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ backgroundColor: '#c7d2fe' }} />
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography fontWeight="bold" variant="subtitle1" sx={{ color: '#556474' }}>
              Project List for Contract:&nbsp;
            </Typography>
            <Typography fontWeight="bold" variant="subtitle1">
              {selectedContract?.contractNumber}
            </Typography>
          </Grid>
        </Grid>
        {/* Grid for filter section 2 */}
        <Grid item xs={12}>
          <Filters
            components={PROJECT_FILTER_COMPONENTS}
            apiUrl="dummyUrl"
            getFilterData={getFilterDataForProjects}
            getFilterDataPayloadChange={getFilterDataPayloadChangeForProject}
            payload={projectFilters}
            setPayload={setProjectFilters}
            emptyFilters={emptyProjectFilters}
            handleFunnelFilter={handleFunnelFiltersForProjects}
          />
        </Grid>
        {/* Grid for all Project list */}
        <Grid item xs={12}>
          <SimpleTable
            rowData={projectData}
            headerData={columnDataforProjectList}
            paginator
            rows={10}
            selectionMode="single"
            selection={projectRowSelected}
            onSelectionChange={(e) => setProjectRowSelected(e.value)}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            editingRows={editingRows}
            dataKey="projectNumber"
            editMode="row"
            numericFields={projectNumericFields}
            headCellsType={projectHeadCellsType}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ContractList;
