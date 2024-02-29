import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Button, Container, Divider, Dialog, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import { COMPONENTS, REGX_TYPE, TASK_TYPE, OWNERSHIP_TYPE } from '../../utils/constants';
import RenderComponent from '../../components/RenderComponent';
import { isArray, isValidStr } from '../../utils/utils';
import useBoolean from '../../hooks/useBoolean';
import {
  getServiceLevelList,
  getServiceSubjectList,
  getServiceOrderDatesList,
  getProjectZonesList,
  getServiceTasksList,
  // getServiceTaskItemDdlList,
  getServiceTaskItemList
} from '../../services/projectService';
import { API_V1, APIS } from '../../utils/apiList';
import { IS_DATA_LOADING } from '../../redux/constants';

function AddServiceSubjectDialog({
  open,
  handleClose,
  projectId,
  projectNumber,
  locationName,
  legalEntityId,
  businessSubTypeId
}) {
  const dispatch = useDispatch();
  const [error, setError] = useBoolean(false);
  const [showCustomTask, setShowCustomTask] = useBoolean(false);
  const [showScheduleTasks, setShowScheduleTasks] = useBoolean(false);
  const [serviceLevels, setServiceLevels] = useState([]);
  const [serviceOrderDates, setServiceOrderDates] = useState([]);
  const [projectZones, setProjectZones] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [serviceSubjects, setServiceSubjects] = useState([]);
  const [serviceTaskItems, setServiceTaskItems] = useState({});
  const [payload, setPayload] = useState({
    serviceSubject: '',
    serviceSubjectId: 0,
    serviceLevelId: 1,
    serviceQuantity: 0,
    ownership: 0,
    taskList: []
  });

  const {
    serviceSubjectId,
    serviceSubject,
    serviceLevelId,
    serviceQuantity,
    ownership,
    taskList,
    isInstallationAssociationPresent,
    isConsumableAssociationPresent
  } = payload;
  const { CUSTOM, SCHEDULED } = TASK_TYPE;

  const {
    SERVICE_LEVELS,
    SERVICE_SUBJECTS,
    SERVICE_ORDERS_DATES,
    GET_SERVICE_ORDER_TASK,
    GET_ZONES,
    SERVICE_ORDER_TASKS,
    // SERVICE_ORDER_TASK_ITEMS_DDL,
    SERVICE_ORDER_TASK_ITEMS
  } = APIS;

  const { TEXT_FIELD, SELECT_BOX, ICON, RADIO, BUTTON, DATEPICKER, TYPOGRAPHY, CHECKBOX, AUTOCOMPLETE, NONE } =
    COMPONENTS;

  const serviceSubjectComps = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginBottom: '1rem' },
      key: 'serviceSubject',
      label: 'Service Subject Code',
      options: serviceSubjects,
      columnWidth: 2,
      isRequired: true,
      isError: error && !serviceSubject,
      helperText: 'Please select service code',
      autoCompleteDisplayKey: 'code'
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginBottom: '1rem' },
      key: 'serviceSubject',
      label: 'Service Subject Name',
      options: serviceSubjects,
      columnWidth: 4.6,
      isRequired: true,
      isError: error && !serviceSubject,
      helperText: 'Please select service name',
      autoCompleteDisplayKey: 'name'
    },
    {
      control: SELECT_BOX,
      key: 'serviceLevelId',
      label: 'Service Level',
      options: serviceLevels,
      columnWidth: 3,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isRequired: true,
      isError: error && !serviceLevelId,
      helperText: 'Please select service level'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginBottom: '1rem' },
      key: 'serviceQuantity',
      label: 'Quantity',
      columnWidth: 2,
      endAdornmentData: 'Each',
      isRequired: true,
      isError: error && !serviceQuantity,
      helperText: 'Please enter quantity'
    },
    {
      control: RADIO,
      groupStyle: { marginBottom: '1rem' },
      key: 'ownership',
      label: 'Ownership :',
      showLabel: true,
      options: OWNERSHIP_TYPE,
      columnWidth: 12,
      isRequired: true,
      isError: error && !ownership,
      helperText: 'Please select ownership'
    }
  ];

  const taskBtnComps = [
    {
      control: BUTTON,
      btnTitle: 'Add Task',
      // handleClickButton: () => updateTaskData('', '', 'ADD'),
      startIcon: <AddIcon />,
      columnWidth: 1.5,
      isDisabled: !serviceSubjectId
    },
    {
      control: BUTTON,
      btnTitle: 'Split',
      // handleClickButton: () => alert('Split Clicked!'),
      columnWidth: 1,
      isDisabled: !serviceSubjectId
    }
  ];

  const taskComponentsSet = [
    {
      control: SELECT_BOX,
      key: 'taskId',
      label: 'Task Name',
      options: [],
      select: true,
      columnWidth: 2,
      isRequired: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    {
      control: TEXT_FIELD,
      key: 'taskQuantity',
      label: 'Quantity',
      columnWidth: 1
    },
    {
      control: SELECT_BOX,
      key: 'serviceOrders',
      label: 'Schedule',
      options: serviceOrderDates,
      select: true,
      isRequired: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 2
    },
    {
      control: SELECT_BOX,
      key: 'zone',
      label: 'Zone Details',
      options: projectZones,
      columnWidth: 2,
      select: true,
      isRequired: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    {
      control: TEXT_FIELD,
      key: 'serialNumber',
      label: 'Serial Number/FA ID',
      columnWidth: 2
    },
    {
      control: TEXT_FIELD,
      key: 'taskNote',
      label: 'Notes',
      columnWidth: 2.5
    },
    {
      control: ICON,
      groupStyle: { marginRight: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Record',
      handleClickIcon: () => updateTaskData('', '', 'DELETE'),
      columnWidth: 0.5
    }
  ];

  const sparePartsComponentsSet = [
    {
      control: ICON,
      groupStyle: { marginRight: '-1.5rem', marginTop: '0.4rem' },
      iconName: <CancelIcon />,
      color: 'error',
      tooltipTitle: 'Remove Record',
      handleClickIcon: () => updateSparePartsData('', 'DELETE'),
      columnWidth: 0.5
    },
    {
      control: AUTOCOMPLETE,
      key: 'item',
      label: 'Item Code',
      options: [],
      columnWidth: 2,
      autoCompleteDisplayKey: 'code'
    },
    {
      control: AUTOCOMPLETE,
      key: 'item',
      label: 'Description',
      options: [],
      columnWidth: 3,
      autoCompleteDisplayKey: 'name'
    },
    {
      control: TEXT_FIELD,
      key: 'taskItemNote',
      label: 'Service Related Note',
      columnWidth: 4
    },
    {
      control: CHECKBOX,
      key: 'isBillable',
      label: 'Is billable $',
      labelPlacement: 'start',
      columnWidth: 1.5
    },
    {
      control: NONE,
      columnWidth: 1
    },
    {
      control: TEXT_FIELD,
      key: 'itemQuantity',
      label: 'Quantity',
      columnWidth: 1
    },
    {
      control: TEXT_FIELD,
      key: 'conversionFactor',
      label: 'Factor',
      columnWidth: 1,
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      key: 'ratioId',
      label: 'Ratio',
      select: true,
      columnWidth: 1.5,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    {
      control: SELECT_BOX,
      key: 'uomId',
      label: 'UOM',
      select: true,
      columnWidth: 1.5,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    {
      control: TEXT_FIELD,
      key: 'serviceQuantity',
      label: 'Service Qty',
      columnWidth: 1,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'unitPrice',
      label: 'Unit Price',
      columnWidth: 1.5
    },
    {
      control: TEXT_FIELD,
      key: 'grossAmount',
      label: 'Gross Amount',
      columnWidth: 1.5,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'discountAmount',
      label: 'Discount',
      columnWidth: 1
    },
    {
      control: TEXT_FIELD,
      key: 'netAmount',
      label: 'Net Amount',
      columnWidth: 1.5,
      isDisabled: true,
      groupStyle: { marginBottom: '1rem' }
    }
  ];

  const buttonComponents = [
    {
      control: BUTTON,
      groupStyle: { marginRight: '1.5rem' },
      btnTitle: 'Back',
      color: 'warning',
      handleClickButton: () => handleClose(),
      columnWidth: 0.5
    },
    {
      control: BUTTON,
      btnTitle: 'Save',
      handleClickButton: () => checkErrorsAndSaveProject(),
      columnWidth: 0.5
    }
  ];

  const getServiceLevels = async () => {
    let newServicelevels = [];
    const res = await getServiceLevelList(`${API_V1}/${SERVICE_LEVELS}`);
    if (res?.isSuccessful) {
      newServicelevels = res.data || [];
    }
    setServiceLevels([...newServicelevels]);
  };

  const getServiceSubjects = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const [namesList, codesList] = [[], []];
    const res = await getServiceSubjectList(`${API_V1}/${SERVICE_SUBJECTS}`, { businessSubTypeId, legalEntityId });
    if (res?.isSuccessful && isArray(res.data)) {
      setServiceSubjects(res.data);
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const getServiceOrderDates = async () => {
    let newServiceDates = [];
    const res = await getServiceOrderDatesList(`${API_V1}/${SERVICE_ORDERS_DATES}${projectId}`);
    if (res?.isSuccessful) {
      newServiceDates = res.data || [];
    }
    setServiceOrderDates([...newServiceDates]);
  };

  const getProjectZones = async () => {
    let newZones = [];
    const res = await getProjectZonesList(`${API_V1}/${GET_SERVICE_ORDER_TASK}/${projectId}/${GET_ZONES}`);
    if (res?.isSuccessful) {
      newZones = res.data || [];
    }
    setProjectZones([...newZones]);
  };

  const getServiceTasks = async (isCustom) => {
    let newTasks = [];
    if (serviceSubject?.id) {
      const apiPayload = {
        serviceSubjectId: serviceSubject?.id,
        projectId,
        taskType: isCustom ? CUSTOM : SCHEDULED
      };
      const res = await getServiceTasksList(`${API_V1}/${SERVICE_ORDER_TASKS}`, apiPayload);
      if (res?.isSuccessful) {
        newTasks = res.data || [];
      }
    }
    if (isCustom) {
      setCustomTasks([...newTasks]);
    } else {
      setScheduleTasks([...newTasks]);
    }
  };

  // const getServiceTaskItemDdls = async (taskId) => {
  //   if (taskId) {
  //     dispatch({ type: IS_DATA_LOADING, data: true });
  //     const apiPayload = {
  //       serviceSubjectId,
  //       taskId,
  //       isInstallationAssociationPresent,
  //       isConsumableAssociationPresent,
  //       itemSearchKey: ''
  //     };
  //     const res = await getServiceTaskItemDdlList(`${API_V1}/${SERVICE_ORDER_TASK_ITEMS_DDL}`, apiPayload);
  //     if (res?.isSuccessful && isArray(res.data)) {
  //       setServiceTaskItems({ ...serviceTaskItems, [taskId]: res.data });
  //     }
  //     dispatch({ type: IS_DATA_LOADING, data: false });
  //   }
  // };

  const addDefaultItemToTask = (taskId, taskObjInd, tasks) => {
    if (isInstallationAssociationPresent || isConsumableAssociationPresent) {
      if (!isArray(tasks)) {
        tasks = serviceTaskItems[taskId];
      }
      if (isArray(tasks)) {
        const task = taskList[taskObjInd];
        if (
          (task.taskType === CUSTOM && isInstallationAssociationPresent) ||
          (task.taskType === SCHEDULED && isConsumableAssociationPresent)
        ) {
          return [{ ...tasks[0], item: { id: tasks[0]?.id } }];
        }
      }
    }
    return [];
  };

  const getServiceTaskItem = async (taskId) => {
    if (taskId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const apiPayload = {
        serviceSubjectId,
        taskId,
        isInstallationAssociationPresent,
        isConsumableAssociationPresent,
        itemSearchKey: ''
      };
      const res = await getServiceTaskItemList(`${API_V1}/${SERVICE_ORDER_TASK_ITEMS}`, apiPayload);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (res?.isSuccessful && isArray(res.data)) {
        setServiceTaskItems({ ...serviceTaskItems, [taskId]: res.data });
        return res.data;
      }
    }
    return {};
  };

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const handleChangeData = async (key, val, ind) => {
    if (key) {
      const updateFields = {};
      if (['taskId', 'taskType', 'taskQuantity', 'zone', 'serialNumber', 'taskNote', 'serviceOrders'].includes(key)) {
        taskList[ind][key] = val;
        if (key === 'taskId') {
          let items = [];
          if (!serviceTaskItems[val]) {
            items = await getServiceTaskItem(val);
          }
          taskList[ind].taskItems = await addDefaultItemToTask(val, ind, taskList[ind].taskType, items);
        }
      } else if (
        [
          'item',
          'itemQuantity',
          'conversionFactor',
          'uomId',
          'unitPrice',
          'discountAmount',
          'taskItemNote',
          'isBillable'
        ].includes(key)
      ) {
        const [taskInd, itemRowInd] = ind.split('-');
        if (key === 'item') {
          updateFields.taskList = [
            ...taskList,
            (taskList[taskInd].taskItems[itemRowInd] = { ...val, item: { id: val.id } })
          ];
        } else {
          const selectedItem = taskList[taskInd].taskItems[itemRowInd];
          const itemUpdateField = { [key]: val };
          if (key === 'itemQuantity') {
            itemUpdateField.serviceQuantity = (selectedItem?.conversionFactor || 1) * (val || 0);
          }
          if (['itemQuantity', 'unitPrice', 'discountAmount'].includes(key)) {
            const currUnitPrice = (key === 'unitPrice' && val) || selectedItem?.unitPrice;
            const currDiscount = (key === 'discountAmount' && val) || selectedItem?.discountAmount;
            const currItemQuantity = (key === 'itemQuantity' && val) || selectedItem?.itemQuantity;
            const qtyAndPriceAndDiscExist = currUnitPrice && currItemQuantity;
            let [grossAmount, netAmount] = [0, 0, 0];
            if (qtyAndPriceAndDiscExist) {
              grossAmount = selectedItem?.itemQuantity * currUnitPrice || 0;
              netAmount = (grossAmount && grossAmount * 1 - currDiscount * 1) || 0;
            }
            const isValidAmtCalculation = !currDiscount || currDiscount < grossAmount;
            itemUpdateField.grossAmount = (isValidAmtCalculation && grossAmount) || 0;
            itemUpdateField.netAmount = (isValidAmtCalculation && netAmount) || 0;
          }
          updateFields.taskList = [
            ...taskList,
            (taskList[taskInd].taskItems[itemRowInd] = { ...selectedItem, ...itemUpdateField })
          ];
        }
      } else {
        updateFields[key] = val;
        if (key === 'serviceQuantity') {
          if (!val || isValidStr(val, REGX_TYPE.NUM)) {
            val = (isValidStr(val, REGX_TYPE.NUM) && val) || 0;
            updateFields[key] = val;
          } else {
            return true;
          }
        }
      }
      updatePayload({ ...updateFields });
    }
  };

  const updateTaskData = (index, event, action, isCustom) => {
    const values = [...taskList];
    switch (action) {
      case 'UPDATE':
        values[index][event?.target?.name] = event?.target?.value;
        break;
      case 'DELETE':
        values.splice(index, 1);
        break;
      case 'ADD':
        values.push({
          taskId: '',
          taskType: isCustom ? CUSTOM : SCHEDULED,
          taskQuantity: '',
          zone: '',
          serialNumber: '',
          taskNote: '',
          serviceOrders: [],
          taskItems: []
        });
        break;
      default:
        break;
    }
    updatePayload({ taskList: [...values] });
  };

  const updateSparePartsData = (event, action, taskInd, itemRowInd) => {
    const values = taskList[taskInd].taskItems;
    switch (action) {
      case 'UPDATE':
        values[itemRowInd][event?.target?.name] = event?.target?.value;
        break;
      case 'DELETE':
        values.splice(itemRowInd, 1);
        break;
      case 'ADD':
        values.push({
          item: '',
          itemId: '',
          conversionFactor: '',
          uomId: '',
          itemQuantity: '',
          discountAmount: '',
          grossAmount: '',
          netAmount: '',
          unitPrice: '',
          taskItemNote: '',
          isBillable: false,
          serviceQuantity: ''
        });
        break;
      default:
        break;
    }
    updatePayload({ taskList });
  };

  const checkErrorsAndSaveProject = () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    if (!serviceSubject || !serviceLevelId || !serviceQuantity || !ownership) {
      setError.on();
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      saveServiceSubject();
    }
  };

  const saveServiceSubject = () => alert('No errors and proceed for Save !!');

  const getTaskAndSparePartsComp = (i, task, isCustom) => (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        {taskComponentsSet?.map((comp, ind) => {
          if (ind === 0) {
            comp = { ...comp, options: isCustom ? customTasks : scheduleTasks };
          }
          return (
            <RenderComponent
              key={ind}
              metaData={comp}
              payload={taskList[i]}
              ind={i}
              handleChange={handleChangeData}
              handleBlur={handleChangeData}
            />
          );
        })}
        <Grid item xs={12} sx={{ ml: '0.5rem' }}>
          <RenderComponent
            metaData={{
              control: BUTTON,
              btnTitle: 'Add Spare Parts',
              handleClickButton: () => updateSparePartsData('', 'ADD', i),
              startIcon: <AddIcon />,
              columnWidth: 2
            }}
          />
        </Grid>
        <Grid mb={2}>
          <Typography variant="subtitle2" sx={{ ml: '1.7rem', mt: '0.5rem', mb: '1rem' }}>
            Spare Parts:
          </Typography>
          {isArray(taskList[i]?.taskItems) &&
            taskList[i]?.taskItems?.map((taskItem, itemRowInd) => {
              const selectedItem = taskList[i]?.taskItems[itemRowInd];
              return (
                <>
                  <Grid item xs={12} mt={1}>
                    <Grid container spacing={3} style={{ marginLeft: '1.3rem' }}>
                      {sparePartsComponentsSet?.map((comp, itemInd) => {
                        if (itemInd === 1 || itemInd === 2) {
                          const options = (serviceTaskItems && task.taskId && serviceTaskItems[task.taskId]) || [];
                          comp = { ...comp, options };
                        }
                        if (itemInd === 8) {
                          if (selectedItem?.isRatiosApplicable) {
                            comp = { ...comp, options: selectedItem?.ratios };
                            comp = { ...comp, isDisabled: true };
                          } else {
                            comp = { ...comp, isDisabled: false };
                          }
                        }
                        if (itemInd === 9) {
                          comp = { ...comp, options: selectedItem?.uoMs };
                        }

                        return (
                          <RenderComponent
                            key={itemInd}
                            metaData={{
                              ...comp,
                              handleClickIcon: () => updateSparePartsData('', 'DELETE', i, itemRowInd)
                            }}
                            payload={taskList[i]?.taskItems[itemRowInd]}
                            ind={`${i}-${itemRowInd}`}
                            handleChange={handleChangeData}
                            handleBlur={handleChangeData}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );

  useEffect(() => {
    getServiceLevels();
    getServiceSubjects();
  }, []);

  useEffect(() => {
    getServiceOrderDates();
    getProjectZones();
  }, [projectId]);

  useEffect(() => {
    getServiceTasks(false);
    getServiceTasks(true);
    updatePayload({ taskList: [] });
    const serviceSubjectObj = serviceSubjects.find((sub) => sub.id === payload.serviceSubject?.id);
    updatePayload({
      isInstallationAssociationPresent: serviceSubjectObj?.isInstallationAssociationPresent || false,
      isConsumableAssociationPresent: serviceSubjectObj?.isConsumableAssociationPresent || false,
      serviceSubjectId: serviceSubjectObj?.id || 0
    });
  }, [payload.serviceSubject]);

  const handleClickCustomTask = () => setShowCustomTask.toggle();
  const handleClickScheduleTask = () => setShowScheduleTasks.toggle();

  const getTitle = () =>
    `${(projectNumber && `Project: ${projectNumber}`) || ''} ${(locationName && `Location: ${locationName}`) || ''}`;

  return (
    <>
      <Dialog maxWidth="lg" fullWidth open={open}>
        <DialogContent>
          <Container>
            {/* Grid Container for header and close icon */}
            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Typography variant="h6">Add New Service Subject</Typography>
                <Typography variant="h6">{getTitle()}</Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem' }} />

            {/* Grid container for form components */}
            <Grid item xs={12} sm={6} sx={{ marginTop: '2rem' }}>
              <Grid container spacing={3}>
                {serviceSubjectComps?.map((comp, ind) => (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={ind}
                    handleChange={handleChangeData}
                    handleBlur={handleChangeData}
                  />
                ))}
              </Grid>
            </Grid>

            <Grid
              container
              spacing={3}
              mt={1}
              style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
            >
              <Grid item xs={12} display="flex" alignItems="center" mb={1}>
                {showCustomTask ? (
                  <ArrowDropUpIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
                ) : (
                  <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
                )}
                <Typography fontWeight="bold" variant="subtitle2">
                  Custom Tasks
                </Typography>
              </Grid>
              {showCustomTask && (
                <>
                  <Grid item xs={12} sx={{ ml: '0.5rem', mb: '1rem' }}>
                    <Grid container spacing={3}>
                      {taskBtnComps.map((comp, ind) => (
                        <RenderComponent
                          key={ind}
                          metaData={{ ...comp, handleClickButton: () => updateTaskData('', '', 'ADD', true) }}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  {isArray(taskList) &&
                    taskList.map((task, i) => task.taskType === CUSTOM && getTaskAndSparePartsComp(i, task, true))}
                </>
              )}
            </Grid>

            <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem', marginTop: '1rem' }} />

            <Grid
              container
              spacing={3}
              mt={1}
              style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
            >
              <Grid item xs={12} display="flex" alignItems="center" mb={1}>
                {showScheduleTasks ? (
                  <ArrowDropUpIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
                ) : (
                  <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
                )}
                <Typography fontWeight="bold" variant="subtitle2">
                  Schedule Tasks
                </Typography>
              </Grid>
              {showScheduleTasks && (
                <>
                  <Grid item xs={12} sx={{ ml: '0.5rem', mb: '1rem' }}>
                    <Grid container spacing={3}>
                      {taskBtnComps.map((comp, ind) => (
                        <RenderComponent
                          key={ind}
                          metaData={{ ...comp, handleClickButton: () => updateTaskData('', '', 'ADD', false) }}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  {isArray(taskList) &&
                    taskList.map((task, i) => task.taskType === SCHEDULED && getTaskAndSparePartsComp(i, task, false))}
                </>
              )}
            </Grid>

            <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem', marginTop: '1rem' }} />

            {/* Grid container for back / save / delete button */}
            <Grid container spacing={1} sx={{ mt: '1rem' }}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                {buttonComponents?.map((comp, ind) => (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={ind}
                    handleChange={handleChangeData}
                  />
                ))}
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}

AddServiceSubjectDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  projectId: PropTypes.string,
  projectNumber: PropTypes.string,
  locationName: PropTypes.string,
  legalEntityId: PropTypes.string,
  businessSubTypeId: PropTypes.string
};

export default AddServiceSubjectDialog;
