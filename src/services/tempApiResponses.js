export const COUNTRIES = {
  data: [
    {
      id: 1,
      name: 'Bahrain',
      legalEntity: 'BAH'
    },
    {
      id: 2,
      name: 'Saudi Arabia',
      legalEntity: 'SAR'
    },
    {
      id: 3,
      name: 'Qatar',
      legalEntity: 'QTR'
    },
    {
      id: 4,
      name: 'United Arab Emirates',
      legalEntity: 'UAE'
    }
  ],
  isSuccessful: true,
  errors: []
};

export const REGIONS = {
  data: [
    {
      countryId: 2,
      countryName: 'Saudi Arabia',
      id: 1,
      name: 'Jeddah'
    },
    {
      countryId: 2,
      countryName: 'Saudi Arabia',
      id: 2,
      name: 'Riyadh'
    },
    {
      countryId: 2,
      countryName: 'Saudi Arabia',
      id: 3,
      name: 'Khobar'
    },
    {
      countryId: 2,
      countryName: 'Saudi Arabia',
      id: 4,
      name: 'Abha'
    },
    {
      countryId: 4,
      countryName: 'United Arab Emirates',
      id: 5,
      name: 'Sharjah'
    }
  ],
  isSuccessful: true,
  errors: []
};

export const BUSINESS_TYPES = {
  data: [
    {
      id: 1,
      name: 'Refill'
    },
    {
      id: 2,
      name: 'Maintenance'
    },
    {
      id: 3,
      name: 'Specialized Cleaning Services'
    },
    {
      id: 4,
      name: 'Audit'
    },
    {
      id: 5,
      name: 'demo business'
    }
  ],
  isSuccessful: true,
  errors: []
};

export const BUSINESS_SUB_TYPES = {
  data: [
    {
      id: 1,
      Name: 'RF-WHR',
      businessTypeId: 1
    },
    {
      id: 2,
      Name: 'RF-RZR',
      businessTypeId: 1
    },
    {
      id: 3,
      Name: 'RF-INU',
      businessTypeId: 1
    }
  ],
  isSuccessful: true,
  errors: []
};

export const LEGAL_ENTITIES = {
  data: [
    {
      id: 1,
      name: 'Reza Hygiene Kingdom Of Saudi Arabia'
    },
    {
      id: 2,
      name: 'Reza Hygiene Bahrain Branch'
    },
    {
      id: 3,
      name: 'Reza Hygiene Dubai Branch'
    },
    {
      id: 4,
      name: 'Reza Hygiene Qatar Branch'
    },
    {
      id: 5,
      name: 'Sports and Leisure Division'
    }
  ],
  isSuccessful: true,
  errors: []
};

export const RANDOM_COLOR = {
  data: '#A7D448',
  isSuccessful: true,
  errors: []
};

export const USER_ROLE_WISE_MENU = {
  data: {
    screens: [
      {
        id: 1,
        name: 'Dashboard',
        code: 'DASHBOARD',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 2,
        name: 'Administration',
        code: 'ADMIN',
        parentUIId: 0,
        subMenu: [
          {
            id: 3,
            name: 'Users',
            code: 'USERS',
            parentUIId: 2,
            subMenu: null
          },
          {
            id: 5,
            name: 'Countries/Currencies',
            code: 'COUNTRIESCUR',
            parentUIId: 2,
            subMenu: null
          },
          {
            id: 32,
            name: 'Manage Questions',
            code: 'MANAGEQ',
            parentUIId: 2,
            subMenu: null
          },
          {
            id: 39,
            name: 'Roles & Permissions',
            code: 'ROLESMGMT',
            parentUIId: 2,
            subMenu: null
          },
          {
            id: 40,
            name: 'System Defaults',
            code: 'SYSDEFAULTS',
            parentUIId: 2,
            subMenu: null
          }
        ]
      },
      {
        id: 4,
        name: 'Master List',
        code: 'MASTLIST',
        parentUIId: 0,
        subMenu: [
          {
            id: 6,
            name: 'Customers',
            code: 'MASTCUSTOMER',
            parentUIId: 4,
            subMenu: null
          },
          {
            id: 7,
            name: 'Salesmen',
            code: 'MASTSALESMAN',
            parentUIId: 4,
            subMenu: null
          },
          {
            id: 8,
            name: 'Servicemen',
            code: 'MASTSERVICEMAN',
            parentUIId: 4,
            subMenu: null
          }
        ]
      },
      {
        id: 9,
        name: 'Contracts/Projects',
        code: 'CONTRACTPROJ',
        parentUIId: 0,
        subMenu: [
          {
            id: 10,
            name: 'Contracts',
            code: 'CONTRACTS',
            parentUIId: 9,
            subMenu: null
          },
          {
            id: 11,
            name: 'Service Orders',
            code: 'SERVICEORDER',
            parentUIId: 9,
            subMenu: null
          },
          {
            id: 12,
            name: 'Project Expiration',
            code: 'PROJECTEXPIRY',
            parentUIId: 9,
            subMenu: null
          },
          {
            id: 13,
            name: 'Terminate Projects',
            code: 'TERMINATEPROJ',
            parentUIId: 9,
            subMenu: null
          }
        ]
      },
      {
        id: 14,
        name: 'Manage Schedule',
        code: 'MANAGESCHEDULE',
        parentUIId: 0,
        subMenu: [
          {
            id: 15,
            name: 'Add Call Out',
            code: 'ADDCALLOUT',
            parentUIId: 14,
            subMenu: null
          },
          {
            id: 16,
            name: 'Schedule Services',
            code: 'SCHEDULESERVICE',
            parentUIId: 14,
            subMenu: null
          }
        ]
      },
      {
        id: 17,
        name: 'Inventory Management',
        code: 'INVENTORYMGMT',
        parentUIId: 0,
        subMenu: [
          {
            id: 18,
            name: 'Material Picking',
            code: 'MATERIALPICKING',
            parentUIId: 17,
            subMenu: null
          },
          {
            id: 19,
            name: 'Material And Price',
            code: 'MATERIALPRICING',
            parentUIId: 17,
            subMenu: null
          },
          {
            id: 20,
            name: 'FOL Installation',
            code: 'FOLINSTALLATION',
            parentUIId: 17,
            subMenu: null
          },
          {
            id: 21,
            name: 'Equipments/Devices',
            code: 'EQPTDEVICES',
            parentUIId: 17,
            subMenu: null
          }
        ]
      },
      {
        id: 22,
        name: 'Invoicing',
        code: 'INVOICING',
        parentUIId: 0,
        subMenu: [
          {
            id: 23,
            name: 'Invoice',
            code: 'INVOICE',
            parentUIId: 22,
            subMenu: null
          },
          {
            id: 24,
            name: 'Invoice Overview',
            code: 'INVOICEOVERVIEW',
            parentUIId: 22,
            subMenu: null
          }
        ]
      },
      {
        id: 25,
        name: 'Credit Notes',
        code: 'CREDITNOTES',
        parentUIId: 0,
        subMenu: [
          {
            id: 26,
            name: 'Credit Notes Proposal And Workflow',
            code: 'CREDITNOTESWORKFLOW',
            parentUIId: 25,
            subMenu: null
          },
          {
            id: 27,
            name: 'Credit Control',
            code: 'CREDITCONTROL',
            parentUIId: 25,
            subMenu: null
          },
          {
            id: 28,
            name: 'Credit Control Coordinator',
            code: 'CREDITCOORDINATOR',
            parentUIId: 25,
            subMenu: null
          }
        ]
      },
      {
        id: 29,
        name: 'Reports',
        code: 'REPORTS',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 30,
        name: 'iPad Synchronization Log',
        code: 'IPADSYNCLOGS',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 31,
        name: 'Route Analysis',
        code: 'ROUTEANALYSIS',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 33,
        name: 'Discount Workflow',
        code: 'DISCOUNTWORKFLOW',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 34,
        name: 'Equipment Builder',
        code: 'EQPTBUILDER',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 35,
        name: 'Ax Synchronization',
        code: 'AXSYNC',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 36,
        name: 'Mobile Warehouse',
        code: 'MOBILEWAREHOUSE',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 37,
        name: 'Salesmen',
        code: 'SALESMAN',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 38,
        name: 'Export',
        code: 'EXPORT',
        parentUIId: 0,
        subMenu: []
      },
      {
        id: 41,
        name: 'Transfer Services',
        code: 'DEACTIVATEUSERS',
        parentUIId: 0,
        subMenu: []
      }
    ]
  },
  isSuccessful: true,
  errors: []
};

export const USER_LIST = {
  totalRecords: 1,
  userList: [
    {
      id: 1,
      employeeId: 150,
      userId: '8fea6fbb-c765-4eff-87df-4135a39809da',
      name: 'Muhammed Anwar Naseer Shaikh',
      username: 'Ameya.5587',
      password: 'lywy8063@WIA',
      shortName: 'Anwar',
      displayName: 'Anwar Shaikh',
      email: 'naseer.shaikh@Reza.com',
      mobileNo: '966504603776',
      axEmployeeId: '5587',
      legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
      legalEntityId: 1,
      role: [
        {
          id: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad',
          name: 'SUPERADMIN'
        }
      ],
      backColor: '#FFC0CB',
      textColor: '#FFFFFF',
      stringRegionIds: '[1]',
      stringCountryIds: '[1]',
      regionIds: [1],
      countryIds: [1],
      roleId: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad',
      preferredNameOption: 'shortName',
      preferredTheme: 'dark'
    }
  ]
};

export const ROLE_LIST = {
  pageSize: 10000,
  totalCount: 9,
  roles: [
    {
      name: 'SERVICEMANAGER',
      id: 'fa40d4c9-4343-4556-a7ef-4dea57438078'
    },
    {
      name: 'SERVICEMAN',
      id: 'f276495d-b915-48c2-8dc8-76a816dcbef6'
    },
    {
      name: 'DELIVERYDRIVER',
      id: 'e5b27717-979c-43b7-9a14-0918a9d53f6f'
    },
    {
      name: 'MyRole',
      id: 'c118789e-5d33-4a03-b366-5618a7cd7923'
    },
    {
      name: 'VANSALESMAN',
      id: 'bb4f40ad-2e9f-46c4-8f9f-ada0ea0dc57d'
    },
    {
      name: 'SUPERADMIN',
      id: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad'
    },
    {
      name: 'ITADMIN',
      id: '498108b4-0dcb-4120-949d-4a61bc6b7545'
    },
    {
      name: 'OPSADMIN',
      id: '497f3978-10a2-4a29-a9a3-6ecbbd1974c6'
    },
    {
      name: 'SALESMAN',
      id: '411d7b8a-5964-4b6e-a205-743c3736ccea'
    }
  ]
};

export const USER_PROFILE_DETAILS = {
  id: 1,
  employeeId: 150,
  userId: 'cc1d7853-197d-4214-bdc3-8ad098a13b7f',
  name: 'Muhammed Anwar Naseer Shaikh',
  username: 'Ameya.5587',
  password: 'jzcl3423@JUT',
  shortName: 'Anwar',
  displayName: 'Anwar Sgaikh',
  email: 'naseer.shaikh@Reza.com',
  mobileNo: '966504603776',
  axEmployeeId: '5587',
  legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
  legalEntityId: 1,
  role: [
    {
      id: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad',
      name: 'SUPERADMIN'
    }
  ],
  backColor: '#FFC0CB',
  textColor: '#FFFFFF',
  stringRegionIds: '[1]',
  stringCountryIds: '[1]',
  regionIds: [1],
  countryIds: [1],
  roleId: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad',
  preferredNameOption: 'shortName',
  preferredTheme: 'light',
  accessToken: ''
};

export const EMPLOYEE_LIST = {
  data: {
    employees: [
      {
        employeeId: 3508,
        employeeName: 'Lupe Lamora ',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3508,
        employeeName: 'Lupe Lamora ',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3517,
        employeeName: 'Percy Jackson',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3517,
        employeeName: 'Percy Jackson',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3551,
        employeeName: 'Mahela Kumaram Swamynathan',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3551,
        employeeName: 'Mahela Kumaram Swamynathan',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3555,
        employeeName: 'Boris Becker',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3555,
        employeeName: 'Boris Becker',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3556,
        employeeName: 'Joe Hrimathea',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      },
      {
        employeeId: 3556,
        employeeName: 'Joe Hrimathea',
        legalEntity: 'Reza Hygiene Kingdom Of Saudi Arabia',
        countryCode: null,
        mobileNo: '966504603776',
        email: 'prathamesh.jadhav@arowanaconsulting.com'
      }
    ],
    totalRecords: 98
  },
  isSuccessful: true,
  errors: []
};

export const REGIONS_IN_COUNTRY = {
  data: {
    countryRegionList: [
      {
        id: 7,
        name: 'Saudi Arabia',
        regions: [
          {
            id: 1,
            name: 'Abha'
          },
          {
            id: 4,
            name: 'Abu Dhabi'
          }
        ]
      },
      {
        id: 6,
        name: 'United Arab Emirates',
        regions: [
          {
            id: 2,
            name: 'Ajman'
          }
        ]
      }
    ]
  }
};

export const ADD_UPDATE_USER_PAYLOAD = {
  user: {
    id: 0,
    employeeId: 150,
    userId: '',
    name: 'Muhammed Anwar Naseer Shaikh',
    username: 'Ameya.5587',
    password: '',
    shortName: 'Anwar',
    displayName: 'Anwar Sgaikh',
    email: 'ameya.gadre@arowanaconsulting.com',
    mobileNo: '12345678',
    axEmployeeId: '5587',
    legalEntity: '',
    legalEntityId: 1,
    role: [],
    backColor: '#FFC0CB',
    textColor: '#FFFFFF',
    stringRegionIds: '',
    stringCountryIds: '',
    regionIds: [1],
    countryIds: [1],
    roleId: 'a6bce14a-fee3-41c9-8948-1b9ce4aa10ad',
    preferredNameOption: 'shortName',
    preferredTheme: 'light'
  }
};

export const MOBILE_WAREHOUSE_ITEM_LIST = [
  { id: 'warehouse1', name: 'Warehouse 1' },
  { id: 'warehouse2', name: 'Warehouse 2' },
  { id: 'warehouse3', name: 'Warehouse 3' },
  { id: 'warehouse4', name: 'Warehouse 4' },
  { id: 'warehouse5', name: 'Warehouse 5' },
  { id: 'warehouse6', name: 'Warehouse 6' }
];

export const MOBILE_WAREHOUSE_GRID_DATA = [
  {
    stockCode: 611080,
    description: 'Refill Vibrant Sense 600 ml',
    qty: 21,
    uom: 'Kg'
  },
  {
    stockCode: 621183,
    description: 'Battery Type C',
    qty: 2,
    uom: 'Each'
  },
  {
    stockCode: 621176,
    description: 'Battery Type D',
    qty: 170,
    uom: 'Each'
  }
];
