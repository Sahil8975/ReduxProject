import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { isArray } from '../../../utils/utils';
import { COMPONENTS, PrimaryLight } from '../../../utils/constants';
import RenderComponent from '../../../components/RenderComponent';

function CustomerIdDialog({
  open,
  handleClose,
  handleProceed,
  customerIdTypes,
  payloadData,
  setPayloadData,
  organisationTimeBasedIdentificationType,
  setOrganisationTimeBasedIdentificationType,
  isEdit,
  callSaudiPostApi
}) {
  const { SELECT_BOX, TEXT_FIELD, DATEPICKER, BUTTON } = COMPONENTS;
  const [copyPayload, setCopyPayload] = useState({});
  const [copyArray, setCopyArray] = useState([]);
  const [payload, setPayload] = useState({
    associatedFieldType: 0,
    associatedFieldValue: '',
    validFrom: new Date()
  });
  const [tableData, setTableData] = useState(null);
  const [code, setCode] = useState('');
  const [optionsData, setOptionsData] = useState({});
  const [isRecordEdit, setIsRecordEdit] = useState(false);
  const [nonEditable, setNonEditable] = useState(false);
  const [isFutureData, setIsFutureData] = useState(false);
  const [isPastData, setIsPastData] = useState(false);
  const [indexOfEdit, setIndexOfEdit] = useState(0);

  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const myCloseModal = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    updatePayload({ validFrom: new Date() });
    setPayloadData({ ...payloadData, ...copyPayload });
    setOrganisationTimeBasedIdentificationType(copyArray);
    setNonEditable(false);
    setIsRecordEdit(false);
    handleClose();
  };

  const arrayLength = organisationTimeBasedIdentificationType.length;

  const getToDate = (fromDate) => {
    const futureDate = moment(fromDate).add(50, 'years');
    const indOfCurrentObj = organisationTimeBasedIdentificationType.findIndex(
      (itm) => moment(itm.validFrom).format('YYYY-MM-DD') === moment(fromDate).format('YYYY-MM-DD')
    );
    if (indOfCurrentObj !== -1 && arrayLength > indOfCurrentObj + 1) {
      const dateObj = organisationTimeBasedIdentificationType[indOfCurrentObj + 1].validFrom;
      return moment(dateObj).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
    }
    return futureDate.format('YYYY-MM-DDTHH:mm:ss');
  };

  const selectedObj = organisationTimeBasedIdentificationType.find((itm) => itm.isSelected);

  const handleOkClick = () => {
    const { validFrom, associatedFieldType, associatedFieldValue } = payload;
    const orgainzationIdObj = customerIdTypes.find((itm) => itm.id === associatedFieldType * 1) || '';
    const selectedIndex = organisationTimeBasedIdentificationType.findIndex((itm) => itm.isSelected === true);
    const unsavedObj = organisationTimeBasedIdentificationType.some(
      (item) => item.id === 0 && item.isSelected === true
    );
    const isObjectFound = organisationTimeBasedIdentificationType.some(
      (item) =>
        item.associatedFieldType === orgainzationIdObj.code &&
        item.associatedFieldValue === associatedFieldValue &&
        moment(item.validFrom).format('YYYY-MM-DD') === moment(validFrom).format('YYYY-MM-DD')
    );
    const isFutureDate = new Date(validFrom) <= new Date();
    const validToDate = moment(validFrom).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');

    if (!isObjectFound) {
      const modifiedData = [...organisationTimeBasedIdentificationType];
      if (isRecordEdit) {
        handleOkEditedRecord();
      } else {
        if (moment(validFrom).format('YYYY-MM-DD') === moment(selectedObj.validFrom).format('YYYY-MM-DD')) {
          modifiedData[selectedIndex].fieldValue = associatedFieldType.toString();
          modifiedData[selectedIndex].associatedFieldType = (orgainzationIdObj && orgainzationIdObj.code) || '';
          modifiedData[selectedIndex].associatedFieldValue = associatedFieldValue;
          modifiedData[selectedIndex].validFrom = moment(validFrom).format('YYYY-MM-DDTHH:mm:ss');
          modifiedData[selectedIndex].validTo = getToDate(validFrom);
        } else if (unsavedObj) {
          const index = organisationTimeBasedIdentificationType.findIndex(
            (item) => item.id === 0 && item.isSelected === true
          );
          if (index > 0) {
            modifiedData[index - 1].validTo = validToDate;
            modifiedData[index - 1].isSelected = !isFutureDate;
          }
          modifiedData[index].fieldValue = associatedFieldType.toString();
          modifiedData[index].associatedFieldType = (orgainzationIdObj && orgainzationIdObj.code) || '';
          modifiedData[index].associatedFieldValue = associatedFieldValue;
          modifiedData[index].validFrom = moment(validFrom).format('YYYY-MM-DDTHH:mm:ss');
          modifiedData[index].validTo = getToDate(validFrom);
        } else {
          if (moment(validToDate).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
            modifiedData[selectedIndex].isEditable = false;
          }
          modifiedData[selectedIndex].validTo = validToDate;
          modifiedData[selectedIndex].isSelected = !isFutureDate;
          const newObj = {
            id: 0,
            fieldType: 'OrganisationIdentificationType',
            fieldValue: associatedFieldType.toString(),
            associatedFieldType: orgainzationIdObj.code,
            associatedFieldValue,
            validFrom: moment(validFrom).format('YYYY-MM-DDTHH:mm:ss'),
            validTo: getToDate(validFrom),
            isEditable: true,
            isSelected: isFutureDate
          };
          modifiedData[selectedIndex + 1] = newObj;
        }
        setOrganisationTimeBasedIdentificationType(modifiedData);
        const currentObj = modifiedData.find((itm) => itm.isSelected);
        const orgId = customerIdTypes.find((itm) => itm.code === currentObj.associatedFieldType);
        const { associatedFieldValue: currFieldValue } = currentObj;
        setPayloadData({
          ...payloadData,
          organizationId: orgId.id,
          organizationIdValue: currFieldValue
        });
      }
    }
    if (associatedFieldType * 1 === 2 && selectedObj.associatedFieldValue) {
      callSaudiPostApi(selectedObj.associatedFieldValue);
    }
    handleProceed();
    setNonEditable(false);
  };

  // Check if the record is a future record
  const isFutureRecord = (record) => {
    const validFromDate = new Date(record.validFrom);
    const today = new Date();
    return validFromDate > today;
  };

  // Check if the record is a previous record
  const isPreviousRecord = (record) => {
    const validToDate = new Date(record.validTo);
    const today = new Date();
    return validToDate < today;
  };

  // Check if there are future records in the array
  const hasFutureRecords = (array) => (isArray(array) && array.some((record) => isFutureRecord(record))) || false;

  // Check if there are previous records in the array
  const hasPreviousRecords = (array) => (isArray(array) && array.some((record) => isPreviousRecord(record))) || false;

  const editRecord = (options, ind) => {
    const { fieldValue, associatedFieldValue, validFrom, validTo, isEditable } = options;
    const [day, month, year] = validFrom.split('-');
    const formattedDateString = `${year}-${month}-${day}`;
    setOptionsData(options);
    const orgainzationIdObj = customerIdTypes.find((itm) => itm.id === fieldValue * 1) || '';
    setCode(orgainzationIdObj.code);
    updatePayload({
      associatedFieldType: fieldValue * 1,
      associatedFieldValue,
      validFrom: new Date(formattedDateString)
    });
    if (!isEditable) {
      setNonEditable(true);
      return;
    }
    setNonEditable(false);
    setIsRecordEdit(true);
  };

  useEffect(() => {
    // Check array1 for future and previous records
    const futureRecords = hasFutureRecords(organisationTimeBasedIdentificationType);
    const previousRecords = hasPreviousRecords(organisationTimeBasedIdentificationType);
    setIsFutureData(futureRecords);
    setIsPastData(previousRecords);
  }, [payload]);

  const handleOkEditedRecord = () => {
    const {
      validFrom: payloadValidFrom,
      associatedFieldType: payloadAssoFieldType,
      associatedFieldValue: payloadAssoFieldValue
    } = payload;
    const { associatedFieldType, associatedFieldValue, validFrom, validTo } = optionsData;
    const [fDay, fMonth, fYear] = validFrom.split('-');
    const [tDay, tMonth, tYear] = validTo.split('-');
    const fromDateString = `${fYear}-${fMonth}-${fDay}`;
    const toDateString = `${tYear}-${tMonth}-${tDay}`;
    const index = organisationTimeBasedIdentificationType.findIndex(
      (item) =>
        item.associatedFieldType === associatedFieldType &&
        item.associatedFieldValue === associatedFieldValue &&
        moment(item.validFrom).format('YYYY-MM-DD') === moment(fromDateString).format('YYYY-MM-DD') &&
        moment(item.validTo).format('YYYY-MM-DD') === moment(toDateString).format('YYYY-MM-DD')
    );
    const orgId = customerIdTypes.find((itm) => itm.code === selectedObj.associatedFieldType);
    if (index !== -1) {
      const validToDate = moment(payloadValidFrom).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
      const modifiedData = [...organisationTimeBasedIdentificationType];
      if (index > 0) {
        modifiedData[index - 1].validTo = validToDate;
      }
      modifiedData[index].fieldValue = payloadAssoFieldType.toString();
      modifiedData[index].associatedFieldType = code;
      modifiedData[index].associatedFieldValue = payloadAssoFieldValue;
      modifiedData[index].validFrom = moment(payloadValidFrom).format('YYYY-MM-DDTHH:mm:ss');
      modifiedData[index].validTo = getToDate(payloadValidFrom);
      setOrganisationTimeBasedIdentificationType(modifiedData);
      updatePayload({
        associatedFieldType: orgId.id,
        associatedFieldValue: selectedObj.associatedFieldValue,
        validFrom: selectedObj.validFrom
      });
      if (index === 0) {
        setPayloadData({
          ...payloadData,
          organizationId: payloadAssoFieldType,
          organizationIdValue: payloadAssoFieldValue
        });
      }
    } else {
      updatePayload({
        associatedFieldType: orgId.id,
        associatedFieldValue: selectedObj.associatedFieldValue,
        validFrom: selectedObj.validFrom
      });
    }
    setIsRecordEdit(false);
  };

  // console.log('payload', payload);

  const handleChangeData = (key, val) => {
    if (key === 'associatedFieldType') {
      const orgainzationIdObj = customerIdTypes.find((itm) => itm.id === val * 1) || '';
      setCode(orgainzationIdObj.code);
    }
    updatePayload({ [key]: val });
  };

  useEffect(() => {
    if (isRecordEdit) {
      const { validFrom } = payload;
      const newInd = organisationTimeBasedIdentificationType.findIndex(
        (itm) => moment(itm.validFrom).format('YYYY-MM-DD') === moment(validFrom).format('YYYY-MM-DD')
      );
      setIndexOfEdit(newInd);
    }
  }, [isRecordEdit]);

  const getMaxFromDate = () => {
    let maxDate;
    const { validFrom } = selectedObj;
    const selectedIndex = organisationTimeBasedIdentificationType.findIndex((obj) => obj.isSelected);
    const isFutureIndex = indexOfEdit > selectedIndex;
    if (arrayLength === 1) {
      if (selectedObj.id === 0) {
        maxDate = new Date(validFrom);
      } else if (selectedIndex === 0) {
        maxDate = undefined;
      } else {
        maxDate = new Date();
      }
    } else if (isRecordEdit && isFutureIndex) {
      maxDate = undefined;
    } else if (isRecordEdit && isFutureData) {
      const newDate = new Date(organisationTimeBasedIdentificationType[selectedIndex + 1]?.validFrom);
      newDate.setDate(newDate.getDate() - 1);
      maxDate = newDate;
    } else if (isFutureData && isPastData) {
      maxDate = new Date();
    }

    return maxDate;
  };

  const getMinFromDate = () => {
    let minDate;
    const { validFrom } = selectedObj;
    const isLessFromDate = new Date(validFrom) < new Date();
    const selectedIndex = organisationTimeBasedIdentificationType.findIndex((obj) => obj.isSelected);
    const isFutureIndex = indexOfEdit > selectedIndex;
    if (selectedObj.id === 0 && arrayLength === 1) {
      minDate = undefined;
    } else if (isRecordEdit && isFutureIndex) {
      const newDate = new Date(organisationTimeBasedIdentificationType[selectedIndex]?.validFrom);
      newDate.setDate(newDate.getDate() + 1);
      minDate = newDate;
    } else if (isRecordEdit && isFutureData) {
      if (isPastData) {
        const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex - 1]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else if (isFutureData && arrayLength === 2) {
        const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else {
        minDate = undefined;
      }
    } else if (isFutureData && !isPastData && isLessFromDate) {
      const newDate = new Date(organisationTimeBasedIdentificationType[selectedIndex]?.validFrom);
      newDate.setDate(newDate.getDate() + 1);
      minDate = newDate;
    } else if (isFutureData && !isPastData) {
      minDate = new Date();
    } else if (isFutureData && isPastData) {
      const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex - 1]?.validFrom);
      prevDate.setDate(prevDate.getDate() + 1);
      minDate = prevDate;
    } else if (isPastData && !isFutureData) {
      if (!isRecordEdit && arrayLength === 2) {
        const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else {
        const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex - 1]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      }
    } else if (!isPastData && !isFutureData) {
      if (!isRecordEdit && arrayLength === 1) {
        const prevDate = new Date(organisationTimeBasedIdentificationType[selectedIndex]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else if (isRecordEdit && arrayLength === 1) {
        minDate = undefined;
      } else {
        const newDate = new Date(validFrom);
        newDate.setDate(newDate.getDate() + 1);
        minDate = newDate;
      }
    }

    return minDate;
  };

  const components = [
    {
      control: SELECT_BOX,
      // groupStyle: { marginBottom: '0.5rem', marginLeft: '1rem' },
      key: 'associatedFieldType',
      label: 'Organisation Id',
      options: customerIdTypes,
      select: true,
      isRequired: payloadData.customerClassificationId !== 3,
      isError: nonEditable,
      helperText: nonEditable && 'This record cannot be edited',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      // isDisabled: ,
      columnWidth: 3
    },
    {
      control: TEXT_FIELD,
      key: 'associatedFieldValue',
      label: 'Value',
      columnWidth: 3,
      isRequired: payloadData.customerClassificationId !== 3
      // groupStyle: { marginBottom: '0.5rem' }
      // isError:error &&,
      // helperText:,
      // isDisabled:
    },
    {
      control: DATEPICKER,
      // groupStyle: { height: '3rem' },
      key: 'validFrom',
      label: 'From Date',
      showTodayButton: false,
      // shouldDisableDate: (date) => datesToDisable.includes(moment(date).format('YYYY-MM-DD')),
      minDate: getMinFromDate(),
      maxDate: getMaxFromDate(),
      isRequired: true,
      // isDisabled: disableEditSchedule,
      columnWidth: 2
    }
  ];

  const buttons = [
    {
      control: BUTTON,
      color: 'warning',
      size: 'small',
      btnTitle: 'Cancel',
      handleClickButton: () => myCloseModal(),
      groupStyle: { minWidth: '7rem' }
    },
    {
      control: BUTTON,
      color: 'success',
      btnTitle: 'Ok',
      handleClickButton: () => handleOkClick(),
      groupStyle: { minWidth: '7rem' }
    }
  ];

  // console.log('organisationTimeBasedIdentificationType', organisationTimeBasedIdentificationType);

  useEffect(() => {
    if (isEdit && isArray(customerIdTypes)) {
      const tableData = [];
      organisationTimeBasedIdentificationType.map((itm) => {
        const { associatedFieldType, associatedFieldValue, validFrom, validTo } = itm;
        if (associatedFieldType) {
          const oragnisationIdObj = customerIdTypes.find((s) => s.code === associatedFieldType);
          if (oragnisationIdObj) {
            return tableData.push({
              ...itm,
              name: oragnisationIdObj.name,
              associatedFieldType,
              associatedFieldValue,
              validFrom: moment(validFrom).format('DD-MM-YYYY'),
              validTo: moment(validTo).format('DD-MM-YYYY')
            });
          }
        }
        return null;
      });
      setTableData(tableData);
    }
  }, [organisationTimeBasedIdentificationType, customerIdTypes]);

  useEffect(() => {
    if (isArray(customerIdTypes)) {
      const { organizationId, organizationIdValue } = payloadData;
      const { validFrom } = selectedObj;
      updatePayload({
        associatedFieldType: organizationId,
        associatedFieldValue: organizationIdValue,
        validFrom
      });
      setCopyPayload({ ...copyPayload, organizationId, organizationIdValue });
      setCopyArray(organisationTimeBasedIdentificationType);
    }
  }, [payloadData, customerIdTypes]);

  return (
    <Dialog open={open} onClose={myCloseModal} fullWidth maxWidth="md">
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
      <DialogTitle>{isEdit ? 'Organisation Id' : 'Add Organisation Id'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {components?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Organisation Id Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>From Date</TableCell>
                    <TableCell>To Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isArray(tableData) &&
                    isEdit &&
                    tableData.map((row, ind) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          backgroundColor: row.isSelected ? PrimaryLight : ''
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.associatedFieldValue}</TableCell>
                        <TableCell>{row.validFrom}</TableCell>
                        <TableCell>{row.validTo}</TableCell>
                        <TableCell>
                          <Tooltip title="Click to Edit">
                            <IconButton disabled={!row.isEditable} onClick={() => editRecord(row, ind)}>
                              <EditIcon color={!row.isEditable ? 'lightgrey' : 'success'} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ paddingTop: '0rem' }}>
        {buttons?.map((comp, ind) => (
          <RenderComponent key={ind} metaData={comp} ind={1} />
        ))}
      </DialogActions>
    </Dialog>
  );
}

CustomerIdDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleProceed: PropTypes.func,
  customerIdTypes: PropTypes.array,
  payloadData: PropTypes.object,
  setPayloadData: PropTypes.func,
  organisationTimeBasedIdentificationType: PropTypes.array,
  setOrganisationTimeBasedIdentificationType: PropTypes.func,
  isEdit: PropTypes.bool,
  callSaudiPostApi: PropTypes.func
};

export default CustomerIdDialog;
