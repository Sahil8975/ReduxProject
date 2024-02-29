import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddressMap from './AddressMap';
import { ROUTES } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import { isArray, truncateString } from '../../../utils/utils';
import RenderComponent from '../../../components/RenderComponent';
import { COMPONENTS, THEME } from '../../../utils/constants';
import './CustomerView.scss';

function CustomerLocation({
  locationData,
  setLocationContacts,
  setActiveLocation,
  setShowCustomerContact,
  currentLocation,
  setCurrentLocation,
  expandedLocation,
  setExpandedLocation,
  showCustomerContact,
  setShowLocationContact,
  showLocationContact,
  routeData,
  setLocationId,
  setPrimaryLocation
}) {
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 24.711565944884473, lng: 46.67166389337076 });
  const [clickedLocation, setClickedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const { BUTTON } = COMPONENTS;
  const { themeMode } = useSettings();
  const {
    organizationIdentificationType,
    organizationIdentificationTypeValue,
    id: customerId,
    hasLocation,
    hasPrimaryLocation
  } = routeData;

  const zoom = 12;
  const mapGridStyle = {
    height: '23rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    border: '1px solid black'
  };

  const getAccordionClassName = (themeMode, currentLocation, itmId) => {
    if (themeMode === THEME.DARK) {
      return currentLocation === itmId ? 'dark-mode-accordion-selected' : 'dark-mode-accordion';
    }
    return currentLocation === itmId ? 'light-mode-accordion-selected' : 'light-mode-accordion';
  };

  const handleChange = (panel, locationId, contacts, isPrimaryLocation, data) => (event, isExpanded) => {
    setExpandedLocation(isExpanded ? panel : false);
    setActiveLocation(panel === locationId);
    setLocationContacts(contacts);
    setCurrentLocation(panel);
    setShowCustomerContact(false);
    setShowLocationContact(true);
    setLocationId(panel);
    setPrimaryLocation(isPrimaryLocation);
    setShowMap(false);
  };

  const handleAccordionClick = (locationData) => {
    navigate(
      ROUTES.ADDCUSTOMER,
      {
        state: {
          expandAccordion: 'AddLocation',
          organizationIdentificationType,
          locationId: locationData.id,
          organizationIdentificationTypeValue,
          customerId,
          isEdit: true
        }
      },
      { replace: true }
    );
  };

  const handleClickShowMap = (address, lat, lng) => {
    setShowMap(!showMap);
    setCenter({ lat: lat * 1, lng: lng * 1 });
    setClickedLocation({ position: { lat: lat * 1, lng: lng * 1 }, location: address });
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
      <Grid item xs={12}>
        <Grid item xs={12} display="flex" justifyContent="space-between" sx={{ marginTop: '-1rem' }}>
          <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.9rem', color: 'primary.main' }}>
            Customer Location
          </Typography>
          <RenderComponent
            metaData={{
              control: BUTTON,
              groupStyle: { marginRight: '1rem', marginTop: '-0.5rem' },
              variant: 'contained',
              color: 'success',
              size: 'small',
              handleClickButton: () =>
                navigate(
                  ROUTES.ADDCUSTOMER,
                  {
                    state: {
                      expandAccordion: 'AddLocation',
                      CRNumber: organizationIdentificationType === 2 ? organizationIdentificationTypeValue : '',
                      customerId,
                      hasLocation,
                      hasPrimaryLocation,
                      isEdit: true,
                      isNewLocation: true
                    }
                  },
                  { replace: true }
                ),
              btnTitle: 'Add Location',
              isDisabled: !showCustomerContact && !showLocationContact,
              columnWidth: 4,
              columnHeight: 2
            }}
          />
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: '0.2rem' }}>
          <Grid item xs={12} sx={{ height: '54vh', overflowY: 'auto' }}>
            {!isArray(locationData) && (
              <Paper elevation={5} sx={{ height: '3rem', width: 'calc(100% - 1rem)', marginTop: '-0.5rem' }}>
                <Typography sx={{ fontFamily: 'Montserrat ', fontSize: '0.9rem' }} align="center" pt={1.5}>
                  No Location Found
                </Typography>
              </Paper>
            )}
            {isArray(locationData) &&
              locationData.map((itm) => (
                <Accordion
                  key={itm.id}
                  expanded={expandedLocation === itm.id}
                  onChange={handleChange(itm.id, itm.id, itm.contacts, itm.isPrimary)}
                  sx={{ width: 'calc(100% - 1rem)' }}
                >
                  <AccordionSummary
                    expandIcon={expandedLocation === itm.id ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className={getAccordionClassName(themeMode, currentLocation, itm.id)}
                    sx={{
                      borderRadius: '8px',
                      // backgroundColor: currentLocation === itm.id ? 'rgba(1, 136, 168, 255)' : '#fff',
                      // boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                      backgroundColor: currentLocation === itm.id ? 'rgba(20, 30, 70, 1)' : '#fff',
                      color: currentLocation === itm.id ? 'rgba(152,203,219,1)' : 'rgba(20, 30, 70, 1)',
                      boxShadow:
                        currentLocation === itm.id ? '0px 3px rgba(152,203,219,1)' : '0px 3px 6px rgba(152,203,219,1)',
                      '&:hover': {
                        backgroundColor: currentLocation === itm.id ? '#98cbdb' : '#141e46',
                        color: currentLocation === itm.id ? '#141e46' : '#98cbdb'
                      }
                    }}
                  >
                    <Grid container spacing={1}>
                      <Tooltip title={itm.name}>
                        <Typography sx={{ ml: 0.5, mb: 0.5, fontFamily: 'Montserrat ', fontSize: '0.9rem' }}>
                          {itm.name && truncateString(itm.name, 15)}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={itm.purpose}>
                        <Typography sx={{ ml: 0.5, mb: 0.5, fontFamily: 'Montserrat ', fontSize: '0.9rem' }}>
                          {itm.purposeAbbreviation ? `[${itm.purposeAbbreviation}]` : ''}
                        </Typography>
                      </Tooltip>
                      {itm.isPrimary && (
                        <Tooltip title="Primary">
                          <WorkspacePremiumIcon sx={{ color: '#a7220d', position: 'absolute', right: '2rem' }} />
                        </Tooltip>
                      )}
                    </Grid>
                  </AccordionSummary>
                  <Tooltip title="Double click to edit location information." placement="top">
                    <AccordionDetails
                      className="customerLocationAccordionDetailsStyles"
                      onDoubleClick={() => handleAccordionClick(itm)}
                      sx={{ marginTop: '-1rem' }}
                    >
                      <Grid container spacing={3} mt={1}>
                        <Grid item xs={12}>
                          <Typography
                            sx={{
                              fontFamily: 'Montserrat ',
                              fontSize: '0.9rem',
                              color: !itm.address ? 'red' : ''
                            }}
                          >
                            {(itm.address && itm.address) || 'address:'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Map view">
                            <IconButton disabled={!itm.latitude}>
                              <MapIcon
                                sx={{ color: '#a7220d' }}
                                onClick={() => handleClickShowMap(itm.address, itm.latitude, itm.longitude)}
                              />
                            </IconButton>
                          </Tooltip>
                          {!itm.latitude && (
                            <Typography variant="body2" display="inline" sx={{ color: 'red' }}>
                              Latitude and Longitude not available
                            </Typography>
                          )}
                          {showMap && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} mt={0.5} md={12}>
                                  <AddressMap
                                    zoom={zoom}
                                    center={center}
                                    mapGridStyle={mapGridStyle}
                                    clickedLocation={clickedLocation}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Tooltip>
                </Accordion>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

CustomerLocation.propTypes = {
  locationData: PropTypes.array,
  setLocationContacts: PropTypes.func,
  setActiveLocation: PropTypes.func,
  setShowCustomerContact: PropTypes.func,
  currentLocation: PropTypes.number,
  setCurrentLocation: PropTypes.func,
  expandedLocation: PropTypes.bool,
  setExpandedLocation: PropTypes.func,
  showCustomerContact: PropTypes.bool,
  setShowLocationContact: PropTypes.func,
  showLocationContact: PropTypes.bool,
  routeData: PropTypes.object,
  setLocationId: PropTypes.func,
  setPrimaryLocation: PropTypes.bool
};

export default CustomerLocation;
