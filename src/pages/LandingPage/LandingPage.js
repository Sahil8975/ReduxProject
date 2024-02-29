import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Container, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DialogComponent from '../../components/Dialog';
import {
  getLegalEntities,
  getCountries,
  getBusinessTypes,
  getrolelist,
  getRegions,
  getRegionsWithHierarchy,
  getSalesmensDdl,
  getServicemensDdl,
  getCurrencyCodes,
  getFundingTypes,
  getServiceOrderStatus
} from '../../services/masterDataService';
import { getProjectStatusList } from '../../services/projectService';
import { APIS, API_V1 } from '../../utils/apiList';
import {
  POST_LEGAL_ENTITIES,
  GET_COUNTRY,
  GET_REGIONS,
  GET_REGIONS_WITH_HIERARCHY,
  GET_BUSINESS_TYPES,
  SAVE_ROLES,
  SAVE_LOGIN_USERS_DETAILS_SUCCESS,
  SAVE_ROLEWISE_MENU,
  IS_DATA_LOADING,
  SAVE_SALESMANS,
  SAVE_SERVICEMANS,
  GET_CURRIENCY_CODES,
  GET_FUNDING_TYPES,
  GET_SERVICE_ORDER_STATUS,
  GET_PROJECT_STATUS
} from '../../redux/constants';
import * as authService from '../../components/authentication/identityServer/services/AuthService';
import { getUser } from '../../components/authentication/identityServer/services/AuthService';
import { getUserProfileDetails } from '../../services/employeeService';
import useSettings from '../../hooks/useSettings';
import { isArray, setSessionStorageItem, isViewAllowedForRole } from '../../utils/utils';
import { ROLE_NAME, LOCAL_STORAGE_KEYS, LOG_USER_ACTIVITY, ROLE_SPECIFIC_VIEWS } from '../../utils/constants';
import { logUserActivity } from '../../utils/rest-services';
import { ROUTES } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import './LandingPage.scss';

function LandingPage() {
  const { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID } = LOCAL_STORAGE_KEYS;
  const userInfo = useSelector((state) => state.LoginUserDetailsReducer?.userInfo);
  const { role, userId } = userInfo || { role: null };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onChangeMode } = useSettings();
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const {
    DASHBOARD_ITEM_CONSUMPTION,
    DASHBOARD_UNFINISHED_TASK,
    DASHBOARD_PROJECT_PENDING_RENEWAL,
    DASHBOARD_PROJECT_PENDING_UNINSTALLATION,
    DASHBOARD_PARTIALLY_COMPALTED_TASKS,
    DASHBOARD_PROJECT_ON_HOLD,
    DASHBOARD_INVOICE_DISCREPANCIES
  } = ROLE_SPECIFIC_VIEWS;

  const handleActionDispatch = (type, data = []) => dispatch({ type, data });

  const getLegalEntitiesList = async () => {
    const res = await getLegalEntities(`${API_V1}/${APIS.GET_LEGAL_ENTITIES}`);
    handleActionDispatch(POST_LEGAL_ENTITIES, res?.data || []);
  };

  const getContriesList = async () => {
    const res = await getCountries(`${API_V1}/${APIS.GET_COUNTRIES}?userId=${userId}`);
    handleActionDispatch(GET_COUNTRY, res?.data || []);
  };

  const getRegionsList = async () => {
    const res = await getRegions(`${API_V1}/${APIS.GET_REGIONS}?countryId=all&userId=${userId}`);
    handleActionDispatch(GET_REGIONS, res?.data || []);
  };

  const getFundingTypesList = async () => {
    const res = await getFundingTypes(`${API_V1}/${APIS.FUNDING_TYPES}`);
    handleActionDispatch(GET_FUNDING_TYPES, res?.data || []);
  };

  const getRegionsListWithHierarchy = async () => {
    const res = await getRegionsWithHierarchy(`${API_V1}/${APIS.GET_REGIONS_WITH_HEIRARCHY}`);
    handleActionDispatch(GET_REGIONS_WITH_HIERARCHY, res?.data?.countryRegionList || []);
  };

  const getBusinessTypesList = async () => {
    const res = await getBusinessTypes(`${API_V1}/${APIS.GET_BUSINESS_TYPES}`);
    handleActionDispatch(GET_BUSINESS_TYPES, res?.data || []);
  };

  const getCurrencyCodeList = async () => {
    const res = await getCurrencyCodes(`${API_V1}/${APIS.GET_CURRIENCY_CODES}`);
    handleActionDispatch(GET_CURRIENCY_CODES, res?.data || []);
  };

  const getSalesmans = async () => {
    const res = await getSalesmensDdl(`${API_V1}/${APIS.GET_SALESMAN_DDL}`);
    handleActionDispatch(SAVE_SALESMANS, res?.data || []);
  };

  const getServicemans = async () => {
    const res = await getServicemensDdl(`${API_V1}/${APIS.GET_SERVICEMAN_DDL}`);
    handleActionDispatch(SAVE_SERVICEMANS, res?.data || []);
  };

  const getServiceOrderStatusList = async () => {
    const res = await getServiceOrderStatus(`${API_V1}/${APIS.GET_SERVICE_ORDER_STATUS}`);
    handleActionDispatch(GET_SERVICE_ORDER_STATUS, res?.data || []);
  };

  const getProjectStatusListDdl = async () => {
    const res = await getProjectStatusList(`${API_V1}/${APIS.PROJECT_STATUSES}`);
    handleActionDispatch(GET_PROJECT_STATUS, res?.data || []);
  };

  const getRoles = async () => {
    const res = await getrolelist(`${API_V1}/${APIS.GET_ROLES}`);
    const { data } = res;
    if (isArray(data)) {
      const roleList = data?.map((rl) => ({ id: rl.id, name: rl.name }));
      handleActionDispatch(SAVE_ROLES, roleList || []);
    } else {
      handleActionDispatch(SAVE_ROLES, []);
      getRoles();
    }
  };

  const getRolewiseMenu = (role) => {
    authService.getRolewiseMenu(role).then((menu) => {
      dispatch({
        type: SAVE_ROLEWISE_MENU,
        data: menu?.data?.screens || []
      });
    });
  };

  const getMasterData = () => {
    getLegalEntitiesList();
    getFundingTypesList();
    getRegionsListWithHierarchy();
    getBusinessTypesList();
    getSalesmans();
    getServicemans();
    getRoles();
    getCurrencyCodeList();
    getServiceOrderStatusList();
    getProjectStatusListDdl();
  };

  const getUserInfo = async () => {
    const user = await getUser();
    // const role = localStorage.getItem(ROLE);
    // const user = DUMMY_USERS[role];
    // if (user && user?.access_token && role) {
    if (user?.access_token) {
      setSessionStorageItem(ACCESS_TOKEN, user.access_token);
      setSessionStorageItem(REFRESH_TOKEN, user.refresh_token);
      const {
        profile: { given_name: givenName, email_verified: emailVerified, sub }
      } = user;
      if (user) {
        setSessionStorageItem(USER_ID, sub);
        logUserActivity(sub, LOG_USER_ACTIVITY.LOGIN);
        const userProfileDetails = await getUserProfileDetails(
          `${API_V1}/${APIS.GET_USER_PROFILE_DETAILS}?userId=${sub}`
        );
        if (userProfileDetails?.id) {
          getMasterData();
          onChangeMode(userProfileDetails.preferredTheme);
          if (isArray(userProfileDetails?.role)) {
            const roleName = userProfileDetails?.role[0]?.name;
            if (!roleName) {
              // clearSessionStorage();
              // navigate(ROUTES.LOGIN);
              authService.logout();
            } else {
              getRolewiseMenu(roleName);
              const {
                id,
                displayName,
                preferredNameOption,
                preferredTheme,
                email,
                shortName,
                name,
                defaultUserScreen,
                version,
                regionIds
              } = userProfileDetails;
              const data = {
                id,
                displayName,
                preferredNameOption,
                preferredTheme,
                email,
                givenName,
                emailVerified,
                name,
                shortName,
                regionIds,
                preferredUsername: preferredNameOption,
                role: userProfileDetails?.role[0]?.roleDisplayName,
                userId: sub,
                defaultUserScreen,
                version
              };
              // setUserInfo(data);
              setShowConfirmBox(!displayName);
              if (preferredTheme) {
                setIsLoading(false);
              }
              dispatch({
                type: SAVE_LOGIN_USERS_DETAILS_SUCCESS,
                data
              });
            }
          }
          // TODO: this is temporary change for development mode
        } else {
          getUserInfo();
        }
      }
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  useEffect(() => {
    getFundingTypesList();
    getUserInfo();
    getLegalEntitiesList();
    getRegionsListWithHierarchy();
    getBusinessTypesList();
    getSalesmans();
    getServicemans();
    getRoles();
    getCurrencyCodeList();
  }, []);

  useEffect(() => {
    if (userId) {
      getContriesList();
      getRegionsList();
    }
  }, [userId]);

  return (
    <>
      {isloading ? (
        <LoadingScreen style={{ marginTop: '200px' }} />
      ) : (
        <>
          {' '}
          <DialogComponent
            open={showConfirmBox}
            handleClose={() => setShowConfirmBox(false)}
            titleType="Warning"
            title="Set Your Display Name"
            content="Please enter your display name under settings"
            isProceedButton={false}
            isCancelButton
            cancelButtonText="Ok"
          />
          <Grid container spacing={3}>
            <Grid item xs={12} mt={1}>
              <Typography variant="h5" align="center">
                Dashboard
              </Typography>
            </Grid>
          </Grid>
          <Container style={{ maxWidth: '1200px', backgroundColor: '#F8F8F8', padding: '0.8rem', marginTop: '1rem' }}>
            <Grid container spacing={3} direction="row">
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3} mt={1}>
                  {isViewAllowedForRole(DASHBOARD_ITEM_CONSUMPTION, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Item Consumption
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  {isViewAllowedForRole(DASHBOARD_UNFINISHED_TASK, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Unfinished Tasks
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  {isViewAllowedForRole(DASHBOARD_PROJECT_PENDING_RENEWAL, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Projects Pending Renewal
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  {isViewAllowedForRole(DASHBOARD_PROJECT_PENDING_UNINSTALLATION, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Projects Pending Uninstallation
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  {isViewAllowedForRole(DASHBOARD_PARTIALLY_COMPALTED_TASKS, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Partially Completed Tasks – Stock Hold
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  {isViewAllowedForRole(DASHBOARD_PROJECT_ON_HOLD, role) && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Projects on Hold
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {isViewAllowedForRole(DASHBOARD_INVOICE_DISCREPANCIES, role) && (
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} sm={12}>
                      <Card style={{ height: '73vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1" style={{ color: '#637381' }}>
                          Invoice Discrepancies
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}

export default memo(LandingPage);
