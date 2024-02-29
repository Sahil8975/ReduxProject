import { useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { IconButton, Paper, Tooltip, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add'; // Custom Task
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Custom Task
import CheckIcon from '@mui/icons-material/Check'; // Completed
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Completed
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ErrorIcon from '@mui/icons-material/Error'; // Empty
import ScheduleIcon from '@mui/icons-material/Schedule'; // Schedule
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import RotateRightIcon from '@mui/icons-material/RotateRight'; // Inprogress
import PanToolIcon from '@mui/icons-material/PanTool'; // HoldCustomerRequest
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // HoldCredit
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'; // HoldStockAvailability
import SyncProblemIcon from '@mui/icons-material/SyncProblem'; // Not completed
import AddTaskIcon from '@mui/icons-material/AddTask'; // Completed
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Cancelled
import CallIcon from '@mui/icons-material/Call'; // Callout
import DomainVerificationIcon from '@mui/icons-material/DomainVerification'; // Callout Planned
import DoneAllIcon from '@mui/icons-material/DoneAll'; // Callout Completed
import { useState, useEffect } from 'react';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'; // Callout Canelled
import { getFormattedDate, isArray } from '../../utils/utils';
import {
  COMPONENTS,
  DATE_FORMAT,
  SERVICE_ORDER_STATUS,
  STATUS,
  TASK_TYPE,
  ICON_COLOR,
  getDialogBoldContent
} from '../../utils/constants';
import RenderComponent from '../../components/RenderComponent';
import { createAdditionalServiceOrder, updateServiceOrder } from '../../services/projectService';
import { APIS, API_V1 } from '../../utils/apiList';
import { IS_DATA_LOADING } from '../../redux/constants';
import { NOTIFICATIONS } from '../../utils/messages';

export default function ServiceGrid({
  isPermitNeeded,
  isDeviceAllowed,
  isPONeeded,
  serviceOrders,
  setServiceOrders,
  preferredTimings,
  servicemens,
  projectId,
  hasServiceOrders,
  setShowGenericAlertBox,
  isProjectCompleted,
  projectEndDate,
  additionalServicemans
}) {
  const {
    EMPTY,
    SCHEDULED,
    IN_PROGRESS,
    HOLD_CUSTOMER_REQUEST,
    HOLD_STOCK_AVAILABILITY,
    HOLD_CREDIT,
    NOT_COMPLETED,
    COMPLETED,
    CANCELLED,
    CALL_OUT_PLANNED,
    CALL_OUT_CANECELLED,
    CALL_OUT_COMPLETED
  } = SERVICE_ORDER_STATUS;

  const { CUSTOM } = TASK_TYPE;
  const dispatch = useDispatch();
  const { ORANGE } = ICON_COLOR;
  const [updatedIndex, setUpdatedIndex] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [pendingSaveCount, setPendingSaveCount] = useState(0);

  const comps = {
    preferredTimmings: {
      control: COMPONENTS.SELECT_BOX,
      key: 'preferredTimingId',
      label: 'Preferred Timing',
      placeholder: 'Preferred Timing',
      options: preferredTimings,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.7rem' },
      controlStyle: { minWidth: '9rem' },
      columnWidth: 12,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: isProjectCompleted
    },
    serviceman: {
      control: COMPONENTS.SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.7rem' },
      key: 'servicemanId',
      label: 'Serviceman',
      placeholder: 'Serviceman',
      options: servicemens,
      select: true,
      columnWidth: 12,
      isRequired: true,
      isSelecteAllAllow: false,
      isDisabled: isProjectCompleted
    },
    additionalServicemen: {
      control: COMPONENTS.MULTI_SELECT_BOX,
      key: 'additionalServicemen',
      label: 'Additional Servicemen',
      placeholder: 'Additional Servicemen',
      columnWidth: 12,
      options: servicemens,
      labelStyle: { marginTop: '-0.5rem', marginLeft: '0.5rem' },
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.7rem', width: '13.5rem' },
      controlStyle: { height: '2rem' },
      maxMultipleOptions: 1,
      isDisabled: isProjectCompleted
    }
  };

  useEffect(() => {
    const allSaveIconPrimary = updatedIndex.every((index) => getIconColor(false, index) === 'primary');
    console.log('allSaveIconsArePrimary', allSaveIconPrimary);
    if (allSaveIconPrimary) {
      setIsDataChanged(false);
    }
    setPendingSaveCount(updatedIndex.length);
  }, [updatedIndex]);

  const deleteMltSlctOptn = (key, id, ind) => {
    if (!isProjectCompleted && serviceOrders[ind].isServiceOrderEditable) {
      const newAdditionalServicemen = serviceOrders[ind].additionalServicemen.filter((mn) => mn.id !== id);
      serviceOrders[ind].additionalServicemen = [...newAdditionalServicemen];
      serviceOrders[ind].additionalServicemanIds = newAdditionalServicemen.map((mn) => mn.id);
      setServiceOrders([...serviceOrders]);
    }
  };

  const handleChangeData = (key, val, ind) => {
    let rowModified = false;

    if (key === 'servicemanId' || key === 'preferredTimingId' || key === 'additionalServicemen') {
      rowModified = true;
      setIsDataChanged(true);
    }
    if (key === 'servicemanId') {
      if (serviceOrders[ind].servicemanId !== val) {
        rowModified = true;
      }
      if (isArray(serviceOrders[ind].additionalServicemanIds)) {
        serviceOrders[ind].additionalServicemen = [];
        serviceOrders[ind].additionalServicemanIds = [];
      }
    } else if (key === 'preferredTimingId') {
      if (serviceOrders[ind].preferredTimingId !== val) {
        rowModified = true;
      }
    } else if (key === 'additionalServicemen') {
      if (serviceOrders[ind].additionalServicemanIds !== val) {
        rowModified = true;
      }
      if (isArray(val) && val.find((man) => man.id === serviceOrders[ind].servicemanId * 1)) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: 'Selected additional serviceman is already assigned as serviceman to service order',
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
        return;
      }
      serviceOrders[ind].additionalServicemanIds = val.map((man) => man.id);
    }
    if (rowModified && !updatedIndex.includes(ind)) {
      setUpdatedIndex([...updatedIndex, ind]);
    }
    serviceOrders[ind][key] = val || null;
    setServiceOrders([...serviceOrders]);
  };

  const handleDeleteServiceOrder = (serviceOrderInd, serviceOrder) => {
    const { serviceOrderId, serviceSubjectTasks } = serviceOrder;
    if (serviceOrderId && serviceSubjectTasks.find((st) => st.serviceSubjectId)) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Not Allowed',
        content: 'Please delete Service Subject - Task to delete the service.',
        showProceedBtn: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Are You Sure?',
        content: 'Do you really want to delete this service?',
        showProceedBtn: true,
        proceedAction: hasServiceOrders && serviceOrderId ? 'removeServiceOrder' : 'removeServiceOrderOnUI',
        cancelButtonText: 'No',
        proceedButtonText: 'Yes',
        additionalInfoForProceed: { serviceOrderInd, serviceOrderId }
      });
    }
  };

  const displayErrorMessage = (content) =>
    setShowGenericAlertBox({
      open: true,
      titleType: STATUS.ERROR,
      title: 'Error',
      content,
      showProceedBtn: false,
      cancelButtonText: 'Ok',
      color: 'success'
    });

  const handleSaveAll = () => {
    updatedIndex.forEach((ind) => {
      const row = serviceOrders[ind];
      if (row && row.serviceOrderId) {
        handleUpdteServiceOrder(row, projectEndDate, ind, true);
      } else {
        handleSaveServiceOrder(row, projectEndDate, ind);
      }
    });
    setIsDataChanged(false);
  };

  const handleSaveServiceOrder = async (payload, projectEndDate, ind) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await createAdditionalServiceOrder(`${API_V1}/${APIS.CREATE_ADDITIONAL_SERVICE_ORDER}`, {
      ...payload,
      projectEndDate,
      projectId
    });
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.isSuccessful && res.data.serviceOrderId) {
      const filterArray = (isArray(updatedIndex) && updatedIndex.filter((id) => id !== ind)) || [];
      setUpdatedIndex(filterArray);
      serviceOrders[ind] = { ...res.data };
      if (isArray(serviceOrders[ind].additionalServicemanIds)) {
        serviceOrders[ind].additionalServicemen = serviceOrders[ind].additionalServicemanIds.map((mn) =>
          servicemens.find((ad) => ad.id === mn)
        );
      }
      setServiceOrders([...serviceOrders]);
      const allSaveIconPrimary = updatedIndex.every((index) => getIconColor(false, index) === 'primary');
      if (allSaveIconPrimary) {
        setIsDataChanged(false);
      }
    } else {
      displayErrorMessage(res?.error || NOTIFICATIONS.SOMETHING_WENT_WRONG);
    }
  };

  const handleUpdteServiceOrder = async (payload, projectEndDate, ind, calledFromSaveAll = false) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await updateServiceOrder(`${API_V1}/${APIS.UPDATE_SERVICE_ORDER}`, {
      ...payload,
      projectEndDate,
      projectId
    });
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.isSuccessful && res.data.serviceOrderId) {
      if (calledFromSaveAll) {
        setUpdatedIndex([]);
      } else {
        const filterArray = (isArray(updatedIndex) && updatedIndex.filter((id) => id !== ind)) || [];
        setUpdatedIndex(filterArray);
      }

      if (payload.serviceOrderId !== res.data.serviceOrderId) {
        serviceOrders.splice(ind, 1);
        const serviceOrderIndToUpdate = serviceOrders.findIndex(
          (ord) => ord.serviceOrderId === res.data.serviceOrderId
        );
        ind = serviceOrderIndToUpdate;
      }
      serviceOrders[ind] = { ...res.data, isServiceOrderEditable: true };
      if (isArray(serviceOrders[ind].additionalServicemanIds)) {
        serviceOrders[ind].additionalServicemen = serviceOrders[ind].additionalServicemanIds.map((mn) =>
          servicemens.find((ad) => ad.id === mn)
        );
      }
      setServiceOrders([...serviceOrders]);
    } else {
      displayErrorMessage(res?.error || NOTIFICATIONS.SOMETHING_WENT_WRONG);
    }
  };

  const getIconColor = (disableAction, ind) => {
    if (disableAction) {
      return 'lightgrey';
    }
    if (updatedIndex.includes(ind)) {
      return 'error';
    }
    return 'primary';
  };

  const handleRemoveServiceSubject = (
    serviceOrderInd,
    serviceSubjectInd,
    serviceOrderId,
    taskId,
    serviceSubjectId,
    serviceSubjectTaskName
  ) => {
    setShowGenericAlertBox({
      open: true,
      titleType: STATUS.WARNING,
      title: 'Are you sure?',
      content: getDialogBoldContent(serviceSubjectTaskName, '', 'serviceOrderGridTask', ''),
      showProceedBtn: true,
      maxWidth: serviceSubjectTaskName ? 'md' : 'sm',
      proceedAction: 'deleteServiceOrderTask',
      cancelButtonText: 'No',
      proceedButtonText: 'Yes',
      additionalInfoForProceed: { serviceOrderInd, serviceSubjectInd, serviceOrderId, taskId, serviceSubjectId }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Callout':
        return (
          <Tooltip title={status}>
            <CallIcon />
          </Tooltip>
        );
      case CUSTOM:
        return (
          <Tooltip title={status}>
            <AddCircleOutlineIcon />
          </Tooltip>
        );
      case EMPTY:
        return (
          <Tooltip title={status}>
            <ErrorOutlineIcon />
          </Tooltip>
        );
      case SCHEDULED:
        return (
          <Tooltip title={status}>
            <AccessAlarmIcon />
          </Tooltip>
        );
      case IN_PROGRESS:
        return (
          <Tooltip title={status}>
            <RotateRightIcon />
          </Tooltip>
        );
      case HOLD_CUSTOMER_REQUEST:
        return (
          <Tooltip title={status}>
            <PanToolIcon color="error" />
          </Tooltip>
        );
      case HOLD_CREDIT:
        return (
          <Tooltip title={status}>
            <MonetizationOnIcon color="error" />
          </Tooltip>
        );
      case HOLD_STOCK_AVAILABILITY:
        return (
          <Tooltip title={status}>
            <ProductionQuantityLimitsIcon color="error" />
          </Tooltip>
        );
      case NOT_COMPLETED:
        return (
          <Tooltip title={status}>
            <SyncProblemIcon />
          </Tooltip>
        );
      case COMPLETED:
        return (
          <Tooltip title={status}>
            <CheckCircleIcon sx={{ color: 'rgb(0, 171, 85)' }} />
          </Tooltip>
        );
      case CANCELLED:
        return (
          <Tooltip title={status}>
            <HighlightOffIcon sx={{ color: ORANGE }} />
          </Tooltip>
        );
      case CALL_OUT_PLANNED:
        return (
          <Tooltip title={status}>
            <DomainVerificationIcon />
          </Tooltip>
        );
      case CALL_OUT_CANECELLED:
        return (
          <Tooltip title={status}>
            <RemoveDoneIcon />
          </Tooltip>
        );
      case CALL_OUT_COMPLETED:
        return (
          <Tooltip title={status}>
            <DoneAllIcon />
          </Tooltip>
        );
      default:
        return <></>;
    }
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {!isArray(serviceOrders) && <caption style={{ textAlign: 'center' }}>No Service added</caption>}
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: '10px' }}>Sr.No.</TableCell>
              {!isProjectCompleted && (
                <TableCell>
                  Action
                  {hasServiceOrders && (
                    <Button
                      style={{ marginLeft: '-0.5rem' }}
                      onClick={handleSaveAll}
                      color={isDataChanged ? 'error' : 'primary'}
                    >
                      SaveAll
                    </Button>
                  )}
                </TableCell>
              )}
              {hasServiceOrders && <TableCell>Service Status</TableCell>}
              {hasServiceOrders && <TableCell>Task Type</TableCell>}
              {hasServiceOrders && <TableCell>Service Type</TableCell>}
              <TableCell>Scheduled Day Date</TableCell>
              {hasServiceOrders && <TableCell>Service Subject - Task</TableCell>}
              {!hasServiceOrders && <TableCell align="center">Type&nbsp;</TableCell>}
              <TableCell>Preferred time</TableCell>
              <TableCell>Serviceman</TableCell>
              <TableCell>Additional Servicemen</TableCell>
              {hasServiceOrders && <TableCell>SO Number</TableCell>}
              {(hasServiceOrders || isPONeeded) && <TableCell align="center">PO Needed</TableCell>}
              {(hasServiceOrders || isPermitNeeded) && <TableCell align="center">Permit Needed</TableCell>}
              {(hasServiceOrders || isDeviceAllowed) && <TableCell align="center">Device Allowed</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isArray(serviceOrders) &&
              serviceOrders.map((row, ind) => {
                const disableAction = !row.isServiceOrderEditable;
                return (
                  <TableRow key={ind} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: 1 }}>
                    <TableCell style={{ minWidth: '0.2rem' }}>{`${ind + 1}.`}</TableCell>
                    {!isProjectCompleted && (
                      <TableCell style={{ minWidth: '5.5rem', paddingLeft: '0rem' }}>
                        <Tooltip title="Delete Service Order">
                          <IconButton disabled={disableAction} onClick={() => handleDeleteServiceOrder(ind, row)}>
                            <CloseIcon color={disableAction ? 'lightgrey' : 'error'} />
                          </IconButton>
                        </Tooltip>
                        {hasServiceOrders && (
                          <Tooltip title="Save Service Order">
                            <IconButton
                              disabled={disableAction}
                              onClick={() =>
                                row.serviceOrderId
                                  ? handleUpdteServiceOrder(row, projectEndDate, ind)
                                  : handleSaveServiceOrder(row, projectEndDate, ind)
                              }
                            >
                              <SaveIcon color={getIconColor(disableAction, ind)} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {hasServiceOrders && <TableCell align="center">{getStatusIcon(row.serviceOrderStatus)}</TableCell>}
                    {hasServiceOrders && (
                      <TableCell align="center">
                        {(isArray(row.serviceSubjectTasks) &&
                          row.serviceSubjectTasks.map((tsk) =>
                            getStatusIcon((tsk.taskCode && (tsk.taskCode === CUSTOM ? CUSTOM : SCHEDULED)) || EMPTY)
                          )) ||
                          getStatusIcon(EMPTY)}
                      </TableCell>
                    )}
                    {hasServiceOrders && (
                      <TableCell align="center">{getStatusIcon(row.isCallOut ? 'Callout' : SCHEDULED)}</TableCell>
                    )}
                    <TableCell style={{ minWidth: '9rem', align: 'center' }}>
                      {getFormattedDate(DATE_FORMAT.DATE_NAME_FORMAT, row.scheduledDate)}
                    </TableCell>
                    {hasServiceOrders && (
                      <TableCell component="th" scope="row" style={{ paddingLeft: '10px' }}>
                        {(isArray(row.serviceSubjectTasks) &&
                          row.serviceSubjectTasks.map(
                            (tsk, i) =>
                              (tsk.serviceSubjectId && (
                                <Typography
                                  variant="subtitle2"
                                  style={{ color: '#637381', minWidth: '20rem' }}
                                  // mb="10px"
                                >
                                  {tsk.serviceSubjectTaskName}
                                  {!isProjectCompleted && (
                                    <IconButton
                                      disabled={disableAction}
                                      onClick={() =>
                                        handleRemoveServiceSubject(
                                          ind,
                                          i,
                                          row.serviceOrderId,
                                          tsk.taskId,
                                          tsk.serviceSubjectId,
                                          tsk.serviceSubjectTaskName
                                        )
                                      }
                                    >
                                      <CloseIcon
                                        color={disableAction ? 'lightgrey' : 'error'}
                                        style={{ verticalAlign: 'middle' }}
                                      />
                                    </IconButton>
                                  )}
                                </Typography>
                              )) ||
                              ''
                          )) ||
                          ''}
                      </TableCell>
                    )}
                    {!hasServiceOrders && (
                      <TableCell align="center">
                        <Tooltip title="Empty Service">
                          <ErrorOutlineIcon />
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell component="th" scope="row">
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comps.preferredTimmings, isDisabled: disableAction }}
                        payload={row}
                        ind={ind}
                        handleChange={handleChangeData}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" style={{ paddingRight: '6px' }}>
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comps.serviceman, isDisabled: disableAction }}
                        payload={row}
                        ind={ind}
                        handleChange={handleChangeData}
                      />
                    </TableCell>
                    <TableCell>
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comps.additionalServicemen, isDisabled: disableAction }}
                        payload={row}
                        ind={ind}
                        handleChange={handleChangeData}
                        deleteMltSlctOptn={deleteMltSlctOptn}
                      />
                    </TableCell>
                    {hasServiceOrders && <TableCell>{row.soNumber}</TableCell>}

                    {(hasServiceOrders || isPONeeded) && (
                      <TableCell align="center">{row.isPONeeded && <CheckIcon />}</TableCell>
                    )}
                    {(hasServiceOrders || isPermitNeeded) && (
                      <TableCell align="center">{row.isPermitNeeded && <CheckIcon />}</TableCell>
                    )}
                    {(hasServiceOrders || isDeviceAllowed) && (
                      <TableCell align="center">{row.isDeviceAllowed && <CheckIcon />}</TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
