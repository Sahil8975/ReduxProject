import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { Button } from 'primereact/button';
import '../../Styles/app.scss';
import SimpleTable from '../table/simpleTable';

export default function ProjectTable({ tableDataInput, columnDataForProjects, showAddProject, ...other }) {
  const [tableData, setTableData] = useState(tableDataInput);
  const [editingRows, setEditingRows] = useState({});

  const setActiveRowIndex = (index) => {
    const editingRow = { ...editingRows, ...{ [`${tableData[index].id}`]: true } };
    setEditingRows(editingRow);
  };

  const addNewProject = () => {
    const currentTableData = tableData;
    currentTableData.unshift({ id: Math.floor(Math.random() * 10000) });
    setTableData(currentTableData);
    setActiveRowIndex(0);
  };
  return (
    <Grid container spacing={1}>
      {!showAddProject && (
        <Grid item justifyContent="right" display="flex" xs={12} lg={12}>
          <Button label="Add New Project" onClick={addNewProject} />
        </Grid>
      )}
      <Grid item xs={12} lg={12}>
        <SimpleTable rowData={tableDataInput} headerData={columnDataForProjects} editingRows={editingRows} {...other} />
      </Grid>
    </Grid>
  );
}
