import { useTranslation } from 'react-i18next';
import { Typography, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CallIcon from '@mui/icons-material/Call';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import EvStationIcon from '@mui/icons-material/EvStation';
import BuildIcon from '@mui/icons-material/Build';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PanToolIcon from '@mui/icons-material/PanTool';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import NoCellIcon from '@mui/icons-material/NoCell';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { serviceTypes } from './data';
import { SERVICE_TYPES, ICON_COLOR } from '../../utils/constants';
import './ServiceBoard.css';

const ServiceTypes = () => {
  const { t } = useTranslation();
  const { ORANGE } = ICON_COLOR;
  const {
    COMPLETED,
    SCHEDULE,
    CANCELLED,
    REFILL,
    MAINTENANCE,
    CALL_OUT,
    AUDIT,
    GET_PERMIT,
    EARLY_MORNING_JOB,
    LATE_NIGHT_JOB,
    CUSTOM,
    CREDITHOLD,
    STOCKHOLD,
    CUSTOMERHOLD,
    PO_NEEDED,
    DEVICE_NOT_ALLOWED,
    ADDITIONAL_SERVICEMEN
  } = SERVICE_TYPES;

  const getServiceIcon = (icon) => {
    switch (icon) {
      case COMPLETED:
        return <CheckCircleIcon sx={{ color: 'rgb(0, 171, 85)' }} className="serviceTypeIcons" />;
      case SCHEDULE:
        return <AccessAlarmIcon className="serviceTypeIcons" />;
      case CUSTOM:
        return <AddCircleOutlineIcon className="serviceTypeIcons" />;
      case REFILL:
        return <EvStationIcon className="serviceTypeIcons" />;
      case MAINTENANCE:
        return <BuildIcon className="serviceTypeIcons" />;
      case CALL_OUT:
        return <CallIcon className="serviceTypeIcons" />;
      case AUDIT:
        return <HdrAutoIcon className="serviceTypeIcons" />;
      case CANCELLED:
        return <HighlightOffIcon className="serviceTypeIcons" sx={{ color: ORANGE }} />;
      case GET_PERMIT:
        return <AssignmentLateIcon className="serviceTypeIcons" />;
      case CREDITHOLD:
        return <MonetizationOnIcon color="error" className="serviceTypeIcons" />;
      case STOCKHOLD:
        return <ProductionQuantityLimitsIcon color="error" className="serviceTypeIcons" />;
      case CUSTOMERHOLD:
        return <PanToolIcon color="error" className="serviceTypeIcons" />;
      case EARLY_MORNING_JOB:
        return <LightModeIcon color="warning" className="serviceTypeIcons" />;
      case LATE_NIGHT_JOB:
        return <Brightness3Icon className="serviceTypeIcons" />;
      case PO_NEEDED:
        return <PendingActionsIcon color="info" className="serviceTypeIcons" />;
      case DEVICE_NOT_ALLOWED:
        return <NoCellIcon className="serviceTypeIcons" />;
      case ADDITIONAL_SERVICEMEN:
        return <PeopleOutlineIcon className="serviceTypeIcons" />;
      default:
        return '';
    }
  };

  return (
    <>
      <Grid container style={{ padding: 15 }} columns={{ xs: 5, sm: 5, md: 10 }}>
        {serviceTypes.map((service, index) => (
          <Grid item xs={1} sm={1} md={2} key={index}>
            <span>{getServiceIcon(service.type)}</span>
            <Typography variant="body2" gutterBottom ml="2rem" mr={1} mt="-1.6rem">
              {t(`serviceDashboard.${service.type}`)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ServiceTypes;
