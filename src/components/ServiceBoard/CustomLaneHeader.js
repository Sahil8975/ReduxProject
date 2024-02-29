import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Grid, Tooltip, Popover } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router';
import { isArray } from 'lodash';

import { COLOR_CODES } from './data';
import { THEME } from '../../utils/constants';
import useSettings from '../../hooks/useSettings';
import { ROUTES } from '../../routes/paths';

export default function CustomLaneHeader({ laneTitle, serviceMenOnLeave, scheduleDate }) {
  const { SERVICEORDERDETAILS } = ROUTES;
  const navigate = useNavigate();
  const { themeMode } = useSettings();
  const { DRK, LGT } = COLOR_CODES;

  const [colorCode, setColorCode] = useState(themeMode === THEME.LIGHT ? LGT : DRK);
  const {
    CARD: { BG, TXT }
  } = colorCode;

  const MAX_SHOW = 5;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => setColorCode(themeMode === THEME.LIGHT ? LGT : DRK), [themeMode]);

  const onHeaderClick = () => {
    const filterPayload = JSON.parse(localStorage.getItem('filterPayload'));
    navigate(SERVICEORDERDETAILS, {
      state: { scheduleDate, tabValue: 1, filterPayload }
    });
  };

  return (
    <Grid
      onClick={() => onHeaderClick()}
      className="custom-header-section"
      style={{ backgroundColor: BG, color: TXT, width: '100%' }}
    >
      <Tooltip title="Click to View Service Details" arrow>
        <header className="custom-header">{laneTitle}</header>
      </Tooltip>
      <Grid className="service-men-leave-block">
        {isArray(serviceMenOnLeave) && (
          <>
            {serviceMenOnLeave.slice(0, MAX_SHOW)?.map((men, ind) => (
              <Tooltip key={ind} title={men.name} arrow>
                <span
                  className="service-men-on-leave"
                  style={{ backgroundColor: men.colorCode, borderColor: men.colorCode }}
                />
              </Tooltip>
            ))}
            <ExpandMoreIcon className="show-more-icn" onClick={handleClick} style={{ color: TXT }} />
            <Popover
              id="more-servicemen"
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
            >
              {serviceMenOnLeave?.map((men, ind) => (
                <div key={ind} className="service-men-on-leave-popover">
                  <span
                    className="service-men-on-leave mr-half-rm inline-blk"
                    style={{ backgroundColor: men.colorCode, borderColor: men.colorCode }}
                  />
                  <span style={{ fontSize: '12px' }}>{men.name}</span>
                </div>
              ))}
            </Popover>
          </>
        )}
      </Grid>
    </Grid>
  );
}

CustomLaneHeader.propTypes = {
  laneTitle: PropTypes.string,
  serviceMenOnLeave: PropTypes.object
};
