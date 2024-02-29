import React, { useState, useEffect } from 'react';
import { TextField, Container, Grid, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Scrollbar from '../Scrollbar';

// styles
import './dataGrid.scss';

export default function DataGridComponent({ tableData, headers }) {
  const rows = tableData;
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        columns={headers}
        components={
          true
            ? {}
            : {
                Toolbar: GridToolbar
              }
        }
        rows={rows}
        checkboxSelection
      />
    </div>
  );
}
