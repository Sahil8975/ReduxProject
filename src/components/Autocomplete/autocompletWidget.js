import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function AutocompleteWidget({
  id,
  options,
  label,
  disablePortal,
  autoCompleteOpt,
  autoHighlight,
  autoSelect,
  blurOnSelect,
  clearIcon,
  classes,
  clearText,
  closeText,
  defaultValue,
  disableClearable,
  disableCloseOnSelect,
  disabled,
  disabledItemsFocusable,
  disableListWrap,
  filterOptions,
  filterSelectedOptions,
  forcePopupIcon,
  freeSolo,
  fullWidth,
  getOptionLabel,
  groupBy,
  inputValue,
  limitTags,
  loading,
  loadingText,
  multiple,
  noOptionsText,
  onChange,
  onClose,
  openText,
  popupIcon,
  size,
  value,
  error,
  helperText,
  FormHelperTextProps
}) {
  return (
    <Autocomplete
      disablePortal={disablePortal === undefined || disablePortal === null ? false : disablePortal}
      autoComplete={autoCompleteOpt === undefined || autoCompleteOpt === null ? false : autoCompleteOpt}
      autoHighlight={autoHighlight === undefined || autoHighlight === null ? false : autoHighlight}
      autoSelect={autoSelect === undefined || autoSelect === null ? false : autoSelect}
      blurOnSelect={blurOnSelect === undefined || blurOnSelect === null ? false : blurOnSelect}
      clearIcon={clearIcon === undefined || clearIcon === null ? undefined : clearIcon}
      classes={classes === undefined || classes === null ? {} : classes}
      clearText={clearText === undefined || clearText === null ? 'Clear' : clearText}
      closeText={closeText === undefined || closeText === null ? 'Close' : closeText}
      id={id}
      defaultValue={defaultValue === undefined || defaultValue === null ? null : defaultValue}
      disableClearable={disableClearable === undefined || disableClearable === null ? false : disableClearable}
      disableCloseOnSelect={
        disableCloseOnSelect === undefined || disableCloseOnSelect === null ? false : disableCloseOnSelect
      }
      disabled={disabled === undefined || disabled === null ? false : disabled}
      disabledItemsFocusable={
        disabledItemsFocusable === undefined || disabledItemsFocusable === null ? false : disabledItemsFocusable
      }
      disableListWrap={disableListWrap === undefined || disableListWrap === null ? false : disableListWrap}
      filterOptions={filterOptions === undefined || filterOptions === null ? undefined : filterOptions}
      filterSelectedOptions={
        filterSelectedOptions === undefined || filterSelectedOptions === null ? false : filterSelectedOptions
      }
      forcePopupIcon={forcePopupIcon === undefined || forcePopupIcon === null ? 'auto' : forcePopupIcon}
      freeSolo={freeSolo === undefined || freeSolo === null ? false : freeSolo}
      fullWidth={fullWidth === undefined || fullWidth === null ? false : fullWidth}
      getOptionLabel={getOptionLabel === undefined || getOptionLabel === null ? undefined : getOptionLabel}
      groupBy={groupBy === undefined || groupBy === null ? undefined : groupBy}
      inputValue={inputValue}
      limitTags={limitTags === undefined || limitTags === null ? -1 : limitTags}
      loading={loading === undefined || loading === null ? false : loading}
      loadingText={loadingText === undefined || loadingText === null ? false : loadingText}
      multiple={multiple === undefined || multiple === null ? false : multiple}
      noOptionsText={noOptionsText === undefined || noOptionsText === null ? 'No options' : noOptionsText}
      onChange={onChange === undefined || onChange === null ? undefined : onChange}
      onClose={onClose === undefined || onClose === null ? undefined : onClose}
      openText={openText === undefined || openText === null ? 'Open' : openText}
      popupIcon={popupIcon === undefined || popupIcon === null ? undefined : popupIcon}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          FormHelperTextProps={FormHelperTextProps}
        />
      )}
      size={size === undefined || size === null ? 'medium' : size}
      value={value}
    />
  );
}

AutocompleteWidget.propTypes = {
  id: PropTypes.string,
  options: PropTypes.object,
  label: PropTypes.string,
  disablePortal: PropTypes.bool,
  autoCompleteOpt: PropTypes.bool,
  autoHighlight: PropTypes.bool,
  autoSelect: PropTypes.bool,
  blurOnSelect: PropTypes.bool,
  clearIcon: PropTypes.symbol,
  classes: PropTypes.object,
  clearText: PropTypes.string,
  closeText: PropTypes.string,
  defaultValue: PropTypes.string,
  disableClearable: PropTypes.bool,
  disableCloseOnSelect: PropTypes.symbol,
  disabled: PropTypes.symbol,
  disabledItemsFocusable: PropTypes.symbol,
  disableListWrap: PropTypes.symbol,
  filterOptions: PropTypes.object,
  filterSelectedOptions: PropTypes.object,
  forcePopupIcon: PropTypes.symbol,
  freeSolo: PropTypes.bool,
  fullWidth: PropTypes.string,
  getOptionLabel: PropTypes.func,
  groupBy: PropTypes.string,
  inputValue: PropTypes.string,
  limitTags: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  multiple: PropTypes.bool,
  noOptionsText: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  openText: PropTypes.string,
  popupIcon: PropTypes.symbol,
  size: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  FormHelperTextProps: PropTypes.object
};
