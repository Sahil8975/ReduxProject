import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Container, Divider } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import RenderComponent from '../../components/RenderComponent';
import SimpleTable from '../../components/table/simpleTable';
import DialogComponent from '../../components/Dialog';
import { isArray, isObject } from '../../utils/utils';
import { COMPONENTS, STATUS } from '../../utils/constants';
import { NOTIFICATIONS } from '../../utils/messages';
import { addLeaveEntry, getUserList, leavesData, removeLeave } from '../../services/leavesService';
import { APIS, API_V1 } from '../../utils/apiList';
import useBoolean from '../../hooks/useBoolean';
import './LeaveDetails.scss';

function LeaveDetails() {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const [payload, setPayload] = useState({
    countryId: [],
    countryIds: [],
    regionId: [],
    regionIds: [],
    roleId: 'all',
    userId: 0,
    fromDate: new Date(),
    toDate: new Date()
  });
  const [funnelFilters, setFunnelFilters] = useState(null);
  const [userList, setUserList] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isSave, setIsSave] = useBoolean(false);
  const [isRemove, setIsRemove] = useBoolean(false);
  const [getId, setGetId] = useState();
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });
  const [region, setRegion] = useState([]);

  const { country: countries, regions: allRegions, roles } = masterData;
  const { SELECT_BOX, MULTI_SELECT_BOX, DATEPICKER, BUTTON, NONE } = COMPONENTS;

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const handleCloseAlertBox = () => setShowAlertBox({ open: false, titleType: '', title: '', content: '' });

  const confirmationBox = (content = '', titleType = '', title = '') => {
    setShowAlertBox({
      open: true,
      titleType,
      title,
      content
    });
  };

  const getErrorMessage = (res, errorMsg = '') => {
    if (isArray(res.errors)) {
      return res.errors[0] || errorMsg;
    }
    return res.error ? res.error : NOTIFICATIONS.SOMETHING_WENT_WRONG;
  };

  const handleIsSave = () => {
    const { userId, countryIds, regionIds } = payload;
    if (!userId || !countryIds || !regionIds || countryIds.length === 0 || regionIds.length === 0) {
      setIsError(true);
    } else {
      setIsError(false);
      setIsSave.on();
    }
  };
  // setIsSave.on();

  const handleSaveEntry = async () => {
    const payloadData = {
      userId: payload?.userId,
      fromDate: payload?.fromDate,
      toDate: payload?.toDate
    };
    const res = await addLeaveEntry(`${API_V1}/${APIS.ADD_LEAVE}`, payloadData);
    if (res?.isSuccessful) {
      getLeaves();
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, 'Error');
    }
  };

  const handleIsRemove = (options) => {
    setIsRemove.on();
    setGetId(options.id);
  };

  const handleRemoveEntry = async () => {
    const res = await removeLeave(`${API_V1}/${APIS.REMOVE_LEAVE}?employeeleaveId=${getId}`);
    if (res?.isSuccessful) {
      getLeaves();
    } else {
      confirmationBox(getErrorMessage(res), STATUS.ERROR, 'Error');
    }
  };

  const componentSet = [
    {
      control: MULTI_SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'countryId',
      label: 'Country',
      placeholder: 'Country',
      columnWidth: 2.5,
      options: countries,
      isError: isError && (!payload.countryIds || payload.countryIds.length === 0),
      helperText: isError && (!payload.countryIds || payload.countryIds.length === 0) && 'Country is Required',
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      isRequired: true,
      maxMultipleOptions: 1
    },
    {
      control: MULTI_SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'regionId',
      label: 'Region',
      placeholder: 'Region',
      columnWidth: 2.2,
      options: region,
      isError: isError && (!payload.regionIds || payload.regionIds.length === 0),
      helperText: isError && (!payload.regionIds || payload.regionIds.length === 0) && 'Region is Required',
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      isRequired: true,
      maxMultipleOptions: 1
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.7rem' },
      key: 'roleId',
      label: 'Role',
      placeholder: 'Role',
      columnWidth: 1.5,
      options: roles,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    },

    {
      control: SELECT_BOX,
      key: 'userId',
      label: 'Username',
      placeholder: 'Username',
      columnWidth: 2,
      options: userList,
      isError: isError && !payload.userId,
      helperText: isError && !payload.userId && 'Username is Required',
      select: true,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true
    },
    {
      control: DATEPICKER,
      key: 'fromDate',
      label: 'From Date',
      placeholder: 'From Date',
      columnWidth: 1.3,
      minDate: new Date()
    },
    {
      control: DATEPICKER,
      key: 'toDate',
      label: 'To Date',
      placeholder: 'To Date',
      columnWidth: 1.3,
      minDate: (payload?.fromDate && new Date(payload?.fromDate)) || new Date()
    },
    {
      control: BUTTON,
      key: 'save',
      btnTitle: 'Save',
      color: 'success',
      handleClickButton: () => handleIsSave(),
      // groupStyle: { marginTop: '-0.2rem' },
      columnWidth: 0.9
    }
  ];

  const columnForEntries = [
    {
      field: 'name',
      header: 'Name',
      sortable: true,
      filter: true,
      style: { width: '30%' }
    },
    {
      field: 'role',
      header: 'Role',
      sortable: true,
      filter: true,
      style: { width: '30%' }
    },
    {
      field: 'leaveDate',
      header: 'Leave Date',
      sortable: true,
      filter: true,
      style: { width: '30%' }
    },
    {
      field: 'action',
      header: 'Action',
      icon: <ClearIcon color="error" style={{ cursor: 'pointer', textAlign: 'center', fontSize: 'large' }} />,
      onClick: handleIsRemove,
      tooltipTitle: 'Click to Delete',
      placement: 'left',
      style: { width: '10%' }
    }
  ];

  const headCellsType = ['NONE', 'NONE', 'NONE', 'ICON'];
  const numericFields = ['leaveDate'];

  const clearFunnelFilter = () => handleFunnelFilter();

  const clearFunnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setFunnelFilters({
      name: clearFunnelFilterObj(),
      role: clearFunnelFilterObj(),
      leaveDate: clearFunnelFilterObj()
    });
  };

  const removeRegions = (val) => {
    if (val) {
      const filteredRegions = region?.filter((rgn) => rgn.countryId !== val);
      setRegion(filteredRegions);
    } else {
      setRegion([]);
    }
  };

  const deleteMltSlctOptn = (key, val) => {
    if (key === 'countryId' && val && isArray(payload.countryId)) {
      const countryId = payload.countryId.filter((cntry) => cntry.id !== val);
      const regionId = region.filter((rgn) => rgn.countryId !== val);
      const countryIds = countryId.map((el) => el.id);
      const rgnId = [];
      if (regionId && payload.regionId !== 0) {
        regionId.forEach((el) => {
          payload.regionId.forEach((elq) => {
            if (elq.id === el.id) {
              rgnId.push(elq);
            }
          });
        });
      }
      const regionIds = rgnId.map((el) => el.id);
      updatePayload({ countryId, regionId: rgnId, countryIds, regionIds });
      removeRegions(val);
    }

    if (key === 'regionId' && val && isArray(payload.regionId)) {
      const regionId = payload.regionId.filter((rgn) => rgn.id !== val);
      const regionIds = regionId.map((el) => el.id);
      updatePayload({ regionId, regionIds });
    }
  };
  const setCountryAndRegions = (val, region = 0) => {
    if (val.length !== 0) {
      const regions = [];
      if (isArray(val)) {
        val.forEach((el) => {
          const filteredRegions = allRegions?.filter((rgn) => rgn.countryId === el.id);
          if (filteredRegions) {
            filteredRegions.forEach((region) => regions.push(region));
          }
          if (filteredRegions.length === 1) {
            region = filteredRegions;
          }
        });
      }
      setRegion(regions);
      if (isArray(payload.regionId) || isArray(payload.regionIds)) {
        const regionId = payload.regionId.filter((rg) => regions.includes(rg));
        const regionIds = regionId.map((el) => el.id);
        updatePayload({ regionId, regionIds });
      }
    } else {
      updatePayload({ regionId: [], regionIds: [] });
      setRegion([]);
    }
    return region;
  };

  const handleChangeData = (key, val) => {
    if (key) {
      const updateFields = { [key]: val };
      if (key === 'countryId') {
        updateFields.countryIds = val.map((el) => el.id);
        setCountryAndRegions(val);
      }
      if (key === 'regionId') {
        updateFields.regionIds = val.map((el) => el.id);
      }
      if (key === 'userId') {
        updateFields.userId = val * 1;
      }
      if (key === 'fromDate') {
        updateFields.toDate = val;
      }
      updatePayload({ ...updateFields });
    }
  };

  const getUserListData = async () => {
    if (isArray(payload.countryId)) {
      const res = await getUserList(`${API_V1}/${APIS.GET_USERLIST}`, payload);
      if (isArray(res?.data)) {
        setUserList(res?.data);
      } else {
        setUserList([]);
      }
    }
  };

  const getLeaves = async () => {
    if (isArray(payload.countryId)) {
      const res = await leavesData(`${API_V1}/${APIS.LEAVES_DATA}`, payload);
      if (res && isObject(res)) {
        const leaves = res?.data || [];
        if (isArray(leaves)) {
          const displayData = [];
          leaves?.forEach((item) => {
            const { name, role, leaveDate, id } = item;
            return displayData.push({
              name,
              role,
              leaveDate,
              id
            });
          });
          setLeaveData(displayData);
        } else {
          setLeaveData([]);
        }
      }
    }
  };

  const getTitleType = () => (isRemove ? 'Warning' : 'Success');

  const getDialogcontent = () => {
    let message = '';
    if (isSave) {
      message = 'Do you want to add leave for this user?';
    }
    if (isRemove) {
      message = 'Do you want to remove this leave entry?';
    }
    return message;
  };

  const handleDialogClose = () => {
    setIsRemove.off();
    setIsSave.off();
  };

  const handleDialogSubmit = () => {
    handleDialogClose();
    if (isRemove) {
      handleRemoveEntry();
    } else if (isSave) {
      handleSaveEntry();
    }
  };

  useEffect(() => {
    if (payload?.regionIds !== 0) {
      getUserListData();
      getLeaves();
    }
  }, [payload?.regionIds, payload?.roleId]);

  useEffect(() => {
    if (payload.countryId.length === 0) {
      updatePayload({ userId: 0, fromDate: new Date(), toDate: new Date() });
    }
    if (payload.regionId.length === 0) {
      updatePayload({ userId: 0, fromDate: new Date(), toDate: new Date() });
    }
  }, [payload?.countryIds, payload?.regionIds]);

  useEffect(() => {
    let regionId = 0;
    let countryId = 0;

    if (masterData?.country?.length === 1) {
      countryId = masterData?.country;
      regionId = setCountryAndRegions(countryId);
    }
    setPayload({
      ...payload,
      countryId,
      countryIds: (isArray(countryId) && countryId.map((itm) => itm.id)) || [],
      regionId,
      regionIds: (isArray(regionId) && regionId.map((itm) => itm.id)) || []
    });
  }, []);
  return (
    <Grid className="leave-details-main-cls">
      <DialogComponent
        open={isSave || isRemove}
        handleClose={handleDialogClose}
        handleProceed={handleDialogSubmit}
        title={isRemove ? 'Remove Leave Entry' : 'Add Leave Entry'}
        titleType={getTitleType()}
        content={getDialogcontent()}
        isProceedButton
        isCancelButton
        proceedButtonText="Yes"
        cancelButtonText="No"
      />
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

      <Grid container spacing={3} xs={12} display="flex" justifyContent="center">
        <Typography fontWeight="bold" variant="subtitle1">
          Manage Leave Details
        </Typography>
      </Grid>

      <Divider style={{ marginTop: '0.5rem' }} />

      <Grid item xs={12} sm={6} mt={4} style={{ marginTop: '1.5rem' }}>
        <Grid container spacing={3}>
          {componentSet?.map((comp, ind) => (
            <RenderComponent
              key={ind}
              metaData={comp}
              payload={payload}
              ind={1}
              handleChange={handleChangeData}
              deleteMltSlctOptn={deleteMltSlctOptn}
            />
          ))}{' '}
        </Grid>
      </Grid>

      <Divider />

      <Grid item xs={12} mt={2} style={{ marginTop: '0.2rem' }}>
        <SimpleTable
          rowData={leaveData}
          headerData={columnForEntries}
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
          clearFilter={clearFunnelFilter}
          filterData={funnelFilters}
        />
      </Grid>
    </Grid>
  );
}

export default LeaveDetails;
