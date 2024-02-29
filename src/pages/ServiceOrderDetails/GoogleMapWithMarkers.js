import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAP } from '../../utils/constants';
import { isArray } from '../../utils/utils';

function GoogleMapWithMarkers({ zoom = 5, center, markers, mapGridStyle }) {
  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const [activeMarkerId, setActiveMarkerId] = useState('');

  function renderMarkers(markers) {
    return markers.map((marker) => (
      <Marker
        title={marker.location}
        icon={{
          path: GOOGLE_MAP.MAP_MARKER,
          fillColor: marker.color,
          fillOpacity: 1,
          scale: 2,
          strokeColor: '#000',
          strokeWeight: 0,
          anchor: { x: 12, y: 24 }
        }}
        position={marker.position}
        onClick={() => setActiveMarkerId(marker.id)}
      >
        {activeMarkerId === marker.id && marker.isInfoWindow && marker.getInfowWindow && (
          <InfoWindow position={marker.position}>{marker.getInfowWindow(marker)}</InfoWindow>
        )}
      </Marker>
    ));
  }

  const getGoogleMap = () => (
    <GoogleMap zoom={zoom} mapContainerStyle={containerStyle} center={center}>
      {Array.isArray(markers) && renderMarkers(markers)}
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

export default React.memo(GoogleMapWithMarkers);
