import * as types from '../constants';

const initialState = {
  ethnicityList: [],
  genderList: [],
  nationalityList: [],
  clinicWardList: [],
  titlePrefixList: [],
  discipline: [],
  subDiscipline: [],
  orderStatus: [],
  fetchExpressRegistration: false
};

export default function StaticDropdownReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.GET_ETHNICITY_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_ETHNICITY_LIST_SUCCESS:
      return {
        ...state,
        ethnicityList: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_ETHNICITY_LIST_FAILURE:
      return {
        ...state,
        ethnicityList: [],
        fetchExpressRegistration: false
      };
    case types.GET_GENDER_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_GENDER_LIST_SUCCESS:
      return {
        ...state,
        genderList: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_GENDER_LIST_FAILURE:
      return {
        ...state,
        genderList: [],
        fetchExpressRegistration: false
      };

    case types.GET_NATIONALITY_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_NATIONALITY_LIST_SUCCESS:
      return {
        ...state,
        nationalityList: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_NATIONALITY_LIST_FAILURE:
      return {
        ...state,
        nationalityList: [],
        fetchExpressRegistration: false
      };

    case types.GET_CLINICWARD_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_CLINICWARD_LIST_SUCCESS:
      return {
        ...state,
        clinicWardList: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_CLINICWARD_LIST_FAILURE:
      return {
        ...state,
        clinicWardList: [],
        fetchExpressRegistration: false
      };
    case types.GET_TITLEPREFIX_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_TITLEPREFIX_LIST_SUCCESS:
      return {
        ...state,
        titlePrefixList: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_TITLEPREFIX_LIST_FAILURE:
      return {
        ...state,
        titlePrefixList: [],
        fetchExpressRegistration: false
      };

    case types.GET_DISCIPLINE_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_DISCIPLINE_LIST_SUCCESS:
      return {
        ...state,
        discipline: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_DISCIPLINE_LIST_FAILURE:
      return {
        ...state,
        discipline: [],
        fetchExpressRegistration: false
      };
    case types.GET_SUBDISCIPLINE_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_SUBDISCIPLINE_LIST_SUCCESS:
      return {
        ...state,
        subDiscipline: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_SUBDISCIPLINE_LIST_FAILURE:
      return {
        ...state,
        subDiscipline: [],
        fetchExpressRegistration: false
      };
    case types.GET_ORDERSTATUS_LIST_REQUEST:
      return {
        ...state,
        fetchExpressRegistration: true
      };

    case types.GET_ORDERSTATUS_LIST_SUCCESS:
      return {
        ...state,
        orderStatus: actions.payload,
        fetchExpressRegistration: false
      };

    case types.GET_ORDERSTATUS_LIST_FAILURE:
      return {
        ...state,
        orderStatus: [],
        fetchExpressRegistration: false
      };
    default:
      return state;
  }
}
