import * as React from 'react';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function RatingsWidget({
  name,
  precision,
  disabled,
  defaultValue,
  emptyIcon,
  emptyLabelText,
  icon,
  max,
  size,
  onChange
}) {
  return (
    <Stack spacing={1}>
      <Rating
        defaultValue={defaultValue === undefined || defaultValue === null ? 0 : defaultValue}
        precision={precision === undefined || precision === null ? 1 : precision}
        emptyIcon={emptyIcon === undefined || emptyIcon === null ? undefined : emptyIcon}
        emptyLabelText={emptyLabelText === undefined || emptyLabelText === null ? 'Empty' : emptyLabelText}
        icon={icon === undefined || icon === null ? undefined : icon}
        disabled={disabled === undefined || disabled === null ? false : disabled}
        max={max === undefined || max === null ? 7 : max}
        size={size === undefined || size === null ? 'medium' : size}
        name={name}
        onChange={onChange}
      />
    </Stack>
  );
}

RatingsWidget.propTypes = {
  name: PropTypes.string,
  precision: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  emptyIcon: PropTypes.symbol,
  emptyLabelText: PropTypes.string,
  icon: PropTypes.symbol,
  max: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func
};
