import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Grid, Typography, Button, Tabs, Tab, Box } from '@mui/material';
import SimpleTable from '../../../components/table/simpleTable';
import Filters from '../../../components/Filter/filter';
import AlertDialog from '../../../components/AlertDialog';
import { COMPONENTS } from '../../../utils/constants';
import RenderComponent from '../../../components/RenderComponent';
import { IS_DATA_LOADING } from '../../../redux/constants';
import { APIS, API_V1 } from '../../../utils/apiList';
import { isArray } from '../../../utils/utils';
import { getUsers } from '../../../services/employeeService';
import { ROUTES } from '../../../routes/paths';
import './UserList.scss';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.object,
  value: PropTypes.string,
  index: PropTypes.string
};

function userListTabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function UserList() {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [confirmUser, setConfirmUser] = useState(false);
  const [regions, setRegions] = useState([]);
  const emptyFiltersData = {
    countryId: 'all',
    regionId: 'all',
    name: '',
    userName: '',
    shortName: '',
    roleId: 'all',
    email: '',
    iUsers: [],
    userIds: [],
    pageIndex: 0,
    pageSize: 0
  };
  const [payload, setPayload] = useState({ ...emptyFiltersData });
  const [emptyFilters, setEmptyFilter] = useState(emptyFiltersData);

  const clearFunnelFilter = () => {
    handleFunnelFilter();
  };

  const funnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      name: funnelFilterObj(),
      userName: funnelFilterObj(),
      roleId: funnelFilterObj(),
      email: funnelFilterObj(),
      mobileNoToDisplay: funnelFilterObj()
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { t } = useTranslation();

  const formatUsersData = (usersList) => {
    if (usersList) {
      const formattedUsers = [];
      usersList.forEach((item) => {
        const { name, username, role, email, mobileNo, phoneNumberCode } = item;
        formattedUsers.push({
          name,
          username,
          roleName: role[0].roleDisplayName,
          email,
          mobileNoToDisplay: mobileNo ? `${phoneNumberCode ? `${phoneNumberCode}-` : ''}${mobileNo}` : '',
          edit: null,
          mobileNo,
          ...item
        });
      });
      setUsers(formattedUsers);
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      setUsers([]);
      dispatch({ type: IS_DATA_LOADING, data: false });
    }
  };

  // Handle alert dialog success method
  const handleAlertDialogSubmit = () => setConfirmUser(false);

  // Handle alert dialog close method
  const handleAlertDialogClose = () => setConfirmUser(false);

  const handleClickEdit = (val) =>
    navigate(`/administration/users/edit-user/${val.id}`, { state: val }, { replace: true });

  const columnForInternalUser = [
    {
      field: 'name',
      header: `${t('userList.name')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'username',
      header: `${t('userList.userName')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'roleId',
      header: 'Role',
      sortable: true,
      filter: true
    },
    {
      field: 'email',
      header: `${t('userList.email')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'mobileNoToDisplay',
      header: `${t('userList.mobileNo')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'edit',
      header: 'Action',
      icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
      onClick: handleClickEdit,
      tooltipTitle: 'Click to Edit',
      placement: 'left'
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'ICON'];
  const numericFields = ['id', 'username', 'mobileNoToDisplay', 'roleId'];

  const { TEXT_FIELD, SELECT_BOX, BUTTON } = COMPONENTS;
  const FILTER_COMPONETS = [
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'countryId',
      label: 'serviceDashboard.country',
      placeholder: 'serviceDashboard.country',
      options: masterData?.country,
      isDisabled: masterData?.country?.length === 1,
      select: true,
      columnWidth: 1.6
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'regionId',
      label: 'Region',
      placeholder: 'Region',
      options: regions,
      isDisabled: !payload?.countryId || regions?.length === 1,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'name',
      label: `${t('userList.name')}`
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'userName',
      label: `${t('userList.userName')}`
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'roleId',
      label: 'Role',
      placeholder: 'Role',
      options: masterData?.roles,
      select: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'email',
      label: `${t('userList.email')}`
    }
  ];

  const getFilterData = (filters, callApi) => {
    if (callApi) {
      getUsersList({ ...emptyFilters, ...payload });
    } else {
      setUsers([]);
      getUsersList({
        countryId: 'all',
        regionId: 'all',
        name: '',
        userName: '',
        shortName: '',
        roleId: 'all',
        email: '',
        iUsers: [],
        userIds: []
      });
      if (masterData?.country.length !== 1) {
        setRegions([]);
      }
    }
  };

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
    } else {
      setPayload({ ...payload, [key]: val || '' });
    }
  };

  const getUsersList = async (payloadData = payload) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getUsers(`${API_V1}/${APIS.GET_USERS}`, payloadData);
    formatUsersData(res?.userList || []);
  };

  const navigateToAddUser = () => navigate(ROUTES.ADD_USER);

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    if (state?.isReloadUserList) {
      if (isArray(users)) {
        getFilterData(payload, true);
      }
      navigate(ROUTES.USERS, { state: { isReloadUserList: false } });
    }
  }, [state?.isReloadUserList]);

  useEffect(() => {
    let regionId = 0;
    let countryId = 0;

    if (masterData?.country?.length === 1) {
      countryId = masterData?.country[0]?.id.toString();
      regionId = setCountryAndRegions(countryId);
    }
    if (countryId) {
      setEmptyFilter({ ...emptyFiltersData, countryId: countryId || 'all', regionId: regionId || 'all' });
    }
    setPayload({
      ...payload,
      countryId: countryId || 'all',
      regionId: regionId || 'all'
    });
  }, []);

  return (
    <Grid className="user_list_main_cls">
      {confirmUser &&
        AlertDialog({
          title: 'Confirm',
          description: 'Confirm login as',
          isOpen: confirmUser,
          handleClose: handleAlertDialogClose,
          handleSubmit: handleAlertDialogSubmit,
          negativeText: 'No',
          positiveText: 'Yes'
        })}
      <Grid p={2} container spacing={4}>
        <Grid item xs={12}>
          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="User Management">
            <Tab label={`${t('userList.internalUser')}`} {...userListTabProps(0)} />
            <Tab disabled label={`${t('userList.externalUser')}`} {...userListTabProps()} />
          </Tabs>
        </Grid>
      </Grid>

      <TabPanel style={{ width: '100%' }} value={value} index={0}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <RenderComponent
              metaData={{
                control: BUTTON,
                variant: 'contained',
                color: 'success',
                groupStyle: { float: 'right', minWidth: '10rem' },
                handleClickButton: () => navigateToAddUser(),
                btnTitle: 'Add New User'
              }}
            />
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
        </Grid>
        {/* Grid layout for Internal users */}
        <Grid style={{ marginTop: '1rem' }} item xs={12}>
          <SimpleTable
            rowData={users}
            headerData={columnForInternalUser}
            paginator
            rows={20}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            dataKey="id"
            editMode="row"
            numericFields={numericFields}
            headCellsType={headCellsType}
            isActionBtn
            actionBtnText="Add New User"
            btnStyle={{ style: { marginRight: '1rem' } }}
            clearFilter={clearFunnelFilter}
            filterData={funnelFilters}
          />
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid style={{ marginTop: 0 }} container spacing={3}>
          <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item xs={7}>
            <Typography variant="h6" display="inline">
              {`${t('userList.externalUser')}`}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Button variant="contained" style={{ float: 'right' }}>
              {`${t('userList.addUser')}`}
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
    </Grid>
  );
}

export default UserList;
