import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAP } from '../../../utils/constants';

function AddressMap({ zoom, center, mapGridStyle, setLatlngs, clickedLocation, setClickedLocation, disableLocation }) {
  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  const handleClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setClickedLocation({ position: newLocation, location: '' });
    setLatlngs(newLocation);
  };

  const getGoogleMap = () => (
    <GoogleMap
      zoom={zoom}
      mapContainerStyle={containerStyle}
      center={center}
      onClick={disableLocation ? null : (e) => handleClick(e)}
    >
      {clickedLocation !== null && (
        <Marker
          icon={{
            path: GOOGLE_MAP.MAP_MARKER,
            fillColor: '#ea4335',
            fillOpacity: 1,
            scale: 2,
            strokeColor: '#000',
            strokeWeight: 0,
            anchor: { x: 12, y: 24 }
          }}
          position={clickedLocation.position}
          title={clickedLocation.location}
        />
      )}
    </GoogleMap>
  );

  return (
    <>
      <Grid item xs={12} style={mapGridStyle}>
        {window.google === undefined ? (
          <LoadScript googleMapsApiKey={GOOGLE_MAP.API_KEY}>{getGoogleMap()}</LoadScript>
        ) : (
          getGoogleMap()
        )}
      </Grid>
    </>
  );
}

AddressMap.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.object,
  mapGridStyle: PropTypes.object,
  setLatlngs: PropTypes.func,
  clickedLocation: PropTypes.object,
  setClickedLocation: PropTypes.func,
  disableLocation: PropTypes.bool
};

export default React.memo(AddressMap);
