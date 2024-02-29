import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
import { COMPONENTS, PrimaryLight } from '../../../utils/constants';
import RenderComponent from '../../../components/RenderComponent';
import { isArray } from '../../../utils/utils';

function VatNumberDialog({
  open,
  handleClose,
  handleProceed,
  customerTimeBasedVAT,
  setCustomerTimeBasedVAT,
  payloadData,
  setPayloadData,
  isEdit
}) {
  const { TEXT_FIELD, DATEPICKER, BUTTON } = COMPONENTS;
  const [copyPayload, setCopyPayload] = useState({});
  const [copyArray, setCopyArray] = useState([]);
  const [payload, setPayload] = useState({ fieldValue: '', validFrom: new Date() });
  const [tableData, setTableData] = useState(null);
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
    setCustomerTimeBasedVAT(copyArray);
    setNonEditable(false);
    setIsRecordEdit(false);
    handleClose();
  };

  const selectedObj = customerTimeBasedVAT.find((itm) => itm.isSelected);

  const arrayLength = customerTimeBasedVAT.length;

  const getToDate = (fromDate) => {
    const futureDate = moment(fromDate).add(50, 'years');
    const indOfCurrentObj = customerTimeBasedVAT.findIndex(
      (itm) => moment(itm.validFrom).format('YYYY-MM-DD') === moment(fromDate).format('YYYY-MM-DD')
    );
    if (indOfCurrentObj !== -1 && arrayLength > indOfCurrentObj + 1) {
      const dateObj = customerTimeBasedVAT[indOfCurrentObj + 1].validFrom;
      return moment(dateObj).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
    }
    return futureDate.format('YYYY-MM-DDTHH:mm:ss');
  };

  const handleOkClick = () => {
    const { validFrom, fieldValue } = payload;
    const selectedIndex = customerTimeBasedVAT.findIndex((itm) => itm.isSelected === true);
    const isObjectFound = customerTimeBasedVAT.some(
      (item) =>
        item.fieldValue === fieldValue &&
        moment(item.validFrom).format('YYYY-MM-DD') === moment(validFrom).format('YYYY-MM-DD')
    );
    const unsavedObj = customerTimeBasedVAT.some((item) => item.id === 0 && item.isSelected === true);
    const isFutureDate = new Date(validFrom) <= new Date();
    const validToDate = moment(validFrom).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');

    if (!isObjectFound) {
      const modifiedData = [...customerTimeBasedVAT];
      if (isRecordEdit) {
        handleOkEditedRecord();
      } else {
        if (moment(validFrom).format('YYYY-MM-DD') === moment(selectedObj.validFrom).format('YYYY-MM-DD')) {
          modifiedData[selectedIndex].fieldValue = fieldValue;
          modifiedData[selectedIndex].validFrom = moment(validFrom).format('YYYY-MM-DDTHH:mm:ss');
          modifiedData[selectedIndex].validTo = getToDate(validFrom);
        } else if (unsavedObj) {
          const index = customerTimeBasedVAT.findIndex((item) => item.id === 0 && item.isSelected === true);
          if (index > 0) {
            modifiedData[index - 1].validTo = validToDate;
            modifiedData[index - 1].isSelected = !isFutureDate;
          }
          modifiedData[index].fieldValue = fieldValue;
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
            fieldType: 'CustomerVAT',
            fieldValue,
            associatedFieldType: '',
            associatedFieldValue: '',
            validFrom: moment(validFrom).format('YYYY-MM-DDTHH:mm:ss'),
            validTo: getToDate(validFrom),
            isEditable: true,
            isSelected: isFutureDate
          };
          modifiedData[selectedIndex + 1] = newObj;
        }
        setCustomerTimeBasedVAT(modifiedData);
        const currentObj = modifiedData.find((itm) => itm.isSelected);
        const { fieldValue: currFieldValue } = currentObj;
        setPayloadData({ ...payloadData, customerVAT: currFieldValue });
      }
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

  const editRecord = (options) => {
    // console.log('options', options);
    const { fieldValue, validFrom, validTo, isEditable } = options;
    const [day, month, year] = validFrom.split('-');
    const formattedDateString = `${year}-${month}-${day}`;
    setOptionsData(options);
    updatePayload({
      fieldValue,
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
    const futureRecords = hasFutureRecords(customerTimeBasedVAT);
    const previousRecords = hasPreviousRecords(customerTimeBasedVAT);
    setIsFutureData(futureRecords);
    setIsPastData(previousRecords);
  }, [payload]);

  const handleOkEditedRecord = () => {
    const { validFrom: payloadValidFrom, fieldValue: payloadfieldValue } = payload;
    const { fieldValue, validFrom, validTo } = optionsData;
    const [fDay, fMonth, fYear] = validFrom.split('-');
    const [tDay, tMonth, tYear] = validTo.split('-');
    const fromDateString = `${fYear}-${fMonth}-${fDay}`;
    const toDateString = `${tYear}-${tMonth}-${tDay}`;
    const index = customerTimeBasedVAT.findIndex(
      (item) =>
        item.fieldValue === fieldValue &&
        moment(item.validFrom).format('YYYY-MM-DD') === moment(fromDateString).format('YYYY-MM-DD') &&
        moment(item.validTo).format('YYYY-MM-DD') === moment(toDateString).format('YYYY-MM-DD')
    );
    if (index !== -1) {
      const validToDate = moment(payloadValidFrom).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
      const modifiedData = [...customerTimeBasedVAT];
      if (index > 0) {
        modifiedData[index - 1].validTo = validToDate;
      }
      modifiedData[index].fieldValue = payloadfieldValue.toString();
      modifiedData[index].validFrom = moment(payloadValidFrom).format('YYYY-MM-DDTHH:mm:ss');
      modifiedData[index].validTo = getToDate(payloadValidFrom);
      setCustomerTimeBasedVAT(modifiedData);
      updatePayload({
        fieldValue: selectedObj.fieldValue,
        validFrom: selectedObj.validFrom
      });
      if (index === 0) {
        setPayloadData({ ...payloadData, customerVAT: payloadfieldValue });
      }
    } else {
      updatePayload({
        fieldValue: selectedObj.fieldValue,
        validFrom: selectedObj.validFrom
      });
    }
    setIsRecordEdit(false);
  };

  // console.log('payload', payload);

  const handleChangeData = (key, val) => {
    if (key === 'fieldValue') {
      updatePayload({ [key]: val });
    }
    updatePayload({ [key]: val });
  };

  // console.log('customerTimeBasedVAT', customerTimeBasedVAT);

  useEffect(() => {
    if (isRecordEdit) {
      const { validFrom } = payload;
      const newInd = customerTimeBasedVAT.findIndex(
        (itm) => moment(itm.validFrom).format('YYYY-MM-DD') === moment(validFrom).format('YYYY-MM-DD')
      );
      setIndexOfEdit(newInd);
    }
  }, [isRecordEdit]);

  const getMaxFromDate = () => {
    let maxDate;
    const { validFrom } = selectedObj;
    const selectedIndex = customerTimeBasedVAT.findIndex((obj) => obj.isSelected);
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
      const newDate = new Date(customerTimeBasedVAT[selectedIndex + 1]?.validFrom);
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
    const selectedIndex = customerTimeBasedVAT.findIndex((obj) => obj.isSelected);
    const isFutureIndex = indexOfEdit > selectedIndex;
    if (selectedObj.id === 0 && arrayLength === 1) {
      minDate = undefined;
    } else if (isRecordEdit && isFutureIndex) {
      const newDate = new Date(customerTimeBasedVAT[selectedIndex]?.validFrom);
      newDate.setDate(newDate.getDate() + 1);
      minDate = newDate;
    } else if (isRecordEdit && isFutureData) {
      if (isPastData) {
        const prevDate = new Date(customerTimeBasedVAT[selectedIndex - 1]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else if (isFutureData && arrayLength === 2) {
        const prevDate = new Date(customerTimeBasedVAT[selectedIndex]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else {
        minDate = undefined;
      }
    } else if (isFutureData && !isPastData && isLessFromDate) {
      const newDate = new Date(customerTimeBasedVAT[selectedIndex]?.validFrom);
      newDate.setDate(newDate.getDate() + 1);
      minDate = newDate;
    } else if (isFutureData && !isPastData) {
      minDate = new Date();
    } else if (isFutureData && isPastData) {
      const prevDate = new Date(customerTimeBasedVAT[selectedIndex - 1]?.validFrom);
      prevDate.setDate(prevDate.getDate() + 1);
      minDate = prevDate;
    } else if (isPastData && !isFutureData) {
      if (!isRecordEdit && arrayLength === 2) {
        const prevDate = new Date(customerTimeBasedVAT[selectedIndex]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      } else {
        const prevDate = new Date(customerTimeBasedVAT[selectedIndex - 1]?.validFrom);
        prevDate.setDate(prevDate.getDate() + 1);
        minDate = prevDate;
      }
    } else if (!isPastData && !isFutureData) {
      if (!isRecordEdit && arrayLength === 1) {
        const prevDate = new Date(customerTimeBasedVAT[selectedIndex]?.validFrom);
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
      control: TEXT_FIELD,
      key: 'fieldValue',
      label: 'Customer VAT Number',
      columnWidth: 3,
      isRequired: payloadData.customerClassificationId !== 3,
      isError: nonEditable,
      helperText: nonEditable && 'This record cannot be edited'
      // groupStyle: { marginBottom: '0.5rem' }
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

  useEffect(() => {
    if (isEdit) {
      const tableData = [];
      customerTimeBasedVAT.map((itm) => {
        const { validFrom, validTo, fieldValue } = itm;
        if (fieldValue) {
          return tableData.push({
            ...itm,
            vatNumber: fieldValue,
            validFrom: moment(validFrom).format('DD-MM-YYYY'),
            validTo: moment(validTo).format('DD-MM-YYYY')
          });
        }
        return null;
      });
      setTableData(tableData);
    }
  }, [customerTimeBasedVAT]);

  useEffect(() => {
    const { customerVAT } = payloadData;
    const { validFrom } = selectedObj;
    updatePayload({ fieldValue: customerVAT, validFrom });
    setCopyPayload({ ...copyPayload, customerVAT });
    setCopyArray(customerTimeBasedVAT);
  }, [payloadData]);

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
      <DialogTitle>{isEdit ? 'VAT Number' : 'Add VAT Number'}</DialogTitle>
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
                    <TableCell>VAT Number</TableCell>
                    <TableCell>From Date</TableCell>
                    <TableCell>To Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isArray(tableData) &&
                    isEdit &&
                    tableData.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          backgroundColor: row.isSelected ? PrimaryLight : ''
                        }}
                      >
                        <TableCell>{row.fieldValue}</TableCell>
                        <TableCell>{row.validFrom}</TableCell>
                        <TableCell>{row.validTo}</TableCell>
                        <TableCell>
                          <Tooltip title="Click to Edit">
                            <IconButton disabled={!row.isEditable} onClick={() => editRecord(row)}>
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

VatNumberDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleProceed: PropTypes.func,
  payloadData: PropTypes.object,
  setPayloadData: PropTypes.func,
  customerTimeBasedVAT: PropTypes.array,
  setCustomerTimeBasedVAT: PropTypes.func,
  isEdit: PropTypes.bool
};

export default VatNumberDialog;
