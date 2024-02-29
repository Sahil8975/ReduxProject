import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../../../utils/constants';
import { ROUTES } from '../../../routes/paths';
import * as authService from '../identityServer/services/AuthService';
import LoadingScreen from '../../LoadingScreen';

export default function LoginForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      navigate(ROUTES.DASHBOARD);
    } else {
      login();
    }
  }, []);

  const login = () => authService.login();

  return (
    <>
      <img src="/static/home/rezaLogo.png" alt="reza" style={{ padding: '0 1.1rem 0 1.1rem' }} />
      <img src="/static/home/omslogo.png" alt="oms" />
      <LoadingScreen label="Loading" />
    </>
  );
}
