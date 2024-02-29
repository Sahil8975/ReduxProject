import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import ContractsCreation from '../pages/contracts/ContractsCreation';
import DashboardLayout from '../layouts/dashboard';
// components
import LoadingScreen from '../components/LoadingScreen';
import Login from '../pages/auth/Login';
import { COMING_SOON, ROUTES } from './paths';

// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

const {
  VALIDATE_ACCESS_CODE,
  SIGN_IN,
  RESET_PASSWORD,
  COUNTRIESCUR,
  HOME,
  DASHBOARD,
  USERS,
  MASTCUSTOMER,
  MASTSALESMAN,
  MASTSERVICEMAN,
  CONTRACTS,
  PROJECTEXPIRY,
  TERMINATEPROJ,
  ADDCALLOUT,
  SERVICEORDERDETAILS,
  SCHEDULESERVICE,
  SCHEDULEVIEWER,
  MATERIALPICKING,
  INVOICE,
  MOBILEWAREHOUSE,
  ADD_CONTRACT,
  EDIT_CONTRACT,
  ADD_USER,
  EDIT_USER,
  ADD_PROJECT,
  ADD_SERVICE_SUBJECT,
  EDIT_SERVICE_SUBJECT,
  EDIT_PROJECT,
  LEAVEDETAILS,
  EDIT_SCHEDULE,
  CUSTOMERVIEW,
  ADDCUSTOMER
} = ROUTES;

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: 'login',
      element: <Login />
    },
    {
      path: RESET_PASSWORD,
      element: <Login />
    },
    {
      path: VALIDATE_ACCESS_CODE,
      element: <ValidateEmail />
    },
    {
      path: SIGN_IN,
      element: <SigninCallback />
    },
    {
      /* path: 'dashboard',
      element: <DashboardLayout />,
      children: [{ path: '', element: <Dashboard /> }] */
    },
    {
      /* path: 'Registration',
      element: <DashboardLayout />,
      children: [
       // { path: '/', element: <Navigate to="/Registration/Express-appointment" replace /> },
       // { path: 'Express-appointment', element: <ExpressRegistration /> },
       // { path: 'Create-appointment', element: <CreateAppointment /> },
        // { path: 'Manage-appointment', element: <ManageAppointment /> }
      ] */
    },
    {
      path: 'Manage-order',
      element: <DashboardLayout />,
      children: [
        {
          path: '/Manage-order/Dispatch-appointment',
          element: <Navigate to="/Manage-order/Dispatch-appointment" replace />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: HOME,
          element: <LandingPage />
        },
        {
          path: DASHBOARD,
          element: <LandingPage />
        },
        {
          path: COUNTRIESCUR,
          element: <CountryList />
        },
        {
          path: '/employee',
          element: <Employee />
        },
        {
          path: MATERIALPICKING,
          element: <MaterialPickingList />
        },
        {
          path: '/invoice',
          element: <Invoice />
        },
        // {
        //   path: '/pay',
        //   element: <StripeContainer />
        // },
        {
          path: '/components',
          element: <ComponentsPage />
        },
        // {
        //   path: SCHEDULESERVICE,
        //   element: <ServiceDashboardPage />
        // },
        {
          path: SCHEDULEVIEWER,
          element: <ScheduleViewerPage />
        },
        {
          path: ADD_CONTRACT,
          element: <ContractsCreation />
        },
        {
          path: EDIT_CONTRACT,
          element: <EditContractPage />
        },
        {
          path: ADD_PROJECT,
          element: <ProjectCreationPage />
        },
        {
          path: ADD_SERVICE_SUBJECT,
          element: <AddServiceSubject />
        },
        {
          path: `${EDIT_SERVICE_SUBJECT}/:id`,
          element: <AddServiceSubject />
        },
        {
          path: `${EDIT_PROJECT}/:id`,
          element: <ProjectCreationPage />
        },
        {
          path: CONTRACTS,
          element: <ContractListPage />
        },
        // {
        //   path: PROJECTEXPIRY,
        //   element: <ProjectExpirationPage />
        // },
        {
          path: ADDCALLOUT,
          element: <AddCallOutPage />
        },
        // {
        //   path: TERMINATEPROJ,
        //   element: <TerminateProjectPage />
        // },
        {
          path: INVOICE,
          element: <InvoiceListPage />
        },
        {
          path: '/administration',
          element: <AdministrationLandingPage />
        },
        {
          path: USERS,
          element: <UserListPage />
        },
        {
          path: ADD_USER,
          element: <AddNewUserPage />
        },
        {
          path: EDIT_USER,
          element: <AddNewUserPage />
        },
        {
          path: MASTSALESMAN,
          element: <SalesmanListPage />
        },
        {
          path: MOBILEWAREHOUSE,
          element: <MobileWarehouseListPage />
        },
        {
          path: MASTSERVICEMAN,
          element: <ServicemanListPage />
        },
        {
          path: '/projectEquivalency',
          element: <ProjectEquivalencyListPage />
        },
        {
          path: '/add-projectEquivalency',
          element: <AddProjectEquivalencyPage />
        },
        {
          path: '/projectEquivalency/edit/:id',
          element: <AddProjectEquivalencyPage />
        },
        {
          path: SERVICEORDERDETAILS,
          element: <ServiceOrderDetailsPage />
        },
        {
          path: MASTCUSTOMER,
          element: <Customers />
        },
        {
          path: LEAVEDETAILS,
          element: <LeaveDetails />
        },
        {
          path: EDIT_SCHEDULE,
          element: <EditSchedule />
        },
        {
          path: CUSTOMERVIEW,
          element: <CustomerView />
        },
        {
          path: ADDCUSTOMER,
          element: <CreateUpdateCustomer />
        }
      ]
    },
    {
      path: '',
      element: <DashboardLayout />,
      children: [{ path: 'Profile', element: <PageFour /> }]
    },
    // Main Routes
    {
      path: '*',
      element: <DashboardLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '',
      element: <DashboardLayout />,
      children: [{ path: COMING_SOON, element: <ComingSoon /> }]
    },
    /* {
      path: HOME,
      element: <LandingPage />
      // children: [{ path: '/', element: <Dashboard /> }]
    },
    {
      path: '/employee',
      element: <Employee />
    },
    {
      path: '/data',
      element: <Data />
    },
    {
      path: '/invoice',
      element: <Invoice />
    },
    {
      path: '/pay',
      element: <StripeContainer />
    },
    {
      path: '/components',
      element: <ComponentsPage />
    },
    */
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage/LandingPage')));
const CountryList = Loadable(lazy(() => import('../pages/Administration/CountryList/CountryList')));
const Employee = Loadable(lazy(() => import('../pages/Employee')));
// const Data = Loadable(lazy(() => import('../pages/Data')));
const MaterialPickingList = Loadable(lazy(() => import('../pages/InventoryManagement/MaterialPickingList')));
const Invoice = Loadable(lazy(() => import('../pages/Invoice')));
// const StripeContainer = Loadable(lazy(() => import('../pages/StripeContainer')));
const ComponentsPage = Loadable(lazy(() => import('../pages/ComponentsPage')));
const ProjectCreationPage = Loadable(lazy(() => import('../pages/ProjectCreation/ProjectCreation')));
const AddServiceSubject = Loadable(lazy(() => import('../pages/ProjectCreation/AddServiceSubject')));
const ContractListPage = Loadable(lazy(() => import('../pages/contracts/ContractList')));
const ProjectExpirationPage = Loadable(lazy(() => import('../pages/ProjectExpiration/ProjectExpiration')));
const Customers = Loadable(lazy(() => import('../pages/Customers/CustomersList')));
const AddCallOutPage = Loadable(lazy(() => import('../pages/AddCallOut/AddCallOutPage')));
const ServiceDashboardPage = Loadable(lazy(() => import('../pages/ScheduleService')));
const TerminateProjectPage = Loadable(lazy(() => import('../pages/TerminateAllProject/TerminateProject')));
const InvoiceListPage = Loadable(lazy(() => import('../pages/InvoiceList/InvoiceList')));
const ValidateEmail = Loadable(lazy(() => import('../components/authentication/login/ValidateEmail')));
const SigninCallback = Loadable(lazy(() => import('../components/authentication/identityServer/SigninCallback')));
const AdministrationLandingPage = Loadable(lazy(() => import('../pages/Administration/AdministrationLandingPage')));
const UserListPage = Loadable(lazy(() => import('../pages/Administration/UserManagement/UserList')));
const AddNewUserPage = Loadable(lazy(() => import('../pages/Administration/UserManagement/AddNewUser/AddNewUser')));
const SalesmanListPage = Loadable(lazy(() => import('../pages/Salesman/SalesmanList')));
const MobileWarehouseListPage = Loadable(lazy(() => import('../pages/MobileWarehouseList/MobileWarehouseList')));
const ServicemanListPage = Loadable(lazy(() => import('../pages/ServicemanOrTechnicians/ServicemanList')));
const ProjectEquivalencyListPage = Loadable(lazy(() => import('../pages/ProjectEquivalency/ProjectEquivalencyList')));
const AddProjectEquivalencyPage = Loadable(lazy(() => import('../pages/ProjectEquivalency/AddProjectEquivalency')));
const EditContractPage = Loadable(lazy(() => import('../pages/contracts/EditContract')));
const ServiceOrderDetailsPage = Loadable(lazy(() => import('../pages/ServiceOrderDetails/ServiceOrderDetails')));
const LeaveDetails = Loadable(lazy(() => import('../pages/LeaveDetails/LeaveDetails')));
const ScheduleViewerPage = Loadable(lazy(() => import('../pages/ScheduleViewer/ScheduleViewer')));
const EditSchedule = Loadable(lazy(() => import('../pages/ScheduleViewer/EditSchedule/EditSchedule')));
const CustomerView = Loadable(lazy(() => import('../pages/CustomerManagement/CustomerView/CustomerView')));
const CreateUpdateCustomer = Loadable(
  lazy(() => import('../pages/CustomerManagement/ManageCustomer/CreateUpdateCustomer'))
);
