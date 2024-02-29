import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import { COMPONENTS, STATUS, REGX_TYPE, LOCATIONS } from '../../../utils/constants';
import {
  getSaudiPostApi,
  getAddressGoogleApi,
  getLatlngGoogleApi,
  getLatlngSaudiApi
} from '../CustomerServices/AddLocationApis';
import {
  getLocationNames,
  getLocationDetails,
  addUpdateCustomerLocation
} from '../CustomerServices/CreateUpdateCustomerServices';
import { IS_DATA_LOADING } from '../../../redux/constants';
import RenderComponent from '../../../components/RenderComponent';
import AddressMap from '../CustomerView/AddressMap';
import DialogComponent from '../../../components/Dialog';
import { isObject, isArray, isValidStr } from '../../../utils/utils';
import { NOTIFICATIONS } from '../../../utils/messages';

function AddLocation({
  locationData,
  setContactData,
  setEnableAddContacts,
  setShowContacts,
  legalEntityHSD,
  locationInfo,
  entityIdHSD,
  defaultMapLocation,
  disableLocation,
  setDisableLocation,
  isEdit,
  setLocationNameHeader,
  setResubmitted,
  setSubmitted,
  newLocation
}) {
  const dispatch = useDispatch();
  const { JEDDHA, ABHA, KHOBAR, RIYADH, SAUDI_ARABIA } = LOCATIONS;
  const [error, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [latlngs, setLatlngs] = useState({});
  const [center, setCenter] = useState(SAUDI_ARABIA);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [storedAddress, setStoredAddress] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [isPrimaryLoc, setIsPrimaryLoc] = useState(false);
  const [newIsPrimary, setNewIsPrimary] = useState(false);
  const [disableLocationName, setDisableLocationName] = useState(false);
  const [savedLocationData, setSavedLocationData] = useState({});
  const [CRApiCall, setCRApiCall] = useState(false);
  const [disbalePurpose, setDisbalePurpose] = useState({
    service: false,
    business: false,
    delivery: false
  });
  const [fieldChanges, setFieldChanges] = useState({
    postalCode: false,
    buildingNumber: false,
    street: false,
    additionalNumber: false,
    district: false
  });
  const { TEXT_FIELD, AUTOCOMPLETE, BUTTON, SELECT_BOX, TYPOGRAPHY, CHECKBOX, NONE } = COMPONENTS;

  const { customerId, CRNumber, oldCRNumber, mapLocation } = locationData;
  const { isHSDLegalEntity } = entityIdHSD;
  const {
    custId,
    CRNum,
    hasLocation,
    locationId,
    hasPrimaryLocation,
    isPrimaryLocation,
    organizationId,
    organizationIdentificationTypeValue,
    organizationIdentificationType,
    organizationIdValue
  } = locationInfo;

  const zoom = 12;
  const mapGridStyle = {
    height: '23rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    border: '1px solid black'
  };

  const [payload, setPayload] = useState({
    customerId: 0,
    customerLocationId: 0,
    customerLocationName: '',
    isPrimarySPL: false,
    isPrimary: false,
    service: false,
    business: false,
    delivery: false,
    purposes: [],
    address: '',
    buildingNumber: '',
    street: '',
    streetArabic: '',
    district: '',
    districtArabic: '',
    // originalPostalCode: '',
    postalCode: '',
    cityId: null,
    latitude: '',
    longitude: '',
    isAddressVerified: false,
    unitNumber: '',
    additionalNumber: '',
    region: '',
    regionArabic: '',
    city: '',
    cityArabic: '',
    placeId: '',
    isPublished: false,
    unitNumberArabic: null,
    buildingNumberArabic: null,
    postalCodeArabic: null,
    AdditionalNumberArabic: null
  });
  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const [genericAlertBox, setShowGenericAlertBox] = useState({
    open: false,
    title: '',
    titleType: '',
    content: '',
    proceedAction: '',
    showProceedBtn: false,
    cancelButtonText: '',
    proceedButtonText: '',
    additionalInfoForProceed: null
  });

  const locComps = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginTop: '0.4rem' },
      key: 'customerLocationName',
      label: 'Location Name',
      columnWidth: 9,
      isError: (error && !payload.customerLocationName) || (error && payload.customerLocationName.length > 60),
      helperText:
        (error && !payload.customerLocationName && 'Please enter customer location name') ||
        (error && payload.customerLocationName.length > 60 && 'Name must be 60 characters long.'),
      isRequired: true,
      isDisabled: disableLocation || payload.isPrimary
    },
    {
      control: CHECKBOX,
      key: 'isPrimary',
      label: 'Primary',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 2,
      isDisabled: true
    },
    {
      control: TYPOGRAPHY,
      groupStyle: { marginTop: '0.5rem', marginRight: '0.5rem' },
      key: 'purpose',
      label: 'Purpose*',
      isError: error && !(payload.service || payload.business || payload.delivery),
      columnWidth: 1.2,
      isDisabled: (isEdit && payload.isPrimary) || disableLocation || (!isEdit && payload.isPrimary)
    },
    {
      control: CHECKBOX,
      key: 'service',
      label: 'Service',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 1.7,
      isRequired: true,
      isError: error && !(payload.service || payload.business || payload.delivery),
      isDisabled:
        (isEdit && payload.isPrimary) ||
        disableLocation ||
        // isPrimaryLoc ||
        (!isEdit && payload.isPrimary) ||
        disbalePurpose.service
    },
    {
      control: CHECKBOX,
      key: 'business',
      label: 'Business',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 1.7,
      isRequired: true,
      isError: error && !(payload.service || payload.business || payload.delivery),
      isDisabled:
        (isEdit && payload.isPrimary) ||
        disableLocation ||
        // isPrimaryLoc ||
        (!isEdit && payload.isPrimary) ||
        disbalePurpose.business
    },
    {
      control: CHECKBOX,
      key: 'delivery',
      label: 'Delivery',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 1.7,
      isRequired: true,
      isError: error && !(payload.service || payload.business || payload.delivery),
      isDisabled:
        (isEdit && payload.isPrimary) ||
        disableLocation ||
        // isPrimaryLoc ||
        (!isEdit && payload.isPrimary) ||
        disbalePurpose.delivery
    },
    {
      control: NONE,
      columnWidth: 2
    },
    {
      control: TEXT_FIELD,
      key: 'address',
      label: 'Address',
      isMultiline: true,
      textRows: 3,
      columnWidth: 9,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.5rem' },
      isRequired: true,
      isError: (error && !payload.address) || (error && payload.address.length > 250),
      helperText:
        (error && !payload.address && 'Please enter address') ||
        (error && payload.address.length > 250 && 'Address must be 250 characters long.'),
      handleKeyDown: (e) => enterKeyhandler(e, 'address'),
      isDisabled: disableLocation || (!isEdit && locationData.legalEntityHSD) || (isEdit && isHSDLegalEntity)
    },
    {
      control: BUTTON,
      key: 'refetch',
      btnTitle: 'Refetch',
      tooltipTitle: 'Refetch address by CR number',
      color: 'success',
      groupStyle: { marginTop: '1rem' },
      handleClickButton: () => refetchData(),
      isDisabled: disableLocation,
      columnWidth: 2.2
    },
    {
      control: BUTTON,
      key: 'fetch',
      btnTitle: 'Fetch',
      tooltipTitle: 'Fetch address',
      color: 'success',
      groupStyle: { marginTop: '1rem' },
      handleClickButton: () => fetchData(),
      isDisabled: disableLocation,
      columnWidth: 2.2
    },
    {
      control: TEXT_FIELD,
      key: 'buildingNumber',
      label: 'Building #',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.buildingNumber.length > 20,
      helperText: lengthError && 'Building number must be 20 digits long.',
      handleKeyDown: (e) => enterKeyhandler(e, 'buildingNumber'),
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity)
    },
    {
      control: TEXT_FIELD,
      key: 'street',
      label: 'Street',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.street.length > 100,
      helperText: lengthError && 'Street name must be 100 characters long.',
      handleKeyDown: (e) => enterKeyhandler(e, 'street'),
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity)
    },
    // {
    //   control: NONE,
    //   columnWidth: 2
    // },
    {
      control: TEXT_FIELD,
      key: 'additionalNumber',
      label: 'Secondary #',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.additionalNumber.length > 20,
      helperText: lengthError && 'Secondary number must be 20 digits long.',
      handleKeyDown: (e) => enterKeyhandler(e, 'additionalNumber'),
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity)
    },
    {
      control: TEXT_FIELD,
      key: 'district',
      label: 'District',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.district.length > 60,
      helperText: lengthError && 'District name must be 60 characters long.',
      handleKeyDown: (e) => enterKeyhandler(e, 'district'),
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity)
    },
    // {
    //   control: NONE,
    //   columnWidth: 2
    // },
    {
      control: TEXT_FIELD,
      key: 'postalCode',
      label: 'Postal Code',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0.5rem' },
      isError: lengthError && payload.postalCode.length > 20,
      helperText: lengthError && 'Postal code must be 20 digits long.',
      handleKeyDown: (e) => enterKeyhandler(e, 'postalCode'),
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity)
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '0.5rem' },
      key: 'cityId',
      label: 'City',
      options: [],
      select: true,
      // isRequired: true,
      // isError: error && !payload?.projectStatusId,
      // helperText: 'Please select project status',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: disableLocation || (!isEdit && !locationData.legalEntityHSD) || (isEdit && !isHSDLegalEntity),
      columnWidth: 5.5
    },
    // {
    //   control: NONE,
    //   columnWidth: 2
    // },
    {
      control: TEXT_FIELD,
      key: 'latitude',
      label: 'Latitude',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0rem' },
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'longitude',
      label: 'Longitude',
      columnWidth: 5.5,
      groupStyle: { marginBottom: '0rem' },
      // isRequired: true,
      // isError:error &&,
      // helperText:,
      isDisabled: true
    },
    {
      control: CHECKBOX,
      key: 'isAddressVerified',
      label: 'Address Verified',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 4,
      isDisabled: true
    }
  ];

  const buttonComps = [
    {
      control: BUTTON,
      key: 'addNew',
      btnTitle: 'Save & Add New',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => saveLocationData(true),
      isDisabled: disableLocation,
      columnWidth: 1.6
    },
    {
      control: BUTTON,
      key: 'save',
      btnTitle: 'Save',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => saveLocationData(false),
      isDisabled: disableLocation,
      columnWidth: 0.9
    },
    {
      control: BUTTON,
      key: 'cancel',
      btnTitle: 'Cancel',
      color: 'warning',
      groupStyle: { marginRight: '1rem', marginBottom: '0.5rem' },
      handleClickButton: () => handleCancel(),
      isDisabled: disableLocation,
      columnWidth: 0.9
    }
  ];

  const refetchData = () => {
    if (organizationIdentificationType === 2 && payload.isPrimary) {
      callSaudiPostApi(organizationIdentificationTypeValue);
    } else {
      callSaudiPostApi(CRNumber || CRNum);
    }
  };

  const fetchData = () => {
    if (payload.address) {
      callLatlngGoogleApi(payload.address);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      const {
        customerLocationId,
        isPrimary,
        isPrimarySPL,
        isAddressVerified,
        isPublished,
        purposes,
        address,
        unitNumber,
        buildingNumber,
        street,
        district,
        city,
        region,
        postalCode,
        additionalNumber,
        addressArabic,
        unitNumberArabic,
        buildingNumberArabic,
        streetArabic,
        districtArabic,
        cityArabic,
        regionArabic,
        postalCodeArabic,
        additionalNumberArabic,
        latitude,
        longitude,
        customerId,
        customerLocationName,
        placeId
      } = savedLocationData;
      const cityName = convertToProperCase(city);
      const streetName = getStreetName(street);
      const shouldUpdateAddress = payload.isPrimary;
      const address2 = getAddressFormat(buildingNumber, streetName, district, cityName, postalCode, additionalNumber);
      setLocAddress(address2);
      const updatePayloadAddress = shouldUpdateAddress ? address2 : address;
      const updatePayloadObject = {};
      if (isArray(purposes)) {
        purposes.forEach((itm) => {
          if (['Service', 'Business', 'Delivery'].includes(itm)) {
            updatePayloadObject[itm.toLowerCase()] = true;
          }
        });
      }
      // Set the missing purposes to false
      const allPurposes = ['Service', 'Business', 'Delivery'];
      allPurposes.forEach((purpose) => {
        if (!(purpose.toLowerCase() in updatePayloadObject)) {
          updatePayloadObject[purpose.toLowerCase()] = false;
        }
      });
      updatePayload({
        customerLocationId,
        isPrimary,
        isPrimarySPL,
        isAddressVerified,
        isPublished,
        purposes,
        address: updatePayloadAddress,
        unitNumber,
        buildingNumber,
        street,
        district,
        city: cityName,
        region,
        postalCode,
        additionalNumber,
        addressArabic,
        unitNumberArabic,
        buildingNumberArabic,
        streetArabic,
        districtArabic,
        cityArabic,
        regionArabic,
        postalCodeArabic,
        additionalNumberArabic,
        latitude,
        longitude,
        customerId,
        customerLocationName,
        placeId,
        ...updatePayloadObject
        // service,
        // delivery,
        // business
      });
      setDisbalePurpose(updatePayloadObject);
      const notNullLoc = latitude !== '' && longitude !== '';
      if (notNullLoc) {
        setCenter({ lat: latitude * 1, lng: longitude * 1 });
      }
      setClickedLocation({
        position: { lat: latitude * 1, lng: longitude * 1 },
        location: address
      });
    } else {
      const defaultPayload = {
        customerId: 0,
        customerLocationId: 0,
        customerLocationName: '' || payload.customerLocationName,
        isPrimary: !hasPrimaryLocation,
        isPrimarySPL: false,
        service: false || payload.service,
        business: false || payload.business,
        delivery: false || payload.delivery,
        purposes: [],
        address: '',
        buildingNumber: '',
        street: '',
        streetArabic: '',
        district: '',
        districtArabic: '',
        postalCode: '',
        cityId: null,
        latitude: '',
        longitude: '',
        isAddressVerified: false,
        unitNumber: '',
        additionalNumber: '',
        region: '',
        regionArabic: '',
        city: '',
        cityArabic: '',
        placeId: 0,
        isPublished: false,
        unitNumberArabic: null,
        buildingNumberArabic: null,
        postalCodeArabic: null,
        AdditionalNumberArabic: null
      };
      if (!isPrimaryLoc !== undefined) {
        if (!isPrimaryLoc) {
          defaultPayload.isPrimary = false;
        } else {
          defaultPayload.isPrimary = true;
          defaultPayload.customerLocationName = 'Business Address';
          defaultPayload.service = true;
          defaultPayload.business = true;
          defaultPayload.delivery = true;
        }
      }
      if (payload.isPrimary !== undefined) {
        if (payload.isPrimary) {
          defaultPayload.isPrimary = true;
          defaultPayload.customerLocationName = 'Business Address';
          defaultPayload.service = true;
          defaultPayload.business = true;
          defaultPayload.delivery = true;
        }
      }
      if (newIsPrimary !== undefined) {
        if (newIsPrimary) {
          defaultPayload.isPrimary = false;
          defaultPayload.customerLocationName = '';
          defaultPayload.service = false;
          defaultPayload.business = false;
          defaultPayload.delivery = false;
        }
      }
      updatePayload(defaultPayload);
      getMapRegion(mapLocation);
      setClickedLocation(null);
    }
  };

  const saveLocationData = async (addNewLocation) => {
    if (
      !payload.customerLocationName ||
      !(payload.service || payload.business || payload.delivery) ||
      !payload.address
    ) {
      setError(true);
    } else {
      const purposes = [];
      if (payload.service) {
        purposes.push('Service');
      }
      if (payload.business) {
        purposes.push('Business');
      }
      if (payload.delivery) {
        purposes.push('Delivery');
      }
      const capitalPurpose = purposes.map((purpose) => purpose.charAt(0).toUpperCase() + purpose.slice(1));
      const payloadData = {
        customerLocation: {
          ...payload,
          purposes: capitalPurpose,
          customerId: customerId || custId,
          customerLocationName: payload.customerLocationName,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString()
        }
      };
      dispatch({ type: IS_DATA_LOADING, data: true });
      const res = await addUpdateCustomerLocation(payloadData);
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (!res.isSuccessful) {
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok'
        });
      } else if (res.isSuccessful) {
        const { hasPrimaryLocation, isShowSubmit, isShowReSubmit } = res.data;
        setNewIsPrimary(res.data.hasPrimaryLocation);
        setSubmitted(isShowSubmit);
        setResubmitted(isShowReSubmit);
        setContactData({
          ...res.data,
          customerId: customerId || custId,
          isRouting: false,
          isPrimaryLocation: payload.isPrimary
        });
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.SUCCESS,
          title: 'Success',
          content: res?.message || 'Customer location saved successfully.',
          showProceedBtn: false,
          cancelButtonText: 'Close'
        });
        setCRApiCall(false);
        setSavedLocationData({});
        setDisableLocation(true);
        if (addNewLocation) {
          setEnableAddContacts(false);
          setShowContacts.off();
          setDisableLocationName(false);
          setDisbalePurpose({
            service: false,
            business: false,
            delivery: false
          });
        } else if (newLocation) {
          setEnableAddContacts(true);
          setShowContacts.on();
        }
      }
    }
    if (addNewLocation) {
      if (
        !payload.customerLocationName ||
        !(payload.service || payload.business || payload.delivery) ||
        !payload.address
      ) {
        setError(true);
      } else {
        setError(false);
        setLocationNameHeader('');
        setDisableLocation(false);
        updatePayload({
          customerId: 0,
          customerLocationId: 0,
          customerLocationName: '',
          isPrimary: false,
          isPrimarySPL: false,
          service: false,
          business: false,
          delivery: false,
          purposes: [],
          address: '',
          buildingNumber: '',
          street: '',
          streetArabic: '',
          district: '',
          districtArabic: '',
          postalCode: '',
          cityId: null,
          latitude: '',
          longitude: '',
          isAddressVerified: false,
          unitNumber: '',
          additionalNumber: '',
          region: '',
          regionArabic: '',
          city: '',
          cityArabic: '',
          placeId: ''
        });
        setContactData({});
        if (isEdit) {
          getMapRegion(defaultMapLocation);
        } else {
          getMapRegion(mapLocation);
        }
      }
    }
  };

  const enterKeyhandler = (e, key) => {
    //   if (['address', 'postalCode', 'buildingNumber', 'street', 'additionalNumber', 'district'].includes(key)) {
    //     callLatlngGoogleApi(payload.address);
    //   }
    //   else if (key === 'locationName') {
    //     getLocationNameList(payload.customerLocationName);
    //   }
  };

  const handleOnBlur = (key, val) => {
    //   if (['address', 'postalCode', 'buildingNumber', 'street', 'additionalNumber', 'district'].includes(key) && val) {
    //     callLatlngGoogleApi(payload.address);
    //   }
  };

  const handleChangeData = (key, val) => {
    if (key === 'customerLocationName') {
      updatePayload({ [key]: val });
      if (val.length > 60) {
        setError(true);
      }
    } else if (key === 'address') {
      updatePayload({ [key]: val });
      if (!val) {
        updatePayload({
          buildingNumber: '',
          city: '',
          street: '',
          district: '',
          additionalNumber: '',
          postalCode: '',
          latitude: '',
          longitude: ''
          // isAddressVerified: false
        });
        setClickedLocation(null);
        setCenter({ lat: 24.711565944884473, lng: 46.67166389337076 });
      }
      if (val.length > 250) {
        setError(true);
      }
    } else if (key === 'postalCode') {
      if (val && !isValidStr(val, REGX_TYPE.NUM)) {
        setFieldChanges((prev) => ({ ...prev, [key]: true }));
        return;
      }
      updatePayload({ [key]: val });
      if (val) {
        const slicedPostalCode = val.slice(0, 20);
        updatePayload({ [key]: slicedPostalCode });

        const modifiedAddress = getAddressFormat(
          key === 'buildingNumber' ? val : payload.buildingNumber,
          key === 'street' ? val : payload.street,
          key === 'district' ? val : payload.district,
          key === 'city' ? val : payload.city,
          key === 'postalCode' ? val : payload.postalCode,
          key === 'additionalNumber' ? val : payload.additionalNumber
        );

        const isMatching = modifiedAddress === storedAddress;
        updatePayload({ isAddressVerified: isMatching });

        if (isEdit && payload.isPrimary) {
          const isMatchingEdit = modifiedAddress === (locAddress || storedAddress);
          updatePayload({ isAddressVerified: isMatchingEdit });
        }
      }
      setFieldChanges((prev) => ({ ...prev, [key]: true }));
    } else if (['buildingNumber', 'city', 'street', 'additionalNumber', 'district'].includes(key)) {
      const maxLengths = {
        buildingNumber: 20,
        street: 100,
        additionalNumber: 20,
        district: 60
      };

      if (val.length > maxLengths[key]) {
        val = val.slice(0, maxLengths[key]);
      }

      updatePayload({ [key]: val });

      const modifiedAddress = getAddressFormat(
        key === 'buildingNumber' ? val : payload.buildingNumber,
        key === 'street' ? val : payload.street,
        key === 'district' ? val : payload.district,
        key === 'city' ? val : payload.city,
        key === 'postalCode' ? val : payload.postalCode,
        key === 'additionalNumber' ? val : payload.additionalNumber
      );

      const isMatching = modifiedAddress === storedAddress;
      updatePayload({ isAddressVerified: isMatching });

      if (isEdit && payload.isPrimary) {
        const isMatchingEdit = modifiedAddress === (locAddress || storedAddress);
        updatePayload({ isAddressVerified: isMatchingEdit });
      }
      setFieldChanges((prev) => ({ ...prev, [key]: true }));
    } else if (['service', 'business', 'delivery'].includes(key)) {
      updatePayload({ [key]: val });
      const { purposes } = payload;
      if (val) {
        if (!purposes.includes(key)) {
          purposes.push(key);
        }
      } else {
        const filterPurposes = purposes.filter((itm) => itm !== key);
        updatePayload({ purposes: filterPurposes });
      }
    } else {
      updatePayload({ [key]: val });
    }
  };

  useEffect(() => {
    const handleLocationUpdate = () => {
      const { address, postalCode, buildingNumber, street, additionalNumber, district } = payload;
      // Check if all specified keys are empty or whitespace
      const allKeysEmpty = ['address', 'postalCode', 'buildingNumber', 'street', 'additionalNumber', 'district'].every(
        (itm) => !payload[itm] || payload[itm].trim() === ''
      );
      if (allKeysEmpty) {
        updatePayload({
          latitude: '',
          longitude: '',
          isAddressVerified: false
        });
        setClickedLocation(null);
        getMapRegion(defaultMapLocation);
      }
    };
    handleLocationUpdate();
  }, [
    payload.address,
    payload.postalCode,
    payload.buildingNumber,
    payload.street,
    payload.additionalNumber,
    payload.district
  ]);

  // const getLocationNameList = async (searchKey) => {
  //   dispatch({ type: IS_DATA_LOADING, data: true });
  //   const res = await getLocationNames(searchKey);
  //   dispatch({ type: IS_DATA_LOADING, data: false });
  //   if (!res.isSuccessful) {
  //     setShowGenericAlertBox({
  //       open: true,
  //       titleType: STATUS.ERROR,
  //       title: 'Error',
  //       content: 'Invalid request. Invalid parameter.',
  //       showProceedBtn: false,
  //       cancelButtonText: 'Close'
  //     });
  //   } else {
  //     setLocationNameList(res.data);
  //   }
  // };

  const getAddressFormat = (buildingNumber, streetName, district, cityName, postalCode, additionalNumber) =>
    `${buildingNumber ? `${buildingNumber}, ` : ''}${streetName ? `${streetName}, ` : ''}${
      district ? `${district}\n` : ''
    }${cityName ? `${cityName}  ` : ''}${postalCode ? `${postalCode}` : ''}${
      additionalNumber ? `-${additionalNumber}\n` : '\n'
    }Kingdom of Saudi Arabia`;

  const getArabicAddressFormat = (
    districtArabic,
    streetArabic,
    buildingNumber,
    additionalNumber,
    PostCode,
    cityArabic
  ) =>
    `${districtArabic ? `${districtArabic}, ` : ''}${streetArabic ? `${streetArabic}, ` : ''}${
      buildingNumber ? `${buildingNumber}\n` : ''
    }${additionalNumber ? `${additionalNumber}` : ''}${PostCode ? `-${PostCode}  ` : ''}${
      cityArabic ? `${cityArabic}\n` : '\n'
    }المملكة العربية السعودية`;

  const getStreetName = (street) => {
    if (street) {
      return `${street}`;
    }
    return '';
  };

  const convertToProperCase = (str) => {
    if (!str) {
      return '';
    }
    return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
  };

  const callSaudiPostApi = async (CRNumber) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getSaudiPostApi(CRNumber);
    dispatch({ type: IS_DATA_LOADING, data: false });
    const { KSABusinesses, success } = res;
    if (!success && isEdit) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Location is not present for this CR Number.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    } else if (success) {
      // eslint-disable-next-line camelcase
      const {
        BuildingNumber: buildingNumber,
        UnitNumber: unitNumber,
        AdditionalNumber: additionalNumber,
        City: city,
        City_L2: cityArabic,
        RegionName: region,
        RegionName_L2: regionArabic,
        Street: street,
        Street_L2: streetArabic,
        District: district,
        District_L2: districtArabic,
        IsPrimaryAddress,
        PostCode,
        Latitude,
        Longitude,
        PKAddressID: placeId
      } = KSABusinesses[0];
      const cityName = convertToProperCase(city);
      const streetName = getStreetName(street);
      const address = getAddressFormat(buildingNumber, streetName, district, cityName, PostCode, additionalNumber);
      const addressArabic = getArabicAddressFormat(
        districtArabic,
        streetArabic,
        buildingNumber,
        additionalNumber,
        PostCode,
        cityArabic
      );
      setStoredAddress(address);
      updatePayload({
        address,
        addressArabic,
        buildingNumber,
        unitNumber,
        additionalNumber,
        street,
        streetArabic,
        district,
        districtArabic,
        region,
        regionArabic,
        city: cityName,
        cityArabic,
        postalCode: PostCode,
        latitude: Latitude,
        longitude: Longitude,
        isAddressVerified: true,
        isPrimarySPL: IsPrimaryAddress === 'true',
        placeId
      });
      setClickedLocation({ position: { lat: Latitude * 1, lng: Longitude * 1 }, location: address });
      setCenter({ lat: Latitude * 1, lng: Longitude * 1 });
      setCRApiCall(true);
    }
  };

  const callGoogleApi = async (lat, lng) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getAddressGoogleApi(lat, lng);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.status === 'OK') {
      const { place_id: placeId, formatted_address: locationAddress } = res.results[0];
      const postalCodeObject = res.results.find((itm) => itm.types.includes('postal_code'));
      const postId = postalCodeObject.address_components.find((itm) => itm.types.includes('postal_code'));
      const position = res.results[0].geometry.location;
      updatePayload({
        address: `${locationAddress} \nKingdom of Saudi Arabia` || '',
        buildingNumber: '',
        city: '',
        street: '',
        district: '',
        additionalNumber: '',
        postalCode: postId.long_name,
        latitude: position.lat || '',
        longitude: position.lng || '',
        isAddressVerified: false,
        placeId
      });
      callLatlngSaudiApi(position.lat, position.lng);
      setClickedLocation({
        position: { lat: position.lat, lng: position.lng },
        location: postalCodeObject.formatted_address
      });
      setCenter({ lat: position.lat, lng: position.lng });
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Location is not present.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    }
  };

  const callLatlngGoogleApi = async (address) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getLatlngGoogleApi(address);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.status === 'OK') {
      const { location } = res.results[0].geometry;
      const { formatted_address: locationName, place_id: placeId } = res.results[0];
      updatePayload({
        address: `${locationName} \nKingdom of Saudi Arabia`,
        buildingNumber: '',
        city: '',
        street: '',
        district: '',
        postalCode: '',
        additionalNumber: '',
        latitude: location.lat,
        longitude: location.lng,
        placeId,
        isAddressVerified: false
      });
      callLatlngSaudiApi(location.lat, location.lng);
      setClickedLocation({
        position: { lat: location.lat, lng: location.lng },
        location: locationName
      });
      setCenter(location);
    } else {
      updatePayload({
        buildingNumber: '',
        street: '',
        district: '',
        postalCode: '',
        additionalNumber: '',
        address: '',
        latitude: '',
        longitude: ''
      });
      setClickedLocation(null);
      setCenter({ lat: 24.711565944884473, lng: 46.67166389337076 });
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Location is not present.',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    }
  };

  const getLocationData = async (locationId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getLocationDetails(locationId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!res.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: res?.message || (isArray(res.error) && res.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (res.isSuccessful) {
      const {
        customerLocationId,
        isPrimary,
        isPrimarySPL,
        isAddressVerified,
        isPublished,
        purposes,
        address,
        unitNumber,
        buildingNumber,
        street,
        district,
        city,
        region,
        postalCode,
        additionalNumber,
        addressArabic,
        unitNumberArabic,
        buildingNumberArabic,
        streetArabic,
        districtArabic,
        cityArabic,
        regionArabic,
        postalCodeArabic,
        additionalNumberArabic,
        latitude,
        longitude,
        customerId,
        customerLocationName,
        placeId
      } = res.data?.location;
      setSavedLocationData(res.data.location);
      setIsPrimaryLoc(isPrimary);
      setDisableLocationName(customerLocationName);
      setLocationNameHeader(`- ${customerLocationName}`);
      const cityName = convertToProperCase(city);
      const streetName = getStreetName(street);
      const shouldUpdateAddress = payload.isPrimary;
      const address2 = getAddressFormat(buildingNumber, streetName, district, cityName, postalCode, additionalNumber);
      setLocAddress(address2);
      const updatePayloadAddress = shouldUpdateAddress ? address2 : address;
      const updatePayloadObject = {};
      purposes.forEach((itm) => {
        if (['Service', 'Business', 'Delivery'].includes(itm)) {
          updatePayloadObject[itm.toLowerCase()] = true;
        }
      });

      // Set the missing purposes to false
      const allPurposes = ['Service', 'Business', 'Delivery'];
      allPurposes.forEach((purpose) => {
        if (!(purpose.toLowerCase() in updatePayloadObject)) {
          updatePayloadObject[purpose.toLowerCase()] = false;
        }
      });
      updatePayload({
        customerLocationId,
        isPrimary,
        isPrimarySPL,
        isAddressVerified,
        isPublished,
        purposes,
        address: updatePayloadAddress,
        unitNumber,
        buildingNumber,
        street,
        district,
        city: cityName,
        region,
        postalCode,
        additionalNumber,
        addressArabic,
        unitNumberArabic,
        buildingNumberArabic,
        streetArabic,
        districtArabic,
        cityArabic,
        regionArabic,
        postalCodeArabic,
        additionalNumberArabic,
        latitude,
        longitude,
        customerId,
        customerLocationName,
        placeId,
        ...updatePayloadObject
        // service,
        // delivery,
        // business
      });
      setDisbalePurpose(updatePayloadObject);
      const notNullLoc = latitude !== '' && longitude !== '';
      if (notNullLoc) {
        setCenter({ lat: latitude * 1, lng: longitude * 1 });
      }
      setClickedLocation({
        position: { lat: latitude * 1, lng: longitude * 1 },
        location: address
      });
    }
  };

  const callLatlngSaudiApi = async (lat, lng) => {
    // const lat = 21.7014554234756;
    // const lng = 39.136390686035156;
    dispatch({ type: IS_DATA_LOADING, data: true });
    const res = await getLatlngSaudiApi(lat, lng);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (res.status === 'OK') {
      const { location } = res.results[0].geometry;
      updatePayload({
        buildingNumber: '',
        street: '',
        district: '',
        postalCode: '',
        latitude: location.lat,
        longitude: location.lng,
        isAddressVerified: false
      });
      setClickedLocation(location);
      setCenter(location);
    } else {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: 'Error in getting response from Saudi Post',
        showProceedBtn: false,
        cancelButtonText: 'Close'
      });
    }
  };

  const handleCloseBackAlertBox = () =>
    setShowGenericAlertBox({
      open: false,
      title: '',
      titleType: '',
      content: '',
      proceedAction: '',
      showProceedBtn: false,
      cancelButtonText: '',
      proceedButtonText: '',
      additionalInfoForProceed: null
    });

  const handleProceedBackAlertBox = () => {
    handleCloseBackAlertBox();
  };

  const getMapRegion = (mapRegionId) => {
    switch (mapRegionId) {
      case 1:
        setCenter(JEDDHA);
        break;
      case 2:
        setCenter(RIYADH);
        break;
      case 3:
        setCenter(KHOBAR);
        break;
      case 4:
        setCenter(ABHA);
        break;
      default:
        setCenter(SAUDI_ARABIA);
        break;
    }
  };

  useEffect(() => {
    if (CRApiCall) {
      setSavedLocationData(payload);
    }
  }, [CRApiCall]);

  useEffect(() => {
    const changes = Object.values(fieldChanges).some((field) => field);
    if (changes) {
      const { city, street, buildingNumber, district, postalCode, additionalNumber } = payload;
      const cityName = convertToProperCase(city);
      const streetName = getStreetName(street);
      const newAddress = getAddressFormat(buildingNumber, streetName, district, cityName, postalCode, additionalNumber);
      updatePayload({ address: newAddress });
      setFieldChanges({
        postalCode: false,
        buildingNumber: false,
        street: false,
        additionalNumber: false,
        district: false
      });
    }
  }, [
    fieldChanges,
    payload.postalCode,
    payload.buildingNumber,
    payload.street,
    payload.district,
    payload.city,
    payload.additionalNumber
  ]);

  useEffect(() => {
    if (!hasPrimaryLocation) {
      updatePayload({
        isPrimary: true,
        customerLocationName: 'Business Address',
        service: true,
        business: true,
        delivery: true,
        purposes: ['Service', 'Business', 'Delivery']
      });
    } else {
      updatePayload({
        isPrimary: false,
        customerLocationName: '',
        service: false,
        business: false,
        delivery: false
      });
    }
  }, [locationData]);

  useEffect(() => {
    if (custId) {
      updatePayload({ customerId: custId });
    }
    if (!hasPrimaryLocation && CRNum) {
      callSaudiPostApi(CRNum);
    }
  }, [CRNum]);

  // useEffect(() => {
  //   getLocationNameList('ad');
  // }, []);

  useEffect(() => {
    const { lat, lng } = latlngs;
    if ((lat, lng)) {
      callGoogleApi(lat, lng);
      // callLatlngSaudiApi(lat, lng);
    } else if (CRNumber || oldCRNumber) {
      const CRValue = isEdit ? oldCRNumber : CRNumber;
      callSaudiPostApi(CRValue);
    }
  }, [CRNumber, oldCRNumber, latlngs]);

  useEffect(() => {
    if (locationId) {
      getLocationData(locationId);
    }
  }, [locationId]);

  useEffect(() => {
    const mapRegion = mapLocation || defaultMapLocation;
    getMapRegion(mapRegion);
  }, [mapLocation, defaultMapLocation]);

  return (
    <Grid container spacing={3}>
      <DialogComponent
        open={genericAlertBox.open}
        handleClose={handleCloseBackAlertBox}
        title={genericAlertBox.title}
        titleType={genericAlertBox.titleType}
        content={genericAlertBox.content}
        isCancelButton
        isProceedButton={genericAlertBox.showProceedBtn}
        cancelButtonText={genericAlertBox.cancelButtonText}
        proceedButtonText={genericAlertBox.proceedButtonText}
        handleProceed={handleProceedBackAlertBox}
      />
      <Grid item xs={12} sx={{ mt: -1, display: 'flex', justifyContent: 'flex-start' }}>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            {locComps?.map((comp, ind) => {
              if (comp.key === 'isAddressVerified' && legalEntityHSD) {
                return (
                  <RenderComponent
                    key={ind}
                    metaData={{ ...comp }}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                    handleBlur={handleOnBlur}
                  />
                );
              }
              if (
                (comp.key === 'refetch' && CRNumber && payload.isPrimary) ||
                (comp.key === 'refetch' && organizationIdentificationType === 2 && payload.isPrimary) ||
                (comp.key === 'refetch' && CRNum && payload.isPrimary)
              ) {
                return (
                  <RenderComponent
                    key={ind}
                    metaData={{ ...comp }}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                    handleBlur={handleOnBlur}
                  />
                );
              }
              if (
                (comp.key === 'fetch' && !CRNumber && !payload.isPrimary) ||
                (comp.key === 'fetch' && !organizationIdentificationType === 2 && isHSDLegalEntity) ||
                (comp.key === 'fetch' && !CRNum && !payload.isPrimary) ||
                (comp.key === 'fetch' && !CRNumber && locationData.legalEntityHSD) ||
                (comp.key === 'fetch' && !CRNum && organizationIdentificationType !== 2 && isHSDLegalEntity && isEdit)
              ) {
                return (
                  <RenderComponent
                    key={ind}
                    metaData={{ ...comp }}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                    handleBlur={handleOnBlur}
                    handleFetch={fetchData}
                  />
                );
              }
              if (comp.key !== 'refetch' && comp.key !== 'fetch') {
                return (
                  <RenderComponent
                    key={ind}
                    metaData={{ ...comp }}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                    handleBlur={handleOnBlur}
                  />
                );
              }
              return null;
            })}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Box sx={{ width: '100%', height: '55vh', marginLeft: '-1rem' }}>
              <AddressMap
                zoom={zoom}
                center={center}
                mapGridStyle={mapGridStyle}
                setLatlngs={setLatlngs}
                clickedLocation={clickedLocation}
                setClickedLocation={setClickedLocation}
                disableLocation={disableLocation}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem', marginTop: '-2.2rem' }}
          >
            {buttonComps?.map((comp, ind) => (
              <RenderComponent key={ind} metaData={comp} ind={1} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

AddLocation.propTypes = {
  locationData: PropTypes.object,
  locationInfo: PropTypes.object,
  setContactData: PropTypes.func,
  setEnableAddContacts: PropTypes.func,
  setShowContacts: PropTypes.func,
  legalEntityHSD: PropTypes.bool,
  defaultMapLocation: PropTypes.number,
  disableLocation: PropTypes.bool,
  setDisableLocation: PropTypes.func,
  isEdit: PropTypes.bool,
  setLocationNameHeader: PropTypes.func,
  entityIdHSD: PropTypes.object,
  newLocation: PropTypes.bool
};

export default AddLocation;
