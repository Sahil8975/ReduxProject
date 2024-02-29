import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Paper,
  Popover
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WidgetsIcon from '@mui/icons-material/Widgets';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MapIcon from '@mui/icons-material/Map';
import commaNumber from 'comma-number';
import useSettings from '../../../hooks/useSettings';
import { isArray, truncateString } from '../../../utils/utils';
import { COMPONENTS, THEME } from '../../../utils/constants';
import { ROUTES } from '../../../routes/paths';
import RenderComponent from '../../../components/RenderComponent';
import './CustomerView.scss';

function CustomerDataTable({
  customersData,
  getCustomerLocations,
  getRecords,
  payload,
  totalRecords,
  setShowCustomerContact,
  expandedCustomer,
  setExpandedCustomer,
  currentCustomer,
  setCurrentCustomer,
  setShowLocationContact,
  setCurrentLocation,
  setExpandedLocation,
  setActiveContact,
  setExpandedContact,
  setRouteData,
  setCustomerId,
  setPrimaryLocation,
  setLocationId
}) {
  const navigate = useNavigate();
  const [legendAnchorEl, setLegendAnchorEl] = useState(null);
  const { themeMode } = useSettings();
  const { BUTTON } = COMPONENTS;
  const handleChange = (panel, customerId, data) => (event, isExpanded) => {
    setExpandedCustomer(isExpanded ? panel : false);
    setCurrentCustomer(panel);
    setShowCustomerContact(true);
    setShowLocationContact(false);
    setExpandedLocation(false);
    setCurrentLocation(null);
    setActiveContact(null);
    setExpandedContact(false);
    setCustomerId(customerId);
    if (isExpanded) {
      getCustomerLocations(panel);
      setLocationId('');
      setRouteData(data);
      setPrimaryLocation(data.hasPrimaryLocation);
    }
  };

  const generateAccordionDetails = (row) => (
    <Tooltip title="Double click to edit customer information." placement="top">
      <AccordionDetails className="accordionDetailsStyles" onDoubleClick={() => handleAccordionClick(row)}>
        <Grid container spacing={1} p={2} sx={{ marginTop: '-1rem' }}>
          {[
            { label: 'Business Industry', value: row.businessIndustry },
            { label: 'Group', value: row.customerGroupName },
            {
              label:
                (row.organizationIdentificationTypeName && row.organizationIdentificationTypeName) ||
                'Organization Identification Type',
              value: row.organizationIdentificationTypeValue
            },
            { label: 'Credit Limit', value: commaNumber(Number(row.creditLimit).toFixed(2)) },
            { label: 'Credit Period in days', value: row.creditPeriod },
            { label: 'Collector Name', value: row.collectorName },
            { label: 'Salesman', value: row.salesmanName }
          ].map((item, index) => {
            const isRed =
              (['Business Industry', 'Group', 'Organization Identification Type', 'Salesman'].includes(item.label) &&
                !item.value) ||
              (item.label === 'Credit Period in days' &&
                row.customerClassificationDisplayCode === 'CRD' &&
                item.value !== 0 &&
                !item.value);

            return (
              <Grid item xs={6} key={index}>
                <Typography
                  sx={{
                    fontFamily: 'Montserrat',
                    fontSize: '0.9rem',
                    color: isRed ? 'red' : ''
                  }}
                >
                  {item.label}:
                </Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }}>{item.value}</Typography>
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Tooltip>
  );

  const getAccordionClassName = (themeMode, currentCustomer, rowId) => {
    if (themeMode === THEME.DARK) {
      return currentCustomer === rowId ? 'dark-mode-accordion-selected' : 'dark-mode-accordion';
    }
    return currentCustomer === rowId ? 'light-mode-accordion-selected' : 'light-mode-accordion';
  };

  const openeLegend = Boolean(legendAnchorEl);

  const handleLegendClose = () => setLegendAnchorEl(null);

  const handleLegendClick = (e) => {
    setLegendAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const { pageIndex, isApproved } = payload;
  let approval = null;
  if (isApproved === 'true') {
    approval = true;
  } else if (isApproved === 'false') {
    approval = false;
  }

  const disablePreRecords = pageIndex === 1;

  const disableNextRecords = pageIndex === Math.ceil(totalRecords / 10);

  const getPreviousRecords = () => {
    getRecords(false, { ...payload, isApproved: approval, pageIndex: pageIndex - 1 });
  };

  const getNextRecords = () => {
    getRecords(true, { ...payload, isApproved: approval, pageIndex: pageIndex + 1 });
  };

  const handleAccordionClick = (row) =>
    navigate(
      ROUTES.ADDCUSTOMER,
      { state: { expandAccordion: 'AddCustomer', customerId: row.id, isEdit: true } },
      { replace: true }
    );

  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {totalRecords !== 0 && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    marginLeft: '1rem',
                    fontWeight: 'bold',
                    color: 'primary.main',
                    fontFamily: ' Montserrat',
                    fontSize: '0.9rem'
                  }}
                >
                  Total Records {totalRecords}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Grid item xs={1} mt={-1} sx={{ marginLeft: '-1.5rem' }}>
              {isArray(customersData) && (
                <Tooltip title="Previous records">
                  <IconButton onClick={() => getPreviousRecords()} disabled={disablePreRecords}>
                    <ExpandCircleDownIcon
                      sx={{
                        transform: 'rotate(180deg)',
                        color: disablePreRecords ? 'lightgrey' : '#141E46',
                        cursor: 'pointer'
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={9} mt={-1} mr={2.5}>
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  variant: 'contained',
                  groupStyle: { marginBottom: '0.5rem', marginLeft: '3rem' },
                  color: 'success',
                  size: 'small',
                  handleClickButton: () =>
                    navigate(
                      ROUTES.ADDCUSTOMER,
                      { state: { expandAccordion: 'AddCustomer', payload } },
                      { replace: true }
                    ),
                  btnTitle: 'Add Customer',
                  columnWidth: 12,
                  columnHeight: 2
                }}
              />
            </Grid>
            <Grid item xs={2} mt={-0.5}>
              <Tooltip title="Legends">
                <IconButton onClick={handleLegendClick} sx={{ marginLeft: '3rem' }}>
                  <WidgetsIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Popover
                id="legend"
                open={openeLegend}
                anchorEl={legendAnchorEl}
                onClose={handleLegendClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
              >
                <Grid container spacing={2} p={2}>
                  <Grid item xs={12} display="flex" justifyContent="start" width="3rem">
                    <WorkspacePremiumIcon sx={{ color: '#a7220d' }} />
                    <Typography sx={{ marginLeft: '1rem', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>
                      Primary Icon
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="start">
                    <MapIcon sx={{ color: '#a7220d' }} />
                    <Typography sx={{ marginLeft: '1rem', fontFamily: 'Montserrat', fontSize: '0.9rem' }}>
                      Map Icon
                    </Typography>
                  </Grid>
                </Grid>
              </Popover>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ height: '54vh', overflowY: 'auto', marginTop: '-0.3rem' }}>
        {!isArray(customersData) && (
          <Paper elevation={5} sx={{ height: '3rem', width: 'calc(100% - 1rem)', marginTop: '-0.5rem' }}>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }} align="center" pt={1.5}>
              No Customer Found
            </Typography>
          </Paper>
        )}
        {isArray(customersData) &&
          customersData.map((row) => (
            <Accordion
              key={row.id}
              expanded={expandedCustomer === row.id}
              onChange={handleChange(row.id, row.id, row)}
              sx={{ width: 'calc(100% - 1rem)' }}
            >
              <AccordionSummary
                expandIcon={expandedCustomer === row.id ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className={getAccordionClassName(themeMode, currentCustomer, row.id)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: currentCustomer === row.id ? 'rgba(20, 30, 70, 1)' : '#fff',
                  color: currentCustomer === row.id ? 'rgba(152,203,219,1)' : 'rgba(20, 30, 70, 1)',
                  // backgroundColor: currentCustomer === row.id ? '#1391b1' : '#fff',
                  // boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                  boxShadow:
                    currentCustomer === row.id ? '0px 3px rgba(152,203,219,1)' : '0px 3px 6px rgba(152,203,219,1)',

                  '&:hover': {
                    backgroundColor: currentCustomer === row.id ? '#98cbdb' : '#141e46',
                    color: currentCustomer === row.id ? '#141e46' : '#98cbdb'
                  }
                }}
              >
                <Grid container spacing={1}>
                  {row.isPendingApproval && (
                    <Tooltip title="isPendingApproval">
                      <IconButton>
                        <PriorityHighIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Typography sx={{ fontFamily: 'Montserrat ', fontSize: '0.9rem', ml: 0.5, mb: 0.5, pt: 1 }}>
                    {row.accountNumber}
                  </Typography>
                  <Tooltip title={row.customerName}>
                    <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem', ml: 0.5, mb: 0.5, pt: 1 }}>
                      {row.customerName && truncateString(row.customerName, 15)}
                    </Typography>
                  </Tooltip>
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat',
                      fontSize: '0.9rem',
                      ml: 0.5,
                      mb: 0.5,
                      pt: 1,
                      color: !row.customerClassificationDisplayCode ? 'red' : ''
                    }}
                  >
                    {row.customerClassificationDisplayCode ? `[${row.customerClassificationDisplayCode}]` : '[]'}
                  </Typography>
                  {isArray(payload.salesmanIds) && payload.salesmanIds.length >= 2 && (
                    <Tooltip title={row.salesmanShortName}>
                      <Typography
                        sx={{
                          fontFamily: 'Montserrat',
                          fontSize: '0.9rem',
                          ml: 'auto',
                          mb: 0.5,
                          pt: 1,
                          textAlign: 'right'
                        }}
                      >
                        {row.salesmanShortName && truncateString(row.salesmanShortName, 15)}
                      </Typography>
                    </Tooltip>
                  )}
                </Grid>
              </AccordionSummary>
              {generateAccordionDetails(row)}
            </Accordion>
          ))}
      </Grid>
      {isArray(customersData) && (
        <Grid item xs={12} mt={-1} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Tooltip title="Next records">
            <IconButton onClick={() => getNextRecords()} disabled={disableNextRecords} sx={{ marginRight: '-1rem' }}>
              <ExpandCircleDownIcon sx={{ color: disableNextRecords ? 'lightgrey' : '#141E46' }} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customersData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ ml: -2, overflowX: 'hidden' }}
      /> */}
    </Grid>
  );
}

CustomerDataTable.propTypes = {
  customersData: PropTypes.array,
  getCustomerLocations: PropTypes.func,
  getRecords: PropTypes.func,
  payload: PropTypes.object,
  pageIndex: PropTypes.number,
  isApproved: PropTypes.string,
  totalRecords: PropTypes.number,
  setShowCustomerContact: PropTypes.func,
  expandedCustomer: PropTypes.bool,
  setExpandedCustomer: PropTypes.func,
  currentCustomer: PropTypes.number,
  setCurrentCustomer: PropTypes.func,
  setShowLocationContact: PropTypes.func,
  setCurrentLocation: PropTypes.func,
  setExpandedLocation: PropTypes.func,
  setActiveContact: PropTypes.func,
  setExpandedContact: PropTypes.func,
  setRouteData: PropTypes.func,
  setPrimaryLocation: PropTypes.func,
  setCustomerId: PropTypes.func,
  setLocationId: PropTypes.func
};

export default CustomerDataTable;
