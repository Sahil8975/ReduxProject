import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';
import './BasicDatePicker.scss';

export default function BasicDatePicker({
  label,
  minDate,
  maxDate,
  inputFormat,
  views,
  size = 'small',
  value,
  error,
  helperText,
  FormHelperTextProps,
  disabled,
  getSelectedDate,
  getIsoDate,
  hideTabs = true,
  showTodayButton = true,
  disableFuture = false,
  disablePast = false,
  isRequired = false,
  shouldDisableDate,
  secondDate,
  isSecondDate,
  secondLabel
}) {
  const handleDateChange = (dt) => {
    getSelectedDate(new Date(dt));
    getIsoDate(moment(dt).toISOString());
  };

  const myToolbar = () =>
    isSecondDate ? (
      <div className="wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dateTitle">{(label && label) || ''}</div>
            <div className="dateValue">{(value && moment(value).format('DD-MM-YYYY')) || '--'}</div>
          </div>
          <div>
            <div className="dateTitle">{(secondLabel && secondLabel) || ''}</div>
            <div className="secondDateValue">{(value && moment(secondDate).format('DD-MM-YYYY')) || '--'}</div>
          </div>
        </div>
      </div>
    ) : (
      <div className="wrapper">
        <div className="dateTitle">{(label && label) || ''}</div>
        <div className="dateValue">{(value && moment(value).format('DD-MM-YYYY')) || '--'}</div>
      </div>
    );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        sx={{
          '& .PrivateDateTimePickerToolbar-penIcon': { display: 'none' }
        }}
        value={value === '' ? null : value}
        onChange={handleDateChange}
        showTodayButton={showTodayButton}
        disableFuture={disableFuture}
        disablePast={disablePast}
        shouldDisableDate={shouldDisableDate}
        minDate={minDate}
        maxDate={maxDate}
        cancelText={null}
        hideTabs={hideTabs}
        label={label}
        ToolbarComponent={myToolbar}
        toolbarFormat="dd-MM-"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DateRangeIcon />
            </InputAdornment>
          )
        }}
        views={views === undefined || views === null ? ['year', 'month', 'day', 'hours', 'minutes'] : views}
        renderInput={(props) => (
          <TextField
            fullWidth
            {...props}
            size={size}
            error={error}
            helperText={helperText}
            FormHelperTextProps={FormHelperTextProps}
            defaultValue="10-02-2020"
            required={isRequired}
          />
        )}
        inputFormat={inputFormat === undefined || inputFormat === null ? 'dd-MM-yyyy hh:mm a' : inputFormat}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
}

BasicDatePicker.propTypes = {
  label: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  inputFormat: PropTypes.string,
  views: PropTypes.object,
  size: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  FormHelperTextProps: PropTypes.object,
  disabled: PropTypes.bool,
  getSelectedDate: PropTypes.func,
  getIsoDate: PropTypes.func,
  isRequired: PropTypes.bool,
  showTodayButton: PropTypes.bool
};
