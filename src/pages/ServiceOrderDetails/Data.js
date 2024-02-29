export const GroupByServicemanData = [
  {
    id: 1,
    servicemanName: 'Arun Kumar',
    details: [
      {
        id: 1,
        customerName: 'French Bakery L.L.C',
        contractNumber: 'RHECDU_0205',
        location: 'Al Aweer, Dubai - United Arab Emirates',
        projectNumber: 'RHEPDU_0205_028_001',
        serviceSubject: '618132 Modular Soap Disp. Refillable 900ml 4LR-WWG',
        serviceType: 'Refill',
        status: 'Schedulled',
        preferredTimings: 'Morning',
        serviceDate: '29-08-2022'
      },
      {
        id: 2,
        customerName: 'French Bakery L.L.C',
        contractNumber: 'RHECDU_0205',
        location: 'Al Aweer, Dubai - United Arab Emirates',
        projectNumber: 'RHEPDU_0205_011_001',
        serviceSubject: 'D01013 Quantura 10 Single Dishwash Detergent, \n D01014 Quantura 10 Single Dishwash Rinse',
        serviceType: 'Maintenance',
        status: 'Callout',
        preferredTimings: 'Evening',
        serviceDate: '29-08-2022'
      }
    ]
  },
  {
    id: 2,
    servicemanName: 'Ramshad Thatta Thazhath',
    details: [
      {
        id: 1,
        customerName: 'Panda Retail Company',
        contractNumber: 'HSDCJD_0263',
        location: 'Al Hamra mall',
        projectNumber: 'HSDPJD_0263_146_001',
        serviceSubject: '99717700 Scrubmaster B 120 R',
        serviceType: 'Maintenance',
        status: 'Schedulled',
        preferredTimings: 'Evening',
        serviceDate: '29-08-2022'
      }
    ]
  },
  {
    id: 3,
    servicemanName: 'Leo Sajan',
    details: [
      {
        id: 1,
        customerName: 'Panda Retail Company',
        contractNumber: 'HSDCJD_0263',
        location: 'Al Nakheel mall',
        projectNumber: 'HSDPJD_0263_149_001',
        serviceSubject: '99717512 Hako Scrubmaster B 75 R Basic / TB 550 / SF 760 / 105 Ah',
        serviceType: 'Refill',
        status: 'Hold',
        preferredTimings: 'Morning',
        serviceDate: '29-08-2022'
      }
    ]
  },
  {
    id: 4,
    servicemanName: 'Javad Keezhu Veettil',
    details: [
      {
        id: 4,
        customerName: 'Addoha Poultry Co',
        contractNumber: 'HSDCKH_0097',
        location: 'Jubail "JUBAIL Saudi Arabia ",SAU',
        projectNumber: 'HSDPKH_0097_001_004',
        serviceSubject: 'GE1000 Generic Equipment',
        serviceType: 'Refill',
        status: 'Callout',
        preferredTimings: 'Evening',
        serviceDate: '29-08-2022'
      }
    ]
  },
  {
    id: 5,
    servicemanName: 'Burhanudeen Talhath',
    details: [
      {
        id: 5,
        customerName: 'Different Food Company Ltd',
        contractNumber: 'HSDCRU_0616',
        location: 'As Sahafah, Olaya St. 6531, 3059 Riyadh 13321 Saudi Arabia',
        projectNumber: 'HSDPRU_0616_002_001',
        serviceSubject: 'D01005 Quantura 200 Bchem Comp QD200-BT/C/D9',
        serviceType: 'Maintenance',
        status: 'Hold',
        preferredTimings: 'Night',
        serviceDate: '29-08-2022'
      }
    ]
  },
  {
    id: 6,
    servicemanName: 'Ashar Parasuraman Kunnath',
    details: [
      {
        id: 1,
        customerName: 'Different Food Company Ltd',
        contractNumber: 'HSDCRU_0616',
        location: 'As Sahafah, Olaya St. 6531, 3059 Riyadh 13321 Saudi Arabia',
        projectNumber: 'HSDPRU_0616_001_001',
        serviceSubject: '618132 Modular Soap Disp. Refillable 900ml 4LR-WWG',
        serviceType: 'Audit',
        status: 'Schedulled',
        preferredTimings: 'Night',
        serviceDate: '30-08-2022'
      }
    ]
  },
  {
    id: 7,
    servicemanName: 'Neil Necesario Jamboy',
    details: [
      {
        id: 1,
        customerName: 'United Flowers for Vegitable Oil Co Ltd',
        contractNumber: 'HSDCJD_0906',
        location: '5119 Al Mahjar Unit#1 Jeddah 22423-7990,SAU',
        projectNumber: 'HSDPJD_0906_001_001',
        serviceSubject: 'GE1000 Generic Equipment',
        serviceType: 'Audit',
        status: 'Callout',
        preferredTimings: 'Evening',
        serviceDate: '30-08-2022'
      }
    ]
  }
];

export const GroupByCustomerData = [
  {
    id: 1,
    customerName: 'French Bakery L.L.C',
    details: [
      {
        id: 1,
        servicemanName: 'Arun Kumar',
        contractNumber: 'RHECDU_0205',
        location: 'Al Aweer, Dubai - United Arab Emirates',
        projectNumber: 'RHEPDU_0205_028_001',
        serviceSubject: '618132 Modular Soap Disp. Refillable 900ml 4LR-WWG',
        serviceType: 'Refill',
        serviceDate: '29-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Morning'
      },
      {
        id: 2,
        servicemanName: 'Arun Kumar',
        contractNumber: 'RHECDU_0205',
        location: 'Al Aweer, Dubai - United Arab Emirates',
        projectNumber: 'RHEPDU_0205_011_001',
        serviceSubject: 'D01013 Quantura 10 Single Dishwash Detergent, D01014 Quantura 10 Single Dishwash Rinse',
        serviceType: 'Maintenance',
        serviceDate: '29-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Evening'
      }
    ]
  },
  {
    id: 2,
    customerName: 'Panda Retail Company',
    details: [
      {
        id: 1,
        servicemanName: 'Ramshad Thatta Thazhath',
        contractNumber: 'HSDCJD_0263',
        location: 'Al Hamra mall',
        projectNumber: 'HSDPJD_0263_146_001',
        serviceSubject: '99717700 Scrubmaster B 120 R',
        serviceType: 'Maintenance',
        serviceDate: '29-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Evening'
      },
      {
        id: 2,
        servicemanName: 'Leo Sajan',
        contractNumber: 'HSDCJD_0263',
        location: 'Al Nakheel mall',
        projectNumber: 'HSDPJD_0263_149_001',
        serviceSubject: '99717512 Hako Scrubmaster B 75 R Basic / TB 550 / SF 760 / 105 Ah',
        serviceType: 'Refill',
        serviceDate: '29-08-2022',
        status: 'Callout',
        preferredTimings: 'Morning'
      }
    ]
  },

  {
    id: 4,
    customerName: 'Addoha Poultry Co',
    details: [
      {
        id: 1,
        servicemanName: 'Javad Keezhu Veettil',
        contractNumber: 'HSDCKH_0097',
        location: 'Jubail "JUBAIL Saudi Arabia ",SAU',
        projectNumber: 'HSDPKH_0097_001_004',
        serviceSubject: 'GE1000 Generic Equipment',
        serviceType: 'Refill',
        serviceDate: '29-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Evening'
      }
    ]
  },

  {
    id: 5,
    customerName: 'Different Food Company Ltd',
    details: [
      {
        id: 1,
        servicemanName: 'Burhanudeen Talhath',
        contractNumber: 'HSDCRU_0616',
        location: 'As Sahafah, Olaya St. 6531, 3059 Riyadh 13321 Saudi Arabia',
        projectNumber: 'HSDPRU_0616_002_001',
        serviceSubject: 'D01005 Quantura 200 Bchem Comp QD200-BT/C/D9',
        serviceType: 'Maintenance',
        serviceDate: '29-08-2022',
        status: 'Callout',
        preferredTimings: 'Night'
      },
      {
        id: 2,
        servicemanName: 'Ashar Parasuraman Kunnath',
        contractNumber: 'HSDCRU_0616',
        location: 'As Sahafah, Olaya St. 6531, 3059 Riyadh 13321 Saudi Arabia',
        projectNumber: 'HSDPRU_0616_001_001',
        serviceSubject: '618132 Modular Soap Disp. Refillable 900ml 4LR-WWG',
        serviceType: 'Audit',
        serviceDate: '30-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Night'
      }
    ]
  },

  {
    id: 6,
    customerName: 'United Flowers for Vegitable Oil Co Ltd',
    details: [
      {
        id: 66,
        servicemanName: 'Neil Necesario Jamboy',
        contractNumber: 'HSDCJD_0906',
        location: '5119 Al Mahjar Unit#1 Jeddah 22423-7990,SAU',
        projectNumber: 'HSDPJD_0906_001_001',
        serviceSubject: 'GE1000 Generic Equipment',
        serviceType: 'Audit',
        serviceDate: '30-08-2022',
        status: 'Schedulled',
        preferredTimings: 'Evening'
      }
    ]
  }
];
