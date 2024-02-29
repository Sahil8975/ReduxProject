// import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Grid,
  FormControlLabel,
  FormControl,
  Button,
  Checkbox,
  RadioGroup,
  Radio,
  Autocomplete,
  Box,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  FormHelperText,
  ListSubheader,
  Divider
} from '@mui/material';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import BasicDatePicker from './pickers/BasicDatePicker';
// import BasicDatePicker from '../components';
import { COMPONENTS } from '../utils/constants';
import { isArray } from '../utils/utils';
import useSettings from '../hooks/useSettings';

const {
  TEXT_FIELD,
  SELECT_BOX,
  CHECKBOX,
  RADIO,
  AUTOCOMPLETE,
  DATEPICKER,
  TEXT_AREA,
  MULTI_SELECT_BOX,
  BUTTON,
  TYPOGRAPHY,
  ICON,
  NONE
} = COMPONENTS;

const RenderComponent = ({ payload, metaData, ind, handleChange, deleteMltSlctOptn, handleBlur }) => {
  const { t } = useTranslation();
  const { lang } = useSettings();

  const createComponent = () => {
    const {
      control,
      isPasswordField = false,
      variant,
      key,
      showLabel = false,
      label,
      placeholder,
      size,
      options,
      labelStyle,
      controlStyle,
      groupStyle,
      select = false,
      fullWidth = true,
      columnWidth = 1.5,
      inputFormat = 'dd-MM-yyyy',
      views = ['year', 'month', 'day'],
      defaultValue = '',
      maxRows = 10,
      minRows = 4,
      menuProps = {},
      type = 'text',
      btnTitle,
      handleClickButton,
      iconSize,
      isDisabled = false,
      isError = false,
      helperText = false,
      isRequired = false,
      // handleBlur,
      endAdornmentData,
      isMultiline = false,
      textRows,
      tooltipTitle,
      placement,
      iconName,
      iconTitle = '',
      handleClickIcon,
      isSelecteAllAllow = true,
      isEmptyOptionAllowed = false,
      maxCharacterLimit,
      handleKeyDown,
      showTodayButton = true,
      disableFuture = false,
      disablePast = false,
      color,
      startIcon,
      minDate,
      maxDate,
      labelPlacement,
      autoCompleteDisplayKey,
      multiple = true,
      maxMultipleOptions = 100,
      selectAll = false,
      selectAllLabel = 'Select All',
      textTransform,
      payloadStyle,
      name,
      shouldDisableDate,
      displayKey = 'name',
      secondDate,
      secondLabel,
      isSecondDate = false,
      addNewData = false
    } = metaData;

    const getCharacters = (value) => (maxCharacterLimit ? value?.toString()?.slice(0, maxCharacterLimit) : value);
    const keyDownHandler = (e) => {
      if (handleKeyDown && e.key === 'Enter') {
        handleKeyDown(e);
      }
    };
    switch (control) {
      case TEXT_FIELD:
      case SELECT_BOX:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            {showLabel && <FormLabel style={labelStyle}>{t([label])}</FormLabel>}
            <Tooltip title={tooltipTitle || ''} placement={placement}>
              <TextField
                id={key}
                variant={variant || 'outlined'}
                size={size || 'small'}
                type={isPasswordField ? 'password' : type}
                select={select}
                fullWidth={fullWidth}
                label={label && t([label] || '')}
                placeholder={placeholder && t([placeholder] || '')}
                // SelectProps={{ native: true }}
                onChange={(e) => handleChange(key, e.target.value, ind)}
                onBlur={(e) => handleBlur && handleBlur(key, e.target.value, ind)}
                onKeyDown={(e) => keyDownHandler(e)}
                value={(payload && payload[key]) || ''}
                style={{
                  ...controlStyle,
                  fontSize: key === 'customerArabicName' ? '1.2rem' : '0.8rem',
                  fontFamily: key === 'customerArabicName' ? 'Times New Roman' : 'Montserrat'
                }}
                disabled={isDisabled}
                error={isError}
                helperText={isError && helperText}
                required={isRequired}
                autoComplete="off"
                onInput={(e) => {
                  e.target.value = getCharacters(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span style={{ fontSize: '0.8rem' }}>{endAdornmentData}</span>
                    </InputAdornment>
                  ),
                  style: {
                    fontSize: key === 'customerArabicName' ? '1.2rem' : 'inherit',
                    fontFamily: key === 'customerArabicName' ? 'Times New Roman' : 'Montserrat'
                  }
                }}
                multiline={isMultiline}
                rows={textRows}
                InputLabelProps={{ shrink: (payload && payload[key]) || false }}
                SelectProps={{
                  style: { height: '2.2rem' }
                }}
              >
                {isEmptyOptionAllowed && <MenuItem key={key} value="" />}
                {isSelecteAllAllow && (
                  <MenuItem key={key} value="all">
                    --
                  </MenuItem>
                )}
                {isArray(options) &&
                  options.map((item) => (
                    <MenuItem
                      style={{ fontSize: '0.8rem', fontStyle: item.isOnLeave ? 'italic' : '' }}
                      key={item.id}
                      disabled={item.isDisabled}
                      value={item.id.toString()}
                    >
                      {item.isOnLeave ? <em> {item[displayKey]}</em> : item[displayKey]}
                    </MenuItem>
                  ))}
              </TextField>
            </Tooltip>
          </Grid>
        );
      case CHECKBOX:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <Tooltip title={tooltipTitle || ''}>
              <FormControlLabel
                label={label && t([label] || '')}
                labelPlacement={labelPlacement || 'end'}
                control={
                  <Checkbox
                    style={{ ...controlStyle }}
                    checked={(payload && payload[key]) || false}
                    onChange={(e) => handleChange(key, e.target.checked, ind)}
                    disabled={isDisabled}
                    required={isRequired}
                    error={isError}
                    helperText={isError && helperText}
                  />
                }
              />
            </Tooltip>
          </Grid>
        );
      case RADIO:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <FormControl component="fieldset" error={isError}>
              <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                {showLabel && (
                  <Typography variant="subtitle2" style={{ marginRight: '1rem', ...labelStyle }}>
                    {label}
                    {(isRequired && '*') || ''}
                  </Typography>
                )}
                <RadioGroup
                  row
                  aria-label={label}
                  value={(payload && payload[key]) || ''}
                  name="row-radio-buttons-group"
                  onChange={(e) => handleChange(key, e.target.value, ind)}
                  required={isRequired}
                  error={isError}
                  helperText={isError && helperText}
                >
                  {options?.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      disabled={isDisabled || item.isDisabled}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
                </RadioGroup>
              </Grid>
              {isError && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
          </Grid>
        );
      case AUTOCOMPLETE: {
        const val =
          (payload && payload[key] && isArray(options) && options?.find((v) => payload[key]?.id === v.id)) || null;
        return (
          <Grid item xs={12} sm={columnWidth} key={`${key}-${ind}`} style={{ ...groupStyle }}>
            <Tooltip title={(val && (autoCompleteDisplayKey ? val[autoCompleteDisplayKey] : val?.name)) || ''}>
              <Autocomplete
                id={key}
                options={options}
                getOptionLabel={(option) =>
                  (autoCompleteDisplayKey && option[autoCompleteDisplayKey]) || option?.name || ''
                }
                onInputChange={(event, newInputValue, reason) => {
                  if (event) {
                    if (addNewData) {
                      handleChange(key, event.target.value, ind);
                    } else if (reason === 'clear' || !newInputValue) {
                      handleChange(key, '', ind);
                    }
                  } else {
                    handleChange(key, '', ind);
                  }
                }}
                onChange={(e, val) => val && handleChange(key, val, ind)}
                onKeyDown={(e) => keyDownHandler(e)}
                value={val}
                freeSolo={addNewData}
                renderOption={(props, option) => (
                  <>
                    <Box
                      component="li"
                      sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                      {...props}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {(autoCompleteDisplayKey && option[autoCompleteDisplayKey]) || option.name}
                    </Box>
                  </>
                )}
                disabled={isDisabled}
                size={size || 'small'}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    fullWidth={fullWidth}
                    placeholder={placeholder && t([placeholder] || '')}
                    SelectProps={{ native: true }}
                    variant={variant || 'outlined'}
                    {...params}
                    label={label && t([label] || '')}
                    inputProps={{
                      ...params.inputProps
                      // Add the onChange event handler here
                      // onChange: (e) => handleChange(key, e.target.value, ind)
                    }}
                    error={isError}
                    helperText={isError && helperText}
                    required={isRequired}
                  />
                )}
              />
            </Tooltip>
          </Grid>
        );
      }
      case DATEPICKER:
        return (
          <Grid item xs={12} sm={columnWidth} key={`${key}-${ind}`} style={{ ...groupStyle }}>
            <BasicDatePicker
              size={size || 'small'}
              label={label && t([label] || '')}
              onChange={(e) => handleChange(key, e.target.value, ind)}
              inputFormat={inputFormat}
              views={views}
              value={(payload && payload[key]) || ''}
              getSelectedDate={() => null}
              getIsoDate={(dt) => handleChange(key, dt, ind)}
              isRequired={isRequired}
              error={isError}
              helperText={isError && helperText}
              showTodayButton={showTodayButton}
              disableFuture={disableFuture}
              disablePast={disablePast}
              disabled={isDisabled}
              minDate={minDate}
              maxDate={maxDate}
              shouldDisableDate={shouldDisableDate}
              secondDate={secondDate}
              secondLabel={secondLabel}
              isSecondDate={isSecondDate}
            />
          </Grid>
        );
      case TEXT_AREA:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <TextareaAutosize
              maxRows={maxRows}
              minRows={minRows}
              aria-label={label && t([label] || '')}
              placeholder={placeholder && t([placeholder] || '')}
              defaultValue={defaultValue}
              style={controlStyle}
              onChange={(e) => handleChange(key, e.target.value, ind)}
              error={isError}
              helperText={isError && helperText}
            />
          </Grid>
        );
      case MULTI_SELECT_BOX:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel error={isError} style={labelStyle} id={`${key}-chip-label`} required={isRequired}>
                {label && t([label] || '')}
              </InputLabel>
              <Select
                labelId={`${key}-chip-label`}
                id={`${key}-chip-id`}
                multiple={multiple}
                value={(payload && payload[key]) || []}
                onChange={(e) => handleChange(key, e.target.value, ind)}
                onBlur={(e) => handleBlur && handleBlur(key, e.target.value, ind)}
                input={<OutlinedInput id={`${key}-select-chip-id`} label={t([label])} />}
                error={isError}
                helperText={isError && helperText}
                required={isRequired}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(isArray(selected) && (
                      <>
                        {selected?.slice(0, maxMultipleOptions).map((item) => (
                          <Chip
                            key={item.name}
                            label={item.name}
                            onMouseDown={(e) => e.stopPropagation()}
                            onDelete={(e) => deleteMltSlctOptn(key, item.id, ind)}
                          />
                        ))}
                        {maxMultipleOptions < selected.length && (
                          <span style={{ marginTop: '0.5rem' }}>+{selected.length - maxMultipleOptions} more</span>
                        )}
                      </>
                    )) ||
                      (selected && (
                        <Chip
                          key={selected.name}
                          label={selected.name}
                          onMouseDown={(e) => e.stopPropagation()}
                          onDelete={(e) => deleteMltSlctOptn(key, selected.id, ind)}
                        />
                      )) || <></>}
                  </Box>
                )}
                MenuProps={menuProps}
                style={{ controlStyle, height: '2.2rem' }}
                disabled={isDisabled}
              >
                {options.length > 0 && selectAll && (
                  <MenuItem
                    key={`${ind}-all`}
                    value={(payload[key] && options.length === payload[key].length && 'deselectAll') || 'selectAll'}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {(payload[key] && options.length === payload[key].length && 'Deselect All') || 'Select All'}
                  </MenuItem>
                )}
                {options?.map((item, ind) => (
                  <MenuItem
                    key={`${item}-${ind}`}
                    value={item}
                    style={{ fontSize: '0.8rem', height: '2rem', fontStyle: item.isOnLeave ? 'italic' : '' }}
                  >
                    {(multiple && (
                      <FormControlLabel
                        label={item.name}
                        htmlFor={item.id}
                        labelPlacement="end"
                        control={
                          <Checkbox
                            inputid={item?.id}
                            checked={
                              (payload &&
                                isArray(payload[key]) &&
                                payload[key].map((item) => item?.id).includes(item?.id)) ||
                              false
                            }
                          />
                        }
                      />
                    )) ||
                      item.name}
                  </MenuItem>
                ))}
              </Select>
              {isError && <FormHelperText error>{helperText}</FormHelperText>}
            </FormControl>
          </Grid>
        );
      case BUTTON:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <Tooltip title={tooltipTitle || btnTitle || ''}>
              <Button
                disabled={isDisabled}
                fullWidth={fullWidth}
                size="medium"
                variant="outlined"
                name={name || ''}
                sx={{
                  height: '1.8rem',
                  borderRadius: 28,
                  ':hover': {
                    bgcolor: color === 'success' ? 'primary.main' : 'warning.main',
                    color: 'white'
                  },
                  textTransform,
                  fontFamily: 'Montserrat'
                }}
                onClick={handleClickButton}
                color={color}
                startIcon={startIcon}
              >
                {btnTitle}
              </Button>
            </Tooltip>
          </Grid>
        );
      case TYPOGRAPHY:
        return (
          <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`}>
            <Typography
              sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem', fontWeight: 'bold', color: isError ? 'red' : '' }}
            >
              {label || ''}
            </Typography>
            <Typography style={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: '#637381', ...payloadStyle }}>
              {(payload && payload[key]) || ''}
            </Typography>
          </Grid>
        );
      case ICON:
        return (
          <>
            <Tooltip title={tooltipTitle || ''} placement={placement}>
              <IconButton
                onClick={() => handleClickIcon(key, ind)}
                aria-label={tooltipTitle || ''}
                style={{ ...groupStyle }}
                color={color || 'inherit'}
                disabled={isDisabled}
                size={iconSize}
              >
                {iconName} <Typography variant="subtitle2">{iconTitle}</Typography>
              </IconButton>
            </Tooltip>
            {label && <Typography variant="subtitle2">{label}</Typography>}
          </>
        );
      case NONE:
        return <Grid item xs={12} sm={columnWidth} style={{ ...groupStyle }} key={`${key}-${ind}`} />;
      default:
        return '';
    }
  };

  return createComponent();
};

export default RenderComponent;
