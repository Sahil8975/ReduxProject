import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Divider,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';

import useBoolean from '../../../hooks/useBoolean';
import RenderComponent from '../../../components/RenderComponent';
import NotesDialog from '../../../components/notesDialog';
import DialogComponent from '../../../components/Dialog';
import {
  COMPONENTS,
  MAX_LENGTH,
  NOTE_TYPE,
  DATE_FORMAT,
  REGX_TYPE,
  STATUS,
  BLOCKED_SERVICE_ORDER_STATUS_ID,
  getDialogBoldContent
} from '../../../utils/constants';
import { isArray, isObject, getFormattedDate, isValidStr, getUniqueObjectsFrom } from '../../../utils/utils';
import { APIS, API_V1 } from '../../../utils/apiList';
import { IS_DATA_LOADING } from '../../../redux/constants';
import { getPreferredTimeList, getServiceOrderDatesList } from '../../../services/projectService';
import {
  getTaskItemsWithPreferenceList,
  getTaskItemDetails,
  getTaskDetailsByServiceOrder,
  getServicemenOnLeave,
  getShiftNextService,
  getPreferredItemsForItem,
  saveEditScheduleAPI,
  removeTaskItems
} from './EditScheduleService';
import { ROUTES } from '../../../routes/paths';
import ShiftNextServices from './ShiftNextServices';
import PreventNewTab from '../../../components/PreventNewTab';
import './EditSchedule.scss';

function EditSchedule({
  displayData,
  handleClose,
  handleCloseButton,
  childRef,
  saveAndClose,
  onDisablePage,
  isDataLoaded
}) {
  const masterData = useSelector((state) => state.MasterDataReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    serviceOrderId,
    locationName,
    customerName,
    contract,
    contractId,
    contractNumber,
    contractName,
    contractSignedOn,
    additionalEmails,
    regionId,
    project,
    projectNumber,
    projectStatus,
    projectId,
    projectName,
    projectSignedOn,
    projectRenewedOn,
    salesmanName,
    previousPerformedServiceDate,
    contactDetails,
    projectNote,
    // serviceOrderStatusId,
    scheduleDate: dateFromCards,
    preferredTimingId,
    servicemanId,
    serviceOrderNumber,
    projectEndDate
  } = displayData;
  const formatedDate = moment(dateFromCards, 'DD-MM-YYYY').format('YYYY-MM-DDTHH:mm:ss');
  const [generalData, setGeneralData] = useBoolean(false);
  const [showCustomTask, setShowCustomTask] = useBoolean(false);
  const [showScheduleTask, setShowScheduleTask] = useBoolean(false);
  const [preferredTimings, setPreferredTimings] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  // const [additionalServicemenList, setAdditionalServicemenList] = useState(servicemen);
  const [itemList, setItemList] = useState([]);
  const [datesToDisable, setDatesToDisable] = useState([]);
  const [uncheckedDates, setUncheckedDates] = useState([]);
  const [datesToPass, setDatesToPass] = useState([]);
  const [checkedDates, setCheckedDates] = useState([]);
  const [shiftDatesToKeep, setShiftDatesToKeep] = useState([]);
  const [dateAllowToBeShifted, setDateAllowToBeShifted] = useState([]);
  const [openShiftNextServices, setOpenShiftNextServices] = useBoolean(false);
  const [isEditShiftDate, setisEditShiftDate] = useBoolean(false);
  const [resSuccessfull, setResSuccessfull] = useBoolean(false);
  const [isError, setIsError] = useBoolean(false);
  const [popupIndex, setPopupIndex] = useState();
  const [errorArray, setErrorArray] = useState([]);
  const [serviceOrderStatusList, setServiceOrderStatusList] = useState([]);
  const [additionalServicemenData, setAdditionalServicemenData] = useState([]);
  const [disableEditSchedule, setDisableEditSchedule] = useBoolean(false);
  const [modifiedTasks, setModifiedTasks] = useBoolean(false);
  const [isAdditionalServiceman, setIsAdditionalServiceman] = useBoolean(false);
  const [isFormModified, setIsFormModified] = useBoolean(false);
  const [selectAllIds, setSelectAllIds] = useBoolean(false);
  const [deselectAllIds, setDeselectAllIds] = useBoolean(false);
  const [diffDays, setDiffDays] = useState(0);
  const selectAllDisable = !isArray(uncheckedDates);
  const deselectAllDisable = !selectAllIds && !isArray(uncheckedDates) && !isArray(dateAllowToBeShifted);
  const [shiftServiceTitle, setShiftServiceTitle] = useState({
    taskName: '',
    scheduleDate: '',
    serviceman: ''
  });
  const [collapseTask, setCollapseTask] = useState([]);
  const [genericAlertBox, setShowGenericAlertBox] = useState({
    open: false,
    title: '',
    titleType: '',
    content: '',
    proceedAction: '',
    proceedInformation: '',
    showProceedBtn: false,
    cancelButtonText: '',
    proceedButtonText: '',
    maxWidth: '',
    color: ''
  });

  const [payload, setPayload] = useState({
    taskList: []
  });

  const preferredItemsList = {};

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

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
    maxChars: MAX_LENGTH.NOTES,
    isDisabled: false
  };

  const [notesBox, setShowNotesBox] = useState({ ...emptyNotesBox });

  const { taskList } = payload;

  const handleProceedNotesAlertBox = (updatedNote) => {
    const taskToUpdate = taskList[notesBox.taskInd];
    if (taskToUpdate) {
      if (notesBox.noteType === NOTE_TYPE.TASK) {
        taskToUpdate[notesBox.key] = updatedNote;
      } else if (notesBox.noteType === NOTE_TYPE.TASK_ITEM) {
        taskToUpdate.taskItems[notesBox.taskItemInd][notesBox.key] = updatedNote;
      } else {
        taskList[0].serviceOrderNote = updatedNote;
        updatePayload({ taskList });
      }
      handleCloseNotesAlertBox();
    }
  };

  const getMinScheduleDate = () =>
    (formatedDate && new Date(formatedDate) < new Date() && new Date(formatedDate)) || new Date();

  const getMaxScheduleDate = () => {
    let maxDate;
    if (isArray(taskList) && projectEndDate) {
      const { isNoOfServicesPicked, isProjectEndDatePicked } = taskList[0];
      if (isNoOfServicesPicked) {
        maxDate = undefined;
      }
      if (isProjectEndDatePicked) {
        maxDate = !projectEndDate ? undefined : new Date(projectEndDate);
      }
    }
    return maxDate;
  };

  const handleCloseNotesAlertBox = () => {
    setIsFormModified.on();
    setShowNotesBox({ ...notesBox, ...emptyNotesBox });
  };

  const handleClickGeneralData = () => setGeneralData.toggle();

  const { PREFERRED_TIMES } = APIS;

  const {
    TEXT_FIELD,
    BUTTON,
    SELECT_BOX,
    MULTI_SELECT_BOX,
    AUTOCOMPLETE,
    DATEPICKER,
    TYPOGRAPHY,
    ICON,
    CHECKBOX,
    NONE
  } = COMPONENTS;

  useEffect(() => {
    if (isArray(masterData?.serviceOrderStatus)) {
      // const notToInclude = ['InProgress', 'Completed', 'CalloutCompleted', 'NotCompleted'];
      const notToInclude = ['InProgress', 'NotCompleted'];
      const statusList = masterData?.serviceOrderStatus.filter((itm) => !notToInclude.includes(itm.code));
      setServiceOrderStatusList(statusList);
    }
  }, []);

  const serviceDetailsComponents = [
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      select: true,
      key: 'serviceOrderStatusId',
      label: 'Service Order Status',
      options: serviceOrderStatusList,
      isSelecteAllAllow: false,
      isDisabled: disableEditSchedule,
      columnWidth: 1.6
    },
    {
      control: ICON,
      key: 'OpsAdminNote',
      iconName: <CommentIcon />,
      groupStyle: { height: '3rem' },
      color: '',
      tooltipTitle: '',
      columnWidth: 0.5,
      handleClickIcon: (key, ind) => {
        setShowNotesBox({
          ...notesBox,
          key: 'serviceOrderNote',
          label: `Service Order Note ( Max ${MAX_LENGTH.NOTES} chars )`,
          noteVal: payload?.taskList[0]?.serviceOrderNote || '',
          taskInd: 0,
          open: true,
          isDisabled: disableEditSchedule
        });
      }
    },
    {
      control: TYPOGRAPHY,
      groupStyle: {
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '0.4rem'
      },
      payloadStyle: { marginLeft: '0.3rem' },
      key: 'lastVisits',
      label: 'Last visit: ',
      columnWidth: 1.5
    },
    {
      control: DATEPICKER,
      groupStyle: { height: '3rem' },
      key: 'scheduleDate',
      label: 'Scheduled Date',
      showTodayButton: false,
      shouldDisableDate: (date) => datesToDisable.includes(moment(date).format('YYYY-MM-DD')),
      secondDate: projectEndDate,
      secondLabel: 'Project End Date',
      isSecondDate: true,
      minDate: getMinScheduleDate(),
      maxDate: getMaxScheduleDate(),
      isRequired: true,
      isDisabled: disableEditSchedule,
      columnWidth: 1.2
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { height: '3rem' },
      key: 'preferredTimingId',
      label: 'Preferred Timings',
      options: preferredTimings,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: disableEditSchedule,
      columnWidth: 1.2
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { height: '3rem' },
      key: 'servicemanId',
      label: 'Serviceman',
      options: servicemen,
      isRequired: true,
      isSelecteAllAllow: false,
      isDisabled: disableEditSchedule,
      columnWidth: 1.1
    },
    {
      control: MULTI_SELECT_BOX,
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      groupStyle: { height: '3rem' },
      key: 'additionalServicemans',
      label: 'Additional Servicemen',
      options: additionalServicemenData,
      isSelecteAllAllow: false,
      maxMultipleOptions: 1,
      isDisabled: disableEditSchedule,
      columnWidth: 2.2
    },
    {
      control: CHECKBOX,
      groupStyle: { height: '3.5rem', marginTop: '-0.2rem' },
      key: 'isShiftToNextToService',
      label: 'Shift next services',
      labelPlacement: 'end',
      isDisabled: disableEditSchedule,
      columnWidth: 1.7
    },
    {
      control: ICON,
      key: 'shiftDates',
      iconTitle: 'Dates',
      groupStyle: { marginTop: '-0.1rem', marginLeft: '-1.5rem', display: modifiedTasks ? 'none' : '' },
      color: 'primary',
      isDisabled: disableEditSchedule,
      columnWidth: 1.5
    },
    {
      control: CHECKBOX,
      groupStyle: { height: '3.5rem', marginTop: '-0.2rem' },
      key: 'modifyEachTask',
      label: 'Shift each Task separately',
      labelPlacement: 'end',
      isDisabled: disableEditSchedule,
      columnWidth: 2.2
    }
  ];

  const taskComponents = [
    {
      control: ICON,
      groupStyle: { paddingLeft: '1rem', cursor: 'pointer' },
      iconName: <CircleIcon fontSize="small" />,
      iconSize: 'small',
      key: 'toggleIcon',
      isDisabled: disableEditSchedule,
      placement: 'left'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'taskName',
      variant: 'standard',
      label: 'Task Name',
      tooltipTitle: '',
      isDisabled: true,
      columnWidth: 1.2
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'taskQuantity',
      tooltipTitle: 'Task Quantity',
      variant: 'standard',
      label: 'Qty',
      isDisabled: true,
      columnWidth: 0.5
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem', fontWeight: 'bold' },
      key: 'serviceSubjectName',
      variant: 'standard',
      label: 'Service Subject Name',
      isDisabled: true,
      columnWidth: 3
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'serviceSubjectQuantity',
      tooltipTitle: 'Service Subject Quantity',
      variant: 'standard',
      label: 'SSQty',
      isDisabled: true,
      columnWidth: 0.5
    },
    {
      control: DATEPICKER,
      groupStyle: { height: '3rem' },
      key: 'scheduleDate',
      label: 'Scheduled Date',
      showTodayButton: false,
      shouldDisableDate: (date) => datesToDisable.includes(moment(date).format('YYYY-MM-DD')),
      minDate: getMinScheduleDate(),
      maxDate: getMaxScheduleDate(),
      secondDate: projectEndDate,
      secondLabel: 'Project End Date',
      isSecondDate: true,
      isRequired: true,
      isDisabled: disableEditSchedule,
      columnWidth: 1.3
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { height: '3rem' },
      key: 'preferredTimingId',
      label: 'Preferred Timings',
      options: preferredTimings,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: disableEditSchedule,
      columnWidth: 1.3
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { height: '3rem' },
      key: 'servicemanId',
      label: 'Serviceman',
      options: servicemen,
      isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      isDisabled: disableEditSchedule,
      columnWidth: 1
    },
    // TODO later
    // {
    //   control: MULTI_SELECT_BOX,
    //   labelStyle: { marginTop: '-0.5rem' },
    //   controlStyle: { height: '2rem' },
    //   groupStyle: { height: '3rem' },
    //   key: 'additionalServicemans',
    //   label: 'Additional Servicemen',
    //   options: additionalServicemenData,
    //   isSelecteAllAllow: false,
    //   maxMultipleOptions: 1,
    //   isDisabled: disableEditSchedule,
    //   columnWidth: 2
    // },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'zoneName',
      variant: 'standard',
      label: 'Zone',
      isDisabled: true,
      columnWidth: 0.9
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'serialNumber',
      variant: 'standard',
      label: 'Serial Numbers',
      isDisabled: true,
      columnWidth: 1.4
    },
    {
      control: ICON,
      groupStyle: { height: '3rem' },
      key: 'taskNotesIcon',
      color: '',
      iconName: <CommentIcon />,
      tooltipTitle: '',
      isDisabled: disableEditSchedule,
      // columnWidth: 1,
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
      control: CHECKBOX,
      groupStyle: { height: '3.5rem', marginTop: '-0.5rem', marginLeft: '0.6rem' },
      key: 'isAssignServicemanToSimilarTask',
      label: 'Assign serviceman for all the same task until the project expiration',
      labelPlacement: 'end',
      isDisabled: disableEditSchedule,
      columnWidth: 5
    },
    {
      control: CHECKBOX,
      groupStyle: { height: '3.5rem', marginTop: '-0.5rem', marginLeft: '-2rem' },
      key: 'isShiftToNextToService',
      label: 'Shift next services',
      labelPlacement: 'end',
      isDisabled: disableEditSchedule,
      columnWidth: 2
    },
    {
      control: ICON,
      key: 'shiftDates',
      iconTitle: 'Dates',
      groupStyle: { marginTop: '-0.5rem', marginLeft: '-2.5rem' },
      color: 'primary',
      isDisabled: disableEditSchedule,
      columnWidth: 1.5
    }
  ];

  const sparePartsComponents = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem', marginLeft: '-1rem' },
      key: 'item',
      isRequired: true,
      label: 'Item Code',
      genericItemList: true,
      autoCompleteDisplayKey: 'code',
      isDisabled: disableEditSchedule,
      columnWidth: 1.3
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem' },
      key: 'item',
      isRequired: true,
      label: 'Description',
      genericItemList: true,
      autoCompleteDisplayKey: 'name',
      isDisabled: disableEditSchedule,
      columnWidth: 2.5
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem', marginLeft: '-1rem' },
      key: 'item',
      isRequired: true,
      genericItemList: false,
      label: 'Item Code (Preferred)',
      autoCompleteDisplayKey: 'code',
      isDisabled: disableEditSchedule,
      columnWidth: 1.2
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { height: '3rem' },
      key: 'item',
      isRequired: true,
      genericItemList: false,
      label: 'Description  (Preferred)',
      autoCompleteDisplayKey: 'name',
      isDisabled: disableEditSchedule
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '-1.6rem', marginRight: '0.6rem', marginTop: '-0.4rem' },
      key: 'isPreferred',
      label: '',
      labelPlacement: 'start',
      isDisabled: disableEditSchedule,
      columnWidth: 0.5,
      tooltipTitle: 'Click to select Preferred Items'
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'itemQuantity',
      label: 'Quantity',
      isRequired: true,
      isDisabled: disableEditSchedule,
      columnWidth: 0.7
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'conversionFactor',
      variant: 'standard',
      label: 'Factor',
      columnWidth: 0.5,
      isDisabled: true
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'ratioId',
      label: 'Ratio',
      select: true,
      isRequired: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      isDisabled: disableEditSchedule,
      columnWidth: 0.9
    },
    {
      control: SELECT_BOX,
      groupStyle: { height: '3rem' },
      key: 'uomId',
      label: 'UOM',
      select: true,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      isRequired: true,
      isDisabled: disableEditSchedule,
      columnWidth: 0.9
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'serviceQuantity',
      variant: 'standard',
      label: 'Service Qty',
      isDisabled: true,
      columnWidth: 0.6
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'unitPrice',
      label: 'Unit Price',
      isRequired: true,
      isDisabled: disableEditSchedule,
      columnWidth: 0.9
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'grossAmount',
      variant: 'standard',
      label: 'Gross Amount',
      columnWidth: 0.7,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem' },
      key: 'discountAmount',
      label: 'Discount',
      isDisabled: disableEditSchedule,
      columnWidth: 0.9
    },

    {
      control: TEXT_FIELD,
      groupStyle: { height: '3rem', paddingTop: '0rem' },
      key: 'netAmount',
      variant: 'standard',
      label: 'Net Amount',
      isDisabled: true,
      columnWidth: 0.7
    },
    {
      control: ICON,
      groupStyle: { height: '3rem' },
      key: 'taskItemNotesIcon',
      color: 'inherit',
      iconName: <CommentIcon />,
      tooltipTitle: '',
      isDisabled: disableEditSchedule,
      columnWidth: 0.2
    },
    {
      control: CHECKBOX,
      groupStyle: { height: '2rem', paddingTop: '0rem', marginLeft: '-1.5rem' },
      key: 'isBillable',
      label: '$',
      labelPlacement: 'start',
      tooltipTitle: 'Is Billable',
      isDisabled: disableEditSchedule,
      columnWidth: 0.6
    },
    {
      control: ICON,
      groupStyle: { height: '2rem', marginTop: '0.5rem', paddingTop: '0rem', marginRight: '-0.6rem' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Spare Part',
      isDisabled: disableEditSchedule,
      columnWidth: 0.3
    }
  ];

  // const buttonComponents = [
  //   {
  //     control: BUTTON,
  //     groupStyle: { marginRight: '1rem' },
  //     btnTitle: 'Close',
  //     color: 'warning',
  //     handleClickButton: () => handleCloseButton(),
  //     columnWidth: 0.8
  //   },
  //   {
  //     control: BUTTON,
  //     btnTitle: 'Save & Close',
  //     color: 'success',
  //     handleClickButton: () => checkErrorsAndSaveProject(),
  //     isDisabled: disableEditSchedule,
  //     columnWidth: 1.3
  //   }
  // ];

  const ShiftButtonComponents = [
    {
      control: BUTTON,
      color: 'success',
      btnTitle: 'Select All',
      handleClickButton: () => checkAllCheckbox(true),
      isDisabled: selectAllDisable,
      groupStyle: { marginRight: '1rem' },
      columnWidth: 1
    },
    {
      control: BUTTON,
      color: 'success',
      btnTitle: 'Deselect All',
      handleClickButton: () => checkAllCheckbox(false),
      isDisabled: deselectAllDisable,
      groupStyle: { marginRight: '1rem' },
      columnWidth: 1.2
    },
    {
      control: BUTTON,
      groupStyle: { marginRight: '1rem' },
      btnTitle: 'Cancel',
      name: isEditShiftDate ? 'close' : 'cancel',
      color: 'warning',
      handleClickButton: (e) => handleCloseShiftNextServices(e, isEditShiftDate ? 'close' : 'cancel'),
      columnWidth: 1
    },
    {
      control: BUTTON,
      btnTitle: 'Ok',
      name: isEditShiftDate ? 'save' : 'ok',
      color: 'success',
      handleClickButton: (e) => handleCloseShiftNextServices(e, isEditShiftDate ? 'save' : 'ok'),
      columnWidth: 0.8
    }
  ];

  const checkErrorsAndSaveProject = () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    if (errorArray.length > 0) {
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
      checkScheduleDate();
    }
  };

  const checkScheduleDate = () => {
    if (projectEndDate) {
      if (
        taskList?.some(
          (itm) =>
            itm.scheduleDate &&
            moment(itm.scheduleDate).format('YYYY-MM-DD') > moment(projectEndDate).format('YYYY-MM-DD')
        )
      ) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: t('dialog.warning'),
          content: 'Project end date will get shifted, do you want to continue?',
          showProceedBtn: true,
          proceedAction: 'checkProjectEndDate',
          proceedButtonText: 'Yes',
          cancelButtonText: 'No'
        });
        dispatch({ type: IS_DATA_LOADING, data: false });
      } else {
        dispatch({ type: IS_DATA_LOADING, data: false });
        alertForShiftedProjectEndDate();
        // saveEditSchedule();
      }
    }
  };

  const checkProjectEndDate = () => {
    if (isArray(payload?.taskList)) {
      const { scheduleDate } = payload?.taskList[0];
      if (!modifiedTasks) {
        taskList.forEach((tsk) => (tsk.projectEndDate = scheduleDate));
      } else {
        const maxDate = taskList.reduce((acc, task) => {
          if (task.scheduleDate && new Date(task.scheduleDate) > new Date(acc)) {
            return task.scheduleDate;
          }
          return acc;
        }, scheduleDate);
        taskList.forEach((tsk) => (tsk.projectEndDate = maxDate));
      }
      saveEditSchedule();
    }
  };

  const checkModifiedTask = () => {
    if (isArray(payload?.taskList)) {
      const { scheduleDate, preferredTimingId, servicemanId, additionalServicemanIds } = payload?.taskList[0];
      taskList.forEach((itm) => {
        itm.scheduleDate = scheduleDate;
        itm.preferredTimingId = preferredTimingId;
        itm.servicemanId = servicemanId;
        itm.additionalServicemanIds = additionalServicemanIds;
      });
    }
  };

  const alertForShiftedProjectEndDate = () => {
    let isProjectEndDateShifted = false;
    const { isNoOfServicesPicked } = taskList[0];
    const selectedShiftIds = taskList
      .map((task) => task.serviceOrderIdsToShift)
      .filter((ids) => ids !== null)
      .flat();
    if (isArray(selectedShiftIds)) {
      const datesArray = shiftDatesToKeep.filter((obj) => selectedShiftIds.includes(obj.id));
      const shiftedDates =
        (isArray(datesArray) &&
          datesArray.map((item) => {
            const updatedScheduleDate = moment(item.scheduleDate, 'ddd DD-MM-YYYY')
              .add(diffDays, 'days')
              .format('ddd DD-MM-YYYY');
            return { ...item, scheduleDate: updatedScheduleDate };
          })) ||
        [];
      shiftedDates.forEach((item) => {
        const schedDate = moment(item.scheduleDate, 'ddd DD-MM-YYYY').format('YYYY-MM-DDTHH:mm:ss');
        if (schedDate > projectEndDate) {
          isProjectEndDateShifted = true;
        }
      });
      if (isProjectEndDateShifted) {
        if (isNoOfServicesPicked) {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.WARNING,
            title: t('dialog.warning'),
            content: 'Project end date will get shifted. Do you still want to continue?',
            showProceedBtn: true,
            proceedAction: 'ProceedToSave',
            proceedButtonText: 'Yes',
            cancelButtonText: 'No'
          });
        } else {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.WARNING,
            title: t('dialog.warning'),
            content:
              'Some services will get cancelled as they will get shifted beyond the Project end date. Do you want to continue?',
            showProceedBtn: true,
            proceedAction: 'ProceedToSave',
            proceedButtonText: 'Yes',
            cancelButtonText: 'No'
          });
        }
      } else {
        saveEditSchedule();
      }
    } else {
      saveEditSchedule();
    }
  };

  const saveEditSchedule = async () => {
    taskList.forEach((itm) => delete itm.additionalServicemans);
    taskList.forEach((itm) => delete itm.lastVisits);
    if (!modifiedTasks) {
      checkModifiedTask();
    }
    taskList.forEach(
      (itm) => (itm.additionalServicemanIds = itm.additionalServicemanIds.filter((id) => id !== itm.servicemanId * 1))
    );
    const res = await saveEditScheduleAPI(`${API_V1}/${APIS.SAVE_EDIT_SCHEDULE}`, payload);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res?.errorCode) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: t('dialog.error'),
        content: (isArray(res.error) && res.error[0]) || t('addUser.somethingWentWrong'),
        showProceedBtn: false,
        cancelButtonText: 'Ok',
        color: 'success'
      });
    } else {
      handleAPIRes(res);
    }
  };

  const handleAPIRes = (res) => {
    if (res.isSuccessful) {
      setResSuccessfull.on();
      setIsAdditionalServiceman.off();
      handleClose();
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.SUCCESS,
        title: t('dialog.success'),
        content: res?.message || 'Edited Schedule Saved Successfully.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    }
  };

  React.useImperativeHandle(childRef, () => ({
    saveAndClose: () => checkErrorsAndSaveProject(),
    handleCloseButton: () => {
      if (isFormModified) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: 'Are you sure?',
          content: 'Redirecting to Schedule Viewer. Do you still want to continue?',
          proceedAction: 'closeEditScheduleDialogBox',
          showProceedBtn: true,
          cancelButtonText: 'No',
          proceedButtonText: 'Yes'
        });
      } else {
        setIsAdditionalServiceman.off();
        handleClose();
      }
    }
  }));

  const getPrefrredTimes = async () => {
    const prefrredTimes = await getPreferredTimeList(`${API_V1}/${PREFERRED_TIMES}`);
    if (!prefrredTimes?.isSuccessful) {
      getPrefrredTimes();
    } else if (isObject(prefrredTimes) && prefrredTimes.data) {
      setPreferredTimings(prefrredTimes.data);
    }
  };

  // const changeAdditionalServicemenIdsForSimilarTask = (additionalServicemen, taskInd) => {
  //   let additionalServicemanIds = additionalServicemen.map((el) => el.id);
  //   const { scheduleDate, preferredTimingId, servicemanId, taskId } = taskList[taskInd];
  //   const formattedScheduleDate = (scheduleDate && scheduleDate.split('T')[0]) || null;
  //   const otherTask = taskList.find(
  //     (task) =>
  //       task.taskId !== taskId &&
  //       task.preferredTimingId === preferredTimingId &&
  //       task.servicemanId === servicemanId &&
  //       formattedScheduleDate === ((task.scheduleDate && task.scheduleDate.split('T')[0]) || null)
  //   );
  //   const additionalServicemanIdsForOtherTask = otherTask?.additionalServicemanIds || [];
  //   additionalServicemanIds = [...additionalServicemanIds, ...additionalServicemanIdsForOtherTask];
  //   additionalServicemanIds = [...new Set(additionalServicemanIds)];
  //   additionalServicemen = getUniqueObjectsFrom(additionalServicemen, 'id');
  //   taskList.forEach((task) => {
  //     if (
  //       task.preferredTimingId === preferredTimingId &&
  //       task.servicemanId === servicemanId &&
  //       formattedScheduleDate === ((task.scheduleDate && task.scheduleDate.split('T')[0]) || null)
  //     ) {
  //       task.additionalServicemanIds = additionalServicemanIds;
  //       task.additionalServicemans = additionalServicemen;
  //     }
  //   });
  // };

  // const deleteMltSlctOptn = (key, val, ind) => {
  //   if (key === 'additionalServicemans' && val && isArray(taskList[ind].additionalServicemans)) {
  //     const additionalServicemans = taskList[ind].additionalServicemans.filter((srvcmn) => srvcmn.id !== val * 1);
  //     const additionalServicemanIds = additionalServicemans.map((v) => v.id);
  //     taskList[ind].additionalServicemans = additionalServicemans;
  //     taskList[ind].additionalServicemanIds = additionalServicemanIds;
  //     // changeAdditionalServicemenIdsForSimilarTask(additionalServicemen, ind);
  //   }
  //   updatePayload({ taskList });
  // };

  // const additionalServicementData = (ind) => {
  //   if (isArray(servicemen)) {
  //     const tempAddntlSrvcmn = servicemen.filter((srvcmn) => srvcmn.id !== taskList[ind].servicemanId * 1);
  //     if (isArray(taskList[ind].additionalServicemanIds)) {
  //       const additionalServicemans =
  //         servicemen.filter((mn) => taskList[ind].additionalServicemanIds.includes(mn.id)) || [];
  //       updatePayload({ additionalServicemans });
  //     }
  //     setAdditionalServicemenList(tempAddntlSrvcmn);
  //   }
  // };

  const getValidCost = (val) => isValidStr(val, REGX_TYPE.UNIT_PRICE_RX) && val && val.split('.').slice(0, 2).join('.');

  const changeAllTasksData = async () => {
    const {
      serviceOrderIdsToShift,
      servicemanId,
      additionalServicemans,
      preferredTimingId,
      scheduleDate,
      isShiftToNextToService
    } = taskList[0];
    const newTaskList = await Promise.all(
      taskList.map((task) => {
        task.modifyEachTask = true;
        task.scheduleDate = scheduleDate;
        task.preferredTimingId = preferredTimingId;
        task.servicemanId = servicemanId;
        task.additionalServicemans = additionalServicemans;
        // task.serviceOrderIdsToShift = serviceOrderIdsToShift;
        // task.isShiftToNextToService = isShiftToNextToService;
        return task;
      })
    );
    updatePayload({ taskList: newTaskList });
  };

  // const changeAdditionalServicemans = (val, index) => {
  //   const tempData =
  //     (isArray(additionalServicemenData) && additionalServicemenData.filter((itm) => itm.id !== val * 1)) || [];
  //   setAdditionalServicemenData(tempData);
  //   taskList[index].additionalServicemans = tempData;
  //   taskList[index].additionalServicemanIds = (isArray(tempData) && tempData.map((itm) => itm.id)) || [];
  // };

  const handleOnBlur = (key, val, ind) => {
    const updateFields = {};
    if (['unitPrice', 'discountAmount'].includes(key) && val) {
      const [taskInd, itemRowInd] = ind.split('-');
      const selectedItem = taskList[taskInd].taskItems[itemRowInd];
      const itemUpdateField = { [key]: val };
      itemUpdateField[key] = parseFloat(val).toFixed(2);
      taskList[taskInd].taskItems[itemRowInd] = { ...selectedItem, ...itemUpdateField };
      updateFields.taskList = [...taskList];
    }
    updatePayload({ ...updateFields });
  };

  const handleChange = (key, val, ind) => {
    setIsFormModified.on();
    if (key) {
      const updateFields = {};
      if (
        [
          'taskName',
          'scheduleDate',
          'preferredTimingId',
          'servicemanId',
          // 'additionalServicemans',
          // 'additionalServicemanIds',
          'isAssignServicemanToSimilarTask',
          'isShiftToNextToService',
          'shiftDates',
          'zoneName',
          'serialNumber',
          'serviceOrderStatusId',
          'modifyEachTask'
        ].includes(key)
      ) {
        // if (['scheduleDate', 'preferredTimingId', 'servicemanId'].includes(key)) {
        //   changeAdditionalServicemenIdsForSimilarTask(taskList[ind].additionalServicemans || [], ind);
        // }
        // if (key === 'additionalServicemans') {
        //   let updatedVal = val;
        //   if (isArray(updatedVal)) {
        //     if (isArray(taskList[ind]?.additionalServicemanIds)) {
        //       taskList[ind]?.additionalServicemanIds.forEach((itm) => {
        //         if (updatedVal.filter((ele) => ele.id === itm).length === 2) {
        //           updatedVal = updatedVal.filter((num) => num.id !== itm);
        //         }
        //       });
        //     }
        //   }
        //   taskList[ind][key] = val;
        //   taskList[ind].additionalServicemanIds = val.map((v) => v.id);
        //   // changeAdditionalServicemenIdsForSimilarTask(val, ind);
        // }
        if (key === 'modifyEachTask') {
          taskList[ind][key] = val;
          if (val === true) {
            changeAllTasksData();
            setModifiedTasks.on();
          } else {
            if (isArray(taskList)) {
              taskList.forEach((itm) => (itm.isShiftToNextToService = false));
            }
            setUncheckedDates(shiftDatesToKeep);
            setCheckedDates([]);
            setDatesToPass([]);
            taskList[0].serviceOrderIdsToShift =
              (isArray(shiftDatesToKeep) && shiftDatesToKeep.map((itm) => itm.id)) || null;
            updatePayload({ taskList });
            setModifiedTasks.off();
          }
        } else if (key === 'servicemanId') {
          //   if (!taskList[0].modifyEachTask) {
          //     changeAdditionalServicemans(val, 0);
          //   } else {
          //     changeAdditionalServicemans(val, ind);
          //   }
          const { taskId } = taskList[ind];
          taskList.forEach((task) => {
            if (task.taskId === taskId && task.isAssignServicemanToSimilarTask) {
              task.servicemanId = val;
            }
          });
          taskList[ind][key] = val;
        } else if (key === 'serviceOrderStatusId') {
          taskList[0][key] = val;
        } else if (key === 'preferredTimingId') {
          taskList[ind][key] = val * 1 || null;
        } else if (key === 'isShiftToNextToService') {
          setDateAllowToBeShifted([]);
          setisEditShiftDate.off();
          if (val === true) {
            taskList[ind][key] = val;
            setPopupIndex(ind);
            const { servicemanId, taskName, scheduleDate } = taskList[ind];
            if (isArray(taskList) && isArray(servicemen)) {
              const servicemanName = servicemen.find((srv) => servicemanId * 1 === srv.id);
              setShiftServiceTitle({
                taskName,
                scheduleDate,
                serviceman: servicemanName?.name
              });
            }
            setOpenShiftNextServices.on();
          } else if (val === false) {
            taskList[ind][key] = val;
            const filteredArray = shiftDatesToKeep.filter(
              (itm) => taskList[ind].serviceOrderIdsToShift && taskList[ind].serviceOrderIdsToShift.includes(itm.id)
            );
            const tempData = [...filteredArray, ...uncheckedDates];
            const uniqueData = tempData.filter(
              (value, index, self) =>
                index === self.findIndex((item) => item.id === value.id && item.scheduleDate === value.scheduleDate)
            );
            const removedIds = checkedDates.filter((id) => !filteredArray.some((item) => item.id === id));
            taskList[ind].serviceOrderIdsToShift = [];
            setUncheckedDates(uniqueData);
            setCheckedDates([...removedIds]);
          } else {
            taskList[ind][key] = false;
          }
        } else if (key === 'taskNote') {
          taskList[ind][key] = val.substr(0, MAX_LENGTH.NOTES);
        } else if (key === 'scheduleDate') {
          if (val === null) {
            taskList[ind][key] =
              (taskList[ind]?.scheduleDate &&
                moment(taskList[ind].scheduleDate).startOf('day')?.format('YYYY-MM-DDTHH:mm:ss')) ||
              null;
          } else {
            const startScheduleDate = (val && moment(val).startOf('day')?.format('YYYY-MM-DDTHH:mm:ss')) || null;
            taskList[ind][key] = startScheduleDate;
            const dateForLeave = (val && getFormattedDate(DATE_FORMAT.YEAR_DATE_TIME_FORMAT, val)) || null;
            getServicemenList(dateForLeave);
            const diffDates = moment(startScheduleDate).diff(moment(formatedDate), 'days');
            setDiffDays(diffDates);
          }
          // additionalServicementData(ind);
        } else {
          if (key === 'isAssignServicemanToSimilarTask' && val) {
            const { taskId, servicemanId } = taskList[ind];
            taskList.forEach((task, idx) => {
              if (ind !== idx && task.taskId === taskId) {
                task.servicemanId = servicemanId;
                task.isAssignServicemanToSimilarTask = true;
              }
            });
          }
          taskList[ind][key] = val;
        }
        updateFields.taskList = [...taskList];
      } else if (
        [
          'serviceSubjectName',
          'item',
          'itemQuantity',
          'conversionFactor',
          'ratioId',
          'uomId',
          'serviceQuantity',
          'unitPrice',
          'discountAmount',
          'grossAmount',
          'netAmount',
          'isBillable',
          'isPreferred'
        ].includes(key)
      ) {
        const [taskInd, itemRowInd] = ind.split('-');
        if (key === 'serviceSubjectName') {
          taskList[ind][key] = val;
        } else {
          const selectedItem = taskList[taskInd].taskItems[itemRowInd];
          const { taskType, isConsumableAssociationPresent } = taskList[taskInd];
          const itemUpdateField = { [key]: val };
          if (key === 'item') {
            itemUpdateField.itemId = val?.id;
            const { taskId, serviceSubjectQuantity } = taskList[taskInd];
            getTaskItemDetail({ ...val, taskId, serviceSubjectQuantity }, taskInd, itemRowInd);
            return;
          }
          if (key === 'itemQuantity') {
            if (
              val &&
              (val === '0' || !isValidStr(val, REGX_TYPE.NUM) || val * 1 > taskList[taskInd]?.taskQuantity * 1)
            ) {
              return true;
            }
            const ratioObj =
              isArray(selectedItem.ratios) && selectedItem.ratios.find((r) => r.id === selectedItem.ratioId * 1);
            const calcSerQuantity =
              taskType === 'Scheduled' && isConsumableAssociationPresent
                ? selectedItem.conversionFactor * val * (ratioObj.ratio || 1)
                : selectedItem.conversionFactor * val;
            itemUpdateField.serviceQuantity = calcSerQuantity;
            selectedItem.discountAmount = 0;
            itemUpdateField.discountAmount = 0;
          } else if (key === 'ratioId') {
            itemUpdateField.ratioId = val || null;
            itemUpdateField.uomId =
              (isArray(selectedItem.ratios) && selectedItem.ratios.find((r) => r.id === val * 1)?.uomId) || '';
            const ratioObj =
              (isArray(selectedItem.ratios) && selectedItem.ratios.find((r) => r.id === val * 1)) || null;
            itemUpdateField.serviceQuantity =
              taskType === 'Scheduled' && isConsumableAssociationPresent
                ? selectedItem.conversionFactor * selectedItem.itemQuantity * (ratioObj?.ratio || 0)
                : selectedItem.conversionFactor * selectedItem.itemQuantity;
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
                itemUpdateField[key] = val;
              } else {
                return true;
              }
            }
            const currUnitPrice = key === 'unitPrice' ? val || 0 : selectedItem?.unitPrice;
            const currDiscount = key === 'discountAmount' ? val || 0 : selectedItem?.discountAmount;
            const currItemQuantity = key === 'itemQuantity' ? val || 0 : selectedItem?.itemQuantity;
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
          if (key === 'taskItemNote') {
            itemUpdateField.taskItemNote = val.substr(0, MAX_LENGTH.NOTES);
          }
          taskList[taskInd].taskItems[itemRowInd] = { ...selectedItem, ...itemUpdateField };
          updateFields.taskList = [...taskList];
        }
      } else {
        updateFields[key] = val;
      }
      updatePayload({ ...updateFields });
    }
  };

  const updateSparePartsData = (event, action, taskInd, itemRowInd, taskItemId, itemId, taskId) => {
    const values = [...taskList[taskInd].taskItems];
    const deleletTaskItemUI = { taskInd, taskItemId, itemRowInd, values };
    switch (action) {
      case 'UPDATE':
        values[itemRowInd][event?.target?.name] = event?.target?.value;
        break;
      case 'DELETE': {
        const itemObj = isArray(itemList) && itemList.find((itm) => itm.taskId === taskId);
        const taskItemName = (isArray(itemObj.items) && itemObj.items.find((itm) => itm.id === itemId)?.name) || '';
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
          serviceSubjectName: '',
          itemId: '',
          itemQuantity: '',
          conversionFactor: '',
          ratioId: '',
          uomId: '',
          serviceQuantity: '',
          unitPrice: '',
          discountAmount: '',
          grossAmount: '',
          netAmount: '',
          taskItemNote: '',
          isBillable: false,
          isPreferred: false,
          hasPreferredItems: false,
          preferredItems: []
        });
        break;
      default:
        break;
    }
    taskList[taskInd].taskItems = [...values];
    updatePayload({ taskList });
  };

  const getServicemenList = async (val) => {
    const res = await getServicemenOnLeave(
      `${API_V1}/${APIS.GET_SERVICEMEN_ON_LEAVE}?scheduledDate=${!val ? formatedDate : val}&regionId=${regionId}`
    );
    setServicemen(res.data);
  };

  const getAdditionalServicemen = (servicemen) => {
    if (isArray(taskList)) {
      const servicemenData = [];
      taskList.forEach((item) => {
        if (isArray(item.additionalServicemanIds)) {
          item.additionalServicemanIds.forEach((id) => servicemenData.push(id));
        }
      });
      if (isArray(servicemenData) && isArray(servicemen)) {
        const tempServicemen = servicemen.filter((itm) => servicemenData.includes(itm.id));
        setAdditionalServicemenData(tempServicemen);
        taskList[0].additionalServicemans = tempServicemen;
        setIsAdditionalServiceman.on();
      }
    }
  };

  const getTaskDetails = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getTaskDetailsByServiceOrder(
      `${API_V1}/${APIS.GET_TASK_DETAILS_BY_SERVICE_ORDER}?serviceOrderId=${serviceOrderId}`
    );
    const newTasks =
      (isArray(res?.data) &&
        res.data.map((data) => ({
          ...data,
          preferredTimingId,
          servicemanId,
          lastVisits: previousPerformedServiceDate || '',
          projectEndDate: null,
          modifyEachTask: false
        }))) ||
      [];
    if (BLOCKED_SERVICE_ORDER_STATUS_ID.includes(newTasks[0]?.serviceOrderStatusId)) {
      setDisableEditSchedule.on();
      onDisablePage(true);
    }
    if (isArray(newTasks)) {
      isDataLoaded(true);
      /* eslint-disable no-plusplus */
      for (let i = 0; i < newTasks.length; i++) {
        const task = newTasks[i];
        if (isArray(task.taskItems)) {
          /* eslint-disable no-plusplus */
          for (let j = 0; j < task.taskItems.length; j++) {
            const taksItem = task.taskItems[j];
            const { hasPreferredItems, itemId } = taksItem;
            if (hasPreferredItems && itemId) {
              if (!preferredItemsList[itemId]) {
                // eslint-disable-next-line no-await-in-loop
                const res = await getPreferredItemsForItem(`${API_V1}/${APIS.PREFERRED_ITEMS_FOR_ITEM}=${itemId}`);
                preferredItemsList[itemId] = isArray(res?.data) ? res?.data : [];
              }
              task.taskItems[j].preferredItems = preferredItemsList[itemId] || [];
            }
          }
        }
      }
    }
    newTasks.forEach((tsk) => {
      if (isArray(tsk.taskItems)) {
        tsk.taskItems.forEach((tskItm) => {
          tskItm.unitPrice = (tskItm.unitPrice && parseFloat(tskItm.unitPrice).toFixed(2)) || '0.00';
          tskItm.discountAmount = (tskItm.discountAmount && parseFloat(tskItm.discountAmount).toFixed(2)) || '0.00';
        });
      }
    });
    updatePayload({ taskList: newTasks });
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.data) {
      getTaskItemList(res.data);
    }
  };

  const getTaskItemList = async (taskList) => {
    const tempPreferedItem = [];
    if (isArray(taskList)) {
      dispatch({ type: IS_DATA_LOADING, data: true });
      /* eslint-disable no-plusplus */
      for (let i = 0; i < taskList.length; i++) {
        const { taskId, serviceSubjectId, isInstallationAssociationPresent, isConsumableAssociationPresent } =
          taskList[i];
        if (
          tempPreferedItem.findIndex((itm) => itm.taskId === taskId && itm.serviceSubjectId === serviceSubjectId) === -1
        ) {
          // eslint-disable-next-line no-await-in-loop
          const res = await getTaskItemsWithPreferenceList(`${API_V1}/${APIS.GET_ITEMS_WITH_PREFERENCE}`, {
            serviceSubjectId,
            taskId: taskId.toString(),
            isInstallationAssociationPresent,
            isConsumableAssociationPresent,
            itemSearchKey: '',
            itemId: 0
          });
          if (isArray(res.data)) {
            tempPreferedItem.push({
              taskId,
              serviceSubjectId,
              items: res.data
            });
          }
        }
      }
      setItemList(tempPreferedItem);
      dispatch({ type: IS_DATA_LOADING, data: false });
    } else {
      setItemList(tempPreferedItem);
    }
  };

  const getTaskItemDetail = async (val, taskInd, itemRowInd) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const { taskId, id, hasPreferredItems, serviceSubjectQuantity, taskQuantity } = val;
    let preferredItems = [];
    const taskDetailData = taskList[taskInd];
    if (taskDetailData) {
      let res = { data: {} };
      if (id) {
        res = await getTaskItemDetails(`${API_V1}/${APIS.GET_TASK_ITEM_DETAILS}`, {
          itemId: id,
          serviceSubjectId: taskDetailData.serviceSubjectId,
          taskId: taskDetailData.taskId.toString(),
          isInstallationAssociationPresent: taskDetailData.isInstallationAssociationPresent,
          isConsumableAssociationPresent: taskDetailData.isConsumableAssociationPresent,
          itemSearchKey: ''
        });
        if (hasPreferredItems) {
          if (!preferredItemsList[id]) {
            const res = await getPreferredItemsForItem(`${API_V1}/${APIS.PREFERRED_ITEMS_FOR_ITEM}=${id}`);
            preferredItemsList[id] = isArray(res?.data) ? res?.data : [];
          }
          preferredItems = preferredItemsList[id] || [];
        }
      }
      taskList[taskInd].taskItems[itemRowInd] = addTaskItemDetailsData(
        res.data,
        hasPreferredItems,
        serviceSubjectQuantity,
        preferredItems,
        taskInd,
        itemRowInd
      );
    }
    updatePayload({ taskList });
    dispatch({ type: IS_DATA_LOADING, data: false });
  };

  const addTaskItemDetailsData = (
    taskItemsDetails,
    hasPreferredItems,
    serviceSubjectQuantity,
    preferredItems,
    taskInd,
    itemRowInd
  ) => {
    if (isObject(taskItemsDetails)) {
      const { taskQuantity, taskItems, taskType, isConsumableAssociationPresent } = taskList[taskInd];
      const prevItem = taskItems[itemRowInd];
      const {
        id,
        itemId,
        conversionFactor,
        ratioId,
        ratios,
        unitPrice,
        uomId,
        uoMs,
        isBillable
        // hasPreferredItems,
        // preferredItems,
        // serviceSubjectQuantity
      } = taskItemsDetails.id ? taskItemsDetails : prevItem;
      // } = taskItemsDetails;
      const newItem = {
        ...prevItem,
        isPreferred: id ? prevItem.isPreferred : false,
        itemId: id || itemId,
        itemQuantity: taskQuantity,
        conversionFactor,
        serviceQuantity:
          taskType === 'Scheduled' && isConsumableAssociationPresent
            ? conversionFactor * taskQuantity * (ratios?.ratio || 1)
            : taskQuantity * conversionFactor,
        ratioId,
        ratios,
        uomId,
        uoMs,
        unitPrice,
        discountAmount: 0,
        grossAmount: (unitPrice && taskQuantity && unitPrice * taskQuantity) || 0,
        netAmount: (unitPrice && taskQuantity && unitPrice * taskQuantity) || 0,
        isBillable,
        hasPreferredItems,
        preferredItems
      };
      return newItem;
    }
    return {};
  };

  const shiftNextServices = async () => {
    const res = await getShiftNextService(
      `${API_V1}/${APIS.GET_SHIFT_NEXT_SERVICES}?projectId=${projectId}&serviceOrderId=${serviceOrderId}`
    );
    setUncheckedDates(res.data);
    setShiftDatesToKeep(res.data);
  };

  const getDatesToLock = async () => {
    const res = await getServiceOrderDatesList(
      `${API_V1}/${APIS.SERVICE_ORDERS_DATES}${projectId}&isSkipEmptyServiceOrders=true`
    );
    if (res.isSuccessful) {
      addDatesToDisable(res.data);
    }
  };

  const addDatesToDisable = (datesToLock) => {
    const Dates = [];
    if (isArray(datesToLock)) {
      const filteredDates = datesToLock.filter(
        (itm) => moment(itm.date).format('YYYY-MM-DD') !== moment(formatedDate).format('YYYY-MM-DD')
      );
      if (isArray(filteredDates)) {
        filteredDates.forEach((itm) => {
          Dates.push(moment(itm.date).format('YYYY-MM-DD'));
        });
      }
      setDatesToDisable(Dates);
    }
  };

  const handleClickCustomTask = () => setShowCustomTask.toggle();
  const handleClickScheduleTask = () => setShowScheduleTask.toggle();

  const handleUrlClick = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    getServicemenList();
    shiftNextServices();
    getDatesToLock();
    getTaskDetails();
    getPrefrredTimes();
  }, []);

  useEffect(() => {
    addDatesToDisable();
  }, [shiftDatesToKeep]);

  useEffect(() => {
    if (!isAdditionalServiceman) {
      getAdditionalServicemen(servicemen);
    }
  }, [servicemen, taskList]);

  useEffect(() => {
    const tempTaskBullets = [];
    if (isArray(taskList)) {
      taskList.forEach((itm) => tempTaskBullets.push(true));
    }
    setCollapseTask(tempTaskBullets);
  }, [taskList]);

  useEffect(() => {
    const errorElements = document.getElementsByClassName('Mui-error');
    if (errorElements && isArray(Array.from(errorElements))) {
      setErrorArray(errorElements);
    }
  });

  useEffect(() => {
    if (isArray(taskList)) {
      const taskTypes = taskList.map((itm) => itm.taskType);
      if (taskTypes.includes('Scheduled')) {
        setShowScheduleTask.on();
      }
      if (taskTypes.includes('Custom')) {
        setShowCustomTask.on();
      }
    }
  }, [taskList]);

  // useEffect(() => {
  //   if (isArray(servicemen)) {
  //     const tempAddntlSrvcmn = servicemen.filter((srvcmn) => srvcmn.id !== servicemanId * 1);
  //     setAdditionalServicemenList(tempAddntlSrvcmn);
  //   }
  // }, [servicemen]);

  const myCloseModal = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleCloseShiftNextServices(event, isEditShiftDate ? 'close' : 'cancel');
  };

  const handleCloseBackAlertBox = () => {
    if (resSuccessfull) {
      setIsAdditionalServiceman.off();
      handleClose();
      setResSuccessfull.off();
    }
    setShowGenericAlertBox({
      open: false,
      title: '',
      titleType: '',
      content: '',
      showProceedBtn: false,
      cancelButtonText: '',
      proceedButtonText: ''
    });
  };

  const handleProceedBackAlertBox = () => {
    handleCloseBackAlertBox();
    const { proceedAction, proceedInformation } = genericAlertBox;
    switch (proceedAction) {
      case 'deleteTaskItem':
        deleteTaskItem(proceedInformation);
        break;
      case 'closeEditScheduleDialogBox':
        setIsAdditionalServiceman.off();
        handleClose();
        break;
      case 'checkProjectEndDate':
        checkProjectEndDate();
        break;
      case 'ProceedToSave':
        saveEditSchedule();
        break;
      default:
        break;
    }
  };

  const deleteTaskItem = async (deleletTaskItemUI) => {
    const { taskItemId, itemRowInd, taskInd, values } = deleletTaskItemUI;
    if (taskItemId) {
      const res = await removeTaskItems(`${API_V1}/${APIS.DELETE_TASKITEM}=${taskItemId}`);
      if (res.isSuccessful) {
        values.splice(itemRowInd, 1);
        taskList[taskInd].taskItems = [...values];
        updatePayload({ taskList });
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
      }
    } else {
      values.splice(itemRowInd, 1);
      taskList[taskInd].taskItems = [...values];
      updatePayload({ taskList });
    }
  };

  const checkAllCheckbox = (checkAll) => {
    const dateIds = (isArray(uncheckedDates) && uncheckedDates.map((itm) => itm.id)) || [];
    const existingIds = taskList[popupIndex]?.serviceOrderIdsToShift || [];
    if (checkAll) {
      setSelectAllIds.on();
      setDeselectAllIds.off();
      if (!isArray(checkedDates)) {
        setCheckedDates([...checkedDates, ...dateIds]);
        setDatesToPass([...existingIds, ...dateIds]);
        setUncheckedDates([]);
      } else {
        const remainingIds = (isArray(dateIds) && dateIds.filter((itm) => !checkedDates.includes(itm))) || [];
        setCheckedDates([...checkedDates, ...remainingIds]);
        setDatesToPass([...dateIds]);
        setUncheckedDates([]);
      }
    }
    if (!checkAll) {
      setDeselectAllIds.on();
      setSelectAllIds.off();
      if (isArray(checkedDates)) {
        let uncheckedIds = [];
        let uncheckedIdsObj = [];
        let uniqueData = [];
        if (!isArray(existingIds)) {
          uncheckedIds = checkedDates.filter((itm) => !datesToPass.includes(itm));
          uncheckedIdsObj = shiftDatesToKeep.filter((itm) => datesToPass.includes(itm.id));
          const tempData = [...uncheckedIdsObj, ...uncheckedDates];
          uniqueData = tempData.filter(
            (value, index, self) =>
              index === self.findIndex((item) => item.id === value.id && item.scheduleDate === value.scheduleDate)
          );
        } else {
          uncheckedIds = checkedDates.filter((itm) => !existingIds.includes(itm));
          const tempData = [...dateAllowToBeShifted];
          uniqueData = tempData.filter(
            (value, index, self) =>
              index === self.findIndex((item) => item.id === value.id && item.scheduleDate === value.scheduleDate)
          );
        }
        setDatesToPass([]);
        setCheckedDates([...uncheckedIds]);
        setUncheckedDates(uniqueData);
      } else {
        setDatesToPass([]);
        setCheckedDates([]);
        setUncheckedDates(shiftDatesToKeep);
      }
    }
  };

  const handleShiftDates = (i) => {
    setPopupIndex(i);
    const filteredArray = shiftDatesToKeep.filter((itm) => taskList[i].serviceOrderIdsToShift.includes(itm.id));
    const tempData = [...uncheckedDates, ...filteredArray];
    const uniqueData = tempData.filter(
      (value, index, self) =>
        index === self.findIndex((item) => item.id === value.id && item.scheduleDate === value.scheduleDate)
    );
    setDateAllowToBeShifted(uniqueData);
    setisEditShiftDate.on();
    setOpenShiftNextServices.on();
  };

  const handleCloseShiftNextServices = (e, val) => {
    setOpenShiftNextServices.off();
    if (val === 'close') {
      if (deselectAllIds) {
        const tempIds = (isArray(uncheckedDates) && uncheckedDates.map((itm) => itm.id)) || [];
        setCheckedDates([...checkedDates, ...tempIds]);
        setUncheckedDates([]);
        setDeselectAllIds.off();
      } else {
        const removedIds = checkedDates.filter((id) => !datesToPass.includes(id));
        const tempIds = [...checkedDates, ...removedIds];
        const uniqueArray = [...new Set(tempIds)];
        setCheckedDates(uniqueArray);
      }
    }
    if (val === 'cancel') {
      if (selectAllIds) {
        const tempData = (isArray(datesToPass) && shiftDatesToKeep.filter((itm) => datesToPass.includes(itm.id))) || [];
        const remainingIds = isArray(datesToPass) && checkedDates.filter((itm) => !datesToPass.includes(itm));
        setUncheckedDates(tempData);
        setCheckedDates([...remainingIds]);
        setDatesToPass([]);
        setSelectAllIds.off();
      } else {
        const canceledIds = (isArray(checkedDates) && checkedDates.filter((id) => !datesToPass.includes(id))) || [];
        setCheckedDates([...canceledIds]);
        setDatesToPass([]);
      }
      taskList[popupIndex].isShiftToNextToService = false;
    }
    if (val === 'ok') {
      taskList[popupIndex].serviceOrderIdsToShift = datesToPass;
      setDatesToPass([]);
      const filterData = uncheckedDates.filter((itm) => !checkedDates.includes(itm.id));
      setUncheckedDates(filterData);
      uncheckIsShiftNextService();
      setDeselectAllIds.off();
      setSelectAllIds.off();
    }
    if (val === 'save') {
      const tempData = [];
      let existingIds = taskList[popupIndex].serviceOrderIdsToShift;
      shiftDatesToKeep.forEach((itm) => {
        if (!checkedDates.includes(itm.id)) {
          tempData.push(itm);
        }
      });
      existingIds = existingIds.filter((id) => !tempData.some((item) => item.id === id));
      const serviceIds = datesToPass.filter((id) => !existingIds.includes(id));
      taskList[popupIndex].serviceOrderIdsToShift = [...existingIds, ...serviceIds];
      setDatesToPass([]);
      setUncheckedDates(tempData);
      setDeselectAllIds.off();
      setSelectAllIds.off();
      uncheckIsShiftNextService();
    }
  };

  const uncheckIsShiftNextService = () => {
    if (!isArray(taskList[popupIndex].serviceOrderIdsToShift)) {
      handleChange('isShiftToNextToService', '', popupIndex);
    }
  };

  const toggelTaskCollapse = (ind) => {
    const tempTaskBullets = [...collapseTask];
    tempTaskBullets[ind] = !tempTaskBullets[ind];
    setCollapseTask([...tempTaskBullets]);
  };

  const getTaskAndSparePartsComp = (i, task, isCustom) => (
    <Grid container spacing={1} sx={{ pl: '1rem', pr: '1rem' }}>
      {taskComponents?.map((comp, ind) => {
        if (
          !taskList[0]?.modifyEachTask &&
          [
            'additionalServicemans',
            'scheduleDate',
            'preferredTimingId',
            'servicemanId',
            'isShiftToNextToService',
            'shiftDates'
          ].includes(comp.key)
        ) {
          return;
        }
        if (comp.key === 'taskName') {
          comp.tooltipTitle = task.taskName;
        }
        if (comp.key === 'serviceSubjectName') {
          comp.tooltipTitle = task.serviceSubjectName;
        }
        if (['scheduleDate', 'servicemanId'].includes(comp.key)) {
          comp.isError = !task[comp.key];
        }
        if (comp.key === 'serialNumber') {
          comp.tooltipTitle = task.serialNumber;
        }
        if (comp.key === 'zoneName') {
          comp.tooltipTitle = task.zoneName;
        }
        if (comp.key === 'toggleIcon') {
          comp.handleClickIcon = () => toggelTaskCollapse(i);
          comp.tooltipTitle = collapseTask[i] ? 'Collapse' : 'Expand';
        }
        if (comp.key === 'shiftDates') {
          comp.isDisabled = !taskList[i].isShiftToNextToService;
          comp.tooltipTitle = taskList[i].isShiftToNextToService && 'Click to View to be shifted service dates';
          comp.handleClickIcon = () => handleShiftDates(i);
        }
        if (comp.key === 'taskNotesIcon') {
          comp.color = (task?.taskNote && 'primary') || '';
          comp.tooltipTitle = task?.taskNote ? 'Click to view Notes' : 'Click to add Notes';
        }
        return (
          <RenderComponent
            key={ind}
            metaData={{ ...comp }}
            payload={taskList[i]}
            ind={i}
            handleChange={handleChange}
            // deleteMltSlctOptn={deleteMltSlctOptn}
          />
        );
      })}
      {collapseTask[i] && (
        <>
          <Grid style={{ marginBottom: '-0.5' }}>
            {isArray(taskList[i]?.taskItems) &&
              taskList[i]?.taskItems?.map((taskItem, itemRowInd) => {
                const selectedItem = taskList[i]?.taskItems[itemRowInd];
                return (
                  <Grid
                    style={{
                      marginLeft: '-2rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    key={itemRowInd}
                  >
                    <Grid item xs={11} sx={{ marginLeft: '4rem' }}>
                      <Grid container spacing={1}>
                        {sparePartsComponents?.map((comp, itemInd) => {
                          if (comp.key === 'unitPrice') {
                            comp.tooltipTitle = taskItem.unitPrice;
                            if (taskItem.unitPrice === 0) {
                              taskItem[comp.key] = '0';
                            }
                          }
                          if (comp.key === 'grossAmount') {
                            comp.tooltipTitle = taskItem.grossAmount;
                          }
                          if (comp.key === 'discountAmount') {
                            comp.tooltipTitle = taskItem.discountAmount;
                          }
                          if (comp.key === 'netAmount') {
                            comp.tooltipTitle = taskItem.netAmount;
                          }

                          if (comp.key === 'item') {
                            comp.isError = !selectedItem.itemId;
                            if (comp.genericItemList && selectedItem.isPreferred) {
                              return true;
                            }
                            if (!comp.genericItemList) {
                              comp.options = selectedItem.preferredItems || [];
                              if (!selectedItem.isPreferred) {
                                return true;
                              }
                            } else {
                              let itemListOptions = [];
                              if (isArray(itemList)) {
                                const itemsArr =
                                  itemList.find(
                                    (item) =>
                                      item.taskId === taskList[i].taskId &&
                                      item.serviceSubjectId === taskList[i].serviceSubjectId
                                  )?.items || [];
                                if (isArray(itemsArr)) {
                                  itemListOptions = itemsArr;
                                }
                              }
                              // if (comp.genericItemList) {
                              comp.options = itemListOptions;
                              // }
                            }
                          }
                          if (comp.key === 'ratioId') {
                            if (isCustom || !isArray(selectedItem?.ratios)) {
                              return false;
                            }
                            comp.options = selectedItem?.ratios;
                          }
                          if (comp.key === 'uomId') {
                            comp.options = selectedItem?.uoMs;
                          }
                          if (comp.key === 'isPreferred') {
                            comp.isDisabled = !selectedItem?.hasPreferredItems;
                          }
                          if (['itemQuantity', 'ratioId', 'uomId', 'unitPrice'].includes(comp.key)) {
                            comp.isError = !taskItem[comp.key];
                          }
                          if (comp.key === 'grossAmount') {
                            taskItem[comp.key] = Number(taskItem.grossAmount).toFixed(2);
                          }
                          if (comp.key === 'netAmount') {
                            taskItem[comp.key] = Number(taskItem.netAmount).toFixed(2);
                          }
                          if (comp.key === 'taskItemNotesIcon') {
                            comp.color = (taskItem?.taskItemNote && 'primary') || '';
                            comp.tooltipTitle = taskItem?.taskItemNote ? 'Click to view Notes' : 'Click to add Notes';
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
                                        noteVal: selectedItem.taskItemNote,
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
                                        selectedItem.taskItemId,
                                        selectedItem.itemId,
                                        task.taskId
                                      )
                              }}
                              payload={{ ...selectedItem, item: { id: selectedItem?.itemId } }}
                              ind={`${i}-${itemRowInd}`}
                              handleChange={handleChange}
                              handleBlur={handleOnBlur}
                            />
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
      <Grid item xs={12} style={{ marginBottom: '1rem', marginTop: '-0.2rem', marginLeft: '1.8rem' }}>
        <RenderComponent
          metaData={{
            control: ICON,
            iconName: <AddIcon />,
            groupStyle: { paddingTop: '0rem', marginLeft: '0.6rem' },
            iconTitle: 'Add Consumables/Spare Parts',
            color: 'primary',
            handleClickIcon: () => updateSparePartsData('', 'ADD', i),
            isDisabled: disableEditSchedule,
            columnWidth: 2
          }}
        />
      </Grid>
      <Divider style={{ marginTop: '-0.5rem' }} />
    </Grid>
  );

  return (
    <>
      <Grid className="edit_schedule_main_cls">
        <PreventNewTab />
        <DialogComponent
          open={genericAlertBox.open}
          handleClose={handleCloseBackAlertBox}
          title={genericAlertBox.title}
          titleType={genericAlertBox.titleType}
          content={genericAlertBox.content}
          maxWidth={genericAlertBox.maxWidth}
          color={genericAlertBox.color}
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
        <Dialog fullWidth maxWidth open={openShiftNextServices} onClose={myCloseModal}>
          <DialogTitle>
            <Grid
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '-1rem' }}
            >
              <Grid item xs={4} style={{ marginLeft: '1.3rem' }}>
                <Typography fontWeight="Bold" variant="subtitle1">
                  Edit Schedule : {serviceOrderNumber}
                </Typography>
              </Grid>
              <Grid item xs={8} sx={{ ml: '-14rem' }}>
                <Typography fontWeight="Bold" variant="subtitle1" align="center">
                  Shift Next Services
                </Typography>
                {modifiedTasks && (
                  <Typography fontWeight="Bold" variant="subtitle1" align="center" color="#637381">
                    {shiftServiceTitle?.taskName} :{' '}
                    {!shiftServiceTitle?.scheduleDate
                      ? ''
                      : moment(shiftServiceTitle?.scheduleDate).format('DD-MM-yyyy')}{' '}
                    : {shiftServiceTitle?.serviceman}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <IconButton
              sx={{
                position: 'absolute',
                right: 5,
                top: 5
              }}
              onClick={myCloseModal}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ShiftNextServices
              shiftDatesToKeep={shiftDatesToKeep}
              uncheckedDates={uncheckedDates}
              setUncheckedDates={setUncheckedDates}
              checkedDates={checkedDates}
              datesToPass={datesToPass}
              setDatesToPass={setDatesToPass}
              setCheckedDates={setCheckedDates}
              shiftServiceTitle={shiftServiceTitle}
              dateAllowToBeShifted={dateAllowToBeShifted}
              isEditShiftDate={isEditShiftDate}
            />
          </DialogContent>
          <DialogActions>
            <Grid container spacing={1}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                {ShiftButtonComponents?.map((comp, ind) => (
                  <RenderComponent key={ind} metaData={comp} ind={ind} />
                ))}
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        <Grid
          container
          spacing={3}
          mt={1}
          style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
        >
          <Grid item xs={12} display="flex" alignItems="center" mb={1}>
            {generalData ? (
              <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickGeneralData} />
            ) : (
              <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickGeneralData} />
            )}
            <Typography fontWeight="bold" variant="subtitle2">
              General Data - {projectNumber} ({projectStatus}) | {locationName}
            </Typography>
          </Grid>
          {(generalData && (
            <Grid container spacing>
              <Grid item xs={12} sx={{ paddingTop: '0rem' }}>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  sx={{ paddingLeft: '0.5rem', paddingTop: '0rem', textAlign: 'center' }}
                >
                  Customer & Contact
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', paddingTop: '0rem' }}
              >
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ display: 'flex', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}
                >
                  <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                    Location:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                  >
                    {locationName || ''}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ display: 'flex', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}
                >
                  <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                    Customer:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                  >
                    {customerName || ''}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ display: 'flex', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}
                >
                  <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                    Salesman:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                  >
                    {salesmanName || ''}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', paddingTop: '0rem' }}
              >
                <Grid item xs={12} sm={4} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                      Contract:
                    </Typography>
                    <Link
                      to={`/contracts-projects/contracts/edit/${contractNumber}`}
                      state={contractId}
                      onClick={handleUrlClick}
                    >
                      <Tooltip title="Click to edit Contract" arrow>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: '#00ab55',
                            paddingTop: '0rem',
                            textDecoration: 'none',
                            marginLeft: '0.2rem'
                          }}
                        >
                          {contract || ''}
                        </Typography>
                      </Tooltip>
                    </Link>
                  </Grid>

                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ wordWrap: 'break-word', paddingTop: '0rem' }}>
                      Name:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contractName || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Signed on:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contractSignedOn || ''}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                      Project:
                    </Typography>
                    <Link
                      to={`${ROUTES.EDIT_PROJECT}/${projectId}`}
                      state={{ projectId, contractId }}
                      onClick={handleUrlClick}
                    >
                      <Tooltip title="Click to edit Project" arrow>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: '#00ab55',
                            paddingTop: '0rem',
                            textDecoration: 'none',
                            marginLeft: '0.2rem'
                          }}
                        >
                          {project || ''}
                        </Typography>
                      </Tooltip>
                    </Link>
                  </Grid>

                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ wordWrap: 'break-word', paddingTop: '0rem' }}>
                      Name:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {projectName || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Signed on:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {projectSignedOn || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Renewed On:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {projectRenewedOn || ''}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0rem' }}>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                      Contact:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.name || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Designation:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.title || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ wordWrap: 'break-word', paddingTop: '0rem' }}>
                      Address:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.address || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Phone:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.phoneNumbers.join(', ') || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Mobile:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.mobileNumbers.join(', ') || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ paddingTop: '0rem' }}>
                      Email:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {contactDetails?.email.join(', ') || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography
                      variant="subtitle2"
                      style={{ wordWrap: 'break-word', paddingTop: '0rem', width: '7.5rem' }}
                    >
                      Additional Email:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', width: '19rem' }}
                    >
                      {additionalEmails || ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', paddingTop: '0rem' }}>
                    <Typography variant="subtitle2" style={{ wordWrap: 'break-word', paddingTop: '0rem' }}>
                      Note:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ color: '#637381', wordWrap: 'break-word', paddingTop: '0rem', marginLeft: '0.2rem' }}
                    >
                      {projectNote || ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )) || <></>}
        </Grid>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} mb={1}>
            <Typography fontWeight="bold" variant="subtitle2" align="center">
              Service Details & Tasks
            </Typography>
          </Grid>
          <Divider style={{ marginTop: '0.5rem' }} />
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {isArray(taskList) &&
                serviceDetailsComponents?.map((comp, ind) => {
                  if (
                    taskList[0]?.modifyEachTask &&
                    [
                      'additionalServicemans',
                      'scheduleDate',
                      'preferredTimingId',
                      'servicemanId',
                      'isShiftToNextToService',
                      'shiftDates'
                    ].includes(comp.key)
                  ) {
                    comp.isDisabled = true;
                  } else if (comp.key === 'OpsAdminNote') {
                    comp.color = (taskList[0]?.serviceOrderNote && 'primary') || '';
                    comp.tooltipTitle = taskList[0]?.serviceOrderNote
                      ? "Click to view Ops admin's Note"
                      : "Click to enter Ops admin's Note";
                  }
                  if (comp.key === 'shiftDates') {
                    comp.isDisabled = !taskList[0]?.isShiftToNextToService;
                    comp.tooltipTitle =
                      taskList[0]?.isShiftToNextToService && 'Click to View to be shifted service dates';
                    comp.handleClickIcon = () => handleShiftDates(0);
                  } else if (comp.key === 'lastVisits') {
                    if (!previousPerformedServiceDate) {
                      return false;
                    }
                  }
                  return (
                    <RenderComponent
                      key={ind}
                      metaData={comp}
                      payload={taskList[0]}
                      ind={0}
                      handleChange={handleChange}
                      // deleteMltSlctOptn={deleteMltSlctOptn}
                    />
                  );
                })}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={3}
            mt={1}
            style={{ border: '1px solid rgb(227 232 234)', marginLeft: '1.5rem', width: '99.9%' }}
          >
            <Grid item xs={12} display="flex" alignItems="center" mb={1}>
              {showCustomTask ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickCustomTask} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                Custom Tasks
              </Typography>
            </Grid>
            {showCustomTask && (
              <>
                {isArray(taskList) &&
                  taskList.map((task, i) => task.taskType === 'Custom' && getTaskAndSparePartsComp(i, task, true))}
              </>
            )}
          </Grid>

          <Grid
            container
            spacing={3}
            mt={1}
            style={{ border: '1px solid rgb(227 232 234)', marginLeft: '1.5rem', width: '99.9%' }}
          >
            <Grid item xs={12} display="flex" alignItems="center" mb={1}>
              {showScheduleTask ? (
                <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
              ) : (
                <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickScheduleTask} />
              )}
              <Typography fontWeight="bold" variant="subtitle2">
                Schedule Tasks
              </Typography>
            </Grid>
            {showScheduleTask && (
              <>
                {isArray(taskList) &&
                  taskList.map((task, i) => task.taskType === 'Scheduled' && getTaskAndSparePartsComp(i, task, false))}
              </>
            )}
          </Grid>
        </Grid>
        {/* <Grid container spacing={1}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
            {buttonComponents?.map((comp, ind) => (
              <RenderComponent key={ind} metaData={comp} payload={payload} ind={ind} handleChange={handleChange} />
            ))}
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
}

EditSchedule.propTypes = {};

export default EditSchedule;
