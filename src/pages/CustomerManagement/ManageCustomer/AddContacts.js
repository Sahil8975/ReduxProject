import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch } from 'react-redux';
import { IS_DATA_LOADING } from '../../../redux/constants';
import { isArray, isValidStr, isEmail } from '../../../utils/utils';
import RenderComponent from '../../../components/RenderComponent';
import { COMPONENTS, REGX_TYPE, STATUS } from '../../../utils/constants';
import { getCountryPhoneCode, getHasLocationContact } from '../CustomerServices/CustomerViewServices';
import {
  getLocationNameForContact,
  addLocationContact,
  addCustomerContact,
  getLocationContactDetails,
  getCustomerContactDetails
} from '../CustomerServices/CreateUpdateCustomerServices';
import { NOTIFICATIONS } from '../../../utils/messages';
import DialogComponent from '../../../components/Dialog';

function AddContacts({ contactData, setApproveBtnEnable }) {
  const dispatch = useDispatch();
  const [locationNameField, setLocationNameField] = useState([]);
  const [phoneCode, setPhoneCode] = useState([]);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  // const [disablePrimary, setDisablePrimary] = useState(false);
  const [isCustomerContact, setIsCustomerContact] = useState(false);
  const [disableIsActive, setDisableIsActive] = useState(false);
  let selectedLocation;

  const { customerId, customerLocationId, contactId, isPrimaryLocation, isRouting, isEdit } = contactData;

  const [payload, setPayload] = useState({
    contactList: [
      {
        id: 0,
        contactId: 0,
        customerLocationId: null,
        contactName: '',
        designation: '',
        contactCategory: 'Generic',
        isDeleted: false,
        isPrimary: false,
        isActive: true,
        isPartOfAutoEmail: false,
        phoneNumber: [{ teleCode: null, phoneNumber: '' }],
        mobileNumbers: [{ mobileCode: null, mobileNumbers: '' }],
        emails: [{ emails: '', isPartOfAutoEmail: false }]
      }
    ]
  });
  const updatePayload = (pairs) => setPayload((prevPayload) => ({ ...prevPayload, ...pairs }));

  const { TEXT_FIELD, AUTOCOMPLETE, BUTTON, ICON, SELECT_BOX, TYPOGRAPHY, CHECKBOX, NONE } = COMPONENTS;

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
    const { proceedAction, additionalInfoForProceed } = genericAlertBox;
    switch (proceedAction) {
      case 'delete':
        deleteItm(additionalInfoForProceed);
        break;
      default:
        break;
    }
  };

  const deleteItm = (deleteInfo) => {
    const { ind, itmInd, key, values, itmId } = deleteInfo;
    if (itmId) {
      const newData = [...values];
      newData[itmInd].isDeleted = true;
      contactList[ind][key] = [...newData];
    } else {
      values.splice(itmInd, 1);
      contactList[ind][key] = [...values];
    }
    updatePayload({ contactList });
  };

  const { contactList } = payload;

  const contactCategoryList = [
    { id: 'Generic', name: 'Generic' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Purchasing', name: 'Purchasing' }
  ];

  // const enterKeyhandler = (e, key) => {
  //   getLocation(customerId, payload.customerLocationId);
  // };

  const contactComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '0.5rem' },
      key: 'customerLocationId',
      label: 'Location Name',
      options: locationNameField,
      select: true,
      // handleKeyDown: (e) => enterKeyhandler(e, 'customerLocationId'),
      isDisabled: isSaved || isEdit,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: true,
      columnWidth: 4.1
    },
    {
      control: CHECKBOX,
      key: 'isPrimary',
      label: 'Primary',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 1,
      isDisabled: true
      // isDisabled: disablePrimary || isSaved
    },
    {
      control: CHECKBOX,
      key: 'isActive',
      label: 'Active',
      groupStyle: { marginBottom: '-0.3rem' },
      columnWidth: 1,
      isDisabled: !isEdit || (isEdit && disableIsActive) || contactList[0].isPrimary
    },
    {
      control: NONE,
      columnWidth: 5
    },
    {
      control: TEXT_FIELD,
      key: 'contactName',
      label: 'Name',
      columnWidth: 4.1,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.4rem' },
      isError: error && contactList[0]?.contactName?.length > 99,
      helperText: error && contactList[0]?.contactName?.length > 99 && 'Contact name must be 100 characters long.',
      isRequired: true,
      isDisabled: isSaved
    },
    {
      control: TEXT_FIELD,
      key: 'designation',
      label: 'Designation',
      columnWidth: 3,
      groupStyle: { marginBottom: '0.5rem', marginTop: '0.4rem' },
      isError: error && contactList[0].designation.length > 49,
      helperText: error && contactList[0].designation.length > 49 && 'Designation must be 50 characters long.',
      isRequired: true,
      isDisabled: isSaved
    },
    {
      control: SELECT_BOX,
      groupStyle: { marginTop: '0.5rem' },
      key: 'contactCategory',
      label: 'Contact Category',
      options: contactCategoryList,
      select: true,
      // isRequired: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: isSaved,
      columnWidth: 1.5
    }
  ];

  const telephoneComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '1rem', marginTop: '1rem' },
      key: 'teleCode',
      label: 'Code',
      options: phoneCode,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: isSaved,
      columnWidth: 4
    },
    {
      control: TEXT_FIELD,
      key: 'phoneNumber',
      label: 'Telephone Number',
      groupStyle: { marginBottom: '1rem', marginTop: '1rem' },
      isDisabled: isSaved,
      columnWidth: 6
    },
    {
      control: ICON,
      key: 'addTelephone',
      iconName: <AddIcon />,
      color: 'primary',
      groupStyle: { marginTop: '0.5rem' },
      columnWidth: 2,
      isDisabled: isSaved
    },
    {
      control: ICON,
      key: 'deleteTelephone',
      groupStyle: { marginTop: '0.5rem' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Delete telephone number',
      columnWidth: 0.5,
      isDisabled: isSaved
    }
  ];

  const mobileComps = [
    {
      control: SELECT_BOX,
      groupStyle: { marginBottom: '1rem', marginTop: '1rem' },
      key: 'mobileCode',
      label: 'Code',
      options: phoneCode,
      select: true,
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false,
      isDisabled: isSaved,
      columnWidth: 4
    },
    {
      control: TEXT_FIELD,
      key: 'mobileNumbers',
      label: 'Mobile Number',
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem', marginTop: '1rem' },
      isDisabled: isSaved
    },
    {
      control: ICON,
      key: 'addMobile',
      iconName: <AddIcon />,
      color: 'primary',
      groupStyle: { marginTop: '0.5rem' },
      columnWidth: 2,
      isDisabled: isSaved
    },
    {
      control: ICON,
      key: 'deleteMobile',
      groupStyle: { marginTop: '0.5rem' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Delete mobile number',
      columnWidth: 0.5,
      isDisabled: isSaved
    }
  ];

  const emailComps = [
    {
      control: TEXT_FIELD,
      groupStyle: { marginBottom: '1rem', marginTop: '1rem' },
      key: 'emails',
      label: 'Email',
      isDisabled: isSaved,
      columnWidth: 3.9
    },
    {
      control: ICON,
      key: 'addEmail',
      iconName: <AddIcon />,
      color: 'primary',
      groupStyle: { marginTop: '0.5rem' },
      columnWidth: 2,
      isDisabled: isSaved
    },
    {
      control: ICON,
      key: 'deleteEmail',
      groupStyle: { marginTop: '0.5rem' },
      iconName: <RemoveCircleIcon />,
      color: 'error',
      tooltipTitle: 'Delete email',
      columnWidth: 0.5,
      isDisabled: isSaved
    },
    {
      control: CHECKBOX,
      key: 'isPartOfAutoEmail',
      label: 'Is part of to be sent auto email',
      groupStyle: { marginTop: '0.8rem' },
      columnWidth: 5,
      isDisabled: isSaved
    }
  ];

  const btnComps = [
    {
      control: BUTTON,
      key: 'cancel',
      btnTitle: 'Cancel',
      color: 'warning',
      groupStyle: { marginRight: '-0.5rem', marginBottom: '1rem' },
      handleClickButton: () => handleCancel(),
      isDisabled: isSaved,
      columnWidth: 1.1
    },
    {
      control: BUTTON,
      key: 'save',
      btnTitle: 'Save',
      color: 'success',
      groupStyle: { marginRight: '-0.5rem', marginBottom: '1rem' },
      handleClickButton: () => saveContact(false),
      isDisabled: isSaved,
      columnWidth: 1.1
    },
    {
      control: BUTTON,
      key: 'saveAdd',
      btnTitle: 'Save & Add New',
      color: 'success',
      groupStyle: { marginRight: '1rem', marginBottom: '1rem' },
      handleClickButton: () => saveContact(true),
      isDisabled: isSaved,
      columnWidth: 1.7
    }
  ];

  // const handleOnBlur = (key, val, ind) => {
  //   const [index, itmInd] = ind.split('-');
  //   if (key === 'emails') {
  //     if (isEmail(val)) {
  //       setMailError(true);
  //     } else {
  //       setMailError(false);
  //     }
  //     // contactList[index][key][itmInd][key]
  //   }
  // };

  const handleChangeData = async (key, val, ind) => {
    const updateFields = {};
    if (
      ['customerLocationId', 'isPrimary', 'isActive', 'contactName', 'designation', 'contactCategory'].includes(key)
    ) {
      if (key === 'contactName') {
        val = val.slice(0, 100);
        contactList[ind][key] = val;
        if (val.length > 99) {
          setError(true);
        }
      } else if (key === 'customerLocationId') {
        if (val === '') {
          const filtered = contactList.filter((itm) => itm.contactCategory === 'Generic');
          updatePayload({ contactList: filtered });
          contactList[ind][key] = null;
          return true;
        }
        if (isArray(locationNameField)) {
          const currentLocation = locationNameField.filter((itm) => itm.id === val * 1);
          [selectedLocation] = currentLocation;
        }
        getLocationInfo(val);
        contactList[ind][key] = val * 1;
        if (contactList.length > 1) {
          contactList[ind + 1][key] = val * 1;
          contactList[ind + 2][key] = val * 1;
        }
      } else if (key === 'designation') {
        val = val.slice(0, 50);
        contactList[ind][key] = val;
        if (val.length > 50) {
          setError(true);
        }
      } else if (key === 'isActive') {
        contactList[ind][key] = val;
        contactList[ind].isDeleted = !val;
      } else {
        contactList[ind][key] = val;
      }
      updateFields.contactList = [...contactList];
    } else if (
      ['teleCode', 'phoneNumber', 'mobileCode', 'mobileNumbers', 'emails', 'isPartOfAutoEmail'].includes(key)
    ) {
      const [index, itmInd] = ind.split('-');
      if (key === 'teleCode') {
        contactList[index].phoneNumber[itmInd][key] = val;
      } else if (key === 'mobileCode') {
        contactList[index].mobileNumbers[itmInd][key] = val;
      } else if (key === 'phoneNumber' || key === 'mobileNumbers') {
        if (!val || (isValidStr(val, REGX_TYPE.NUM) && val.length > 0)) {
          val = (isValidStr(val, REGX_TYPE.NUM) && val.slice(0, 10)) || '';
          contactList[index][key][itmInd][key] = val;
        }
      } else if (key === 'isPartOfAutoEmail') {
        contactList[index].emails[itmInd][key] = val;
      } else if (key === 'emails') {
        contactList[index][key][itmInd][key] = val;
      } else {
        contactList[index][key][itmInd][key] = val;
      }
    }
    updateFields.contactList = [...contactList];
    updatePayload({ ...updateFields });
  };

  const getLocation = async (customerId, searchKey) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const resp = await getLocationNameForContact(customerId, searchKey);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!resp.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: resp?.message || (isArray(resp.error) && resp.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (resp.isSuccessful) {
      const locationOptions = resp.data.map((location) => ({
        id: location.id,
        name: location.name,
        isPrimary: location.isPrimary
      }));
      setLocationNameField(locationOptions);
    }
  };

  const getHasContact = async (customerLocationId) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const resp = await getHasLocationContact(customerLocationId);
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!resp.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: resp?.message || (isArray(resp.error) && resp.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (resp.isSuccessful) {
      if (resp.data.hasPrimaryContact) {
        // setDisablePrimary(true);
        contactList[0].isPrimary = false;
        updatePayload({ contactList });
      } else if (!resp.data.hasContacts) {
        // setDisablePrimary(true);
        contactList[0].isPrimary = true;
        updatePayload({ contactList });
      } else {
        contactList[0].isPrimary = true;
        updatePayload({ contactList });
      }
      addContactComps(resp.data);
    }
  };

  const getPhoneCode = async () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    const resp = await getCountryPhoneCode();
    dispatch({ type: IS_DATA_LOADING, data: false });
    if (!resp.isSuccessful) {
      setShowGenericAlertBox({
        open: true,
        titleType: STATUS.ERROR,
        title: 'Error',
        content: resp?.message || (isArray(resp.error) && resp.error[0]) || NOTIFICATIONS.SOMETHING_WENT_WRONG,
        showProceedBtn: false,
        cancelButtonText: 'Ok'
      });
    } else if (resp.isSuccessful) {
      const countryCode = resp.data.map((itm) => ({
        id: itm.id,
        name: itm.name
      }));
      setPhoneCode(countryCode);
    }
  };

  const getContactDetails = async (id) => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    let res;
    if (customerLocationId) {
      res = await getLocationContactDetails(id);
    } else {
      res = await getCustomerContactDetails(id);
    }
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
      if (res.data?.contact) {
        const contact = res.data?.contact;
        const updatedContact = {
          ...contact,
          contactId: contact.id,
          customerLocationId: contact.customerLocationId,
          contactName: contact.contactName,
          designation: contact.designation,
          isActive: !contact.isDeleted,
          phoneNumber: (isArray(contact.phoneNumber) &&
            contact.phoneNumber.map((phone) => ({
              id: phone.id,
              locationContactId: phone.locationContactId,
              name: phone.name,
              isDeleted: phone.isDeleted,
              isPartOfAutoEmail: phone.isPartOfAutoEmail,
              teleCode: phone.currentValue.split('-').slice(0, 2).join('-'),
              phoneNumber: phone.currentValue.split('-').slice(2).join('')
            }))) || [{ teleCode: null, phoneNumber: '' }],
          mobileNumbers: (isArray(contact.mobileNumbers) &&
            contact.mobileNumbers.map((mobile) => ({
              id: mobile.id,
              locationContactId: mobile.locationContactId,
              mobileCode: mobile.currentValue.split('-').slice(0, 2).join('-'),
              mobileNumbers: mobile.currentValue.split('-').slice(2).join(''),
              isPartOfAutoEmail: mobile.isPartOfAutoEmail,
              name: mobile.name,
              isDeleted: mobile.isDeleted
            }))) || [{ mobileCode: null, mobileNumbers: '' }],
          emails: (isArray(contact.emails) &&
            contact.emails.map((email) => ({
              id: email.id,
              emails: email.currentValue,
              isPartOfAutoEmail: email.isPartOfAutoEmail,
              isDeleted: email.isDeleted,
              locationContactId: email.locationContactId,
              name: email.name
            }))) || [{ emails: '', isPartOfAutoEmail: false }]
        };
        updatePayload({ contactList: [updatedContact] });
      }
    }
  };
  const handleCancel = () => {
    setError(false);
    if (!isEdit) {
      const newData = [
        {
          id: 0,
          contactId: 0,
          customerLocationId: null,
          contactName: '',
          designation: '',
          contactCategory: 'Generic',
          isDeleted: false,
          isPrimary: false,
          isActive: true,
          isPartOfAutoEmail: false,
          phoneNumber: [{ teleCode: null, phoneNumber: '' }],
          mobileNumbers: [{ mobileCode: null, mobileNumbers: '' }],
          emails: [{ emails: '', isPartOfAutoEmail: false }]
        }
      ];
      updatePayload({ contactList: newData });
    } else {
      getContactDetails(contactId);
    }
  };

  const saveContact = async (addNewContact) => {
    const newContactList = contactList.map((contact) => {
      const formattedPhoneNumber = contact.phoneNumber.map((phone) => {
        let currentValue = '';
        if (phone.teleCode && phone.phoneNumber) {
          currentValue = `${phone.teleCode}-${phone.phoneNumber}`;
        } else if (!phone.teleCode && phone.phoneNumber) {
          currentValue = phone.phoneNumber;
        }
        return {
          id: phone.id || 0,
          locationContactId: phone.locationContactId || 0,
          name: phone.name || 'Phone',
          currentValue: currentValue || '',
          isPartOfAutoEmail: phone.isPartOfAutoEmail || false,
          isDeleted: phone.isDeleted || false
        };
      });

      const formattedMobileNumbers = contact.mobileNumbers.map((mobile) => {
        let currentValue = '';
        if (mobile.mobileCode && mobile.mobileNumbers) {
          currentValue = `${mobile.mobileCode}-${mobile.mobileNumbers}`;
        } else if (!mobile.mobileCode && mobile.mobileNumbers) {
          currentValue = mobile.mobileNumbers;
        }
        return {
          id: mobile.id || 0,
          locationContactId: mobile.locationContactId || 0,
          name: mobile.name || 'Mobile',
          currentValue: currentValue || '',
          isPartOfAutoEmail: mobile.isPartOfAutoEmail || false,
          isDeleted: mobile.isDeleted || false
        };
      });

      const formattedEmails = contact.emails.map((email) => ({
        id: email.id || 0,
        locationContactId: email.locationContactId || 0,
        name: email.name || 'Email',
        currentValue: email.emails,
        isPartOfAutoEmail: email.isPartOfAutoEmail,
        isDeleted: email.isDeleted || false
      }));

      return {
        ...contact,
        customerId: contact.customerId || customerId,
        phoneNumber: formattedPhoneNumber.filter((phone) => phone.currentValue !== ''),
        mobileNumbers: formattedMobileNumbers.filter((mobile) => mobile.currentValue !== ''),
        emails: formattedEmails.filter((email) => email.currentValue !== '')
      };
    });
    const filteredContactList = newContactList.reduce((acc, contact) => {
      const existingContact = acc.find((c) => c.contactCategory === contact.contactCategory);

      if (!existingContact) {
        acc.push(contact);
      } else if (contact.isPrimary) {
        acc = acc.filter((c) => c.contactCategory !== contact.contactCategory || c.id === contact.id);
        acc.push(contact);
      }

      return acc;
    }, []);

    let requiredFields = false;

    filteredContactList.forEach((contact) => {
      if (!contact.contactName || !contact.designation) {
        requiredFields = true;
      }
    });
    if (requiredFields) {
      setError(true);
    } else {
      dispatch({ type: IS_DATA_LOADING, data: true });
      let promises;
      try {
        if (isCustomerContact) {
          promises = filteredContactList.map((contact) => addCustomerContact({ customerContact: contact }));
        } else {
          promises = filteredContactList.map((contact) => addLocationContact({ customerLocationContact: contact }));
        }
        const responses = await Promise.all(promises);
        dispatch({ type: IS_DATA_LOADING, data: false });
        const hasError = responses.some((res) => !res.isSuccessful);
        if (!isCustomerContact) {
          const { areApprovalButtonsEnabled } = responses[0].data;
          setApproveBtnEnable(areApprovalButtonsEnabled);
        }
        if (hasError) {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.ERROR,
            title: 'Error',
            content:
              responses.find((res) => !res.isSuccessful)?.message ||
              responses.find((res) => isArray(res.error))?.error[0] ||
              NOTIFICATIONS.SOMETHING_WENT_WRONG,
            showProceedBtn: false,
            cancelButtonText: 'Ok'
          });
        } else {
          setShowGenericAlertBox({
            open: true,
            titleType: STATUS.SUCCESS,
            title: 'Success',
            content: responses[0]?.message || 'Contact saved successfully.',
            showProceedBtn: false,
            cancelButtonText: 'Close'
          });
          setIsSaved(true);
          setDisableIsActive(false);
        }
      } catch (error) {
        // Handle any errors that might occur during the API call or Promise.all
        setShowGenericAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: 'Error',
          content: NOTIFICATIONS.SOMETHING_WENT_WRONG,
          showProceedBtn: false,
          cancelButtonText: 'Ok'
        });
      }
      if (addNewContact) {
        setIsSaved(false);
        const locationId = contactList[0].customerLocationId;
        setDisableIsActive(true);
        updatePayload({
          contactList: [
            {
              id: 0,
              contactId: 0,
              customerLocationId: locationId,
              contactName: '',
              designation: '',
              contactCategory: 'Generic',
              isDeleted: false,
              isPrimary: false,
              isActive: true,
              isPartOfAutoEmail: false,
              phoneNumber: [{ teleCode: null, phoneNumber: '' }],
              mobileNumbers: [{ mobileCode: null, mobileNumbers: '' }],
              emails: [{ emails: '', isPartOfAutoEmail: false }]
            }
          ]
        });
      }
    }
  };

  const updateNumbers = (type, ind, itmInd, key, itmId) => {
    const values = [...contactList[ind][key]];
    let codeType = '';
    let dataKey = '';
    let newObj;
    const proceedItms = { type, ind, itmInd, key, values, itmId };

    if (key === 'phoneNumber') {
      codeType = 'teleCode';
      dataKey = 'phoneNumber';
    } else if (key === 'mobileNumbers') {
      codeType = 'mobileCode';
      dataKey = 'mobileNumbers';
    } else {
      switch (type) {
        case 'add':
          values.push({ emails: '', isPartOfAutoEmail: false });
          break;
        case 'delete':
          setShowGenericAlertBox({
            open: true,
            title: 'Are you sure?',
            titleType: STATUS.WARNING,
            content: 'Do you want to delete this email?',
            proceedAction: 'delete',
            showProceedBtn: true,
            cancelButtonText: 'No',
            proceedButtonText: 'Yes',
            additionalInfoForProceed: proceedItms
          });
          break;
        default:
          break;
      }
      contactList[ind][key] = [...values];
      updatePayload({ contactList });
      return;
    }

    switch (type) {
      case 'add':
        newObj = { [codeType]: null, [dataKey]: '' };
        values.push(newObj);
        break;
      case 'delete':
        setShowGenericAlertBox({
          open: true,
          title: 'Are you sure?',
          titleType: STATUS.WARNING,
          content: 'Do you want to delete this number?',
          proceedAction: 'delete',
          showProceedBtn: true,
          cancelButtonText: 'No',
          proceedButtonText: 'Yes',
          additionalInfoForProceed: proceedItms
        });
        break;
      default:
        break;
    }

    contactList[ind][key] = [...values];
    updatePayload({ contactList });
  };

  const addContactComps = (contactInfo) => {
    const { hasPrimaryContact, hasGenericContact, hasFinanceContact, hasPurchasingContact } = contactInfo;
    // if (contactList.length < 3) {
    const addPrimary = isRouting ? !hasPrimaryContact && isPrimaryLocation : selectedLocation?.isPrimary;
    if (addPrimary) {
      if (!hasFinanceContact) {
        contactList.push({
          id: 0,
          contactId: 0,
          customerLocationId: contactList[0].customerLocationId,
          contactName: '',
          designation: '',
          contactCategory: 'Finance',
          isDeleted: false,
          isPrimary: false,
          isActive: true,
          isPartOfAutoEmail: false,
          phoneNumber: [{ teleCode: null, phoneNumber: '' }],
          mobileNumbers: [{ mobileCode: null, mobileNumbers: '' }],
          emails: [{ emails: '', isPartOfAutoEmail: false }]
        });
      }
      if (!hasPurchasingContact) {
        contactList.push({
          id: 0,
          contactId: 0,
          customerLocationId: contactList[0].customerLocationId,
          contactName: '',
          designation: '',
          contactCategory: 'Purchasing',
          isDeleted: false,
          isPrimary: false,
          isActive: true,
          isPartOfAutoEmail: false,
          phoneNumber: [{ teleCode: null, phoneNumber: '' }],
          mobileNumbers: [{ mobileCode: null, mobileNumbers: '' }],
          emails: [{ emails: '', isPartOfAutoEmail: false }]
        });
      }
      updatePayload({ contactList });
    } else {
      const newData = contactList.filter((itm) => itm.contactCategory === 'Generic');
      updatePayload({ contactList: newData });
    }
    // }
  };

  const getLocationInfo = (customerLocationId) => {
    if (customerLocationId && !isEdit) {
      getHasContact(customerLocationId);
    }
  };

  useEffect(() => {
    if (customerLocationId && isArray(locationNameField)) {
      handleChangeData('customerLocationId', customerLocationId, 0);
      // const newData = [...contactList];
      // newData[0].customerLocationId = customerLocationId;
      // updatePayload({ contactList: newData });
    }
  }, [customerLocationId, locationNameField]);

  useEffect(() => {
    if (customerId) {
      getLocation(customerId, null);
    }
    getPhoneCode();
  }, []);

  useEffect(() => {
    if (isEdit && contactId) {
      if (customerLocationId) {
        getContactDetails(contactId);
      } else {
        getContactDetails(contactId);
      }
    }
  }, [contactData]);

  useEffect(() => {
    if (contactList[0].customerLocationId === null || contactList[0].customerLocationId === undefined) {
      setIsCustomerContact(true);
    } else {
      setIsCustomerContact(false);
    }
  }, [contactList]);

  const getContactsComps = (contact, index) => (
    <Grid item xs={12} mt={3}>
      <Grid container spacing={3}>
        {contactComps.map((comp, ind) => {
          if (comp.key === 'customerLocationId') {
            if (index !== 0) {
              comp.isDisabled = true;
            }
          } else if (['contactName', 'designation'].includes(comp.key)) {
            comp.isError = error && !contactList[index][comp.key];
            comp.helperText = error && !contactList[index][comp.key] && 'Please enter value in field';
          } else if (comp.key === 'isPrimary') {
            if (!contactList[index].customerLocationId) {
              return true;
            }
          } else if (comp.key === 'contactCategory') {
            if (index !== 0) {
              comp.isDisabled = true;
            }
          }
          return (
            <RenderComponent
              key={ind}
              metaData={{ ...comp }}
              payload={contactList[index]}
              ind={index}
              handleChange={handleChangeData}
            />
          );
        })}
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Grid item xs={1.5}>
          <Grid container spacing={3}>
            <RenderComponent
              metaData={{
                control: TYPOGRAPHY,
                groupStyle: { marginTop: '1.2rem' },
                key: 'telephoneNumber',
                label: 'Telephone Number(s)',
                columnWidth: 12
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={3}>
          {isArray(contactList[index].phoneNumber) &&
            contactList[index].phoneNumber.map((itm, itmInd) => {
              if (itm.isDeleted) {
                return null;
              }
              return (
                <Grid container spacing={3} key={itmInd}>
                  {telephoneComps.map((comp, ind) => {
                    if (itm.isDeleted) {
                      return true;
                    }
                    if (comp.key === 'deleteTelephone') {
                      comp.handleClickIcon = () => updateNumbers('delete', index, itmInd, 'phoneNumber', itm.id);
                      if (itmInd === 0) {
                        return true;
                      }
                    } else if (comp.key === 'addTelephone') {
                      comp.handleClickIcon = () => updateNumbers('add', index, itmInd, 'phoneNumber', itm.id);
                      if (itmInd > 0) {
                        return true;
                      }
                    }
                    return (
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comp }}
                        payload={contactList[index]?.phoneNumber[itmInd]}
                        ind={`${index}-${itmInd}`}
                        handleChange={handleChangeData}
                      />
                    );
                  })}
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Grid item xs={1.5}>
          <Grid container spacing={3}>
            <RenderComponent
              metaData={{
                control: TYPOGRAPHY,
                groupStyle: { marginTop: '1.2rem' },
                key: 'mobileNumber',
                label: 'Mobile Number(s)',
                columnWidth: 12
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={3}>
          {isArray(contactList[index].mobileNumbers) &&
            contactList[index].mobileNumbers.map((itm, itmInd) => {
              if (itm.isDeleted) {
                return null;
              }
              return (
                <Grid container spacing={3} key={itmInd}>
                  {mobileComps.map((comp, ind) => {
                    if (itm.isDeleted) {
                      return true;
                    }
                    if (comp.key === 'deleteMobile') {
                      comp.handleClickIcon = () => updateNumbers('delete', index, itmInd, 'mobileNumbers', itm.id);
                      if (itmInd === 0) {
                        return true;
                      }
                    } else if (comp.key === 'addMobile') {
                      comp.handleClickIcon = () => updateNumbers('add', index, itmInd, 'mobileNumbers', itm.id);
                      if (itmInd > 0) {
                        return true;
                      }
                    }
                    return (
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comp }}
                        payload={contactList[index]?.mobileNumbers[itmInd]}
                        ind={`${index}-${itmInd}`}
                        handleChange={handleChangeData}
                      />
                    );
                  })}
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Grid item xs={1.5}>
          <Grid container spacing={3}>
            <RenderComponent
              metaData={{
                control: TYPOGRAPHY,
                groupStyle: { marginTop: '1.2rem' },
                key: 'email',
                label: 'Email(s)',
                columnWidth: 12
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          {isArray(contactList[index].emails) &&
            contactList[index].emails.map((itm, itmInd) => {
              if (itm.isDeleted) {
                return null;
              }
              return (
                <Grid container spacing={3} key={itmInd}>
                  {emailComps.map((comp, ind) => {
                    if (comp.key === 'deleteEmail') {
                      comp.handleClickIcon = () => updateNumbers('delete', index, itmInd, 'emails', itm.id);
                      if (itmInd === 0) {
                        return null;
                      }
                    }
                    if (comp.key === 'addEmail') {
                      comp.handleClickIcon = () => updateNumbers('add', index, itmInd, 'emails', itm.id);
                      if (itmInd > 0) {
                        return null;
                      }
                    }
                    if (comp.key === 'emails') {
                      comp.isError =
                        contactList[index][comp.key][itmInd].emails &&
                        isEmail(contactList[index][comp.key][itmInd].emails);
                      comp.helperText = 'Please enter a valid email.';
                    }
                    if (comp.key === 'isPartOfAutoEmail') {
                      if (!contactList[index].emails[itmInd].emails) {
                        return null;
                      }
                    }
                    return (
                      <RenderComponent
                        key={ind}
                        metaData={{ ...comp }}
                        payload={contactList[index]?.emails[itmInd]}
                        ind={`${index}-${itmInd}`}
                        handleChange={handleChangeData}
                        // handleBlur={handleOnBlur}
                      />
                    );
                  })}
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={3} sx={{ marginTop: '-3rem' }}>
      <Grid>
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
      </Grid>
      {isArray(contactList) && contactList.map((contact, ind) => getContactsComps(contact, ind))}
      <Grid container spacing={3} display="flex" justifyContent="flex-end">
        {btnComps.map((comp, ind) => (
          <RenderComponent key={ind} metaData={comp} ind={payload.length + 1} />
        ))}
      </Grid>
    </Grid>
  );
}

AddContacts.propTypes = {
  contactData: PropTypes.object
};

export default AddContacts;
