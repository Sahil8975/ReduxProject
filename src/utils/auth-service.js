import { postData } from './rest-services';
import { LOCAL_STORAGE_KEYS } from './constants';
import { setLocalStorageItem, clearLocalStorage } from './utils';

const { TOKEN_KEY } = LOCAL_STORAGE_KEYS;
export const login = async (params) => {
  const API_END_POINT = process.env.REACT_APP_API_ENDPOINT;
  const url = `${API_END_POINT}/connect/token`;
  const data = `username=${encodeURIComponent(params.email)}&password=${params.password}&grant_type=password&code=CA`;
  // await postData(url, data, true)
  await postData(url, data)
    .then((res) => {
      setLocalStorageItem(TOKEN_KEY, res.data.access_token);
    })
    .catch(() => console.error('error'));
};

export const logout = () => {
  clearLocalStorage();
  // if (localStorage.getItem(TOKEN_KEY) === null) return false;
  // localStorage.removeItem(TOKEN_KEY);
  return true;
};
