import React from 'react';
import { Grid, Typography } from '@mui/material';

function CustomerServicePreview() {
  return (
    <Grid style={{ border: '1px solid black' }} p={0.5}>
      {/* Grid For All typo components */}
      <Grid item xs={12} mt={1.5}>
        <Grid container spacing={3}>
          {/* Grid for Contract Number */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Contract Number
            </Typography>
            <Typography variant="caption">HSDCJD_0249</Typography>
          </Grid>

          {/* Grid for Project Number */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Project Number
            </Typography>
            <Typography variant="caption">HSDPJD_0249_018_003</Typography>
          </Grid>

          {/* Grid for Customer */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Customer
            </Typography>
            <Typography variant="caption">Saudi Binladin Group Operation and Maintenance</Typography>
          </Grid>

          {/* Grid for Business */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Business
            </Typography>
            <Typography variant="caption">Maintenance</Typography>
          </Grid>

          {/* Grid for Location */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Location
            </Typography>
            <Typography variant="caption">Makkah Haram</Typography>
          </Grid>

          {/* Grid for Serviceman */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Serviceman
            </Typography>
            <Typography variant="caption">Hamza Yaser Khamayseh</Typography>
          </Grid>

          {/* Grid for Scheduled */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Scheduled Date
            </Typography>
            <Typography variant="caption">21-03-2022</Typography>
          </Grid>

          {/* Grid for Status */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Status
            </Typography>
            <Typography variant="caption">Scheduled</Typography>
          </Grid>

          {/* Grid for Notes related to this service */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Notes related to this service
            </Typography>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </Typography>
          </Grid>

          {/* Grid for Report related to this service */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Report related to this service
            </Typography>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </Typography>
          </Grid>

          {/* Grid for Service Subject */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Subject
            </Typography>
            <Typography variant="caption">
              GE1000 Generic Equipment - Serial numbers: [ ] 610641 Dyson Hand Dryer HU02 - High Voltage 220V Nickel -
              Serial 618235 Manual Foam Soap Dispenser Refillable 1Ltr 0.4ml Dosage - Serial 618138 RM Auto Foam Soap
              Dispenser Chrome FG750495 - Serial D01019 Modular Foam Soap Pouch 2Ltr Dispnsr w/o Logo - Serial
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomerServicePreview;
