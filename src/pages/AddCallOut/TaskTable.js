import React, { Fragment, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button, Grid } from '@mui/material';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import useSettings from '../../hooks/useSettings';
import '../../Styles/app.scss';

export default function TaskTable() {
  const jsonData = [
    {
      id: 1,
      serviceSubject: 'Service Subject 1',
      taskName: 'Task Name 1',
      note: 'Testing note... 1'
    },
    {
      id: 2,
      serviceSubject: 'Service Subject 2',
      taskName: 'Task Name 2',
      note: 'Testing note... 2'
    }
  ];
  const { themeMode, onChangeMode } = useSettings();
  const [tableData, setTableData] = useState(jsonData);
  const [editingRows, setEditingRows] = useState({});
  const onRowEditChange = (e) => {
    console.log(e);
    setEditingRows(e.data);
  };

  const onRowEditComplete = (e) => {
    const _tableData = [...tableData];
    const { newData, index } = e;
    _tableData[index] = newData;
    setTableData(_tableData);
  };

  const setActiveRowIndex = (index) => {
    console.log('index', index);
    const editingRow = { ...editingRows, ...{ [`${tableData[index].id}`]: true } };
    console.log('editing row...', editingRow);
    setEditingRows(editingRow);
  };

  const handleChange = (options, e) => {
    debugger; // eslint-disable-line no-debugger
    console.log('options,e', options, e.target.value);
    options.editorCallback(e.target.value);
  };

  const textEditor = (options) => (
    <InputText
      type="text"
      value={options.value}
      onChange={(e) => handleChange(options, e)}
      style={{ minWidth: '12rem' }}
    />
  );

  const addNewProject = () => {
    const currentTableData = tableData;
    currentTableData.unshift({ id: Math.floor(Math.random() * 10000) });
    setTableData(currentTableData);
    setActiveRowIndex(0);
  };
  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href={`https://unpkg.com/primereact/resources/themes/lara-${themeMode}-indigo/theme.css`}
        />
      </Helmet>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={addNewProject} variant="contained" style={{ marginBottom: '1rem' }}>
          Add New Service Subject
        </Button>
      </Grid>
      <DataTable
        value={tableData}
        showGridlines
        responsiveLayout="scroll"
        resizableColumns
        columnResizeMode="expand"
        size="small"
        rows={10}
        editMode="row"
        editingRows={editingRows}
        onRowEditChange={onRowEditChange}
        onRowEditComplete={onRowEditComplete}
        dataKey="id"
        paginator
      >
        <Column
          columnKey="serviceSubject"
          field="serviceSubject"
          header="Service Subject"
          sortable
          editor={(options) => textEditor(options)}
          reorderable={false}
          filter
          filterclear
        />
        <Column
          columnKey="taskName"
          field="taskName"
          header="Task Name"
          sortable
          editor={(options) => textEditor(options)}
          reorderable={false}
          filter
          filterclear
        />
        <Column
          columnKey="note"
          field="note"
          header="Note"
          sortable
          editor={(options) => textEditor(options)}
          reorderable={false}
          filter
          filterclear
        />
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
    </div>
  );
}
