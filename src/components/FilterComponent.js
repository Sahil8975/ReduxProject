import React, { useState } from 'react';
import { TextField, Grid, Paper, Button, Autocomplete, BUTTON } from '@mui/material';
import { COMPONENTS, BUTTON } from '../utils/constants';
import RenderComponent from '../components/RenderComponent';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ProminentAppBar from './header/header';
import jsonData from '../utils/filterdata.json';

function FilterComponent() {
  const [filterdata, setfilterdata] = useState(jsonData);
  const paperStyle = { padding: '5px 5px', margin: '20px auto', marginTop: '0px' };
  const [stockFilter, setStockFilter] = useState(null);
  const [descFilter, setdescFilter] = useState(null);
  const [qtyFilter, setqtyFilter] = useState(null);
  const [uomFilter, setuomFilter] = useState(null);
  const [hqtyFilter, sethqtyFilter] = useState(null);
  const [handFilter, sethandFilter] = useState(null);
  const [owanFilter, setowanFilter] = useState(null);
  const [fwanFilter, setfwanFilter] = useState(null);
  return (
    <div>
      <Grid>
        <ProminentAppBar height="15px" />
        <Paper style={paperStyle} elevation={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={stockFilter}
                onChange={(e) => {
                  setStockFilter(e.target.value);
                  filterdata.code = e.target.value;
                }}
                fullWidth
                size="small"
                label="Stock Code"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={descFilter}
                onChange={(e) => setdescFilter(e.target.value)}
                fullWidth
                size="small"
                label="Description"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={qtyFilter}
                onChange={(e) => setqtyFilter(e.target.value)}
                fullWidth
                size="small"
                label="Qty"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={uomFilter}
                onChange={(e) => setuomFilter(e.target.value)}
                fullWidth
                size="small"
                label="Inv UOM"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={hqtyFilter}
                onChange={(e) => sethqtyFilter(e.target.value)}
                fullWidth
                size="small"
                label="Hold Qty"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={handFilter}
                onChange={(e) => sethandFilter(e.target.value)}
                fullWidth
                size="small"
                label="On-hand"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={owanFilter}
                onChange={(e) => setowanFilter(e.target.value)}
                fullWidth
                size="small"
                label="Van-Stock"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                value={fwanFilter}
                onChange={(e) => setfwanFilter(e.target.value)}
                fullWidth
                size="small"
                label="From-wan"
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={1}>
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  color: 'success',
                  size: 'small',
                  btnTitle: 'Filter',
                  startIcon: <SearchIcon />
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={1}>
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  color: 'success',
                  size: 'small',
                  btnTitle: 'Clear',
                  startIcon: <CloseIcon />
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}
export default FilterComponent;
