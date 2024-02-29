import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Grid } from '@mui/material';

function SkeletonSet({ elementArray, loading }) {
  if (!loading.isFormLoaded) {
    return (
      <div>
        <Grid container spacing={2}>
          {elementArray?.map((element) => renderSingleElement(elementArray.indexOf(element), element))}
        </Grid>
      </div>
    );
  }
}

function renderSingleElement(key, element) {
  return (
    <Grid item xs={12} md={element.md} lg={element.lg} xl={element.xl}>
      <h1>
        <Skeleton
          duration={3}
          height={element.height}
          circle={element.circle}
          width={element.width}
          color={element.color}
        />
      </h1>
    </Grid>
  );
}

SkeletonSet.propTypes = {
  elementArray: PropTypes.object,
  loading: PropTypes.bool
};

export default SkeletonSet;
