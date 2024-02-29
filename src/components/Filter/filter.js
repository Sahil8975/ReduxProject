import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { isArray } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Grid, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import useSettings from '../../hooks/useSettings';
import { THEME, COMPONENTS } from '../../utils/constants';
import { COLOR_CODES } from '../ServiceBoard/data';
import RenderComponent from '../RenderComponent';

import '../ServiceBoard/ServiceBoard.css';

export default function Filters({
  components,
  getFilterData,
  getFilterDataPayloadChange,
  displayBorder = true,
  payload,
  setPayload,
  emptyFilters,
  deleteMltSlctOptn,
  isDisabled = false
}) {
  const { t } = useTranslation();
  const { themeMode } = useSettings();
  const [open, setOpen] = useState(true);
  const { DRK, LGT } = COLOR_CODES;
  const { BUTTON } = COMPONENTS;
  const {
    FILTER_BOX: { BORDER }
  } = themeMode === THEME.LIGHT ? LGT : DRK;

  const handleChange = (key, val) => {
    setPayload({ ...payload, [key]: val });
    getFilterDataPayloadChange(key, val);
  };

  const handleClick = () => setOpen(!open);

  const handleClearFilters = () => {
    setPayload({ ...emptyFilters });
    getFilterData({}, false);
  };
  const handleGetData = () => {
    const isClearBtnClicked = document?.activeElement?.value === 'clear';
    const callApi =
      !isClearBtnClicked &&
      Object.keys(payload).some((ky) =>
        payload[ky] && typeof payload[ky] === 'object' ? payload[ky].length > 0 : payload[ky]
      );
    getFilterData(payload, callApi);
  };

  const listener = (event) => {
    if (event.code === 'Enter') {
      const isPopUpExist = Array.from(document.getElementsByClassName('MuiDialogContent-root')).length > 0;
      if (!isPopUpExist && document?.activeElement?.id && document?.activeElement?.id !== 'shortName') {
        handleGetData();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [payload]);

  return (
    <div className={displayBorder ? 'filter-section' : ''} style={{ borderColor: BORDER }}>
      {!open && <ArrowRightIcon onClick={handleClick} />}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {isArray(components) && (
          <Grid container mb={1}>
            {open && <ArrowDropDownIcon onClick={handleClick} />}
            {components?.map((comp, ind) => (
              <RenderComponent
                key={ind}
                metaData={comp}
                payload={payload}
                ind={ind}
                handleChange={handleChange}
                deleteMltSlctOptn={deleteMltSlctOptn}
              />
            ))}
            <Grid
              className="filter-button-show"
              style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.1rem' }}
            >
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  color: 'success',
                  size: 'small',
                  groupStyle: {
                    display: 'inline-table',
                    minWidth: '6.5rem',
                    marginRight: '1rem',
                    marginLeft: '0.5rem'
                  },
                  btnTitle: 'Filter',
                  handleClickButton: () => handleGetData(),
                  isDisabled,
                  startIcon: <SearchIcon style={{ fontSize: '18px' }} />
                }}
              />

              <RenderComponent
                metaData={{
                  control: BUTTON,
                  color: 'success',
                  size: 'small',
                  value: 'clear',
                  btnTitle: 'Clear',
                  groupStyle: { display: 'inline-table', minWidth: '6.5rem' },
                  handleClickButton: () => handleClearFilters(),
                  isDisabled,
                  startIcon: <ClearIcon style={{ fontSize: '18px' }} />
                }}
              />
            </Grid>
          </Grid>
        )}
      </Collapse>
    </div>
  );
}

Filters.propTypes = {
  components: PropTypes.object,
  getFilterData: PropTypes.func,
  getFilterDataPayloadChange: PropTypes.func,
  displayBorder: PropTypes.bool,
  payload: PropTypes.object,
  setPayload: PropTypes.object,
  emptyFilters: PropTypes.object,
  deleteMltSlctOptn: PropTypes.func,
  isDisabled: PropTypes.bool
};
