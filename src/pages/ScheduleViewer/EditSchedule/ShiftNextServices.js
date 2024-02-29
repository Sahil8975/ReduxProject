import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Grid, Container, Typography, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RenderComponent from '../../../components/RenderComponent';
import { COMPONENTS } from '../../../utils/constants';

import './ShiftNextServices.scss';
import { isArray } from '../../../utils/utils';

function ShiftNextServices({
  shiftDatesToKeep,
  uncheckedDates,
  setUncheckedDates,
  checkedDates,
  setCheckedDates,
  datesToPass,
  setDatesToPass,
  dateAllowToBeShifted,
  isEditShiftDate
}) {
  const maxDatesForSingleColumn = 9;
  const [part, setPart] = useState('');
  const [sortDates, setSortDates] = useState([]);
  const [datesPart, setDatesPart] = useState({
    firstPart: [],
    secondPart: [],
    thirdPart: []
  });
  const { BUTTON } = COMPONENTS;
  const { firstPart, secondPart, thirdPart } = datesPart;

  const handleChecked = (id) => (e) => {
    let tempIds = [];
    let tempPassIds = [];
    if (isEditShiftDate) {
      if (e.target.checked) {
        tempIds = [...checkedDates, id];
        tempPassIds = [...datesToPass, id];
      } else {
        tempIds = checkedDates.filter((ids) => ids !== id);
        tempPassIds = datesToPass.filter((ids) => ids !== id);
        const uncheckedIds = (isArray(shiftDatesToKeep) && shiftDatesToKeep.filter((itm) => itm.id === id)) || [];
        setUncheckedDates([...uncheckedDates, ...uncheckedIds]);
      }
      setCheckedDates([...tempIds]);
      setDatesToPass([...tempPassIds]);
    } else {
      if (!e.target.checked) {
        tempIds = checkedDates.filter((ids) => ids !== id);
        tempPassIds = datesToPass.filter((ids) => ids !== id);
        const uncheckedIds = (isArray(shiftDatesToKeep) && shiftDatesToKeep.filter((itm) => itm.id === id)) || [];
        setUncheckedDates([...uncheckedDates, ...uncheckedIds]);
      } else {
        tempIds = [...checkedDates, id];
        tempPassIds = [...datesToPass, id];
      }
      setCheckedDates([...tempIds]);
      setDatesToPass([...tempPassIds]);
    }
  };

  useEffect(() => {
    const datesToMap = isArray(dateAllowToBeShifted) ? dateAllowToBeShifted : uncheckedDates;
    const sortedDates = _.sortBy(datesToMap, (element) => moment(element.scheduleDate, 'ddd DD-MM-YYYY'));
    setSortDates(sortedDates);
    const sortedDateCount = sortedDates.length;
    if (sortedDateCount <= maxDatesForSingleColumn) {
      setPart('onePart');
    } else if (sortedDateCount <= maxDatesForSingleColumn * 2 * 1) {
      setPart('twoPart');
    } else {
      setPart('threePart');
    }
  }, []);

  useEffect(() => {
    if (part === 'onePart') {
      return;
    }
    if (part === 'threePart') {
      const maxPerColumn = Math.floor(sortDates.length / 3);
      const extraDates = sortDates.length % 3;
      setDatesPart({
        firstPart: sortDates.splice(0, maxPerColumn + (extraDates > 0 ? 1 : 0)),
        secondPart: sortDates.splice(0, maxPerColumn + (extraDates > 1 ? 1 : 0)),
        thirdPart: sortDates
      });
    } else if (part === 'twoPart') {
      const maxPerColumn = Math.floor(sortDates.length / 2);
      const extraDates = sortDates.length % 2;
      setDatesPart({
        firstPart: sortDates.splice(0, maxPerColumn + (extraDates > 0 ? 1 : 0)),
        secondPart: sortDates
      });
    }
  }, [part]);

  const getDateColums = (val, i) => (
    <Grid key={i} item xs={12} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', height: '3rem' }}>
      <FormControlLabel
        key={i}
        control={
          <Checkbox
            color="primary"
            checked={checkedDates.includes(val.id) || false}
            onClick={handleChecked(val.id)}
            size="small"
          />
        }
      />
      <Typography variant="body1" sx={{ mr: 1 }}>
        {val.scheduleDate}
      </Typography>
      <Typography variant="body1" sx={{ mr: 1 }}>
        {val.serviceManName}
      </Typography>
      <Typography variant="body1">{val.preferredTimingName || ''}</Typography>
      {val.isCustomTaskPresent ? (
        <Tooltip title={val.customTaskNames} placement="right">
          <AddCircleOutlineIcon style={{ marginLeft: '0.5rem' }} />
        </Tooltip>
      ) : null}
    </Grid>
  );

  return (
    <Container>
      <Grid item xs={12}>
        {!isArray(sortDates) && (
          <Typography variant="body2" align="center" mt={1} mb={1}>
            No Dates to Select
          </Typography>
        )}
        {part === 'onePart' && (
          <Grid container direction="row" justifyContent="center" alignItems="baseline">
            <Grid item xs={4.5} />
            <Grid item xs={5}>
              {isArray(sortDates) && sortDates.map((val, i) => getDateColums(val, i))}
            </Grid>
            <Grid item xs={2.5} />
          </Grid>
        )}
        {part === 'twoPart' && (
          <Grid container direction="row" justifyContent="center" alignItems="baseline">
            <Grid item xs={5}>
              {isArray(firstPart) && firstPart.map((val, i) => getDateColums(val, i))}
            </Grid>
            <Grid item xs={5}>
              {isArray(secondPart) && secondPart.map((val, i) => getDateColums(val, i))}
            </Grid>
          </Grid>
        )}
        {part === 'threePart' && (
          <Grid container direction="row" justifyContent="center" alignItems="baseline">
            <Grid item xs={4}>
              {isArray(firstPart) && firstPart.map((val, i) => getDateColums(val, i))}
            </Grid>
            <Grid item xs={4}>
              {isArray(secondPart) && secondPart.map((val, i) => getDateColums(val, i))}
            </Grid>
            <Grid item xs={4}>
              {isArray(thirdPart) && thirdPart.map((val, i) => getDateColums(val, i))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default ShiftNextServices;
