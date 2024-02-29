// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const NOTE_FOUND_PATH = '/404';

export const COMING_SOON = '/coming-soon';

export const ROUTES = {
  DEFAULT: '/',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/forgotPassword',
  HOME: '/home',
  LOGOUT: '/logout',
  VALIDATE: '/validate',
  SIGN_IN: '/signin-callback',
  VALIDATE_ACCESS_CODE: '/validate/:accessCode',
  SIGN_IN_CALLBACK: '/signin-callback/:code',
  LOGIN: '/login',
  RESET_PASSWORD: '/resetPassword',
  SIGN_IN_CALLBACK_HTML: '/signin-callback.html',
  USERS: '/administration/users',
  LEAVEDETAILS: '/administration/leave-details',
  COUNTRIESCUR: '/administration/countries',
  COUNTRIES: '/administration/countries',
  MASTCUSTOMER: '/master-list/customers',
  MASTSALESMAN: '/master-list/salesman',
  MASTSERVICEMAN: '/master-list/serviceman',
  CONTRACTS: '/contracts-projects/contracts',
  // PROJECTEXPIRY: '/contracts-projects/project-expiration',
  PROJECTEXPIRY: COMING_SOON,
  // TERMINATEPROJ: '/contracts-projects/terminate-project',
  TERMINATEPROJ: COMING_SOON,
  ADDCALLOUT: '/manage-schedule/add-call-out',
  SERVICEORDERDETAILS: '/manage-schedule/schedule-viewer/serviceOrderDetails',
  // SCHEDULESERVICE: '/manage-schedule/schedule-service',
  SCHEDULESERVICE: COMING_SOON,
  SCHEDULEVIEWER: '/manage-schedule/schedule-viewer',
  EDIT_SCHEDULE: '/manage-schedule/schedule-viewer/edit-schedule',
  MATERIALPICKING: '/inventory-management/material-picking',
  INVOICE: '/invoiceList',
  ADD_CALL_OUT: '/manage-schedule/add-call-out',
  EDIT_CONTRACT: '/contracts-projects/contracts/edit/:id',
  ADD_CONTRACT: '/contracts-projects/contracts/add',
  EDIT_PROJECT: '/contracts-projects/contracts/projects/edit',
  ADD_PROJECT: '/contracts-projects/contracts/projects/add',
  ADD_SERVICE_SUBJECT: '/contracts-projects/contracts/project/add-service-subject',
  EDIT_SERVICE_SUBJECT: '/contracts-projects/contracts/project/edit-service-subject',
  ADD_USER: '/administration/users/add-user',
  EDIT_USER: '/administration/users/edit-user/:id',
  CONTRACT_DETAILS: '/contracts/details',
  CONTRACT_MANAGEMENT_CUSTOMER: '/contract-management/customer/',
  CONTRACT_MANAGEMENT_CONTRACTS: '/contract-management/contracts',
  CONTRACT_MANAGEMENT_SEARCH_CONTRACT: '/contract-management/search-contract',
  CONTRACT_MANAGEMENT_UPLOAD_ATTACHMENTS: '/contract-management/uploadattachments',
  CONTRACT_MANAGEMENT_REMOVE_ATTACHMENTS: '/contract-management/removeattachments',
  CONTRACT_MANAGEMENT_EDIT_CONTRCAT: '/contracts-projects/contracts/edit/',
  UPDATE_CONTRACT: '/contract-management/update-contracts',
  CURRENCY_LIST: '/countrycurrency/list',
  CUSTOMERVIEW: '/customer-management/customer-view',
  ADDCUSTOMER: '/customer-management/customer-view/add-customer',
  ADMIN: COMING_SOON,
  MANAGEQ: COMING_SOON,
  ROLESMGMT: COMING_SOON,
  SYSDEFAULTS: COMING_SOON,
  DEACTIVATEUSERS: COMING_SOON,
  MASTLIST: COMING_SOON,
  CONTRACTPROJ: COMING_SOON,
  SERVICEORDER: COMING_SOON,
  MANAGESCHEDULE: COMING_SOON,
  INVENTORYMGMT: COMING_SOON,
  MATERIALPRICING: COMING_SOON,
  FOLINSTALLATION: COMING_SOON,
  EQPTDEVICES: COMING_SOON,
  INVOICING: COMING_SOON,
  INVOICEOVERVIEW: COMING_SOON,
  CREDITNOTES: COMING_SOON,
  CREDITNOTESWORKFLOW: COMING_SOON,
  CREDITCONTROL: COMING_SOON,
  CREDITCOORDINATOR: COMING_SOON,
  REPORTS: COMING_SOON,
  IPADSYNCLOGS: COMING_SOON,
  ROUTEANALYSIS: COMING_SOON,
  DISCOUNTWORKFLOW: COMING_SOON,
  EQPTBUILDER: COMING_SOON,
  AXSYNC: COMING_SOON,
  SALESMAN: COMING_SOON,
  EXPORT: COMING_SOON,
  MOBILEWAREHOUSE: '/mobile-warehouse-item-list'
};

const { LOGIN, DASHBOARD, MASTCUSTOMER } = ROUTES;

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, LOGIN),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    home: path('', DASHBOARD),
    customers: path(ROOTS_DASHBOARD, MASTCUSTOMER),
    contracts: path(ROOTS_DASHBOARD, '/contracts'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    service: path(ROOTS_DASHBOARD, '/service')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
