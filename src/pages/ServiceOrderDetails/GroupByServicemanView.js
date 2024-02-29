import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CallIcon from '@mui/icons-material/Call';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { ICON_COLOR } from '../../utils/constants';
import { isArray } from '../../utils/utils';

function GroupByServicemanView({ data, isServicemen, passOrderId, cardFlagCallback }) {
  const { t } = useTranslation();
  const { ORANGE } = ICON_COLOR;
  const [selectedCard, setselectedCard] = useState('');
  const getLegends = (service) => (
    <Grid>
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
            <CancelIcon className="service-icon" sx={{ color: ORANGE }} />
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
  );

  const sendIdData = (cardDetail) => {
    cardFlagCallback(false);
    setselectedCard(cardDetail.serviceOrderId);
    passOrderId(cardDetail.serviceOrderId);
  };
  return (
    <>
      {isArray(data) &&
        data?.map((d, index) => (
          <>
            {/* Grid For serviceman Name */}
            <Grid
              item
              xs={12}
              style={{
                backgroundColor: isServicemen ? d?.cardColor : '#0a5',
                color: isServicemen ? d?.textColor : 'white',
                marginTop: index !== 0 ? '1rem' : ''
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={0.5}
            >
              <Typography variant="subtitle2" mt={-0.5}>
                {d.laneTitle}
              </Typography>
            </Grid>

            {/* Grid for Serviceman services details */}
            {isArray(d?.cards) &&
              d?.cards?.map((item) => (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      border: item.serviceOrderId === selectedCard ? '3px solid #0188a8' : '1px solid black',
                      cursor: 'pointer'
                    }}
                    mt={1}
                    p={0.5}
                    mb={1}
                    onClick={() => sendIdData(item)}
                  >
                    <Grid container spacing={3}>
                      {/* Grid for Customer Name */}
                      {isServicemen ? (
                        <Grid item xs={12} sm={8} mt={1}>
                          <Typography variant="subtitle2" fontSize="12px">
                            Customer
                          </Typography>
                          <Typography variant="caption">{item.customerName}</Typography>
                        </Grid>
                      ) : (
                        <>
                          <Grid item xs={12} sm={8} mt={1}>
                            <Typography variant="subtitle2" fontSize="12px">
                              Serviceman
                            </Typography>
                            <Typography variant="caption">{item.servicemanName}</Typography>
                          </Grid>
                        </>
                      )}
                      {/* Grid for Contarct Number */}
                      <Grid item xs={12} sm={4} mt={1}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Contract Number
                        </Typography>
                        <Typography variant="caption">{item.contractNumber}</Typography>
                      </Grid>

                      <Grid item xs={12} sm={8}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Customer Address
                        </Typography>
                        <Typography variant="caption">{item.customerAddress}</Typography>
                      </Grid>
                      {/* Grid for Project Number */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Project Number
                        </Typography>
                        <Typography variant="caption">{item.projectNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Project Address
                        </Typography>
                        <Typography variant="caption">{item.projectAddress}</Typography>
                      </Grid>
                      {/* Grid for Location */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Location
                        </Typography>
                        <Typography variant="caption">{item.locationName}</Typography>
                      </Grid>

                      {/* Grid for Service Subject */}
                      <Grid item xs={12} sm={8}>
                        <Typography variant="subtitle2" fontSize="12px">
                          Service Subjects
                        </Typography>
                        {item.serviceSubjects?.map((e) => (
                          <>
                            <div className="service-subject">
                              <Typography variant="caption">{e}</Typography>
                            </div>
                          </>
                        ))}
                      </Grid>
                      {/* Grid for ICONS */}
                      <Grid item xs={12} sm={4} display="flex" justifyContent="start" alignItems="baseline">
                        <Typography variant="caption">{getLegends(item?.service)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
          </>
        ))}
    </>
  );
}

GroupByServicemanView.propTypes = {
  data: PropTypes.object,
  isServicemen: PropTypes.bool
};

export default GroupByServicemanView;
