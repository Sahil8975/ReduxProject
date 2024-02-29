import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

import './ServiceBoard.css';
import { COLOR_CODES } from './data';
import { THEME } from '../../utils/constants';
import { isArray } from '../../utils/utils';
import useSettings from '../../hooks/useSettings';

const ServiceMens = ({ servicemenList }) => {
  const theme = useTheme();
  const { themeMode } = useSettings();
  const backgroundColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const { DRK, LGT } = COLOR_CODES;

  const [servicemen, setServiceMen] = useState([]);
  const [isServicemensFound, setIsServicemensFound] = useState(false);
  const [colorCode, setColorCode] = useState(themeMode === THEME.LIGHT ? LGT : DRK);
  const {
    SERVICEMAN: { TEXT }
  } = colorCode;

  useEffect(() => setColorCode(themeMode === THEME.LIGHT ? LGT : DRK), [themeMode]);
  useEffect(() => {
    setServiceMen(servicemenList);
    setIsServicemensFound(isArray(servicemenList));
  }, []);

  return (
    <>
      <Grid container columns={{ xs: 5, sm: 5, md: 12 }}>
        <Grid style={{ margin: isServicemensFound ? '0.3rem' : '1rem' }} xs={12} sm={12}>
          <Typography variant="h6">{`${isServicemensFound ? '' : 'No Servicemen found'}`}</Typography>
        </Grid>
        {isServicemensFound && (
          <>
            {servicemen?.map((men, index) => (
              <Grid xs={1} sm={1} md={3} key={index} className="service-men-column">
                <span
                  className="service-men-clr"
                  style={{ backgroundColor: men.backColor || backgroundColor, borderColor: men.backColor || color }}
                />
                <Typography variant="body2" gutterBottom ml="2rem" mr={1} mt="-1.6rem" style={{ color: TEXT }}>
                  {men.name}
                </Typography>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  );
};

export default ServiceMens;
