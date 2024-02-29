import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Paper, Tooltip, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import useSettings from '../../../hooks/useSettings';
import { isArray, truncateString } from '../../../utils/utils';
import RenderComponent from '../../../components/RenderComponent';
import { COMPONENTS, THEME } from '../../../utils/constants';
import { ROUTES } from '../../../routes/paths';
import './CustomerView.scss';

function LocationContacts({
  showLocationContact,
  showCustomerContact,
  contactData,
  expandedContact,
  setExpandedContact,
  activeContact,
  setActiveContact,
  locationId,
  customerId,
  primaryLocation
}) {
  const navigate = useNavigate();
  const { BUTTON } = COMPONENTS;
  const { themeMode } = useSettings();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedContact(isExpanded ? panel : false);
    setActiveContact(panel);
  };

  const handleAccordionClick = (sig) => {
    navigate(
      ROUTES.ADDCUSTOMER,
      { state: { expandAccordion: 'AddContact', contactId: sig.id, locationId, customerId, isEdit: true } },
      { replace: true }
    );
  };

  const getAccordionClassName = (themeMode, activeContact, sigId) => {
    if (themeMode === THEME.DARK) {
      return activeContact === sigId ? 'dark-mode-accordion-selected' : 'dark-mode-accordion';
    }
    return activeContact === sigId ? 'light-mode-accordion-selected' : 'light-mode-accordion';
  };

  const generateContactDetails = (sig) => (
    <Grid item xs={12} container spacing={3} sx={{ marginTop: '0.5rem' }}>
      <Grid container spacing={3} p={2}>
        {[
          { label: 'Telephone Number', value: sig.phoneNumbers },
          { label: 'Mobile Number', value: sig.mobileNumbers },
          { label: 'Email', value: sig.emails }
        ].map((item, index) => (
          <Grid item xs={12} key={index}>
            <Typography sx={{ fontFamily: 'Montserrat ', fontSize: '0.9rem' }}>{item.label}:</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }}>
              {item?.value.join(', ') || ''}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={2} sx={{ marginTop: '0.5rem' }}>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: '0.9rem', color: 'primary.main' }}>
          {!showLocationContact ? 'Customer Contact' : 'Location Contact'}
        </Typography>
        <RenderComponent
          metaData={{
            control: BUTTON,
            groupStyle: { marginTop: '-0.5rem', marginRight: '1rem' },
            btnTitle: 'Add Contact',
            variant: 'contained',
            color: 'success',
            size: 'small',
            handleClickButton: () =>
              navigate(
                ROUTES.ADDCUSTOMER,
                {
                  state: {
                    expandAccordion: 'AddContact',
                    locationId,
                    customerId,
                    isPrimaryLocation: primaryLocation
                    // isEdit: true
                  }
                },
                { replace: true }
              ),
            columnWidth: 5,
            columnHeight: 2,
            isDisabled: !showLocationContact && !showCustomerContact
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ height: '54vh', overflowY: 'auto', marginTop: '0.2rem' }}>
        {!isArray(contactData) && (
          <Paper elevation={5} sx={{ width: 'calc(100% - 1rem)', height: '3rem', marginTop: '-0.5rem' }}>
            <Typography sx={{ fontFamily: 'Montserrat ', fontSize: '0.9rem' }} align="center" pt={1.5}>
              No Contact Found
            </Typography>
          </Paper>
        )}
        {isArray(contactData) &&
          contactData.map((sig) => (
            <Accordion
              key={sig.id}
              expanded={expandedContact === sig.id}
              onChange={handleChange(sig.id)}
              sx={{ width: 'calc(100% - 1rem)' }}
            >
              <AccordionSummary
                expandIcon={expandedContact === sig.id ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className={getAccordionClassName(themeMode, activeContact, sig.id)}
                sx={{
                  borderRadius: '8px',
                  // backgroundColor: activeContact === sig.id ? 'rgba(1, 136, 168, 255)' : '#fff',
                  // boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                  // '&:hover': {
                  //   backgroundColor: '#a5e2f2'
                  // }
                  backgroundColor: activeContact === sig.id ? 'rgba(20, 30, 70, 1)' : '#fff',
                  color: activeContact === sig.id ? 'rgba(152,203,219,1)' : 'rgba(20, 30, 70, 1)',
                  boxShadow:
                    activeContact === sig.id ? '0px 3px rgba(152,203,219,1)' : '0px 3px 6px rgba(152,203,219,1)',
                  '&:hover': {
                    backgroundColor: activeContact === sig.id ? '#98cbdb' : '#141e46',
                    color: activeContact === sig.id ? '#141e46' : '#98cbdb'
                  }
                }}
              >
                <Grid container spacing={1}>
                  <Tooltip title={sig.name}>
                    <Typography sx={{ ml: 0.5, mb: 0.5, fontFamily: 'Montserrat ', fontSize: '0.9rem' }}>
                      {sig.name && truncateString(sig.name, 10)}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={sig.title}>
                    <Typography sx={{ ml: 0.5, mb: 0.5, fontFamily: 'Montserrat ', fontSize: '0.9rem' }}>
                      {sig.title ? `[${truncateString(sig.title, 10)}]` : <span style={{ color: 'red' }}>[ ]</span>}
                    </Typography>
                  </Tooltip>
                  {sig.isPrimary && (
                    <Tooltip title="Primary">
                      <WorkspacePremiumIcon sx={{ color: '#a7220d', position: 'absolute', right: '2rem' }} />
                    </Tooltip>
                  )}
                </Grid>
              </AccordionSummary>
              <Tooltip title="Double click to edit contact information." placement="top">
                <AccordionDetails
                  className="locationContactsAccordionDetailsStyles"
                  onDoubleClick={() => handleAccordionClick(sig)}
                  sx={{ marginTop: '-0.5rem' }}
                >
                  {generateContactDetails(sig)}
                </AccordionDetails>
              </Tooltip>
            </Accordion>
          ))}
      </Grid>
    </Grid>
  );
}

LocationContacts.propTypes = {
  showLocationContact: PropTypes.bool,
  showCustomerContact: PropTypes.bool,
  contactData: PropTypes.array,
  expandedContact: PropTypes.bool,
  setExpandedContact: PropTypes.func,
  activeContact: PropTypes.number,
  setActiveContact: PropTypes.func,
  locationId: PropTypes.any,
  customerId: PropTypes.any,
  primaryLocation: PropTypes.bool
};

export default LocationContacts;
