import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import GoogleMapWithMarkers from './GoogleMapWithMarkers';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS } from '../../utils/constants';
import { isArray } from '../../utils/utils';

function MapView({ servicemanVisitMarkers, siteMarkers, servicemanData, customerData, payloadData }) {
  const [payload, setPayload] = useState({
    servicemanId: [],
    customerId: [],
    servicemanIds: [],
    customerIds: []
  });

  const { MULTI_SELECT_BOX } = COMPONENTS;
  const zoom = 12;
  const center = { lat: 21.4858, lng: 39.1925 };

  const getHtml = (label, val) => (
    <div style={{ padding: '5px' }}>
      <h4> {label}: </h4> <p>{val}</p>
    </div>
  );

  const prepareInfowWindow = (marker) => {
    const { status, location, serviceman, startTime } = marker;
    return (
      <>
        {location && getHtml('Location', location)}
        {serviceman && getHtml('Serviceman', serviceman)}
        {startTime && getHtml('Start Time', startTime)}
        {status && getHtml('Status', status)}
      </>
    );
  };

  const mapGridStyle = {
    height: '43.75rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    border: '1px solid black'
  };

  const componentsSet1 = [
    {
      control: MULTI_SELECT_BOX,
      key: 'servicemanId',
      label: 'Serviceman',
      placeholder: 'Serviceman',
      options: servicemanData,
      columnWidth: 5,
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      maxMultipleOptions: 1
    },
    {
      control: MULTI_SELECT_BOX,
      key: 'customerId',
      label: 'Customer Name',
      placeholder: 'Customer Name',
      options: customerData,
      columnWidth: 5,
      labelStyle: { marginTop: '-0.5rem' },
      controlStyle: { height: '2rem' },
      maxMultipleOptions: 1
    }
  ];

  const updatePayload = (pairs) => {
    setPayload({ ...payload, ...pairs });
    setPayload((state) => {
      console.log('state', state);
      return state;
    });
  };

  const handleChangeData = (key, val) => {
    if (key) {
      const updateFields = { [key]: val };
      if (key === 'servicemanId') {
        updateFields.servicemanIds = val.map((el) => el.id);
      }
      if (key === 'customerId') {
        updateFields.customerIds = val.map((el) => el.id);
      }
      updatePayload({ ...updateFields });
    }
  };

  const deleteMltSlctOptn = (key, val) => {
    if (key === 'servicemanId' && val && isArray(payload.servicemanId)) {
      const servicemanId = payload.servicemanId.filter((cntry) => cntry.id !== val);
      const servicemanIds = servicemanId.map((el) => el.id);
      updatePayload({ servicemanId, servicemanIds });
    }

    if (key === 'customerId' && val && isArray(payload.customerId)) {
      const customerId = payload.customerId.filter((rgn) => rgn.id !== val);
      const customerIds = customerId.map((el) => el.id);
      updatePayload({ customerId, customerIds });
    }
  };
  useEffect(() => {
    updatePayload({ customerId: [], customerIds: [], servicemanId: [], servicemanIds: [] });
  }, [servicemanData, customerData]);

  useEffect(() => {
    payloadData(payload);
  }, [payload, updatePayload]);
  return (
    <>
      <Grid container spacing={3} mt={1}>
        <Grid item xs={8}>
          <Grid container spacing={3}>
            {componentsSet1?.map((comp, ind) => (
              <RenderComponent
                key={ind}
                metaData={comp}
                payload={payload}
                ind={1}
                handleChange={handleChangeData}
                deleteMltSlctOptn={deleteMltSlctOptn}
              />
            ))}{' '}
          </Grid>
        </Grid>

        {/* Grid for Map With Customized Markers */}
        <Grid item xs={12} mt={0.5} md={12}>
          <GoogleMapWithMarkers
            zoom={zoom}
            center={center}
            markers={[...siteMarkers, ...servicemanVisitMarkers]}
            mapGridStyle={mapGridStyle}
          />
        </Grid>
      </Grid>
    </>
  );
}

MapView.propTypes = {
  servicemanVisitMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      location: PropTypes.string,
      serviceman: PropTypes.string,
      position: PropTypes.object,
      color: PropTypes.string
    })
  ),
  siteMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      location: PropTypes.string,
      position: PropTypes.object,
      color: PropTypes.string
    })
  )
};
export default MapView;
