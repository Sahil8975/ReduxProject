import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Divider, Typography, Container } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import { isArray } from 'lodash';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import SimpleTable from '../../components/table/simpleTable';
import RenderComponent from '../../components/RenderComponent';
import useSettings from '../../hooks/useSettings';
import { COMPONENTS, PAYMENT_TYPE, UPDATE_SWITCH, MAX_LENGTH, NOTE_TYPE } from '../../utils/constants';
import Filters from '../../components/Filter/filter';
import NotesDialog from '../../components/notesDialog';
import useBoolean from '../../hooks/useBoolean';
import './AddCallOutPage.scss';

function AddCallOutPage() {
  const dispatch = useDispatch();
  const { lang } = useSettings();
  const { t } = useTranslation();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const { TEXT_FIELD, BUTTON, SELECT_BOX, DATEPICKER, TYPOGRAPHY, ICON, AUTOCOMPLETE, NONE } = COMPONENTS;
  const { UPDATE, ADD, DELETE } = UPDATE_SWITCH;
  const [table1FunnelFilters, setTable1FunnelFilters] = useState(null);
  const [collapseTask, setCollapseTask] = useState([]);
  const [showTask, setShowTask] = useBoolean(true);
  const [payload, setPayload] = useState({
    projectNumber: '',
    scheduleDate: new Date(),
    serviceman: '',
    additionalServiceman: '',
    paymentType: '',
    serviceFees: '',
    notes: '',
    taskList: []
  });

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
    maxChars: MAX_LENGTH.NOTES
  };

  const [notesBox, setShowNotesBox] = useState({ ...emptyNotesBox });

  const handleCloseNotesAlertBox = () => setShowNotesBox({ ...notesBox, ...emptyNotesBox });

  const { taskList } = payload;

  const handleProceedNotesAlertBox = (updatedNote) => {
    const taskToUpdate = taskList[notesBox.taskInd];
    if (taskToUpdate) {
      if (notesBox.noteType === NOTE_TYPE.TASK) {
        taskToUpdate[notesBox.key] = updatedNote;
      } else if (notesBox.noteType === NOTE_TYPE.TASK_ITEM) {
        taskToUpdate.taskItems[notesBox.taskItemInd][notesBox.key] = updatedNote;
      }
      updatePayload({ taskList });
    } else {
      updatePayload({ notes: updatedNote });
    }
    handleCloseNotesAlertBox();
  };

  const taskRecords = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
    { id: 3, name: 'Task 3' },
    { id: 4, name: 'Task 4' },
    { id: 5, name: 'Task 5' }
  ];
  const stockCodes = [
    { id: 1, name: 'ST 1' },
    { id: 2, name: 'ST 2' },
    { id: 3, name: 'ST 3' },
    { id: 4, name: 'ST 4' },
    { id: 5, name: 'ST 5' }
  ];

  const descriptions = [
    { id: 1, name: 'Description Test 1' },
    { id: 2, name: 'Description Test 2' },
    { id: 3, name: 'Description Test 3' },
    { id: 4, name: 'Description Test 4' },
    { id: 5, name: 'Description Test 5' }
  ];

  const ratio = [
    { id: 1, name: '1:1' },
    { id: 2, name: '1:2' },
    { id: 3, name: '1:3' },
    { id: 4, name: '1:4' },
    { id: 5, name: '1:5' }
  ];
  const isBillable = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' }
  ];

  const filterComponentsSet = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'customer',
      label: 'addCallout.customer',
      columnWidth: 3
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectLocation',
      label: 'addCallout.projectLocation',
      columnWidth: 3
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceSubjectName',
      label: 'addCallout.serviceSubjectName',
      columnWidth: 3
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'signatoryName',
      label: 'addCallout.signatoryName'
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginLeft: '2rem', marginRight: '0.5rem' },
      select: true,
      key: 'ProjectBusinessCategory',
      label: 'addCallout.ProjectBusinessCategory',
      placeholder: 'addCallout.ProjectBusinessCategory',
      columnWidth: 1.9
    },

    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'signatoryEmail',
      label: 'addCallout.signatoryEmail',
      columnWidth: 1.9
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'salesman',
      label: 'addCallout.salesman'
    },
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'lastServiceMonth',
      label: 'addCallout.lastServiceMonth',
      placeholder: 'addCallout.lastServiceMonth',
      views: ['month', 'year'],
      inputFormat: 'MM-yyyy',
      disableFuture: true,
      showTodayButton: false,
      columnWidth: 1.4
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '1rem' },
      key: 'lastServiceDoneBy',
      label: 'addCallout.lastServiceDoneBy'
    }
  ];
  const getFilterData = () => {};

  const getFilterDataPayloadChange = () => {};

  const handleChange = (ind, key, val) => {
    updatePayload({ [key]: val });
  };

  const calloutComponents = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'projectNumber',
      label: 'addCallout.projectNumber',
      isDisabled: true,
      columnWidth: 2.6
    },
    {
      control: DATEPICKER,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'scheduleDate',
      label: 'addCallout.scheduleDate',
      placeholder: 'addCallout.scheduleDate',
      columnWidth: 1.2,
      disablePast: true
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceman',
      label: 'addCallout.serviceman',
      placeholder: 'addCallout.serviceman',
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 2.5
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'additionalServiceman',
      label: 'addCallout.additionalServiceman',
      placeholder: 'addCallout.additionalServiceman',
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 2.5
    },

    {
      control: BUTTON,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'mapView',
      color: 'success',
      btnTitle: 'Map View',
      tooltipTitle: 'Click to search serviceman Location',
      columnWidth: 1.2
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'paymentType',
      label: 'addCallout.paymentType',
      placeholder: 'addCallout.paymentType',
      options: PAYMENT_TYPE,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 2.6
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem' },
      key: 'serviceFees',
      label: 'addCallout.serviceFees',
      columnWidth: 3
    },
    {
      control: TYPOGRAPHY,
      groupStyle: {
        marginTop: '0rem',
        marginRight: '-1rem',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      key: 'transactionCurrencyCode',
      label: 'Transaction Currency Code',
      columnWidth: 2
    },
    {
      control: ICON,
      key: 'callOutScheduleNote',
      iconName: <CommentIcon />,
      tooltipTitle: payload?.notes ? 'Click to view Notes' : 'Click to add Notes',
      groupStyle: { marginTop: '0.5rem' },
      columnWidth: 1,
      handleClickIcon: (key, ind) =>
        setShowNotesBox({
          ...notesBox,
          key: 'notes',
          label: `Callout Schedule Note ( Max ${MAX_LENGTH.NOTES} chars )`,
          noteVal: payload?.notes || '',
          open: true
        })
    }
  ];

  const clearFunnelFilter = () => handleFunnelFilter();

  const clearFunnelFilterObj = () => ({
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  });

  const handleFunnelFilter = () => {
    setTable1FunnelFilters({
      customerName: clearFunnelFilterObj(),
      projectNumber: clearFunnelFilterObj(),
      projectLocation: clearFunnelFilterObj(),
      ProjectBusinessCategory: clearFunnelFilterObj(),
      serviceSubject: clearFunnelFilterObj()
    });
  };

  const columnForTable1 = [
    {
      field: 'customerName',
      header: `${t('addCallout.customerName')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'projectNumber',
      header: `${t('addCallout.projectNumber')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'projectLocation',
      header: `${t('addCallout.projectLocation')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'ProjectBusinessCategory',
      header: `${t('addCallout.ProjectBusinessCategory')}`,
      sortable: true,
      filter: true
    },
    {
      field: 'serviceSubject',
      header: `${t('addCallout.serviceSubject')}`,
      sortable: true,
      filter: true
    }
  ];
  const table1HeadCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
  const table1NumericFields = ['projectNumber'];

  const updateTaskData = (index, event, action) => {
    const values = [...taskList];
    switch (action) {
      case UPDATE:
        values[index][event?.target?.name] = event?.target?.value;
        break;
      case DELETE:
        collapseTask.splice(index, 1);
        setCollapseTask([...collapseTask]);
        values.splice(index, 1);
        break;
      case ADD:
        values.push({
          serviceSubjectCode: '',
          description: '',
          taskName: '',
          notes: '',
          taskItems: []
        });
        setCollapseTask([...collapseTask, true]);
        break;
      default:
        break;
    }
    updatePayload({ taskList: [...values] });
  };

  const toggelTaskCollapse = (ind) => {
    const tempTaskBullets = [...collapseTask];
    tempTaskBullets[ind] = !tempTaskBullets[ind];
    setCollapseTask([...tempTaskBullets]);
  };
  const updateSparePartsData = (event, action, taskInd, itemRowInd) => {
    const values = [...taskList[taskInd].taskItems];
    switch (action) {
      case UPDATE:
        values[itemRowInd][event?.target?.name] = event?.target?.value;
        break;
      case DELETE:
        values.splice(itemRowInd, 1);
        break;
      case ADD:
        values.push({
          serviceSubjectCode: '',
          description: '',
          quantity: '',
          ratio: '',
          isBillable: '',
          unitPrice: '',
          discountAmount: '',
          grossAmount: '',
          totalPrice: '',
          serviceRelatedNote: ''
        });
        break;
      default:
        break;
    }
    taskList[taskInd].taskItems = [...values];
    updatePayload({ taskList });
  };

  const taskComponents = [
    {
      control: ICON,
      groupStyle: {
        marginLeft: '0.5rem',
        paddingTop: '0.5rem',
        cursor: 'pointer'
      },
      iconName: <CircleIcon fontSize="small" />,
      iconSize: 'small',
      key: 'toggleIcon',
      tooltipTitle: 'Collapse',
      placement: 'left',
      columnWidth: 1.5
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { paddingLeft: '0rem', marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'serviceSubjectCode',
      label: 'addCallout.serviceSubjectCode',
      placeholder: 'addCallout.serviceSubjectCode',
      options: stockCodes,
      columnWidth: 2.5
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { paddingLeft: '0rem', marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'description',
      label: 'addCallout.description',
      placeholder: 'addCallout.description',
      options: descriptions,
      columnWidth: 4
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { paddingLeft: '0rem', marginLeft: '0.5rem', marginRight: '0.5rem' },
      key: 'taskName',
      label: 'addCallout.taskName',
      placeholder: 'addCallout.taskName',
      options: taskRecords,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 3.7
    },
    {
      control: ICON,
      groupStyle: { marginTop: '0.3rem' },
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
      groupStyle: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
      key: 'deleteTask',
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Task',
      placement: 'right',
      columnWidth: 1
    }
  ];

  const sparePartsComponents = [
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '2rem', paddingTop: '0rem' },
      key: 'serviceSubjectCode',
      label: 'addCallout.serviceSubjectCode',
      placeholder: 'addCallout.serviceSubjectCode',
      options: stockCodes,
      columnWidth: 1.6
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'description',
      label: 'addCallout.description',
      placeholder: 'addCallout.description',
      options: descriptions,
      columnWidth: 2.6
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'quantity',
      label: 'addCallout.quantity',
      columnWidth: 0.8
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'ratio',
      label: 'addCallout.ratio',
      placeholder: 'addCallout.ratio',
      options: ratio,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 0.8
    },
    {
      control: SELECT_BOX,
      select: true,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'isBillable',
      label: 'addCallout.isBillable',
      placeholder: 'addCallout.isBillable',
      options: isBillable,
      isEmptyOptionAllowed: true,
      isSelecteAllAllow: false,
      columnWidth: 1
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'unitPrice',
      label: 'addCallout.unitPrice',
      columnWidth: 0.8
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'discountAmount',
      label: 'addCallout.discountAmount',
      columnWidth: 0.8
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'grossAmount',
      label: 'addCallout.grossAmount',
      columnWidth: 0.8
    },
    {
      control: TEXT_FIELD,
      groupStyle: { marginLeft: '0.5rem', paddingTop: '0rem', paddingLeft: '0.2rem' },
      key: 'totalPrice',
      label: 'addCallout.totalPrice',
      columnWidth: 0.8
    },
    {
      control: ICON,
      groupStyle: { marginLeft: '0.5rem', marginTop: '0.3rem', paddingTop: '0rem' },
      key: 'taskItemNotesIcon',
      color: 'inherit',
      iconName: <CommentIcon />,
      tooltipTitle: '',
      columnWidth: 0.2
    },

    {
      control: ICON,
      groupStyle: {
        marginLeft: '0.3rem',
        paddingTop: '0rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Remove Spare Part',
      handleClickIcon: () => updateSparePartsData('', 'DELETE'),
      columnWidth: 0.3
    }
  ];

  const buttonComponents = [
    {
      control: BUTTON,
      groupStyle: { marginRight: '1rem' },
      btnTitle: 'Back',
      color: 'warning',
      handleClickButton: () => {},
      columnWidth: 0.8
    },
    {
      control: BUTTON,
      btnTitle: 'Save',
      color: 'success',
      handleClickButton: () => {},
      columnWidth: 0.8
    }
  ];

  const getTaskAndSparePartsComp = (task, i) => (
    <Grid item xs={12} mt={2}>
      <Grid container spacing={3}>
        {taskComponents?.map((comp, ind) => {
          if (comp.key === 'toggleIcon') {
            comp.handleClickIcon = () => toggelTaskCollapse(i);
            comp.tooltipTitle = collapseTask[i] ? 'Collapse' : 'Expand';
          }
          if (comp.key === 'deleteTask') {
            comp.handleClickIcon = () => updateTaskData(i, '', 'DELETE');
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
            />
          );
        })}
        {collapseTask[i] && (
          <>
            <Grid item xs={12} ml={1.7} mb={0.7}>
              <Typography variant="subtitle2" sx={{ paddingTop: '0rem' }}>
                Spare Parts:
              </Typography>
            </Grid>
            <Grid container>
              {isArray(taskList[i]?.taskItems) &&
                taskList[i]?.taskItems?.map((taskItem, itemRowInd) => {
                  const selectedItem = taskList[i]?.taskItems[itemRowInd];
                  return (
                    <>
                      {sparePartsComponents?.map((comp, itemInd) => {
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
                                      noteVal: taskList[i]?.taskItems[itemRowInd].taskItemNote,
                                      taskInd: i,
                                      taskItemInd: itemRowInd,
                                      noteType: NOTE_TYPE.TASK_ITEM,
                                      open: true
                                    })
                                  : updateSparePartsData('', 'DELETE', i, itemRowInd)
                            }}
                            payload={taskList[i]?.taskItems[itemRowInd]}
                            ind={`${i}-${itemRowInd}`}
                            handleChange={handleChange}
                          />
                        );
                      })}
                    </>
                  );
                })}
            </Grid>
            <Grid item xs={12} sx={{ ml: '0.5rem', mt: '-1rem' }}>
              <RenderComponent
                metaData={{
                  control: ICON,
                  groupStyle: { paddingLeft: '0rem' },
                  iconName: <AddIcon />,
                  iconTitle: 'Add Spare Parts',
                  tooltipTitle: 'Add spare Parts',
                  color: 'primary',
                  handleClickIcon: () => updateSparePartsData('', 'ADD', i),
                  columnWidth: 2
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );

  const handleClickTask = () => setShowTask.toggle();

  return (
    <Grid className="Add_Call_out_main_cls">
      <NotesDialog
        noteProps={{ ...notesBox }}
        handleClose={handleCloseNotesAlertBox}
        handleProceed={handleProceedNotesAlertBox}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle1" align="center">
            {t('addCallout.addCallOut')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ backgroundColor: '#c7d2fe' }} />
        </Grid>
        <Grid item xs={12}>
          <Filters
            components={filterComponentsSet}
            apiUrl="dummyUrl"
            getFilterData={getFilterData}
            getFilterDataPayloadChange={getFilterDataPayloadChange}
            payload={payload}
            setPayload={setPayload}
            // emptyFilters={emptyFilters}
            // handleFunnelFilter={handleFunnelFilter}
          />
        </Grid>
      </Grid>

      {/* Table-1 Grid Container */}
      <Grid container spacing={3} style={{ marginTop: '0.1rem' }}>
        <Grid item xs={12}>
          <SimpleTable
            // rowData={tasks}
            headerData={columnForTable1}
            paginator
            rows={10}
            showGridlines
            responsiveLayout="scroll"
            resizableColumns
            columnResizeMode="expand"
            size="small"
            dataKey="id"
            editMode="row"
            numericFields={table1HeadCellsType}
            headCellsType={table1NumericFields}
            clearFilter={clearFunnelFilter}
            filterData={table1FunnelFilters}
          />
        </Grid>
      </Grid>

      {/* Schedule Components */}
      <Grid container spacing={3} sx={{ marginTop: '0.5rem' }}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="subtitle2">
            Callout Schedule Details:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {calloutComponents?.map((comp, ind) => {
              if (comp.key === 'callOutScheduleNote') {
                comp.color = (payload?.notes && 'primary') || '';
              }
              return (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChange} />
              );
            })}
          </Grid>
        </Grid>
      </Grid>

      {/* Add New Task */}
      <Grid
        container
        spacing={3}
        mt={1}
        p={1}
        style={{ border: '1px solid rgb(227 232 234)', marginLeft: '0.1rem', width: '99.9%' }}
      >
        <Grid item xs={12} display="flex" alignItems="center" style={{ paddingLeft: '0rem', paddingTop: '0rem' }}>
          {showTask ? (
            <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={handleClickTask} />
          ) : (
            <ArrowRightIcon style={{ cursor: 'pointer' }} onClick={handleClickTask} />
          )}
          <Typography fontWeight="bold" variant="subtitle2">
            Tasks:
          </Typography>
        </Grid>
        {(showTask && (
          <Grid container style={{ marginTop: '0.2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
            {isArray(taskList) && taskList.map((task, i) => getTaskAndSparePartsComp(task, i))}
            <Grid item xs={12} sx={{ ml: '0.2rem' }}>
              <Grid container spacing={3}>
                <RenderComponent
                  metaData={{
                    control: ICON,
                    groupStyle: { padding: '0rem', marginTop: '1rem' },
                    iconName: <AddIcon />,
                    iconTitle: 'Add Task',
                    tooltipTitle: 'Add Task',
                    color: 'primary',
                    handleClickIcon: () => updateTaskData('', '', 'ADD', true)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        )) || <></>}
      </Grid>

      {/* Buttons */}
      <Grid container spacing={1} sx={{ mt: '1rem' }}>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          {buttonComponents?.map((comp, ind) => (
            <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChange} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddCallOutPage;
