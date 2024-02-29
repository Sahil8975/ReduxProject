import { putData } from '../utils/rest-services';

export const updateDisplayName = async (url, body) => putData(url, body, false, true);
