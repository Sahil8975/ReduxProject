import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Chip,
  Checkbox,
  Select,
  ListSubheader,
  OutlinedInput,
  Box
} from '@material-ui/core';
import { isArray } from '../utils/utils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  variant: 'menu',
  getContentAnchorEl: null
};

const GroupedMultiSelect = ({ data, childKey, label, getIds, isError, errorText, isRequired, values = [] }) => {
  const [nameChips, setNameChips] = useState(values);
  const [ids, setSelectedIds] = useState([]);
  const [names, setSelectedNames] = useState([]);
  const menuItems = [];

  /* eslint prefer-arrow-callback: [ "error", { "allowNamedFunctions": true } ] */
  const MenuItemWithCheckbox = React.forwardRef(function MenuItemWithCheckbox(
    { children, selected, em = false, ...other },
    ref
  ) {
    return (
      <MenuItem {...other} selected={selected} ref={ref}>
        <Checkbox checked={selected} />
        {em && <em>{children}</em>}
        {!em && children}
      </MenuItem>
    );
  });

  MenuItemWithCheckbox.propTypes = {
    children: PropTypes.object,
    selected: PropTypes.string,
    em: PropTypes.string
  };

  (function () {
    if (isArray(data)) {
      data?.forEach((item) => {
        menuItems.push(
          <ListSubheader key={item.id} style={{ color: 'black', fontWeight: 'bold' }}>
            {item.name}
          </ListSubheader>
        );
        item[childKey].forEach((chldItem) => {
          menuItems.push(
            <MenuItemWithCheckbox key={chldItem.id} value={chldItem} style={{ fontSize: 13 }}>
              {chldItem.name}
            </MenuItemWithCheckbox>
          );
        });
      });
    }
  })();

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    const tempIds = [];
    const tempNames = [];
    if (isArray(value)) {
      value.forEach((val) => {
        const { id, name } = val;
        if (id && name) {
          tempIds.push(id);
          tempNames.push(name);
        }
      });
    }
    setSelectedIds(tempIds);
    setSelectedNames(tempNames);

    setNameChips(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  useEffect(() => getIds(ids, names), [ids, names]);

  useEffect(() => {
    setTimeout(() => {
      setNameChips([...values]);
    }, 10);
  }, [values]);

  return (
    <div>
      <FormControl sx={{ m: 0, width: '200%' }} error={isError}>
        <InputLabel id="grouped-multiselect">{label}</InputLabel>
        <Select
          labelId="grouped-multiselect"
          id="grouped-multiselect-chip"
          multiple
          value={nameChips}
          onChange={handleChange}
          error={isError}
          helperText={errorText}
          required={isRequired}
          input={<OutlinedInput id="select-multiple-chip" label={label} color="success" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected?.map((value) => (
                <Chip key={value.id} label={value.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {menuItems}
        </Select>
        {isError && <FormHelperText error>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

GroupedMultiSelect.propTypes = {
  data: PropTypes.object,
  childKey: PropTypes.string,
  label: PropTypes.string,
  getIds: PropTypes.func,
  isError: PropTypes.bool,
  errorText: PropTypes.bool,
  isRequired: PropTypes.bool,
  values: PropTypes.object
};

export default GroupedMultiSelect;
