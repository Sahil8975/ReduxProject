// routes
import { PATH_DASHBOARD, ROUTES } from '../../routes/paths';
// components
// import Label from '../../components/Label';
// import SvgIconStyle from '../../components/SvgIconStyle';
// import menuConfig from '../main/MenuConfig';

// ----------------------------------------------------------------------

// const getIcon = (name) => (
//   <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
// );

// const ICONS = {
//   blog: getIcon('ic_blog'),
//   cart: getIcon('ic_cart'),
//   chat: getIcon('ic_chat'),
//   mail: getIcon('ic_mail'),
//   user: getIcon('ic_user'),
//   kanban: getIcon('ic_kanban'),
//   banking: getIcon('ic_banking'),
//   calendar: getIcon('ic_calendar'),
//   ecommerce: getIcon('ic_ecommerce'),
//   analytics: getIcon('ic_analytics'),
//   dashboard: getIcon('ic_dashboard'),
//   booking: getIcon('ic_booking')
// };

const {
  USERS,
  COUNTRIESCUR,
  MASTCUSTOMER,
  MASTSALESMAN,
  MASTSERVICEMAN,
  CONTRACTS,
  // TERMINATEPROJ,
  ADDCALLOUT,
  // SCHEDULESERVICE,
  SCHEDULEVIEWER,
  LEAVEDETAILS,
  INVOICE,
  CUSTOMERVIEW
} = ROUTES;

const sidebarConfig = [
  {
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.home },
      {
        title: 'Administration',
        path: '',
        children: [
          { title: 'Users', path: USERS },
          { title: 'Project Equivalency', path: '/projectEquivalency' },
          { title: 'Countries', path: COUNTRIESCUR },
          { title: 'Leave Details', path: LEAVEDETAILS }
        ]
      },
      {
        title: 'Customer Management',
        path: '',
        children: [{ title: 'Customer View', path: CUSTOMERVIEW }]
      },
      {
        title: 'Master List',
        path: PATH_DASHBOARD.general.service,
        children: [
          { title: 'Customers', path: MASTCUSTOMER },
          { title: 'Salesmen', path: MASTSALESMAN },
          { title: 'Servicemen', path: MASTSERVICEMAN }
        ]
      },
      {
        title: 'Contracts/Projects',
        path: '',
        children: [
          { title: 'Contracts', path: CONTRACTS },
          // { title: 'Projects', path: '/project/add' },
          { title: 'Service Orders', path: '', isPending: true },
          { title: 'Project Expiration List', path: '' },
          { title: 'Terminate Projects', path: '' }
          // { title: 'Project Expiration List', path: PROJECTEXPIRY },
          // { title: 'Terminate Projects', path: TERMINATEPROJ }
        ]
      },
      {
        title: 'Manage Schedule',
        path: '',
        children: [
          { title: 'Add Call Out', path: ADDCALLOUT },
          // { title: 'Schedule Services', path: SCHEDULESERVICE },
          { title: 'Schedule Services', path: '' },
          { title: 'Schedule Viewer', path: SCHEDULEVIEWER }
        ]
      },
      {
        title: 'Inventory Management',
        path: '',
        children: [
          { title: 'Material Picking List', path: '/data' },
          { title: 'Material And Price List', path: '', isPending: true },
          { title: 'FOL Installation List', path: '', isPending: true },
          { title: 'Equipments/Devices', path: '', isPending: true }
        ]
      },
      {
        title: 'Invoicing',
        path: '',
        children: [
          { title: 'Invoice List', path: INVOICE },
          { title: 'Invoice Overview', path: '', isPending: true }
        ]
      },
      {
        title: 'Credit Notes',
        path: '',
        children: [
          { title: 'Credit Notes Proposal And Workflow', path: '', isPending: true },
          { title: 'Credit Control View', path: '', isPending: true },
          { title: 'Credit Control Coordinator View', path: '', isPending: true }
        ]
      },
      { title: 'Reports', path: '', isPending: true },
      { title: 'iPad Synchronization Log', path: '', isPending: true },
      { title: 'Route Analysis', path: '', isPending: true },
      { title: 'Manage Questions', path: '', isPending: true },
      { title: 'Discount Workflow', path: '', isPending: true },
      { title: 'Equipment Builder', path: '', isPending: true },
      { title: 'Ax Synchronization', path: '', isPending: true },
      { title: 'Mobile Warehouse', path: '', isPending: true },
      { title: 'Salesmen View', path: '', isPending: true },
      { title: 'Export', path: '', isPending: true }
    ]
  }
];

export default sidebarConfig;
