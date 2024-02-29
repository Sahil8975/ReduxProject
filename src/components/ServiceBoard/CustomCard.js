import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Typography,
  DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
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
import EditSchedule from '../../pages/ScheduleViewer/EditSchedule/EditSchedule';
import { COLOR_CODES } from './data';
import { THEME, ICON_COLOR, COMPONENTS } from '../../utils/constants';
import useSettings from '../../hooks/useSettings';
import { ROUTES } from '../../routes/paths';

import { MovableCardWrapper } from './styles/Base';
import useBoolean from '../../hooks/useBoolean';
import RenderComponent from '../RenderComponent';

export default function CustomCard({
  onClick,
  className,
  servicemanName,
  previousPerformedServiceDate,
  numberOfDaysOverdue,
  service,
  cardColor,
  textColor,
  serviceOrderId,
  locationName,
  customerName,
  contract,
  contractId,
  contractNumber,
  contractName,
  contractSignedOn,
  projectNumber,
  project,
  projectStatus,
  additionalEmails,
  projectId,
  projectName,
  projectSignedOn,
  projectRenewedOn,
  salesmanName,
  contactDetails,
  projectNote,
  scheduleDate,
  preferredTimingId,
  serviceOrderStatusId,
  servicemanId,
  serviceOrderNumber,
  projectEndDate,
  callGetScheduleOrders,
  regionId
}) {
  const { t } = useTranslation();
  const { themeMode } = useSettings();
  const { DRK, LGT } = COLOR_CODES;
  const { ORANGE } = ICON_COLOR;
  const [open, setOpen] = useBoolean(false);
  const theme = useTheme();
  const childRef = useRef();
  const [colorCode, setColorCode] = useState(themeMode === THEME.LIGHT ? LGT : DRK);
  const {
    CARD: { BG, TXT }
  } = colorCode;
  const [isEditScheduleDisable, setIsEditScheduleDisable] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const { BUTTON } = COMPONENTS;

  useEffect(() => setColorCode(themeMode === THEME.LIGHT ? LGT : DRK), [themeMode]);
  const handleClickOpen = () => {
    const editScheduleData = JSON.parse(localStorage.getItem('filterPayload'));
    localStorage.setItem('editSchedData', JSON.stringify(editScheduleData));
    setOpen.on();
  };

  const myCloseModal = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleCloseButton();
    handleClose();
  };

  const handleCloseButton = () => {
    childRef.current.handleCloseButton();
  };

  const handleClose = () => {
    setOpen.off();
    isDataLoaded(false);
    callGetScheduleOrders();
  };

  const toEditSchedule = {
    serviceOrderId,
    previousPerformedServiceDate,
    locationName,
    customerName,
    contract,
    contractId,
    contractNumber,
    contractName,
    contractSignedOn,
    projectNumber,
    project,
    projectStatus,
    additionalEmails,
    projectId,
    projectName,
    projectSignedOn,
    projectRenewedOn,
    salesmanName,
    contactDetails,
    projectNote,
    scheduleDate,
    preferredTimingId,
    serviceOrderStatusId,
    servicemanId,
    serviceOrderNumber,
    projectEndDate,
    regionId
  };

  const handleIsDisable = (state) => setIsEditScheduleDisable(state);

  const isDataLoaded = (state) => setBtnVisible(state);

  const handleSaveSchedule = () => {
    childRef.current.saveAndClose();
  };

  const dialogActionsBtns = [
    {
      control: BUTTON,
      groupStyle: { marginRight: '1rem' },
      btnTitle: 'Close',
      color: 'warning',
      handleClickButton: () => handleCloseButton(),
      columnWidth: 0.8
    },
    {
      control: BUTTON,
      btnTitle: 'Save & Close',
      color: 'success',
      handleClickButton: () => handleSaveSchedule(),
      isDisabled: isEditScheduleDisable,
      columnWidth: 1.3
    }
  ];

  // const navigateToEditSchedule = () => {
  //   const editScheduleData = JSON.parse(localStorage.getItem('filterPayload'));
  //   localStorage.setItem('editSchedData', JSON.stringify(editScheduleData));
  //   navigate(ROUTES.EDIT_SCHEDULE, { state: toEditSchedule }, { replace: true });
  // };

  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            maxWidth: '100%',
            maxHeight: '90%'
          }
        }}
        open={open}
        onClose={myCloseModal}
      >
        <DialogTitle>
          <Typography fontWeight="Bold" variant="subtitle1">
            Edit Schedule : {serviceOrderNumber}
          </Typography>
          <IconButton
            sx={{
              position: 'absolute',
              right: 5,
              top: 5
            }}
            onClick={handleCloseButton}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditSchedule
            displayData={toEditSchedule}
            handleClose={handleClose}
            handleCloseButton={handleCloseButton}
            saveAndClose={handleSaveSchedule}
            onDisablePage={handleIsDisable}
            isDataLoaded={isDataLoaded}
            childRef={childRef}
          />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'end', visibility: btnVisible ? 'visible' : 'hidden' }}
            >
              {dialogActionsBtns?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} ind={ind} />
              ))}
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <MovableCardWrapper
        onClick={onClick}
        style={{ cardColor, backgroundColor: BG, color: TXT, borderRadius: 6 }}
        className={className}
      >
        <header
          className="custom-card-header"
          style={{
            backgroundColor: cardColor,
            color: textColor
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>{servicemanName}</div>
          {/* {showDeleteButton && <DeleteButton onClick={clickDelete} />} */}
        </header>
        <Grid className="custom-card-section">
          <Grid
            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
            // onClick={navigateToEditSchedule}
            onClick={() => handleClickOpen()}
          >
            <Grid mr={0.5}>
              <Tooltip title={t('serviceDashboard.lastServiceDate')} arrow>
                <span>{previousPerformedServiceDate}</span>
              </Tooltip>
            </Grid>
            <Grid>
              <Tooltip title={t('serviceDashboard.overdueDays')} arrow>
                <span>[{numberOfDaysOverdue}]</span>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid>
            <span style={{ visibility: 'hidden' }}>''</span>
            {service?.audit && (
              <Tooltip title={t('serviceDashboard.audit')} arrow>
                <span className="service-type-icons">
                  <HdrAutoIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.credithold && (
              <Tooltip title={t('serviceDashboard.credithold')} arrow>
                <span className="service-type-icons">
                  <MonetizationOnIcon className="service-icon" color="error" />
                </span>
              </Tooltip>
            )}
            {service?.stockhold && (
              <Tooltip title={t('serviceDashboard.stockhold')} arrow>
                <span className="service-type-icons">
                  <ProductionQuantityLimitsIcon className="service-icon" color="error" />
                </span>
              </Tooltip>
            )}
            {service?.customerhold && (
              <Tooltip title={t('serviceDashboard.customerhold')} arrow>
                <span className="service-type-icons">
                  <PanToolIcon className="service-icon" color="error" />
                </span>
              </Tooltip>
            )}
            {service?.custom && (
              <Tooltip title={t('serviceDashboard.custom')} arrow>
                <span className="service-type-icons">
                  <AddCircleOutlineIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.maintenance && (
              <Tooltip title={t('serviceDashboard.maintenance')} arrow>
                <span className="service-type-icons">
                  <BuildIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.refill && (
              <Tooltip title={t('serviceDashboard.refill')} arrow>
                <span className="service-type-icons">
                  <EvStationIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.callOut && (
              <Tooltip title={t('serviceDashboard.callOut')} arrow>
                <span className="service-type-icons">
                  <CallIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.scheduled && (
              <Tooltip title={t('serviceDashboard.scheduled')} arrow>
                <span className="service-type-icons">
                  <AccessAlarmIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.complete && (
              <Tooltip title="Completed" arrow>
                <span className="service-type-icons">
                  <CheckCircleIcon className="service-icon" sx={{ color: 'rgb(0, 171, 85)' }} />
                </span>
              </Tooltip>
            )}
            {service?.cancelled && (
              <Tooltip title={t('serviceDashboard.cancelled')} arrow>
                <span className="service-type-icons">
                  <HighlightOffIcon className="service-icon" sx={{ color: ORANGE }} />
                </span>
              </Tooltip>
            )}
            {service?.getPermit && (
              <Tooltip title={t('serviceDashboard.getPermit')} arrow>
                <span className="service-type-icons">
                  <AssignmentLateIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.earlymorningJob && (
              <Tooltip title={t('serviceDashboard.earlymorningJob')} arrow>
                <span className="service-type-icons">
                  <LightModeIcon className="service-icon" color="warning" />
                </span>
              </Tooltip>
            )}
            {service?.latenightJob && (
              <Tooltip title={t('serviceDashboard.latenightJob')} arrow>
                <span className="service-type-icons">
                  <Brightness3Icon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.poNeeded && (
              <Tooltip title={t('serviceDashboard.poNeeded')} arrow>
                <span className="service-type-icons">
                  <PendingActionsIcon className="service-icon" color="info" />
                </span>
              </Tooltip>
            )}
            {service?.deviceNotAllowed && (
              <Tooltip title={t('serviceDashboard.deviceNotAllowed')} arrow>
                <span className="service-type-icons">
                  <NoCellIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
            {service?.hasAdditionalServicemen && (
              <Tooltip title="Additional Servicemen" arrow>
                <span className="service-type-icons">
                  <PeopleOutlineIcon className="service-icon" />
                </span>
              </Tooltip>
            )}
          </Grid>
          <Tooltip title={customerName} arrow>
            <div className="custom-card-address">{customerName}</div>
          </Tooltip>
          <Tooltip title={locationName} arrow>
            <div className="custom-card-address">{locationName}</div>
          </Tooltip>
        </Grid>
      </MovableCardWrapper>
    </>
  );
}

CustomCard.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.object,
  servicemanName: PropTypes.string,
  previousPerformedServiceDate: PropTypes.string,
  occurences: PropTypes.string,
  service: PropTypes.string,
  cardColor: PropTypes.string,
  textColor: PropTypes.string,
  locationName: PropTypes.string,
  customerName: PropTypes.string,
  serviceOrderId: PropTypes.number,
  contractNumber: PropTypes.string,
  contract: PropTypes.string,
  contractId: PropTypes.number,
  contractName: PropTypes.string,
  contractSignedOn: PropTypes.string,
  projectNumber: PropTypes.string,
  projectId: PropTypes.string,
  project: PropTypes.string,
  projectStatus: PropTypes.string,
  projectName: PropTypes.string,
  projectSignedOn: PropTypes.string,
  projectRenewedOn: PropTypes.string,
  salesmanName: PropTypes.string,
  contactDetails: PropTypes.object,
  projectNote: PropTypes.string,
  scheduleDate: PropTypes.string,
  serviceOrderStatusId: PropTypes.number,
  servicemanId: PropTypes.number,
  preferredTimingId: PropTypes.number,
  serviceOrderNumber: PropTypes.string,
  projectEndDate: PropTypes.string
};
