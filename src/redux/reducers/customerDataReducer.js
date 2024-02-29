import {
  GET_SALESMEN,
  GET_LEGALENTITIES,
  GET_CUSTOMER_CLASSIFICATIONS,
  GET_CUSTOMER_GROUPS,
  CUSTOMER_RECORDS,
  CUSTOMER_LOCATIONS,
  CUSTOMER_CONTACTS,
  LOCATION_CONTACTS
} from '../constants';

const initialState = {
  salesmen: [],
  legalEntities: [],
  customerClassificactions: [],
  customerGroups: [],
  customerRecords: [],
  customerLocations: [],
  customerContacts: [],
  locationContacts: []
};

export default function CustomerDataReducer(state = initialState, actions) {
  const { type, data } = actions;
  switch (type) {
    case GET_SALESMEN:
      return { ...state, salesmen: data };
    case GET_LEGALENTITIES:
      return { ...state, legalEntities: data };
    case GET_CUSTOMER_CLASSIFICATIONS:
      return { ...state, customerClassificactions: data };
    case GET_CUSTOMER_GROUPS:
      return { ...state, customerGroups: data };
    case CUSTOMER_RECORDS:
      return { ...state, customerRecords: data };
    case CUSTOMER_LOCATIONS:
      return { ...state, customerLocations: data };
    case CUSTOMER_CONTACTS:
      return { ...state, customerContacts: data };
    case LOCATION_CONTACTS:
      return { ...state, locationContacts: data };
    default:
      return { ...state };
  }
}
