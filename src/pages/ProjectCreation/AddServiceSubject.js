import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Container, Divider } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import {
  COMPONENTS,
  REGX_TYPE,
  TASK_TYPE,
  OWNERSHIP_TYPE,
  STATUS,
  NOTE_TYPE,
  MAX_LENGTH,
  SERVICE_ORDER_STATUS,
  getDialogBoldContent
} from '../../utils/constants';
import RenderComponent from '../../components/RenderComponent';
import DialogComponent from '../../components/Dialog';
import Loader from '../../components/LoaderComponent/Loader';
import { deepCopyArrayOfObjects, isArray, isValidStr } from '../../utils/utils';
import useBoolean from '../../hooks/useBoolean';
import {
  getServiceLevelList,
  getServiceSubjectList,
  getServiceOrderDatesList,
  getProjectZonesList,
  getServiceTasksList,
  getServiceTaskItemList,
  addServiceSubject,
  saveEditServiceSubject,
  removeEditServiceSubjectTask,
  validateServiceSubjectQty
} from '../../services/projectService';
import {
  getTaskItemsWithPreferenceList,
  getPreferredItemsForItem,
  getTaskItemDetails,
  removeTaskItems
} from '../ScheduleViewer/EditSchedule/EditScheduleService';
import { API_V1, APIS } from '../../utils/apiList';
import { IS_DATA_LOADING } from '../../redux/constants';
import { ROUTES } from '../../routes/paths';
import NotesDialog from '../../components/notesDialog';

function AddServiceSubject() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    serviceSubjectObjId = null,
    projectId,
    projectNumber,
    locationName,
    legalEntityId,
    businessSubTypeId,
    contractId,
    servicemens,
    preferredTimings
  } = location?.state || {};
  const [localLoader, setLocalLoader] = useBoolean(false);
  const [error, setError] = useBoolean(false);
  const [saveBtnDisable, setSaveBtnDisable] = useBoolean(false);
  const [showCustomTask, setShowCustomTask] = useBoolean(false);
  const [collapseTask, setCollapseTask] = useState([]);
  const [showScheduleTasks, setShowScheduleTasks] = useBoolean(false);
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [serviceLevels, setServiceLevels] = useState([]);
  const [errorArray, setErrorArray] = useState([]);
  const [serviceOrderDates, setServiceOrderDates] = useState([]);
  const [projectZones, setProjectZones] = useState([]);
  const [customScheduleTasks, setCustomScheduleTasks] = useState([]);
  const [serviceSubjects, setServiceSubjects] = useState([]);
  const [serviceTaskItems, setServiceTaskItems] = useState({});
  const [additionalServicemenListTaskWise, setAdditionalServicemenListTaskWise] = useState({});
  const emptyPayload = {
    serviceSubjectSelectedObj: '',
    serviceSubjectId: serviceSubjectObjId || 0,
    serviceLevelId: 1,
    serviceSubjectQuantity: 0,
    ownership: 0,
    taskList: []
  };
  const { COMPLETED, CANCELLED } = SERVICE_ORDER_STATUS;
  const [payload, setPayload] = useState({ ...emptyPayload });
  const [existingData, setExistingData] = useState([]);
  const taskAndServiceSubjectWiseItems = {};
  const preferredItemsList = {};

  const {
    SERVICE_LEVELS,
    SERVICE_SUBJECTS,
    SERVICE_ORDERS_DATES,
    GET_SERVICE_ORDER_TASK,
    GET_ZONES,
    SERVICE_ORDER_TASKS,
    SERVICE_ORDER_TASK_ITEMS,
    SAVE_SERVICE_SUBJECT,
    GET_SERVICE_SUB_ORDER_TASK_DETAILS,
    GET_ITEMS_WITH_PREFERENCE,
    GET_TASK_ITEM_DETAILS,
    PREFERRED_ITEMS_FOR_ITEM,
    SAVE_EDIT_SERVICE_SUBJECT,
    VALIDATE_SS_QUANTITY
  } = APIS;

  const [genericAlertBox, setShowGenericAlertBox] = useState({
    open: false,
    title: '',
    titleType: '',
    content: '',
    showProceedBtn: false,
    proceedAction: '',
    maxWidth: '',
    proceedInformation: '',
    cancelButtonText: '',
    proceedButtonText: ''
  });

  const handleProceedBackAlertBox = () => {
    handleCloseBackAlertBox();
    const { proceedAction, proceedInformation } = genericAlertBox;
    let taskInd;
    if (proceedInformation) {
      taskInd = proceedInformation.taskInd;
    }
    switch (proceedAction) {
      case 'deleteTask':
        deleteTask(proceedInformation);
        break;
      case 'deleteTaskItem':
        deleteTaskItem(proceedInformation);
        break;
      case 'navigateToEditProject':
        navigateToEditProject();
        break;
      case 'confirmSplit':
        splitTask(taskInd);
        break;
      default:
        break;
    }
  };

  const deleteTask = async (proceedInformation) => {
    const { index, orderTaskId, values } = proceedInformation;
    if (orderTaskId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await removeEditServiceSubjectTask(`${API_V1}/${APIS.REMOVE_SERVICE_SUBJECT_TASK}=${orderTaskId}`);
      if (res.isSuccessful) {
        collapseTask.splice(index, 1);
        setCollapseTask([...collapseTask]);
        const { taskId, taskQuantity } = values[0];
        if (taskId) {
          if (isArray(customScheduleTasks)) {
            customScheduleTasks.forEach((tsk) => {
              if (tsk.id * 1 === taskId * 1) {
                tsk.isDisabled = false;
              }
              setCustomScheduleTasks([...customScheduleTasks]);
            });
          }
        }
        values.splice(index, 1);
        updatePayload({ taskList: [...values] });
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        dispatch({ type: IS_DATA_LOADING, data: true });
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: t('dialog.error'),
          content: (isArray(res.error) && res.error[0]) || t('addUser.somethingWentWrong'),
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    } else {
      collapseTask.splice(index, 1);
      setCollapseTask([...collapseTask]);
      const { taskId, taskQuantity } = values[0];
      if (taskId) {
        if (isArray(customScheduleTasks)) {
          customScheduleTasks.forEach((tsk) => {
            if (tsk.id * 1 === taskId * 1) {
              tsk.isDisabled = false;
            }
          });
          setCustomScheduleTasks([...customScheduleTasks]);
        }
      }
      values.splice(index, 1);
      updatePayload({ taskList: [...values] });
    }
  };

  const deleteTaskItem = async (proceedInformation) => {
    const { taskInd, itemRowInd, values, taskItemId } = proceedInformation;
    if (taskItemId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await removeTaskItems(`${API_V1}/${APIS.DELETE_TASKITEM}=${taskItemId}`);
      if (res.isSuccessful) {
        values.splice(itemRowInd, 1);
        taskList[taskInd].taskItems = [...values];
        updatePayload({ taskList });
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: t('dialog.error'),
          content: (isArray(res.error) && res.error[0]) || t('addUser.somethingWentWrong'),
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
        dispatch({ type: IS_DATA_LOADING, data: false });
      }
    } else {
      values.splice(itemRowInd, 1);
      taskList[taskInd].taskItems = [...values];
      updatePayload({ taskList });
    }
  };

  const emptyNotesBox = {
    maxWidth: 'sm',
    title: 'Notes',
    open: false,
    content: '',
    key: '',
    label: '',
    noteVal: '',
    taskInd: '',
    taskItemInd: '',
    noteType: '',
    maxChars: MAX_LENGTH.NOTES
  };

  const emptyTask = {
    taskId: '',
    taskType: '',
    taskQuantity: '',
    zone: null,
    serialNumber: '',
    taskNote: '',
    serviceOrdersObj: [],
    serviceOrders: [],
    defaultServicemanId: 0,
    additionalServicemenObj: [],
    additionalServicemen: [],
    preferredTimingId: null,
    taskItems: []
  };

  const handleCloseNotesAlertBox = () => {
    setIsFormModified.on();
    setShowNotesBox({ ...notesBox, ...emptyNotesBox });
  };

  const handleProceedNotesAlertBox = (updatedNote) => {
    const taskToUpdate = taskList[notesBox.taskInd];
    if (taskToUpdate) {
      if (notesBox.noteType === NOTE_TYPE.TASK) {
        taskToUpdate[notesBox.key] = updatedNote;
      } else if (notesBox.noteType === NOTE_TYPE.TASK_ITEM) {
        taskToUpdate.taskItems[notesBox.taskItemInd][notesBox.key] = updatedNote;
      }
      updatePayload({ taskList });
    }
    handleCloseNotesAlertBox();
  };
  const [notesBox, setShowNotesBox] = useState({ ...emptyNotesBox });
  const {
    serviceSubjectId,
    serviceSubjectSelectedObj,
    serviceLevelId,
    serviceSubjectQuantity,
    ownership,
    taskList,
    isInstallationAssociationPresent,
    isConsumableAssociationPresent
  } = payload;

  const mandatoryFieldsCheck = serviceSubjectId;

  const { CUSTOM, SCHEDULED } = TASK_TYPE;

  const { TEXT_FIELD, SELECT_BOX, ICON, RADIO, BUTTON, MULTI_SELECT_BOX, CHECKBOX, AUTOCOMPLETE, TYPOGRAPHY } =
    COMPONENTS;

  const serviceSubjectComps = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem' },
      key: 'serviceSubjectSelectedObj',
      label: 'Service Subject Code',
      options: serviceSubjects,
      columnWidth: 2,
      isRequired: true,
      isError: error && !serviceSubjectSelectedObj,
      helperText: 'Please select service code',
      autoCompleteDisplayKey: 'code',
      isDisabled: serviceSubjectObjId
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem' },
      key: 'serviceSubjectSelectedObj',
      label: 'Service Subject Name',
      options: serviceSubjects,
      columnWidth: 4.6,
      isRequired: true,
      isError: error && !serviceSubjectSelectedObj,
      helperText: 'Please select service subject name',
      autoCompleteDisplayKey: 'name',
      isDisabled: serviceSubjectObjId
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'serviceSubjectCode',
      label: 'Service Subject Code',
      columnWidth: 2,
      isRequired: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'serviceSubjectName',
      label: 'Service Subject Name',
      columnWidth: 4.6,
      isRequired: true,
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'serviceLevelId',
      label: 'Service Level',
      options: serviceLevels,
      columnWidth: 3,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isRequired: true,
      isError: error && !serviceLevelId,
      helperText: 'Please select service level',
      isDisabled: serviceSubjectObjId
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'serviceSubjectQuantity',
      label: 'Quantity',
      columnWidth: 2,
      endAdornmentData: 'Each',
      isRequired: true,
      isError: error && !serviceSubjectQuantity,
      helperText: 'Please enter quantity'
    },
    {
      control: RADIO,
      groupStyle: { marginTop: '1rem' },
      key: 'ownership',
      label: 'Ownership',
      showLabel: true,
      options: OWNERSHIP_TYPE,
      columnWidth: 12,
      isRequired: true,
      isError: error && !ownership,
      helperText: 'Please select ownership',
      isDisabled: serviceSubjectObjId
    },
    {
      control: TYPOGRAPHY,
      key: 'ownership',
      label: 'Ownership:',
      columnWidth: 12,
      isRequired: true,
      groupStyle: { marginTop: '1rem', display: 'inline-flex' },
      payloadStyle: { marginLeft: '1rem' },
      isLableOnly: true
    }
  ];

  const taskBtnComps = [
    {
      control: ICON,
      iconName: <AddIcon />,
      iconTitle: 'Add Task',
      groupStyle: { marginLeft: '0.1rem', marginTop: '0.3rem' },
      color: 'primary',
      tooltipTitle: 'Add Task',
      columnWidth: 1.5,
      isDisabled: !serviceSubjectId,
      isTask: true
    }
  ];

  const taskComponentsSet = [
    {
      control: ICON,
      groupStyle: { paddingLeft: '1rem', cursor: 'pointer', marginTop: '-0.5rem' },
      iconName: <CircleIcon fontSize="small" />,
      iconSize: 'small',
      key: 'toggleIcon',
      tooltipTitle: 'Collapse',
      placement: 'left'
    },
    {
      control: SELECT_BOX,
      groupStyle: { paddingLeft: '0rem', height: '3rem', marginTop: '-0.5rem' },
      key: 'taskId',
      label: 'Task Name',
      options: [],
      select: true,
      columnWidth: 2,
      isRequired: true,
      isEmptyOptionAllowed: false,
      isSelecteAllAllow: false
    },
    {
      control: MULTI_SELECT_BOX,
      groupStyle: { height: '3rem', paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'serviceOrdersObj',
      label: 'Schedule',
      columnWidth: 4,
      options: serviceOrderDates,
      controlStyle: { height: '2rem' },
      labelStyle: { marginTop: '-0.5rem' },
      maxMultipleOptions: 1,
      selectAll: true,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'serviceOrderDateCombination',
      label: 'Schedule',
      columnWidth: 4,
      controlStyle: { height: '2rem' },
      labelStyle: { marginTop: '-0.5rem' },
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem', paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'serviceOrdersObjInEdit',
      label: 'Schedule',
      columnWidth: 3,
      options: serviceOrderDates,
      select: true,
      controlStyle: { height: '2rem' },
      labelStyle: { marginTop: '-0.5rem' },
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'taskQuantity',
      label: 'Quantity',
      isRequired: true,
      columnWidth: 0.7
    },
    {
      control: ICON,
      groupStyle: { paddingLeft: '0.5rem', marginTop: '-0.5rem' },
      key: 'split',
      iconTitle: '-/-',
      color: 'primary',
      tooltipTitle: 'Split',
      columnWidth: 1
    },
    // {
    //   control: SELECT_BOX,
    //   groupStyle: { marginBottom: '0.5rem', paddingLeft: '0.2rem' },
    //   key: 'defaultServicemanId',
    //   label: 'Serviceman',
    //   placeholder: 'Serviceman',
    //   options: servicemens,
    //   select: true,
    //   columnWidth: 2,
    //   isRequired: true,
    //   isSelecteAllAllow: false,
    //   isEmptyOptionAllowed: true
    // },
    // {
    //   control: MULTI_SELECT_BOX,
    //   key: 'additionalServicemenObj',
    //   label: 'Additional Servicemen',
    //   placeholder: 'Additional Servicemen',
    //   columnWidth: 3,
    //   controlStyle: { height: '2rem' },
    //   labelStyle: { marginTop: '-0.5rem' },
    //   groupStyle: { marginBottom: '0.5rem', paddingLeft: '0.2rem' },
    //   maxMultipleOptions: 1
    // },
    {
      control: SELECT_BOX,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'zone',
      label: 'Zone',
      options: projectZones,
      columnWidth: 2,
      select: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    // {
    //   control: SELECT_BOX,
    //   groupStyle: { paddingLeft: '0.2rem' },
    //   key: 'preferredTimingId',
    //   label: 'Preferred Timings',
    //   options: preferredTimings,
    //   columnWidth: 2,
    //   select: true,
    //   isEmptyOptionAllowed: true,
    //   isSelecteAllAllow: false
    // },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingLeft: '0.2rem', marginTop: '-0.5rem' },
      key: 'serialNumber',
      tooltipTitle: 'Max 50 chars allowed',
      label: 'Serial Number/FA ID',
      columnWidth: 1.5
    },
    // {
    //   control: TEXT_FIELD,
    //   groupStyle: { height: '3rem', paddingLeft: '0.2rem' },
    //   key: 'preferredTimingName',
    //   label: 'Preferred Timing',
    //   columnWidth: 1.5,
    //   isDisabled: true
    // },
    // {
    //   control: TEXT_FIELD,
    //   groupStyle: { height: '3rem', paddingLeft: '0.2rem' },
    //   key: 'serviceManName',
    //   label: 'Serviceman',
    //   columnWidth: 1.5,
    //   isDisabled: true
    // },
    {
      control: ICON,
      groupStyle: { marginTop: '-0.8rem' },
      key: 'taskNotesIcon',
      color: '',
      iconName: <CommentIcon />,
      tooltipTitle: '',
      columnWidth: 1,
      handleClickIcon: (key, ind) =>
        setShowNotesBox({
          ...notesBox,
          key: 'taskNote',
          label: `Service Note ( Max ${MAX_LENGTH.NOTES} chars )`,
          noteVal: payload?.taskList[ind].taskNote || '',
          taskInd: ind,
          taskItemInd: '',
          noteType: NOTE_TYPE.TASK,
          open: true
        })
    },
    {
      control: ICON,
      key: 'deleteTask',
      groupStyle: {
        marginRight: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '-0.7rem'
      },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Task',
      columnWidth: 0.5
    }
  ];

  const sparePartsComponentsSet = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginTop: '-0.2rem' },
      key: 'item',
      label: 'Item Code',
      options: [],
      columnWidth: 1.6,
      autoCompleteDisplayKey: 'code',
      isRequired: true,
      genericItemList: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'item',
      label: 'Description',
      options: [],
      columnWidth: 2,
      autoCompleteDisplayKey: 'name',
      isRequired: true,
      genericItemList: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginTop: '-0.2rem' },
      key: 'item',
      label: 'Item Code (Preferred)',
      options: [],
      columnWidth: 1.6,
      autoCompleteDisplayKey: 'code',
      isRequired: true,
      genericItemList: false
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'item',
      label: 'Description (Preferred)',
      options: [],
      columnWidth: 2,
      autoCompleteDisplayKey: 'name',
      isRequired: true,
      genericItemList: false
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '-2.5rem', marginRight: '1.5rem', marginTop: '-0.5rem' },
      key: 'isPreferred',
      label: '',
      labelPlacement: 'start',
      columnWidth: 0.5,
      tooltipTitle: 'Click to select Preferred Items'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'itemQuantity',
      label: 'Quantity',
      columnWidth: 0.6,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'conversionFactor',
      label: 'Factor',
      columnWidth: 0.6,
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'ratioId',
      label: 'Ratio',
      select: true,
      isRequired: true,
      columnWidth: 0.8,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false
    },
    {
      control: SELECT_BOX,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'uomId',
      label: 'UOM',
      select: true,
      columnWidth: 0.8,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'serviceQuantity',
      label: 'Service Qty',
      columnWidth: 0.8,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'unitPrice',
      label: 'Unit Price',
      columnWidth: 0.8,
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'grossAmount',
      label: 'Gross Amount',
      columnWidth: 0.8,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'discountAmount',
      label: 'Discount',
      columnWidth: 0.8
    },
    {
      control: TEXT_FIELD,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '-0.2rem' },
      key: 'netAmount',
      label: 'Net Amount',
      columnWidth: 0.8,
      isDisabled: true
    },
    {
      control: ICON,
      groupStyle: { paddingLeft: '0.2rem', marginTop: '0.1rem' },
      key: 'taskItemNotesIcon',
      color: 'inherit',
      iconName: <CommentIcon />,
      tooltipTitle: '',
      columnWidth: 0.2
    },
    {
      control: CHECKBOX,
      groupStyle: { paddingLeft: '0rem', marginLeft: '-1rem', marginTop: '-0.5rem' },
      key: 'isBillable',
      label: '$',
      tooltipTitle: 'Is Billable',
      labelPlacement: 'start',
      columnWidth: 0.8
    },
    // {
    //   control: SELECT_BOX,
    //   groupStyle: { paddingLeft: '0.1rem' },
    //   key: 'isBillable',
    //   label: '$',
    //   select: true,
    //   options: [
    //     { id: '0', name: 'No' },
    //     { id: '1', name: 'Yes' }
    //   ],
    //   columnWidth: 1,
    //   isEmptyOptionAllowed: false,
    //   isSelecteAllAllow: false
    // },
    {
      control: ICON,
      groupStyle: { paddingLeft: '0.5rem', marginTop: '-0.1rem', marginLeft: '-2.2rem' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Spare Part',
      handleClickIcon: () => updateSparePartsData('', 'DELETE'),
      columnWidth: 0.3
    }
  ];

  const handleBack = () => {
    if (isFormModified) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Are you sure?',
        content: 'Service subject is not saved. Do you still want to continue?',
        proceedAction: 'navigateToEditProject',
        // maxWidth: 'md',
        showProceedBtn: true,
        cancelButtonText: 'No',
        proceedButtonText: 'Yes'
      });
    } else {
      navigateToEditProject();
    }
    if (serviceSubjectObjId && isFormModified) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Are you sure?',
        content: 'Service subject is not saved. Do you still want to continue?',
        proceedAction: 'navigateToEditProject',
        // maxWidth: 'md',
        showProceedBtn: true,
        cancelButtonText: 'No',
        proceedButtonText: 'Yes'
      });
    } else {
      navigateToEditProject();
    }
  };

  const buttonComponents = [
    {
      control: BUTTON,
      groupStyle: { marginRight: '1.5rem' },
      btnTitle: 'Back',
      color: 'warning',
      handleClickButton: () => handleBack(),
      columnWidth: 0.8
    },
    {
      control: BUTTON,
      groupStyle: { marginRight: '1.5rem' },
      btnTitle: 'Save & Close',
      color: 'success',
      handleClickButton: () => checkErrorsAndSaveProject(false),
      columnWidth: 1.2
    },
    {
      control: BUTTON,
      key: 'save&add',
      btnTitle: 'Save & Add New Service Subject',
      color: 'success',
      handleClickButton: () => checkErrorsAndSaveProject(true),
      columnWidth: 2.4
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
    const res = await getServiceSubjectList(`${API_V1}/${SERVICE_SUBJECTS}`, {
      businessSubTypeId,
      legalEntityId,
      projectId
    });
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

  const getServiceTasks = async (isCustom, serviceSubjectId = null) => {
    let newTasks = [];
    if (serviceSubjectId || serviceSubjectSelectedObj?.id) {
      const apiPayload = {
        serviceSubjectId: serviceSubjectId || serviceSubjectSelectedObj?.id,
        projectId,
        taskType: isCustom ? 'Custom' : 'Scheduled'
      };
      const res = await getServiceTasksList(`${API_V1}/${SERVICE_ORDER_TASKS}`, apiPayload);
      if (res?.isSuccessful) {
        newTasks = res.data || [];
        if (isArray(newTasks)) {
          newTasks.forEach((tsk) => {
            tsk.isDisabled = false;
          });
        }
      }
    }
    if (isCustom) {
      setCustomScheduleTasks([...newTasks]);
      getServiceTasks(false, serviceSubjectId);
    } else {
      setCustomScheduleTasks((customScheduleTasks) => [...customScheduleTasks, ...newTasks]);
    }
  };

  const addDefaultItemToTask = (taskId, taskObjInd, items, taskQuantity) => {
    if (!isArray(items)) {
      items = serviceTaskItems[taskId];
    }
    if (isArray(items)) {
      const task = taskList[taskObjInd];
      if (task.taskType === SCHEDULED) {
        return [];
      }
      if (isInstallationAssociationPresent) {
        return items.map((item) => {
          const ratioObj = (isArray(item.ratios) && item.ratios.find((r) => r.id === item.ratioId * 1)) || null;
          return {
            ...item,
            itemId: item?.id,
            item: { id: item?.id },
            itemQuantity: taskQuantity,
            serviceQuantity:
              task.taskType === SCHEDULED && isConsumableAssociationPresent
                ? taskQuantity * item.conversionFactor * (ratioObj?.ratioId || 0)
                : taskQuantity * item.conversionFactor,
            grossAmount: (item.unitPrice && item.unitPrice * taskQuantity)?.toFixed(2) || 0,
            // netAmount:
            //   (
            //     (item.unitPrice && item.unitPrice * item.conversionFactor * taskQuantity - item.discountAmount * 1) ||
            //     0
            //   )?.toFixed(2) || 0,
            netAmount:
              ((item.unitPrice && item.unitPrice * taskQuantity) - (item.discountAmount * 1 || 0))?.toFixed(2) || 0,
            taskItemNote: '',
            // isBillable: '0'
            isBillable: false
          };
        });
      }
      return [];
      // [
      //   {
      //     ...tasks[0],
      //     itemId: tasks[0]?.id,
      //     item: { id: tasks[0]?.id },
      //     itemQuantity: taskQuantity,
      //     serviceQuantity: taskQuantity * tasks[0].conversionFactor,
      //     grossAmount: (tasks[0].unitPrice && tasks[0].unitPrice * taskQuantity)?.toFixed(2) || 0,
      //     netAmount:
      //       (tasks[0].unitPrice && tasks[0].unitPrice * tasks[0].conversionFactor * taskQuantity)?.toFixed(2) || 0,
      //     taskItemNote: '',
      //     // isBillable: '0'
      //     isBillable: false
      //   }
      // ];
    }
    return [];
  };

  const getServiceTaskItem = async (
    taskId,
    serviceSubjectId,
    isInstallationAssociationPresent,
    isConsumableAssociationPresent,
    taskType,
    isGetItemDetails
  ) => {
    if (taskId && serviceSubjectId) {
      const apiPayload = {
        serviceSubjectId,
        taskId,
        isInstallationAssociationPresent,
        isConsumableAssociationPresent,
        itemSearchKey: ''
      };
      // const res = await getServiceTaskItemList(`${API_V1}/${SERVICE_ORDER_TASK_ITEMS}`, apiPayload);
      if (taskAndServiceSubjectWiseItems[`${taskId}-${serviceSubjectId}`]) {
        setServiceTaskItems((serviceTaskItems) => ({
          ...serviceTaskItems,
          [taskId]: taskAndServiceSubjectWiseItems[`${taskId}-${serviceSubjectId}`]
        }));
        return taskAndServiceSubjectWiseItems[apiPayload.serviceSubjectId];
      }
      const res = await getTaskItemsWithPreferenceList(`${API_V1}/${GET_ITEMS_WITH_PREFERENCE}`, apiPayload);
      if (res?.isSuccessful && isArray(res.data)) {
        const tempServiceTaskItems =
          isGetItemDetails && (taskType === CUSTOM ? isInstallationAssociationPresent : isConsumableAssociationPresent)
            ? await Promise.all(
                res.data.map((itm) =>
                  getTaskItemDetail({ taskId, id: itm.id, hasPreferredItems: itm.hasPreferredItems })
                )
              )
            : res.data;
        setServiceTaskItems((serviceTaskItems) => ({ ...serviceTaskItems, [taskId]: tempServiceTaskItems }));
        taskAndServiceSubjectWiseItems[`${taskId}-${serviceSubjectId}`] = tempServiceTaskItems;
        return tempServiceTaskItems;
      }
    }
    return [];
  };

  const getTaskItemDetail = async (val) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const { taskItemId, taskId, id, hasPreferredItems } = val;
    let preferredItems = [];
    const res = await getTaskItemDetails(`${API_V1}/${GET_TASK_ITEM_DETAILS}`, {
      itemId: id,
      serviceSubjectId,
      taskId: taskId.toString(),
      isInstallationAssociationPresent,
      isConsumableAssociationPresent,
      itemSearchKey: ''
    });
    if (hasPreferredItems) {
      if (!preferredItemsList[id]) {
        const res = await getPreferredItemsForItem(`${API_V1}/${PREFERRED_ITEMS_FOR_ITEM}=${id}`);
        preferredItemsList[id] = isArray(res?.data) ? res?.data : [];
      }
      preferredItems = preferredItemsList[id] || [];
    }
    dispatch({ type: IS_DATA_LOADING, data: false });
    return { ...res.data, hasPreferredItems, preferredItems, taskItemId };
  };

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const getValidCost = (val) => isValidStr(val, REGX_TYPE.UNIT_PRICE_RX) && val && val.split('.').slice(0, 2).join('.');

  const getTaskRemainingQty = (taskId, taskInd) => {
    let taskCurrentQty = 0;
    if (serviceSubjectObjId) {
      // This logic will run in edit service subject component as we gets serviceOrdersObjInEdit from BE
      const taskItem = taskList[taskInd];
      taskCurrentQty = taskList
        .filter(
          (tsk) => tsk.taskId * 1 === taskId * 1 && tsk.serviceOrders[0] === taskItem?.serviceOrders[0] // By assuming in edit service sibject there will always be single service order has been selected
          // (tsk) => tsk.taskId * 1 === taskId * 1 && tsk.serviceOrdersObjInEdit === taskItem?.serviceOrdersObjInEdit
        )
        .reduce((previousValue, currentValue) => previousValue * 1 + currentValue.taskQuantity * 1, 0);
      // return serviceSubjectQuantity;
    } else {
      // This logic will run in add service subject component
      taskCurrentQty = taskList
        .filter((tsk) => tsk.taskId * 1 === taskId * 1)
        .reduce((previousValue, currentValue) => previousValue * 1 + currentValue.taskQuantity * 1, 0);
    }
    return serviceSubjectQuantity - taskCurrentQty;
  };

  const updateTaskDisabledFlag = (taskInd) => {
    customScheduleTasks.forEach((task) => (task.isDisabled = getTaskRemainingQty(task.id, taskInd) <= 0));
    setCustomScheduleTasks([...customScheduleTasks]);
  };

  const enterKeyPress = (e, ind) => {
    handleOnBlur('taskQuantity', e.target.value, ind);
  };

  const handleOnBlur = (key, val, ind) => {
    const updateFields = {};
    if (['unitPrice', 'discountAmount'].includes(key) && val) {
      const [taskInd, itemRowInd] = ind.split('-');
      const selectedItem = taskList[taskInd].taskItems[itemRowInd];
      const itemUpdateField = { [key]: val };
      itemUpdateField[key] = parseFloat(val).toFixed(2);
      taskList[taskInd].taskItems[itemRowInd] = { ...selectedItem, ...itemUpdateField };
      updateFields.taskList = [...taskList];
    } else if (key === 'taskQuantity') {
      if (val !== '0' && (!val || isValidStr(val, REGX_TYPE.NUM))) {
        const { taskId, taskItems, taskType } = taskList[ind];
        const allowedMaxQty = (getTaskRemainingQty(taskId, ind) || 0) + taskList[ind].taskQuantity * 1;
        if (val && allowedMaxQty - val > 0) {
          // Here we are adding additional task with remaining quantity (redaptive logic)
          taskList.splice(ind + 1, 0, {
            ...taskList[ind],
            isTaskEditable: true,
            taskQuantity: allowedMaxQty - val,
            taskItems: deepCopyArrayOfObjects(taskItems)
          });
          delete taskList[ind + 1].orderTaskId;
          if (isArray(taskList[ind + 1].taskItems)) {
            taskList[ind + 1].taskItems.forEach((tskItm) => {
              delete tskItm.taskItemId;
            });
          }
        }
        const newCollapseTask = [...collapseTask, true];
        setCollapseTask(newCollapseTask);
        if (isArray(taskItems)) {
          taskItems.forEach((item) => {
            const { conversionFactor, unitPrice, ratios, ratioId } = item;
            const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
            item.itemQuantity = val;
            item.discountAmount = 0;
            item.serviceQuantity =
              taskType === SCHEDULED && isConsumableAssociationPresent
                ? conversionFactor * val * (ratioObj?.ratio || 0)
                : val * conversionFactor;
            item.grossAmount = (unitPrice && unitPrice * val)?.toFixed(2) || 0;
            item.netAmount = item.grossAmount;
          });
          if (taskList[ind + 1] && isArray(taskList[ind + 1].taskItems)) {
            const { taskQuantity } = taskList[ind + 1];
            taskList[ind + 1].taskItems.forEach((item) => {
              const { conversionFactor, unitPrice, ratios, ratioId } = item;
              const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
              item.itemQuantity = taskQuantity;
              item.discountAmount = 0;
              item.Quantity = taskQuantity;
              item.serviceQuantity =
                taskType === SCHEDULED && isConsumableAssociationPresent
                  ? conversionFactor * taskQuantity * (ratioObj?.ratio || 0)
                  : taskQuantity * conversionFactor;
              item.grossAmount = (unitPrice && unitPrice * taskQuantity)?.toFixed(2) || 0;
              item.netAmount = item.grossAmount;
            });
          }
        }
        updateTaskDisabledFlag(ind);
      } else {
        return true;
      }
    }
    updatePayload({ ...updateFields });
  };

  const handleChangeData = async (key, val, ind) => {
    setIsFormModified.on();
    if (key) {
      const updateFields = {};
      if (
        [
          'taskId',
          'taskType',
          'taskQuantity',
          'zone',
          'serialNumber',
          'taskNote',
          'serviceOrdersObj'
          // 'defaultServicemanId',
          // 'additionalServicemenObj'
          // 'preferredTimingId'
        ].includes(key)
      ) {
        if (key === 'zone' && !val) {
          taskList[ind].zone = null;
        } else if (key === 'taskId') {
          dispatch({ type: IS_DATA_LOADING, data: true });
          taskList[ind] = { ...emptyTask, taskType: taskList[ind].taskType };
          taskList[ind][key] = val;
          const items =
            serviceTaskItems[val] ||
            (await getServiceTaskItem(
              val,
              serviceSubjectId,
              isInstallationAssociationPresent,
              isConsumableAssociationPresent,
              taskList[ind].taskType,
              true
            ));
          const taskQuantity = getTaskRemainingQty(val, ind);
          taskList[ind].taskItems = await addDefaultItemToTask(val, ind, items, taskQuantity);
          // taskList[ind].taskQuantity = taskQuantity;
          taskList[ind].isTaskEditable = true;
          const task = customScheduleTasks.find((task) => task.id * 1 === val * 1) || null;
          taskList[ind].additionalServicemen = task?.additionalServicemen || [];
          // const servicemanId = task?.defaultServicemanId || 0;
          // if (task.taskType === SCHEDULED) {
          //   taskList[ind].defaultServicemanId = task?.defaultServicemanId;
          //   taskList[ind].preferredTimingId = task?.preferredTimingId || null;
          // }
          // const tempAddntlSrvcmn =
          //   (val && servicemens.filter((srvcmn) => srvcmn.id !== servicemanId * 1)) || servicemens;
          // addAdditionalServicemenListToTask(ind, tempAddntlSrvcmn);
          // deleteMltSlctOptn('additionalServicemenObj', servicemanId, ind);
          updateTaskDisabledFlag(ind);
          dispatch({ type: IS_DATA_LOADING, data: false });
        } else if (key === 'taskNote') {
          taskList[ind][key] = val.substr(0, MAX_LENGTH.NOTES);
        } else if (key === 'serialNumber') {
          taskList[ind][key] = val.substr(0, MAX_LENGTH.SERIAL_NUMBER);
        } else if (key === 'taskQuantity') {
          if (val !== '0' && (!val || isValidStr(val, REGX_TYPE.NUM))) {
            const { taskId, taskItems } = taskList[ind];
            val = (isValidStr(val, REGX_TYPE.NUM) && val) || 0;
            const allowedMaxQty = (getTaskRemainingQty(taskId, ind) || 0) + taskList[ind].taskQuantity * 1;
            // //if (val && val * 1 > allowedMaxQty * 1 + taskList[ind].taskQuantity * 1) {
            if (val && val * 1 > allowedMaxQty * 1) {
              return true;
            }
            taskList[ind][key] = val;
            // if (val && allowedMaxQty - val > 0) {
            //   // Here we are adding additional task with remaining quantity (redaptive logic)
            //   taskList.splice(ind + 1, 0, {
            //     ...taskList[ind],
            //     isTaskEditable: true,
            //     taskQuantity: allowedMaxQty - val,
            //     taskItems: deepCopyArrayOfObjects(taskItems)
            //   });
            //   delete taskList[ind + 1].orderTaskId;
            //   if (isArray(taskList[ind + 1].taskItems)) {
            //     taskList[ind + 1].taskItems.forEach((tskItm) => {
            //       delete tskItm.taskItemId;
            //     });
            //   }
            // }
            // if (isArray(taskItems)) {
            //   taskItems.forEach((item) => {
            //     const { conversionFactor, unitPrice, ratios, ratioId } = item;
            //     const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
            //     item.itemQuantity = val;
            //     item.discountAmount = 0;
            //     item.serviceQuantity =
            //       item.taskType === SCHEDULED && isConsumableAssociationPresent
            //         ? conversionFactor * val * (ratioObj?.ratio || 0)
            //         : val * conversionFactor;
            //     item.grossAmount = (unitPrice && unitPrice * val)?.toFixed(2) || 0;
            //     // item.netAmount = ((unitPrice && unitPrice * conversionFactor * val) || 0)?.toFixed(2) || 0;
            //     item.netAmount = item.grossAmount;
            //   });

            //   if (taskList[ind + 1] && isArray(taskList[ind + 1].taskItems)) {
            //     const { taskQuantity } = taskList[ind + 1];
            //     taskList[ind + 1].taskItems.forEach((item) => {
            //       const { conversionFactor, unitPrice, ratios, ratioId } = item;
            //       const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
            //       item.itemQuantity = taskQuantity;
            //       item.discountAmount = 0;
            //       item.Quantity = taskQuantity;
            //       item.serviceQuantity =
            //         item.taskType === SCHEDULED && isConsumableAssociationPresent
            //           ? conversionFactor * taskQuantity * (ratioObj?.ratio || 0)
            //           : taskQuantity * conversionFactor;
            //       item.grossAmount = (unitPrice && unitPrice * taskQuantity)?.toFixed(2) || 0;
            //       // item.netAmount = ((unitPrice && unitPrice * conversionFactor * taskQuantity) || 0)?.toFixed(2) || 0;
            //       item.netAmount = item.grossAmount;
            //     });
            //   }
            // }
            // updateTaskDisabledFlag(ind);
          } else {
            return true;
          }
        }
        // else if (key === 'defaultServicemanId') {
        //   const tempAddntlSrvcmn = (val && servicemens.filter((srvcmn) => srvcmn.id !== val * 1)) || servicemens;
        //   addAdditionalServicemenListToTask(ind, tempAddntlSrvcmn);
        //   taskList[ind][key] = val;
        //   taskList[ind].additionalServicemen = taskList[ind].additionalServicemen.filter(
        //     (srvcmn) => srvcmn * 1 !== val * 1
        //   );
        //   taskList[ind].additionalServicemenObj = taskList[ind].additionalServicemenObj.filter(
        //     (srvcmn) => srvcmn.id * 1 !== val * 1
        //   );
        // }
        else if (['serviceOrdersObj', 'additionalServicemenObj'].includes(key)) {
          const keyToUpdate = key === 'serviceOrdersObj' ? 'serviceOrders' : 'additionalServicemen';
          let sortedVal;
          if (key === 'serviceOrdersObj' && isArray(val)) {
            sortedVal = val.sort((a, b) => new Date(a.date) - new Date(b.date));
            // sortedVal = val.sort((a, b) => a.name.localeCompare(b.name));
          }
          taskList[ind][key] =
            (isArray(sortedVal) &&
              ((sortedVal.includes('selectAll') && [
                ...(key === 'serviceOrdersObj' ? serviceOrderDates : additionalServicemenListTaskWise[ind])
              ]) ||
                (sortedVal.includes('deselectAll') && []))) ||
            sortedVal;
          taskList[ind][keyToUpdate] =
            (isArray(taskList[ind][key]) && taskList[ind][key].map((itm) => itm.id)) ||
            (sortedVal && sortedVal?.id && [sortedVal?.id]) ||
            [];
          if (key === 'serviceOrdersObj') {
            taskList[ind].taskQuantity = '';
            // taskList[ind].serviceOrdersObjInEdit = val?.id;
            if (taskList[ind].taskType === CUSTOM) {
              taskList[ind].serviceOrdersObj = val;
              taskList[ind].serviceOrders = [val?.id];
              taskList[ind].preferredTimingName = val?.preferredTimingName || '';
              taskList[ind].preferredTimingId = val?.preferredTimingId || '';
              taskList[ind].serviceManName = val?.serviceManName || '';
              taskList[ind].defaultServicemanId = val?.serviceManId || '';
            }
          }
        } else {
          taskList[ind][key] = val;
        }
        updateFields.taskList = [...taskList];
      } else if (
        [
          'item',
          'itemQuantity',
          'conversionFactor',
          'ratioId',
          'uomId',
          'unitPrice',
          'discountAmount',
          'taskItemNote',
          'isBillable',
          'isPreferred'
        ].includes(key)
      ) {
        const [taskInd, itemRowInd] = ind.split('-');
        if (key === 'item') {
          const taskItemId = (isArray(existingData) && existingData[taskInd]?.taskItems[itemRowInd].taskItemId) || 0;
          const { taskId, taskQuantity } = taskList[taskInd];
          const itemDetails = await getTaskItemDetail({ ...val, taskId, taskItemId });
          const { id, conversionFactor, unitPrice, discountAmount, ratios, ratioId } = itemDetails;
          const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
          taskList[taskInd].taskItems[itemRowInd] = {
            ...itemDetails,
            itemId: id,
            item: { id },
            itemQuantity: taskQuantity,
            serviceQuantity:
              taskList[taskInd].taskType === SCHEDULED && isConsumableAssociationPresent
                ? conversionFactor * taskQuantity * (ratioObj?.ratio || 1)
                : taskQuantity * conversionFactor,
            grossAmount: (unitPrice && (unitPrice * taskQuantity).toFixed(2)) || 0,
            netAmount: ((unitPrice && unitPrice * taskQuantity) - (discountAmount * 1 || 0))?.toFixed(2) || 0,
            taskItemNote: '',
            isBillable: false
          };
          updateFields.taskList = [...taskList];
        } else {
          const selectedItem = taskList[taskInd].taskItems[itemRowInd];
          const itemUpdateField = { [key]: val };
          if (key === 'itemQuantity') {
            if (
              val &&
              (val === '0' || !isValidStr(val, REGX_TYPE.NUM) || val * 1 > taskList[taskInd]?.taskQuantity * 1)
            ) {
              return true;
            }
            const ratioObj =
              (isArray(selectedItem.ratios) && selectedItem.ratios.find((r) => r.id === selectedItem.ratioId * 1)) ||
              null;
            if (taskList[taskInd].taskType === SCHEDULED && isConsumableAssociationPresent) {
              itemUpdateField.serviceQuantity =
                (selectedItem?.conversionFactor || 1) * (val || 0) * (ratioObj?.ratio || 1);
            } else {
              itemUpdateField.serviceQuantity = (selectedItem?.conversionFactor || 1) * (val || 0);
            }
            itemUpdateField.discountAmount = '0.00';
          } else if (key === 'taskItemNote') {
            itemUpdateField.taskItemNote = val.substr(0, MAX_LENGTH.NOTES);
          } else if (key === 'ratioId') {
            itemUpdateField.ratioId = val || null;
            const ratioObj =
              (isArray(selectedItem.ratios) && selectedItem.ratios.find((r) => r.id === val * 1)) || null;
            itemUpdateField.uomId = ratioObj?.uomId || '';
            if (isConsumableAssociationPresent) {
              itemUpdateField.serviceQuantity =
                (selectedItem?.conversionFactor || 1) * (selectedItem?.itemQuantity || 0) * (ratioObj?.ratio || 0);
            }
          } else if (key === 'uomId') {
            if (isArray(selectedItem.ratios) && selectedItem.ratioId) {
              const selectedRatioId = selectedItem.ratios.find((r) => r.id === selectedItem.ratioId * 1)?.uomId;
              const currentRatioId = selectedItem.ratios.find((r) => r.uomId === val * 1)?.uomId;
              if (selectedRatioId !== currentRatioId) {
                itemUpdateField.ratioId = null;
              }
            }
          }
          if (['itemQuantity', 'unitPrice', 'discountAmount'].includes(key)) {
            if (key === 'unitPrice' || key === 'discountAmount') {
              if (key === 'unitPrice') {
                selectedItem.discountAmount = 0;
                itemUpdateField.discountAmount = 0;
              }
              if (!val || isValidStr(val, REGX_TYPE.UNIT_PRICE_RX)) {
                val = getValidCost(val);
                itemUpdateField[key] = val === ('' || false) ? 0 : val;
              } else {
                return true;
              }
            }
            const currUnitPrice = key === 'unitPrice' ? val || 0 : selectedItem?.unitPrice || 0;
            const currDiscount = key === 'discountAmount' ? val || 0 : selectedItem?.discountAmount || 0;
            const currItemQuantity = key === 'itemQuantity' ? val || 0 : selectedItem?.itemQuantity || 0;
            const qtyAndPriceAndDiscExist = currUnitPrice && currItemQuantity;
            let [grossAmount, netAmount] = [0, 0, 0];
            if (qtyAndPriceAndDiscExist) {
              grossAmount = (currItemQuantity * currUnitPrice)?.toFixed(2) || 0;
              netAmount = (grossAmount && grossAmount * 1 - currDiscount * 1)?.toFixed(2) || 0;
            }
            const isValidAmtCalculation = !currDiscount || currDiscount * 1 < grossAmount * 1;
            if (key === 'discountAmount' && currDiscount * 1 >= grossAmount * 1) {
              return true;
            }
            itemUpdateField.grossAmount = (isValidAmtCalculation && grossAmount) || 0;
            itemUpdateField.netAmount = (isValidAmtCalculation && netAmount) || 0;
          }
          taskList[taskInd].taskItems[itemRowInd] = { ...selectedItem, ...itemUpdateField };
          updateFields.taskList = [...taskList];
        }
      } else {
        updateFields[key] = val;
        if (key === 'serviceSubjectQuantity') {
          // updateFields.taskList = [];
          // setServiceTaskItems([]);
          if (val !== '0' && (!val || isValidStr(val, REGX_TYPE.NUM))) {
            val = (isValidStr(val, REGX_TYPE.NUM) && val) || 0;
            updateFields[key] = val;
            customScheduleTasks.forEach((tsk) => {
              tsk.isDisabled = false;
            });
            setCustomScheduleTasks([...customScheduleTasks]);
          } else {
            return true;
          }
        }
      }
      updatePayload({ ...updateFields });
    }
  };

  const deleteMltSlctOptn = (key, val, ind) => {
    if (['serviceOrdersObj', 'additionalServicemenObj'].includes(key) && val) {
      const existingSelectedList = taskList[ind][key];
      const keyToUpdate = key === 'serviceOrdersObj' ? 'serviceOrders' : 'additionalServicemen';
      if (isArray(existingSelectedList)) {
        const tempObj = existingSelectedList.filter((servOrd) => servOrd.id !== val * 1);
        const tempList = tempObj.map((v) => v.id);
        taskList[ind][key] = [...tempObj];
        taskList[ind][keyToUpdate] = [...tempList];
      } else if (existingSelectedList) {
        taskList[ind][key] = null;
        taskList[ind][keyToUpdate] = [];
      }
    }
    updatePayload([...taskList]);
  };

  const splitTask = (taskInd) => {
    const taskToSplit = taskList[taskInd];
    if (taskToSplit) {
      const { taskQuantity: taskOldQuantity, taskItems } = taskToSplit;
      if (taskOldQuantity > 1) {
        taskItems.forEach((item) => {
          const { conversionFactor, unitPrice, ratios, ratioId } = item;
          item.itemQuantity = 1;
          if (taskList[taskInd].taskType === SCHEDULED && isConsumableAssociationPresent) {
            const ratioObj = (isArray(ratios) && ratios.find((r) => r.id === ratioId * 1)) || null;
            item.serviceQuantity = conversionFactor * 1 * (ratioObj?.ratio || 0);
          } else {
            item.serviceQuantity = conversionFactor || 1 * 1;
          }
          item.grossAmount = (unitPrice && unitPrice * 1)?.toFixed(2) || 0;
          // item.netAmount = ((unitPrice && unitPrice * conversionFactor * 1) || 0)?.toFixed(2) || 0;
          item.netAmount = item.grossAmount;
          item.discountAmount = 0;
        });
        const newTasks = [];
        Array.from(Array((taskOldQuantity - 1) * 1).keys()).forEach(() =>
          newTasks.push({ ...taskToSplit, taskItems: deepCopyArrayOfObjects(taskItems), taskQuantity: 1 })
        );
        const newCollapseTask = collapseTask.concat(Array(taskOldQuantity - 1).fill(true));
        setCollapseTask(newCollapseTask);
        if (isArray(newTasks)) {
          newTasks.forEach((tsk) => {
            delete tsk.orderTaskId;
            if (isArray(tsk.taskItems)) {
              tsk.taskItems.forEach((tskItm) => delete tskItm.taskItemId);
            }
          });
        }
        taskList.splice(taskInd + 1, 0, ...newTasks);
        taskList[taskInd].taskQuantity = 1;
        updatePayload({ taskList });
      }
    }
  };
  const handleSplitConfirmation = (taskInd) => {
    const taskToSplit = taskList[taskInd];
    const taskOldQuantity = taskToSplit?.taskQuantity || 0;

    if (taskOldQuantity <= 5) {
      splitTask(taskInd);
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: 'Are you sure?',
        content: 'Do you really want to split the quantity?',
        showProceedBtn: true,
        proceedAction: 'confirmSplit',
        proceedInformation: { taskInd },
        cancelButtonText: 'No',
        proceedButtonText: 'Yes'
      });
    }
  };

  const updateTaskData = (index, event, action, isCustom, orderTaskId, taskId) => {
    const values = [...taskList];
    const deleletTaskUI = { orderTaskId, index, values };
    switch (action) {
      case 'UPDATE':
        values[index][event?.target?.name] = event?.target?.value;
        break;
      case 'DELETE': {
        const taskName =
          (isArray(customScheduleTasks) && customScheduleTasks.find((itm) => itm.id === taskId * 1)?.name) || '';
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: 'Are you sure?',
          content: getDialogBoldContent(taskName, '', 'deleteTask', ''),
          showProceedBtn: true,
          maxWidth: taskName ? 'md' : 'sm',
          proceedAction: 'deleteTask',
          proceedInformation: deleletTaskUI,
          cancelButtonText: 'No',
          proceedButtonText: 'Yes'
        });
        break;
      }
      case 'ADD':
        values.push({ ...emptyTask, taskType: isCustom ? CUSTOM : SCHEDULED, isTaskEditable: true });
        // addAdditionalServicemenListToTask(taskList.length, servicemens);
        updateTaskDisabledFlag(taskList.length);
        setCollapseTask([...collapseTask, true]);
        break;
      default:
        break;
    }
    updatePayload({ taskList: [...values] });
  };

  // const addAdditionalServicemenListToTask = (ind, list) => {
  //   const tempAdditionalServicemenListTaskWise = { ...additionalServicemenListTaskWise };
  //   tempAdditionalServicemenListTaskWise[ind] = [...list];
  //   setAdditionalServicemenListTaskWise((oldVal) => ({
  //     ...tempAdditionalServicemenListTaskWise
  //   }));
  // };

  const updateSparePartsData = (event, action, taskInd, itemRowInd, taskItemId, itemId, taskId) => {
    const values = [...taskList[taskInd].taskItems];
    const deleletTaskItemUI = { taskInd, itemRowInd, values, taskItemId };
    switch (action) {
      case 'UPDATE':
        values[itemRowInd][event?.target?.name] = event?.target?.value;
        break;
      case 'DELETE': {
        const taskItemName =
          (isArray(serviceTaskItems[taskId]) && serviceTaskItems[taskId].find((itm) => itm.id === itemId)?.name) || '';
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: 'Are you sure?',
          content: getDialogBoldContent(taskItemName, '', 'deleteSparePart', ''),
          showProceedBtn: true,
          maxWidth: taskItemName ? 'md' : 'sm',
          proceedAction: 'deleteTaskItem',
          proceedInformation: deleletTaskItemUI,
          cancelButtonText: 'No',
          proceedButtonText: 'Yes'
        });
        break;
      }
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
          // isBillable: '0',
          isBillable: false,
          serviceQuantity: ''
        });
        break;
      default:
        break;
    }
    taskList[taskInd].taskItems = [...values];
    updatePayload({ taskList });
  };

  const checkErrorsAndSaveProject = (addNewServiceSubject) => {
    expandTasks();
    // setTimeout(() => {
    if (!serviceSubjectObjId) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      if (!serviceSubjectSelectedObj || !serviceLevelId || !serviceSubjectQuantity || !ownership) {
        setError.on();
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else if (errorArray.length > 0) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: t('dialog.error'),
          content: 'Please enter required fields',
          showProceedBtn: false,
          cancelButtonText: 'Ok',
          color: 'success'
        });
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        saveServiceSubject(addNewServiceSubject);
      }
    } else if (errorArray.length > 0) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: t('dialog.error'),
        content: 'Please enter required fields',
        showProceedBtn: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      saveServiceSubject(addNewServiceSubject);
    }
    // }, 5000);
  };

  const checkTaskNotmatching = () => {
    const taskIdWitQty = {};
    taskList.forEach((task) => {
      if ([COMPLETED, CANCELLED].includes(task.serviceOrderStatusCode)) {
        if (taskIdWitQty[task]) {
          taskIdWitQty[task] += task.taskQuantity;
        } else {
          taskIdWitQty[task] = task.taskQuantity;
        }
      }
    });
    const res = taskList.some(
      (task) =>
        ![COMPLETED, CANCELLED].includes(task.serviceOrderStatusCode) &&
        task.taskQuantity * 1 !== serviceSubjectQuantity * 1
    );
    return res;
  };

  const validateSSQauntity = async () => {
    const ownership = !serviceSubjectObjId
      ? payload?.ownership
      : OWNERSHIP_TYPE.find((own) => own.name === payload?.ownership)?.value;
    const validQty = await validateServiceSubjectQty(`${API_V1}/${VALIDATE_SS_QUANTITY}`, {
      serviceSubject: { ...payload, projectId, ownership }
    });
    return validQty;
  };

  const saveServiceSubject = async (addNewServiceSubject) => {
    const checkTaskNotmatching = await validateSSQauntity(payload);
    if (checkTaskNotmatching?.data?.responseCode === 100) {
      const apiToCall = serviceSubjectObjId
        ? saveEditServiceSubject(`${API_V1}/${SAVE_EDIT_SERVICE_SUBJECT}`, {
            serviceSubject: { ...payload, projectId }
          })
        : addServiceSubject(`${API_V1}/${SAVE_SERVICE_SUBJECT}`, {
            serviceSubject: { ...payload, projectId }
          });
      setError.off();
      apiToCall.then((res) => {
        dispatch({ type: IS_DATA_LOADING, data: false });
        if (res?.errorCode) {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.ERROR,
            title: t('dialog.error'),
            content: (isArray(res?.error) && res?.error.join(', ')) || t('addUser.somethingWentWrong'),
            showProceedBtn: false,
            cancelButtonText: 'Ok',
            color: 'success'
          });
        } else {
          handleAPIRes(res, addNewServiceSubject);
        }
      });
    } else {
      dispatch({ type: IS_DATA_LOADING, data: false });
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.WARNING,
        title: t('dialog.error'),
        content: checkTaskNotmatching?.data?.description || 'Please check, task quantities are not fulfilled',
        showProceedBtn: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    }
  };

  const handleAPIRes = (savedServiceSubject, addNewServiceSubject) => {
    const isSuccess = savedServiceSubject?.isSuccessful;
    if (!isSuccess) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: savedServiceSubject ? t('dialog.success') : t('addUser.error'),
        content: (isSuccess && savedServiceSubject?.message) || t('addUser.somethingWentWrong'),
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    }
    dispatch({ type: IS_DATA_LOADING, data: true });
    setTimeout(() => {
      if (isSuccess) {
        if (addNewServiceSubject) {
          setPayload({ ...emptyPayload });
          setIsFormModified.off();
          getServiceSubjects();
        } else {
          navigateToEditProject();
        }
      }
    }, 5000);
  };

  const navigateToAddProject = () => navigate(ROUTES.ADD_PROJECT, { state: { contractId } }, { replace: true });

  const navigateToEditProject = () =>
    navigate(`${ROUTES.EDIT_PROJECT}/${projectId}`, { state: { contractId, projectId } }, { replace: true });

  const toggelTaskCollapse = (ind) => {
    const tempTaskBullets = [...collapseTask];
    tempTaskBullets[ind] = !tempTaskBullets[ind];
    setCollapseTask([...tempTaskBullets]);
  };

  const getTaskAndSparePartsComp = (i, task, isCustom) => (
    <Grid item xs={12} mt={2}>
      <Grid container spacing={3}>
        {taskComponentsSet?.map((comp, ind) => {
          comp.isDisabled = false;
          if (!task.isTaskEditable) {
            comp.isDisabled = true;
            if (['serviceOrdersObj', 'serviceOrdersObjInEdit'].includes(comp.key)) {
              return true;
            }
          }
          if (comp.key === 'toggleIcon') {
            comp.handleClickIcon = () => toggelTaskCollapse(i);
            comp.tooltipTitle = collapseTask[i] ? 'Collapse' : 'Expand';
          } else if (comp.key === 'taskId') {
            comp.isError = !task[comp.key];
            comp.options = customScheduleTasks.filter((task) => task.taskType === (isCustom ? CUSTOM : SCHEDULED));
          } else if (comp.key === 'serviceOrdersObj') {
            if (task.serviceOrdersObjInEdit) {
              return;
            }
            comp.multiple = !isCustom;
            comp.selectAll = !isCustom;
            comp.isError = !isArray(task.serviceOrders);
          } else if (comp.key === 'taskQuantity') {
            comp.isError = !task[comp.key];
            comp.handleKeyDown = (e) => enterKeyPress(e, i);
            comp.isDisabled = !task.isTaskEditable || !task.taskId;
          } else if (comp.key === 'deleteTask') {
            comp.handleClickIcon = () => updateTaskData(i, '', 'DELETE', isCustom, task.orderTaskId, task.taskId);
          } else if (comp.key === 'taskNotesIcon') {
            comp.color = (task?.taskNote && 'primary') || '';
            comp.tooltipTitle = task?.taskNote ? 'Click to view Notes' : 'Click to add Notes';
          } else if (comp.key === 'split') {
            comp.handleClickIcon = () => handleSplitConfirmation(i);
          }
          // else if (comp.key === 'Schedule' && task.isTaskEditable) {
          //   return;
          else if (comp.key === 'serviceOrderDateCombination' && task.isTaskEditable) {
            // else if (comp.key === 'serviceOrderDateCombination' && task.serviceOrdersObjInEdit && !task.isTaskEditable) {
            return;
          }
          if (comp.key === 'serviceOrdersObjInEdit') {
            comp.isDisabled = true;
            if (!task.serviceOrdersObjInEdit) {
              return;
            }
          }
          if (['serviceManName', 'preferredTimingName'].includes(comp.key)) {
            if (!isCustom) {
              return true;
            }
          }
          // if (comp.key === 'additionalServicemenObj') {
          //   comp.options = additionalServicemenListTaskWise[i] || [];
          // }
          return (
            <RenderComponent
              key={ind}
              metaData={{ ...comp }}
              payload={taskList[i]}
              ind={i}
              handleChange={handleChangeData}
              handleBlur={handleOnBlur}
              deleteMltSlctOptn={deleteMltSlctOptn}
            />
          );
        })}
        {collapseTask[i] && (
          <>
            <Grid item xs={12} ml={1.7} mb={0.7} style={{ paddingTop: '0rem', marginTop: '-0.2rem' }}>
              <Typography variant="subtitle2">Spare Parts:</Typography>
            </Grid>
            <Grid sx={{ marginLeft: '0.5rem' }}>
              {isArray(taskList[i]?.taskItems) &&
                taskList[i]?.taskItems?.map((taskItem, itemRowInd) => {
                  const selectedItem = taskList[i]?.taskItems[itemRowInd];
                  return (
                    <>
                      <Grid item xs={12} mt={1}>
                        <Grid container spacing={3} style={{ marginLeft: '0.3rem', paddingTop: '0.5rem' }}>
                          {sparePartsComponentsSet?.map((comp, itemInd) => {
                            comp.isDisabled = false;
                            if (
                              ['conversionFactor', 'serviceQuantity', 'grossAmount', 'netAmount'].includes(comp.key)
                            ) {
                              comp.isDisabled = true;
                            }
                            if (comp.key === 'unitPrice') {
                              comp.tooltipTitle = taskItem.unitPrice;
                            } else if (comp.key === 'grossAmount') {
                              comp.tooltipTitle = taskItem.grossAmount;
                            } else if (comp.key === 'discountAmount') {
                              comp.tooltipTitle = taskItem.discountAmount;
                            } else if (comp.key === 'netAmount') {
                              comp.tooltipTitle = taskItem.netAmount;
                            } else if (comp.key === 'item') {
                              if (comp.genericItemList && taskItem.isPreferred) {
                                return true;
                              }
                              if (!comp.genericItemList && !taskItem.isPreferred) {
                                return true;
                              }
                              comp.options =
                                (comp.genericItemList
                                  ? serviceTaskItems && task.taskId && serviceTaskItems[task.taskId]
                                  : taskItem.preferredItems) || [];
                            } else if (comp.key === 'isPreferred') {
                              if (!serviceSubjectObjId) {
                                return;
                              }
                              // comp.isDisabled = !selectedItem?.hasPreferredItems;
                            } else if (comp.key === 'ratioId') {
                              if (isCustom || !isArray(selectedItem?.ratios)) {
                                return false;
                              }
                              if (selectedItem?.isRatiosApplicable) {
                                comp.options = selectedItem?.ratios;
                                comp.isDisabled = false;
                              } else {
                                comp.isDisabled = true;
                              }
                            } else if (comp.key === 'uomId') {
                              comp.options = selectedItem?.uoMs;
                              comp.isDisabled = isCustom;
                              comp.isRequired = !isCustom;
                            } else if (comp.key === 'discountAmount') {
                              comp.isDisabled = !taskItem.unitPrice;
                            } else if (comp.key === 'taskItemNotesIcon') {
                              comp.color = (taskItem?.taskItemNote && 'primary') || '';
                              comp.tooltipTitle = taskItem?.taskItemNote ? 'Click to view Notes' : 'Click to add Notes';
                            }
                            if (['item', 'itemQuantity', 'ratioId', 'uomId', 'unitPrice'].includes(comp.key)) {
                              comp.isError = !taskItem[comp.key];
                            }
                            if (['grossAmount', 'netAmount'].includes(comp.key)) {
                              comp.isError = taskItem.discountAmount * 1 > taskItem.grossAmount * 1;
                            }
                            if (!taskList[i].isTaskEditable) {
                              comp.isDisabled = true;
                            }
                            return (
                              <RenderComponent
                                key={itemInd}
                                metaData={{
                                  ...comp,
                                  handleClickIcon: (key, ind) =>
                                    key === 'taskItemNotesIcon'
                                      ? setShowNotesBox({
                                          ...notesBox,
                                          label: `Service Related Note (Max ${MAX_LENGTH.NOTES} chars)`,
                                          key: 'taskItemNote',
                                          noteVal: taskList[i]?.taskItems[itemRowInd].taskItemNote,
                                          taskInd: i,
                                          taskItemInd: itemRowInd,
                                          noteType: NOTE_TYPE.TASK_ITEM,
                                          open: true
                                        })
                                      : updateSparePartsData(
                                          '',
                                          'DELETE',
                                          i,
                                          itemRowInd,
                                          taskItem.taskItemId,
                                          taskItem.itemId,
                                          task.taskId
                                        )
                                }}
                                payload={taskList[i]?.taskItems[itemRowInd]}
                                ind={`${i}-${itemRowInd}`}
                                handleChange={handleChangeData}
                                handleBlur={handleOnBlur}
                              />
                            );
                          })}
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
            </Grid>
            <Grid item xs={12} sx={{ ml: '0.5rem', mt: '-1rem' }}>
              <RenderComponent
                metaData={{
                  control: ICON,
                  iconName: <AddIcon />,
                  iconTitle: 'Add Spare Parts',
                  color: 'primary',
                  handleClickIcon: () => updateSparePartsData('', 'ADD', i),
                  columnWidth: 2,
                  isDisabled:
                    !taskList[i].isTaskEditable ||
                    !taskList[i]?.taskId ||
                    !taskList[i].taskQuantity ||
                    !taskList[i].serviceOrders
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
  useEffect(() => {
    const errorElements = document.getElementsByClassName('Mui-error');
    if (errorElements && isArray(Array.from(errorElements))) {
      setErrorArray(errorElements);
    }
  });

  const expandTasks = () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    let tempData = [...collapseTask];
    tempData = tempData.map((n) => (n = true));
    setCollapseTask([...tempData]);
  };

  const getExistingServiceSubjectDetails = async (projectId, serviceSubjectId) => {
    if (projectId && serviceSubjectId) {
      setLocalLoader.on();
      const tempCollapseTask = [];
      const res = await getServiceLevelList(
        `${API_V1}/${GET_SERVICE_SUB_ORDER_TASK_DETAILS}?projectId=${projectId}&serviceSubjectId=${serviceSubjectId}`
      );
      if (res?.isSuccessful && res.data) {
        const { data } = res;
        getServiceTasks(true, serviceSubjectId);
        const { taskList, isInstallationAssociationPresent, isConsumableAssociationPresent } = data;
        if (isArray(taskList)) {
          // await Promise.all(
          //   taskList.map(async (task) => {
          // taskList.forEach(async (task) => {
          // for (const task of taskList) {
          /* eslint-disable no-plusplus */
          for (let i = 0, len = taskList.length; i < len; i++) {
            const task = taskList[i];
            // taskList.map(async (task) => {
            tempCollapseTask.push(true);
            const { taskItems, taskType, serviceOrderId } = task;
            task.serviceOrdersObjInEdit = serviceOrderId;
            if (taskType === CUSTOM && !showCustomTask) {
              setShowCustomTask.on();
            }
            if (taskType === SCHEDULED && !showScheduleTasks) {
              setShowScheduleTasks.on();
            }
            // eslint-disable-next-line no-await-in-loop
            const items = await getServiceTaskItem(
              task.taskId,
              serviceSubjectId,
              isInstallationAssociationPresent,
              isConsumableAssociationPresent,
              taskType,
              true
            );
            if (isArray(taskItems)) {
              // await Promise.all(
              //   taskItems.map(async (item) => {
              /* eslint-disable no-plusplus */
              for (let j = 0, len = taskItems.length; j < len; j++) {
                const item = taskItems[j];
                const { itemId, unitPrice, discountAmount, netAmount, grossAmount } = item;
                const hasPreferredItems =
                  (isArray(items) && items.find((it) => it.id === itemId)?.hasPreferredItems) || [];
                let preferredItems = [];
                if (hasPreferredItems) {
                  if (!preferredItemsList[itemId]) {
                    // eslint-disable-next-line no-await-in-loop
                    const res = await getPreferredItemsForItem(`${API_V1}/${PREFERRED_ITEMS_FOR_ITEM}=${itemId}`);
                    preferredItemsList[itemId] = isArray(res?.data) ? res?.data : [];
                  }
                  preferredItems = preferredItemsList[itemId] || [];
                }
                item.item = { id: item.itemId };
                item.hasPreferredItems = hasPreferredItems;
                item.preferredItems = preferredItems;
                item.isPreferred = false;
                item.unitPrice = (unitPrice && parseFloat(unitPrice).toFixed(2)) || '0.00';
                item.discountAmount = (discountAmount && parseFloat(discountAmount).toFixed(2)) || '0.00';
                item.grossAmount = (grossAmount && parseFloat(grossAmount).toFixed(2)) || '0.00';
                item.netAmount = (netAmount && parseFloat(netAmount).toFixed(2)) || '0.00';
                // item.unitPrice = (unitPrice === 0 && '0') || unitPrice;
                if (unitPrice === 0 && '0') {
                  item.unitPrice = '0.00';
                  item.netAmount = '0.00';
                  item.grossAmount = '0.00';
                }
              }
              //   )
              // );
            }
          }
          // );
          // );
        }
        updatePayload({ ...data });
        setExistingData(data?.taskList);
        setCollapseTask([...tempCollapseTask]);
        setLocalLoader.off();
        return;
      }
    }
    setLocalLoader.off();
    updatePayload({ ...emptyPayload, serviceLevelId: '1' });
  };

  useEffect(() => {
    getServiceLevels();
    getServiceSubjects();
    // updatePayload({ serviceLevelId: '1' });
    getExistingServiceSubjectDetails(projectId, serviceSubjectObjId);
  }, []);

  useEffect(() => {
    getServiceOrderDates();
    getProjectZones();
  }, [projectId]);

  useEffect(() => {
    getServiceTasks(true);
    setServiceTaskItems([]);
    // updatePayload({ taskList: [] });
    const serviceSubjectObj =
      (isArray(serviceSubjects) &&
        serviceSubjects.find((sub) => sub.id === serviceSubjectSelectedObj?.id || serviceSubjectObjId)) ||
      {};
    if (!serviceSubjectObjId) {
      updatePayload({
        isInstallationAssociationPresent: serviceSubjectObj?.isInstallationAssociationPresent || false,
        isConsumableAssociationPresent: serviceSubjectObj?.isConsumableAssociationPresent || false,
        serviceSubjectId: serviceSubjectObj?.id || 0,
        taskList: []
      });
    }
  }, [serviceSubjectSelectedObj]);

  // useEffect(() => {
  //   const serviceSubjectObj =
  //     (isArray(serviceSubjects) &&
  //       serviceSubjects.find((sub) => sub.id === serviceSubjectSelectedObj?.id || serviceSubjectObjId)) ||
  //     {};
  //   if (
  //     serviceSubjectObjId &&
  //     serviceSubjectObj &&
  //     (!serviceSubjectSelectedObj.id || !serviceSubjectSelectedObj.code || !serviceSubjectSelectedObj.name)
  //   ) {
  //     const { code, name, id, isInstallationAssociationPresent, isConsumableAssociationPresent } = serviceSubjectObj;
  //     updatePayload({
  //       serviceSubjectSelectedObj: {
  //         code,
  //         name,
  //         id,
  //         isInstallationAssociationPresent,
  //         isConsumableAssociationPresent
  //       }
  //     });
  //   }
  // }, [serviceSubjects]);

  const handleClickCustomTask = () => mandatoryFieldsCheck && setShowCustomTask.toggle();
  const handleClickScheduleTask = () => mandatoryFieldsCheck && setShowScheduleTasks.toggle();
  const handleClickRequireFields = () => {
    if (!payload?.serviceSubjectQuantity) {
      setError.on();
    }
  };

  const handleCloseBackAlertBox = () =>
    setShowGenericAlertBox({
      open: false,
      title: '',
      titleType: '',
      content: '',
      showProceedBtn: false,
      proceedAction: '',
      proceedInformation: '',
      cancelButtonText: '',
      proceedButtonText: ''
    });

  const getTitle = () =>
    `${(projectNumber && `Project: ${projectNumber}`) || ''} ${(locationName && `Location: ${locationName}`) || ''}`;

  return (
    <Grid sx={{ padding: '30px 28px', width: '100%', margin: '-35px auto' }}>
      <Loader open={localLoader} />
      <DialogComponent
        open={genericAlertBox.open}
        handleClose={handleCloseBackAlertBox}
        title={genericAlertBox.title}
        titleType={genericAlertBox.titleType}
        content={genericAlertBox.content}
        maxWidth={genericAlertBox.maxWidth}
        isCancelButton
        isProceedButton={genericAlertBox.showProceedBtn}
        cancelButtonText={genericAlertBox.cancelButtonText}
        proceedButtonText={genericAlertBox.proceedButtonText}
        handleProceed={handleProceedBackAlertBox}
      />
      <NotesDialog
        noteProps={{ ...notesBox }}
        handleClose={handleCloseNotesAlertBox}
        handleProceed={handleProceedNotesAlertBox}
      />
      <>
        {/* Grid Container for header and close icon */}
        <Grid container spacing={3}>
          {/* <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center" mt={0.5}> */}
          <Grid item xs={4} alignItems="left">
            <Typography fontWeight="bold" variant="subtitle1">
              {serviceSubjectObjId ? 'Edit' : 'Add New'} Service Subject
            </Typography>
          </Grid>
          <Grid item xs={6} alignItems="left">
            <Typography fontWeight="bold" variant="subtitle1">
              {getTitle()}
            </Typography>
          </Grid>
        </Grid>

        <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem' }} />

        {/* Grid container for form components */}
        <Grid item xs={12} sm={6} sx={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            {serviceSubjectComps?.map((comp, ind) => {
              const { key, isLableOnly } = comp;
              if (key === 'ownership') {
                if (!isLableOnly && serviceSubjectObjId) {
                  return;
                }
                if (isLableOnly && !serviceSubjectObjId) {
                  return;
                }
              }
              if (serviceSubjectObjId && ['serviceSubjectSelectedObj'].includes(comp.key)) {
                return;
              }
              if (!serviceSubjectObjId && ['serviceSubjectName', 'serviceSubjectCode'].includes(comp.key)) {
                return;
              }
              return (
                <RenderComponent
                  key={ind}
                  metaData={comp}
                  payload={payload}
                  ind={ind}
                  handleChange={handleChangeData}
                  handleBlur={handleOnBlur}
                />
              );
            })}
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          mt={1}
          style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            mb={1}
            style={{ color: (mandatoryFieldsCheck && 'inherit') || 'lightgray', paddingLeft: '0.5rem' }}
            onClick={handleClickRequireFields}
          >
            {showCustomTask ? (
              <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
            ) : (
              <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              Custom Tasks
            </Typography>
          </Grid>
          {(showCustomTask && mandatoryFieldsCheck && (
            <>
              {isArray(taskList) &&
                taskList.map((task, i) => task.taskType === CUSTOM && getTaskAndSparePartsComp(i, task, true))}
              <Grid item xs={12} sx={{ ml: '0.2rem' }}>
                <Grid container spacing={3}>
                  {taskBtnComps.map((comp, ind) => (
                    <RenderComponent
                      key={ind}
                      metaData={{
                        ...comp,
                        handleClickIcon: () => updateTaskData('', '', 'ADD', true),
                        isDisabled: comp.isTask
                          ? !serviceSubjectId
                          : !serviceSubjectId || !taskList.find((tsk) => tsk.taskType === CUSTOM)
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
            </>
          )) || <></>}
        </Grid>

        <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem', marginTop: '1rem' }} />

        <Grid
          container
          spacing={3}
          mt={1}
          style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            mb={1}
            style={{ color: (mandatoryFieldsCheck && 'inherit') || 'lightgray', paddingLeft: '0.5rem' }}
            onClick={handleClickRequireFields}
          >
            {showScheduleTasks && mandatoryFieldsCheck ? (
              <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
            ) : (
              <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              Schedule Tasks
            </Typography>
          </Grid>
          {(showScheduleTasks && mandatoryFieldsCheck && (
            <>
              {isArray(taskList) &&
                taskList.map((task, i) => task.taskType === SCHEDULED && getTaskAndSparePartsComp(i, task, false))}
              <Grid item xs={12} sx={{ ml: '0.2rem' }}>
                <Grid container spacing={3}>
                  {taskBtnComps.map((comp, ind) => (
                    <RenderComponent
                      key={ind}
                      metaData={{
                        ...comp,
                        handleClickIcon: () => updateTaskData('', '', 'ADD', false),
                        isDisabled: comp.isTask
                          ? !serviceSubjectId
                          : !serviceSubjectId || !taskList.find((tsk) => tsk.taskType === SCHEDULED)
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
            </>
          )) || <></>}
        </Grid>

        <Divider style={{ backgroundColor: '#c7d2fe', marginBottom: '1rem', marginTop: '1rem' }} />

        {/* Grid container for back / save / delete button */}
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            {buttonComponents?.map((comp, ind) => {
              if (comp.key === 'save&add') {
                if (serviceSubjectObjId) {
                  return false;
                }
              }
              return (
                <RenderComponent
                  key={ind}
                  metaData={comp}
                  payload={payload}
                  ind={ind}
                  handleChange={handleChangeData}
                />
              );
            })}
          </Grid>
        </Grid>
      </>
    </Grid>
  );
}

AddServiceSubject.propTypes = {
  projectId: PropTypes.string,
  projectNumber: PropTypes.string,
  locationName: PropTypes.string,
  legalEntityId: PropTypes.string,
  businessSubTypeId: PropTypes.string
};

export default AddServiceSubject;
