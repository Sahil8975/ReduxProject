import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';

export const numberInWords = [
  {
    id: 1,
    name: 'First'
  },
  {
    id: 2,
    name: 'Second'
  },
  {
    id: 3,
    name: 'Third'
  },
  {
    id: 4,
    name: 'Fourth'
  },
  {
    id: 5,
    name: 'Last'
  }
];

export const projectLocations = [
  { id: 1, name: 'Location 1' },
  { id: 2, name: 'Location 2' },
  { id: 3, name: 'Location 3' },
  { id: 4, name: 'Location 4' },
  { id: 5, name: 'Location 5' }
];

export const projectNumbers = [
  { id: 1, name: 'project 1' },
  { id: 2, name: 'project 2' },
  { id: 3, name: 'project 3' },
  { id: 4, name: 'project 4' },
  { id: 5, name: 'project 5' }
];

export const serviceFreqTypeOpts = [
  { name: 'Number Of Services', value: true },
  { name: 'Project End Date', value: '' }
];

export const fixedType = [
  { name: 'Number Of Services', value: 'Number Of Services' },
  { name: 'Project End Date', value: 'Project End Date' }
];

export const serviceFrequencyMonthlyTypes1 = [
  { name: 'Recur On nth date of month', value: 'recurEveryDay' },
  { name: 'Recur specific day of Month', value: 'recurEveryMonth' }
];

export const serviceFrequencyMonthlyTypes2 = [
  { name: 'Option 1', value: 'Day of every month' },
  { name: 'Option 2', value: 'Service frequency month OR' }
];

export const serviceFrequencyYearlyTypes = [
  { name: 'Month of Year', value: 'monthOfYear' },
  { name: 'Day of Month of Year', value: 'dayOfMonthOfYear' }
];

export const statusList = [
  {
    id: 1,
    name: 'Active'
  }
];

export const columnForProject = [
  {
    field: 'scheduledDayDate',
    header: 'Scheduled Day Date',
    sortable: true,
    filter: true
  },
  {
    field: 'serviceDayDate',
    header: 'Service Day Date',
    sortable: true,
    filter: true
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    filter: true
  },
  {
    field: 'depricateScheduled',
    header: '',
    icon: <DeleteIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Depricate'
  },
  {
    field: 'printScheduled',
    header: '',
    icon: <PrintIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Print'
  },
  {
    field: 'editScheduled',
    header: '',
    icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Edit'
  },
  {
    field: 'invoiceDate',
    header: 'Invoice Date',
    sortable: true,
    filter: true
  },
  {
    field: 'invoiceNumber',
    header: 'Invoice Number',
    sortable: true,
    filter: true
  },
  {
    field: 'onAccountLineNumber',
    header: 'On A/c Line Number',
    sortable: true,
    filter: true
  },
  {
    field: 'amount',
    header: 'Amount',
    sortable: true,
    filter: true
  },
  {
    field: 'depricateInvoice',
    header: '',
    icon: <DeleteIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Depricate'
  },
  {
    field: 'printInvoice',
    header: '',
    icon: <PrintIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Print'
  },
  {
    field: 'editInvoice',
    header: '',
    icon: <EditIcon style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1rem' }} />,
    // onClick: handleClickEdit,
    tooltipTitle: 'Click to Edit'
  },
  {
    field: 'receiptDate',
    header: 'Receipt Date',
    sortable: true,
    filter: true
  },
  {
    field: 'receiptNumber',
    header: 'Receipt Number',
    sortable: true,
    filter: true
  },
  {
    field: 'paymentAmpunt',
    header: 'Amount',
    sortable: true,
    filter: true
  },
  {
    field: 'creditNoteDate',
    header: 'Credit Note Date',
    sortable: true,
    filter: true
  },
  {
    field: 'creditNoteNumber',
    header: 'Credit Note Number',
    sortable: true,
    filter: true
  },
  {
    field: 'creditAmount',
    header: 'Amount',
    sortable: true,
    filter: true
  }
];
export const headCellsType = [
  'NONE',
  'NONE',
  'NONE',
  'ICON',
  'ICON',
  'ICON',
  'NONE',
  'NONE',
  'NONE',
  'NONE',
  'ICON',
  'ICON',
  'ICON',
  'NONE',
  'NONE',
  'NONE',
  'NONE',
  'NONE',
  'NONE'
];
