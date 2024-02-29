import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChromePicker, CirclePicker } from 'react-color';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';
import Brightness1SharpIcon from '@mui/icons-material/Brightness1Sharp';
import { Grid, Typography, Button, Container, Paper, Tooltip } from '@mui/material';
import useBoolean from '../../../../hooks/useBoolean';
import RenderComponent from '../../../../components/RenderComponent';
import { COMPONENTS, MAX_LENGTH, PREFERRED_NAMES_KEYS, STATUS, THEME } from '../../../../utils/constants';
import { ROUTES } from '../../../../routes/paths';
import { isArray, isShortName } from '../../../../utils/utils';
import EmployeeList from '../EmployeeList/EmployeeList';
import DialogComponent from '../../../../components/Dialog';
import GroupedMultiSelect from '../../../../components/MultiselectGroupingComponent';
import { APIS, API_V1 } from '../../../../utils/apiList';
import { IS_DATA_LOADING, GET_COUNTRY, GET_REGIONS } from '../../../../redux/constants';
import { getColorCode, validateColorCode, addUpdateUser } from '../../../../services/employeeService';
import { getCountries, getRegions } from '../../../../services/masterDataService';
import signature from '../../../../assets/images/signature.png';
import './AddNewUser.scss';

function AddNewUser() {
  const DEFAUL_BACK_COLOR = '#000';
  const DEFAUL_TEXT_COLOR = '#fff';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const dispatch = useDispatch();
  const masterData = useSelector((state) => state.MasterDataReducer);
  const userInfo = useSelector((state) => state.LoginUserDetailsReducer?.userInfo);

  const [payload, setPayload] = useState({
    textColor: DEFAUL_TEXT_COLOR,
    backColor: DEFAUL_BACK_COLOR,
    selectedregions: []
  });

  const [isError, setIsError] = useState(false);
  const [openEmployeeList, setOpenEmployeeList] = useState(false);
  const [displayBackColor, setDisplayBackColor] = useState(false);
  const [displayTextColor, setDisplayTextColor] = useState(false);
  const [empSearchBtnClick, setEmpSearchBtnClick] = useState(true);
  const [isSuccess, setIsSuccess] = useBoolean(false);
  const [sign, setSign] = useState('');
  const [errors, setErrors] = useState({});
  const [alertBox, setShowAlertBox] = useState({ open: false, title: '' });

  const { USERS, EDIT_USER } = ROUTES;

  const { TEXT_FIELD, BUTTON, SELECT_BOX } = COMPONENTS;
  const { roles, regionsWithHierarchy } = masterData;
  const defaultTextColor = ['#000000', '#FFFFFF', '#F5F5F5', '#FFFFE6'];
  // Open color palette

  // Checking flag is edit or add
  const param = state;
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);
  const isEditFlag = match(EDIT_USER);
  const handleSearchEmployeeList = () => {
    setOpenEmployeeList(true);
    setEmpSearchBtnClick(false);
  };
  // Form fields array
  const componentsSet1 = [
    {
      control: BUTTON,
      key: 'searchEmpId',
      btnTitle: t('addUser.searchEmployee'),
      handleClickButton: handleSearchEmployeeList,
      columnWidth: 2,
      color: 'success',
      isDisabled: isEditFlag
    },
    {
      control: TEXT_FIELD,
      key: 'axEmployeeId',
      label: t('addUser.employeeId'),
      columnWidth: 2,
      groupStyle: { marginBottom: '1rem' },
      isDisabled: true,
      isError: isError && empSearchBtnClick && !payload.axEmployeeId,
      helperText: isError && empSearchBtnClick && !payload.axEmployeeId && t('addUser.employeeIDIsRequired'),
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'name',
      label: t('addUser.name'),
      columnWidth: 4,
      isDisabled: true,
      isError: isError && empSearchBtnClick && !payload.name,
      helperText: isError && empSearchBtnClick && !payload.name && t('addUser.nameIsRequired'),
      isRequired: true
    }
  ];

  const componentsSet2 = [
    {
      control: TEXT_FIELD,
      key: 'legalEntity',
      label: t('addUser.legalEntity'),
      columnWidth: 3,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true,
      isError: isError && empSearchBtnClick && !payload.legalEntity,
      helperText: isError && empSearchBtnClick && !payload.legalEntity && t('addUser.legalEntityIsRequired'),
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'phoneNumberCode',
      label: t('addUser.countryCode'),
      columnWidth: 3,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'mobileNo',
      label: t('addUser.mobileNumber'),
      groupStyle: { marginBottom: '0.5rem' },
      columnWidth: 6,
      isDisabled: true
      // isError: errors.mobileNo || (isError && payload.mobileNo && isPhone(payload.mobileNo)),
      // helperText:
      //   errors.mobileNo ||
      //   (isError && payload.mobileNo && isPhone(payload.mobileNo) && t('addUser.notValidMobileNumber'))
    },
    {
      control: TEXT_FIELD,
      key: 'email',
      label: t('addUser.email'),
      columnWidth: 6,
      groupStyle: { marginBottom: '0.5rem' },
      isDisabled: true,
      isError: isError && empSearchBtnClick && !payload.email,
      helperText: isError && empSearchBtnClick && !payload.email && t('addUser.emailIsRequired'),
      isRequired: true
    },
    {
      control: SELECT_BOX,
      key: 'roleId',
      label: t('addUser.role'),
      placeholder: t('addUser.role'),
      columnWidth: 6,
      options: roles,
      select: true,
      isRequired: true,
      groupStyle: { marginBottom: '0.5rem' },
      isError: isError && empSearchBtnClick && !payload.roleId,
      helperText: isError && empSearchBtnClick && !payload.roleId && 'Role is required',
      isSelecteAllAllow: false,
      isEmptyOptionAllowed: false
    },
    {
      control: TEXT_FIELD,
      key: 'shortName',
      label: t('addUser.shortName'),
      columnWidth: 3,
      isDisabled: isEditFlag,
      groupStyle: { marginBottom: '1rem' },
      isError:
        errors.shortName ||
        (empSearchBtnClick &&
          isError &&
          (!payload.shortName || isShortName(payload.shortName) || payload.shortName.length > MAX_LENGTH.SHORT_NAME)),
      helperText:
        empSearchBtnClick &&
        isError &&
        ((!payload.shortName && t('addUser.shortNameIsRequired')) ||
          (isShortName(payload.shortName) && t('addUser.notValidShortName')) ||
          (payload.shortName.length > MAX_LENGTH.SHORT_NAME && t('addUser.maxlengthShortName'))),
      isRequired: true,
      tooltipTitle: 'Numbers and Special Characters are not Allowed.',
      placement: 'top'
    },
    {
      control: TEXT_FIELD,
      key: 'username',
      label: t('addUser.userName'),
      columnWidth: 3,
      isDisabled: true,
      isError: isError && empSearchBtnClick && !payload.username,
      helperText: isError && empSearchBtnClick && !payload.username && t('addUser.usernameIsRequired'),
      isRequired: true
    }
  ];

  const handleCloseBackColor = () => setDisplayBackColor(false);

  const openBackColor = () => setDisplayBackColor(!displayBackColor);

  const handleCloseTextColor = () => setDisplayTextColor(false);

  const openTextColor = () => setDisplayTextColor(!displayTextColor);

  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs, stringCountryIds: '', stringRegionIds: '' });

  const validate = (fieldValues) => {
    const tempErrors = { ...errors };
    if ('shortName' in fieldValues) {
      tempErrors.shortName = fieldValues.shortName
        ? isShortName(fieldValues.shortName) && t('addUser.notValidShortName')
        : (fieldValues.shortName > MAX_LENGTH.SHORT_NAME && t('addUser.maxlengthShortName')) ||
          t('addUser.shortNameIsRequired');
    }
    // if ('mobileNo' in fieldValues) {
    //   tempErrors.mobileNo =
    //     fieldValues.mobileNo && isPhone(fieldValues.mobileNo) && t('addUser.notValidMobileNumber');
    // }
    setErrors({
      ...tempErrors
    });
  };

  const handleChangeData = (key, val) => {
    if (key === 'mobileNo') {
      const newMobileNo = val.replace(/^0+/, '');
      updatePayload({ [key]: newMobileNo });
    } else {
      updatePayload({ [key]: val });
    }
    validate({ [key]: val });
  };

  const getEmployeeDetails = (data) => {
    const {
      employeeName,
      email,
      employeeId,
      axEmployeeId,
      legalEntity,
      legalEntityId,
      countryCode,
      phoneNumberCode = '',
      mobileNo = '',
      backColor = DEFAUL_BACK_COLOR,
      shortName = '',
      roleId = '',
      regionIds = [],
      regionNames = []
    } = data;
    updatePayload({
      id: 0,
      employeeId,
      userId: '',
      password: '',
      displayName: '',
      axEmployeeId: axEmployeeId.toString(),
      legalEntity,
      legalEntityId,
      role: [],
      stringRegionIds: '',
      stringCountryIds: '',
      countryIds: [],
      preferredNameOption: PREFERRED_NAMES_KEYS.shortName,
      preferredTheme: THEME.DARK,
      name: employeeName,
      email,
      countryCode,
      phoneNumberCode,
      mobileNo,
      backColor,
      shortName,
      roleId,
      regionIds,
      regionNames
    });
  };

  const handleSave = () => {
    setEmpSearchBtnClick(true);
    const { shortName, employeeId, legalEntity, name, username, email, roleId, regionIds, regionNames } = payload;
    if (
      !shortName ||
      isShortName(shortName) ||
      shortName > MAX_LENGTH.SHORT_NAME ||
      !employeeId ||
      !legalEntity ||
      !name ||
      !username ||
      !email ||
      !isArray(regionIds) ||
      !isArray(regionNames) ||
      !roleId
    ) {
      setIsError(true);
    } else {
      saveUserData();
      setIsError(true);
    }
  };

  const saveUserData = () => {
    dispatch({ type: IS_DATA_LOADING, data: true });
    addUpdateUser(`${API_V1}/${APIS.ADD_UPDATE_USER}`, { user: payload }).then((res) => {
      dispatch({ type: IS_DATA_LOADING, data: false });
      if (res?.errorCode) {
        setShowAlertBox({
          open: true,
          titleType: STATUS.ERROR,
          title: t('dialog.error'),
          content: res.error
        });
      } else {
        handleAPIRes(res);
      }
    });
  };

  const getContriesList = async (userId) => {
    const res = await getCountries(`${API_V1}/${APIS.GET_COUNTRIES}?userId=${userId}`);
    dispatch({ type: GET_COUNTRY, data: res?.data || [] });
  };

  const getRegionsList = async (userId) => {
    const res = await getRegions(`${API_V1}/${APIS.GET_REGIONS}?countryId=all&userId=${userId}`);
    dispatch({ type: GET_REGIONS, data: res?.data || [] });
  };

  const handleAPIRes = (updatedUser) => {
    setIsSuccess.on();
    if (updatedUser) {
      if (userInfo?.userId === payload?.userId) {
        getContriesList(userInfo?.userId);
        getRegionsList(userInfo?.userId);
      }
    }
    if (updatedUser) {
      navigate(ROUTES.USERS);
    }
  };

  const handleCloseAlertBox = () => {
    if (isSuccess) {
      navigate(`${ROUTES.USERS}`);
      setIsSuccess.off();
    }
    setShowAlertBox({ open: false, titleType: '', title: '', content: '' });
  };

  const handleChangeBackColor = async (color) => {
    if (isArray(payload?.regionIds)) {
      const isColorAvailable = await validateColor(color.hex);
      if (isColorAvailable) {
        handleChangeData('backColor', color.hex);
      } else {
        setShowAlertBox({
          open: true,
          titleType: STATUS.WARNING,
          title: t('addUser.notAllowed'),
          content: t('addUser.colorOccupied')
        });
      }
    }
  };

  // textColor methods
  const handleChangeTextColor = (color) => handleChangeData('textColor', color.hex);

  const handleCloseEmployeeList = () => setOpenEmployeeList(false);

  const getSelectedRegionIds = (ids, names) => updatePayload({ regionIds: ids, regionNames: names });

  const validateColor = async (color = payload?.backColor) => {
    if (color) {
      const url = `${API_V1}/${APIS.VALIDATE_COLOR_CODE}/${color.replace('#', '%23')}`;
      const res = await validateColorCode(url, payload?.regionIds);
      return res.data;
    }
    return false;
  };

  const getRandomColor = async () => {
    const res = await getColorCode(`${API_V1}/${APIS.GET_RANDOM_COLOR_CODE}`, payload?.regionIds);
    updatePayload({ backColor: res?.data || DEFAUL_BACK_COLOR });
  };

  const checkForValidateColor = async () => {
    const isColorAvailable = await validateColor();
    if (!isColorAvailable) {
      getRandomColor();
    }
  };

  useEffect(() => {
    if (!isEditFlag && isArray(payload?.regionIds)) {
      checkForValidateColor();
    }
  }, [payload?.regionIds]);

  useEffect(() => {
    const { shortName, axEmployeeId } = payload;
    updatePayload({ username: (shortName && axEmployeeId && `${shortName}.${axEmployeeId}`) || '' });
  }, [payload?.shortName]);

  useEffect(() => {
    if (isEditFlag) {
      const { regionIds, signature } = param;
      setSign(signature);
      if (isArray(regionIds)) {
        if (isArray(regionsWithHierarchy)) {
          const regionNames = [];
          const selectedregions = [];
          regionsWithHierarchy.forEach((cntry) => {
            if (isArray(cntry.regions)) {
              cntry.regions.forEach((rgn) => {
                if (regionIds.includes(rgn.id)) {
                  regionNames.push(rgn.name);
                  selectedregions.push(rgn);
                }
              });
            }
          });
          const {
            password = '',
            displayName = '',
            role = [],
            stringRegionIds = '',
            stringCountryIds = '',
            countryIds = [],
            preferredNameOption = PREFERRED_NAMES_KEYS.shortName,
            preferredTheme = THEME.DARK,
            countryCode = '',
            phoneNumberCode = '',
            mobileNo = ''
          } = param;
          updatePayload({
            ...param,
            regionNames,
            selectedregions,
            password,
            displayName,
            role,
            stringRegionIds,
            stringCountryIds,
            countryIds,
            preferredNameOption,
            preferredTheme,
            countryCode,
            phoneNumberCode,
            mobileNo
          });
          console.log(regionNames, selectedregions);
        }
      } else {
        updatePayload({ ...param });
      }
    }
  }, []);

  return (
    <Paper className="add-user-main-cls">
      <DialogComponent
        open={alertBox.open}
        handleClose={handleCloseAlertBox}
        title={alertBox.title}
        titleType={isSuccess ? STATUS.SUCCESS : alertBox.titleType}
        content={isSuccess ? t('addUser.successfullyCreatedUser') : alertBox.content}
        isProceedButton={false}
        isCancelButton
        cancelButtonText={isSuccess ? 'Ok' : 'Cancel'}
        color={isSuccess ? 'success' : 'error'}
      />
      {!openEmployeeList ? (
        <Container
          style={{
            padding: '2rem',
            // marginTop: '10px',
            boxShadow: '1px 1px 2px 2px  #DFE3E8',
            borderRadius: '5px'
          }}
        >
          <Grid container spacing={5}>
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem'
              }}
              item
              xs={12}
            >
              <Typography fontWeight="bold" variant="subtitle1">
                {isEditFlag ? t('addUser.editUser') : t('addUser.addNewUser')}
              </Typography>
            </Grid>
          </Grid>
          <Grid style={{ marginTop: '2rem', padding: '1rem' }} container spacing={3}>
            {/* Grid for search button / ID / Name */}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                {componentsSet1?.map((comp, ind) => (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Grid container for 2  x 2 section */}
          <Grid container spacing={3} style={{ padding: '1rem' }}>
            {/* Grid for legal entity / phoneCode / mobile / email / role */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={3}>
                {componentsSet2?.map((comp, ind) => (
                  <RenderComponent
                    key={ind}
                    metaData={comp}
                    payload={payload}
                    ind={1}
                    handleChange={handleChangeData}
                  />
                ))}
                <Grid item xs={3.2}>
                  <GroupedMultiSelect
                    data={regionsWithHierarchy}
                    childKey="regions"
                    label="Regions *"
                    getIds={getSelectedRegionIds}
                    isError={isError && empSearchBtnClick && !isArray(payload?.regionIds)}
                    errorText={t('addUser.regionRequired')}
                    isRequired
                    values={payload?.selectedregions}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Grid>
                    <Typography
                      style={{
                        fontSize: '13px',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {t('addUser.backColor')}
                    </Typography>
                    <div>
                      <Tooltip title="Click to add Back Color">
                        <Brightness1SharpIcon
                          onClick={openBackColor}
                          style={{
                            color: payload.backColor,
                            cursor: 'pointer',
                            textAlign: 'center',
                            border: '1px solid #637381',
                            borderRadius: '50px',
                            boxShadow: '2px #DEDEDE'
                          }}
                        />
                      </Tooltip>
                      {displayBackColor ? (
                        <div className="popover-cls">
                          <div
                            onKeyDown={() => console.log('')}
                            role="button"
                            tabIndex={0}
                            className="cover-cls"
                            onClick={handleCloseBackColor}
                          />
                          <ChromePicker disableAlpha color={payload.backColor} onChange={handleChangeBackColor} />
                        </div>
                      ) : null}
                    </div>{' '}
                  </Grid>
                </Grid>

                <Grid item xs={3}>
                  <Grid>
                    <Typography
                      style={{
                        fontSize: '13px',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {t('addUser.textColor')}
                    </Typography>
                    <div>
                      <Tooltip title="Click to add Text Color">
                        <Brightness1SharpIcon
                          onClick={openTextColor}
                          style={{
                            color: payload.textColor,
                            cursor: 'pointer',
                            textAlign: 'center',
                            border: '1px solid #637381',
                            borderRadius: '50px',
                            boxShadow: '2px #DEDEDE'
                          }}
                        />
                      </Tooltip>
                      {displayTextColor ? (
                        <div className="popover-cls">
                          <div
                            onKeyDown={() => console.log('')}
                            role="button"
                            tabIndex={0}
                            className="cover-cls"
                            onClick={handleCloseTextColor}
                          />
                          <Grid
                            style={{
                              backgroundColor: '#DEDEDE',
                              padding: '1rem',
                              borderRadius: '12px',
                              width: '200px'
                            }}
                          >
                            <CirclePicker
                              border="1px solid black"
                              width="100%"
                              colors={defaultTextColor}
                              onChange={handleChangeTextColor}
                            />
                          </Grid>
                        </div>
                      ) : null}
                    </div>{' '}
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    style={{
                      fontSize: '13px',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {t('addUser.colorSample')}
                  </Typography>
                  <Grid
                    style={{
                      width: '100%',
                      borderRadius: '12px'
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{
                        backgroundColor: `${payload.backColor}`,
                        borderRadius: '12px 12px 0px 0px ',
                        border: '1px solid #DEDEDE',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}
                    >
                      <Typography
                        style={{
                          color: `${payload.textColor}`,
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginLeft: '0.5rem',
                          paddingBottom: '0.5rem',
                          visibility: `${!payload?.username ? 'hidden' : ''}`
                        }}
                      >
                        {payload?.username || 'Username'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid style={{ position: 'relative', top: -50 }}>
                {isEditFlag ? (
                  <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Typography
                      style={{
                        fontSize: '13px',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        marginRight: '8.5rem'
                      }}
                    >
                      {t('addUser.signaturePreview')}
                    </Typography>
                    <Grid style={{ boxShadow: '2px 2px 2px 2px  #DFE3E8' }} p={1.5}>
                      <Grid
                        style={{
                          height: '130px',
                          width: '15rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          marginBottom: '1rem',
                          backgroundColor: 'rgb(222, 222, 222)'
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          style={{
                            borderRadius: '12px 12px 0px 0px',
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <img src={`data:image/png;base64,${sign}`} alt="No Signature" />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt="70px">
                    <Typography
                      variant="body2"
                      style={{
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      User Signature
                    </Typography>
                    <img
                      alt="signature"
                      src={signature}
                      style={{
                        height: '104px',
                        border: '1px solid black',
                        padding: '5px',
                        borderRadius: '4px'
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={1}>
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={12}>
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  color: 'warning',
                  handleClickButton: () => navigate(USERS),
                  btnTitle: 'Cancel',
                  columnWidth: 0.9
                }}
              />
              <RenderComponent
                metaData={{
                  control: BUTTON,
                  variant: 'contained',
                  color: 'success',
                  size: 'small',
                  groupStyle: { marginLeft: '1.5rem' },
                  handleClickButton: () => handleSave(),
                  btnTitle: 'Save',
                  columnWidth: 0.9
                }}
              />
            </Grid>
          </Grid>
        </Container>
      ) : (
        <EmployeeList
          open={openEmployeeList}
          handleClose={handleCloseEmployeeList}
          selectedEmployee={getEmployeeDetails}
        />
      )}
    </Paper>
  );
}

export default AddNewUser;
