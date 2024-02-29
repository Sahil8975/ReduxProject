import React from 'react';
import { Grid, Typography, Divider } from '@mui/material';

function ServicemanServicePreview() {
  return (
    <Grid style={{ border: '1px solid black' }} p={0.5}>
      {/* Grid for Service Details heading */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" mt={-0.5}>
          Service Details
        </Typography>
      </Grid>

      <Divider />

      {/* Grid For service Subject */}
      <Grid item xs={12} mt={1.5}>
        <Grid container spacing={3}>
          {/* Grid for service subject */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Subject
            </Typography>
            <Typography variant="caption">D02036 Scent Diffuser W.Fan M1500H</Typography>
          </Grid>

          {/* Grid for Scheduled Date */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Scheduled Date
            </Typography>
            <Typography variant="caption">22-05-2022</Typography>
          </Grid>

          {/* Grid for location */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Location
            </Typography>
            <Typography variant="caption">Baghdadiya Opposite Alireza tower</Typography>
          </Grid>

          {/* Grid for Contact Person */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Contact Person
            </Typography>
            <Typography variant="caption">Hamza Yaser</Typography>
          </Grid>

          {/* Grid for Notes / Special Attension */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Notes / Special Attention Notes
            </Typography>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </Typography>
          </Grid>

          {/* Grid for Last Service Date */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Last Service Date
            </Typography>
            <Typography variant="caption">22-04-2022</Typography>
          </Grid>

          {/* Grid for Business */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Business
            </Typography>
            <Typography variant="caption">Maintenance</Typography>
          </Grid>

          {/* Grid for Last Service Details */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Last Service Details / Notes
            </Typography>
            <Typography variant="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed</Typography>
          </Grid>

          {/* Grid for Any Pending Request */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Any Pending Request
            </Typography>
            <Typography variant="caption">Lorem ipsum dolor</Typography>
          </Grid>

          {/* Grid for Ops Admin's input about this pending request */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Ops Admin's input about this pending request
            </Typography>
            <Typography variant="caption">
              Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for Contract Details heading */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" mt={-0.5}>
              Contract Details
            </Typography>
          </Grid>

          {/* Grid for Contract Number */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Contract Number
            </Typography>
            <Typography variant="caption">HSDCJD_0831</Typography>
          </Grid>

          {/* Grid for Contract Name */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Contract Name
            </Typography>
            <Typography variant="caption">Talmik Towers General Contract</Typography>
          </Grid>

          {/* Grid for Customer Address */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Customer Address
            </Typography>
            <Typography variant="caption">Baghdadiya Opposite Alireza tower</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for Project Details heading */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" mt={-0.5}>
              Project Details
            </Typography>
          </Grid>

          {/* Grid for Project Number */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Project Number
            </Typography>
            <Typography variant="caption">HSDPJD_0831_003_001</Typography>
          </Grid>

          {/* Grid for Project Name */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Project Name
            </Typography>
            <Typography variant="caption">Lorem ipsum dolor Lorem</Typography>
          </Grid>

          {/* Grid for Project Location */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Project Location
            </Typography>
            <Typography variant="caption">Baghdadiya Opposite Alireza tower</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ServicemanServicePreview;
