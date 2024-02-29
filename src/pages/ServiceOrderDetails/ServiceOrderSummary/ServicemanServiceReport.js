import React from 'react';
import { Grid, Typography, Button, Divider } from '@mui/material';
import SimpleTable from '../../../components/table/simpleTable';

function ServicemanServiceReport() {
  const columnForConsumablesPart = [
    {
      field: 'stockCode',
      header: 'Stock Code'
    },
    {
      field: 'description',
      header: 'Description'
    },
    {
      field: 'quantity',
      header: 'Quantity'
    },
    {
      field: 'ratio',
      header: 'Ratio'
    },
    {
      field: 'action',
      header: 'Action'
    },
    {
      field: 'discountAmount',
      header: 'Discount Amount'
    },
    {
      field: 'unitPrice',
      header: 'Unit Price'
    },
    {
      field: 'totalPrice',
      header: 'Total Price'
    },
    {
      field: 'errorCode',
      header: 'Error Code'
    },
    {
      field: 'serviceRelatedNotes',
      header: 'Service Related Notes'
    }
  ];
  const columnForRequestedParts = [
    {
      field: 'stockCode',
      header: 'Stock Code'
    },
    {
      field: 'description',
      header: 'Description'
    },
    {
      field: 'quantity',
      header: 'Quantity'
    },
    {
      field: 'note',
      header: 'Note'
    }
  ];
  const headCellsType = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
  const headCellsForRequestedParts = ['NONE', 'NONE', 'NONE'];

  return (
    <Grid>
      {/* Grid for Typos */}
      <Grid item xs={12} style={{ border: '1px solid black' }} p={0.5}>
        <Grid container spacing={3} mt={-0.8}>
          {/* Grid for Service Date */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Date
            </Typography>
            <Typography variant="caption">21-03-2022</Typography>
          </Grid>

          {/* Grid for Service Type */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Type
            </Typography>
            <Typography variant="caption">Callout/ Scheduled</Typography>
          </Grid>

          {/* Grid for Serviceman's notes related to this service */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Serviceman's notes related to this service
            </Typography>
            <Typography variant="caption">
              {' '}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </Typography>
          </Grid>

          {/* Grid for Staff training on site */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Staff training on site
            </Typography>
            <Typography variant="caption"> Lorem ipsum dolor sit amet</Typography>
          </Grid>

          {/* Grid for Recipients */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Recipients
            </Typography>
            <Typography variant="caption"> Lorem ipsum</Typography>
          </Grid>

          {/* Grid for Email subject */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Email Subject
            </Typography>
            <Typography variant="caption">Lorem ipsum Lorem ipsum</Typography>
          </Grid>

          {/* Grid for Email message */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Email Message
            </Typography>
            <Typography variant="caption">
              Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for Service Subjects */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Subject
            </Typography>
            <Typography variant="caption">D02036 Scent Diffuser W.Fan M1500H</Typography>
          </Grid>

          {/* Grid for Type */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Type
            </Typography>
            <Typography variant="caption">FOL / Owned by customer</Typography>
          </Grid>

          {/* Grid for Consumables / Spare parts heading -1 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Consumables / Spare parts</Typography>
          </Grid>

          {/* Grid for consumbles / Spare parts table layout -1 */}
          <Grid item xs={12} className="servicemanServiceReport-dataTable-cls">
            <SimpleTable
              rowData={[]}
              headerData={columnForConsumablesPart}
              rows={10}
              showGridlines
              responsiveLayout="scroll"
              resizableColumns
              columnResizeMode="expand"
              size="small"
              headCellsType={headCellsType}
            />
          </Grid>

          {/* Grid for Total -1 */}
          <Grid item xs={12} display="flex">
            <Typography variant="subtitle2" fontSize="12px">
              Total :-
            </Typography>
            <Typography variant="caption" ml={1}>
              1523.00
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for Service Subjects */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Service Subject
            </Typography>
            <Typography variant="caption">D02036 Scent Diffuser W.Fan M1500H</Typography>
          </Grid>

          {/* Grid for Type */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" fontSize="12px">
              Type
            </Typography>
            <Typography variant="caption">FOL / Owned by customer</Typography>
          </Grid>

          {/* Grid for Consumables / Spare parts heading -2 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Consumables / Spare parts</Typography>
          </Grid>

          {/* Grid for consumbles / Spare parts table layout -2 */}
          <Grid item xs={12} className="servicemanServiceReport-dataTable-cls">
            <SimpleTable
              rowData={[]}
              headerData={columnForConsumablesPart}
              rows={10}
              showGridlines
              responsiveLayout="scroll"
              resizableColumns
              columnResizeMode="expand"
              size="small"
              headCellsType={headCellsType}
            />
          </Grid>

          {/* Grid for Total -2 */}
          <Grid item xs={12} display="flex">
            <Typography variant="subtitle2" fontSize="12px">
              Total :-
            </Typography>
            <Typography variant="caption" ml={1}>
              5523.00
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for requested parts */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Requested Parts</Typography>
          </Grid>

          {/* Grid for requested parts table */}
          <Grid item xs={12} className="servicemanServiceReport-dataTable-cls">
            <SimpleTable
              rowData={[]}
              headerData={columnForRequestedParts}
              rows={10}
              showGridlines
              responsiveLayout="scroll"
              resizableColumns
              columnResizeMode="expand"
              size="small"
              headCellsType={headCellsForRequestedParts}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid For Attatchments */}
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle2" fontSize="12px">
              Attachments
            </Typography>
            <Grid display="flex" justifyContent="flex-start" flexWrap="wrap" p={1}>
              <Grid style={{ border: '1px solid black', borderRadius: '5px' }} p={0.5} mr={0.5}>
                <img src="" alt="No Attachment" />
              </Grid>
              <Grid style={{ border: '1px solid black', borderRadius: '5px' }} p={0.5}>
                <img src="" alt="No Attachment" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for Customer Signature */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" fontSize="12px">
              Customer Signature
            </Typography>
            <Grid style={{ border: '1px solid black', borderRadius: '5px' }} item xs={5} p={0.5} m={0.5}>
              <img src="" alt="No Attachment" />
            </Grid>
          </Grid>

          {/* Grid for Employee ID */}
          <Grid item xs={12} sm={4} mt={0.7}>
            <Typography variant="subtitle2" fontSize="12px">
              Employee ID
            </Typography>
            <Typography variant="caption">EMP10125</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Grid for button PDF and Print */}
          <Grid item xs={12} sm={12} mb={1}>
            <Typography variant="subtitle2" fontSize="12px" mb={0.5}>
              Service Report
            </Typography>
            <Grid display="flex">
              <Button variant="contained" size="small" sx={{ marginRight: '1rem' }}>
                PDF
              </Button>
              <Button variant="contained" size="small" color="warning" sx={{ marginRight: '1rem' }}>
                Print
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ServicemanServiceReport;
