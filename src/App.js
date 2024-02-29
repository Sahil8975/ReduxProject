// routes
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { ErrorBoundary } from 'react-error-boundary';
import { ROUTES } from './routes/paths';
import FallBack from './components/errorHandling/FallBack';
import Router from './routes';
// theme
import ThemeConfig from './theme';
// styles
import './Styles/app.scss';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import { LOCAL_STORAGE_KEYS, LOG_USER_ACTIVITY } from './utils/constants';
import { logUserActivity } from './utils/rest-services';
import { signInRedirect } from './components/authentication/identityServer/services/AuthService';
import Loader from './components/LoaderComponent/Loader';

const logger = require('./callingLogger');
// ----------------------------------------------------------------------

export default function App() {
  moment.tz.setDefault('Asia/Kuala_Lumpur');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const { VALIDATE, SIGN_IN, SIGN_IN_CALLBACK_HTML, DASHBOARD, LOGIN, ADD_PROJECT } = ROUTES;
  const isDataLoading = useSelector((state) => state.MasterDataReducer?.isDataLoading);

  const logActivity = () => {
    if (location.pathname) {
      logUserActivity(
        sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID),
        LOG_USER_ACTIVITY.USER_VIEWPAGE,
        location.pathname
      );
    }
  };

  const manageRoutes = async () => {
    // navigate(ADD_PROJECT);
    const accessCode = queryParams.get('accessCode');
    const { pathname } = location;
    if (VALIDATE === pathname) {
      navigate(`${VALIDATE}/${accessCode}`);
    } else if (SIGN_IN === pathname) {
      navigate(SIGN_IN);
    } else if (sessionStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)) {
      navigate(DASHBOARD);
    } else if (pathname === SIGN_IN_CALLBACK_HTML) {
      await signInRedirect();
      navigate(SIGN_IN);
    } else {
      navigate(LOGIN);
    }
  };
  useEffect(() => {
    logActivity();
  }, [location.pathname]);

  useEffect(() => {
    manageRoutes();
    return () => {};
  }, []);

  const errorHandler = (error, errorInfo) => {
    logger.error('Something Went Wrong', { meta: errorInfo });
  };

  return (
    <ErrorBoundary FallbackComponent={FallBack} onError={errorHandler} key={location.pathname}>
      <Loader open={isDataLoading} />
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <ScrollToTop />
            <Router />
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </ErrorBoundary>
  );
}
