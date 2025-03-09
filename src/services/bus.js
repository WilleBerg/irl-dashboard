import axios from 'axios';
import OAuth2 from 'oauth-js';
import secrets from '../../secrets.json';

const TOKEN_URL = 'https://ext-api.vasttrafik.se/token';
const API_BASE_URL = 'https://ext-api.vasttrafik.se/pr/v4';

let accessToken = null;
let tokenExpiryTime = null;

const getAccessToken = async () => {
  const oauth = new OAuth2({
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    tokenUrl: TOKEN_URL,
    grantType: 'client_credentials'
  });

  const tokenResponse = await oauth.getToken();
  accessToken = tokenResponse.access_token;

  const expiresIn = tokenResponse.expires_in; // Time in seconds
  tokenExpiryTime = Date.now() + expiresIn * 1000; // Convert to milliseconds

  return accessToken;
};

const isTokenExpired = () => {
  if (!accessToken || !tokenExpiryTime) {
    return true;
  }
  return Date.now() >= tokenExpiryTime;
};

const makeApiCall = async (endpoint, params = {}) => {
  if (isTokenExpired()) {
    await getAccessToken();
  }

  const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params
  });

  return response.data;
};

export default {
  getAccessToken,
  makeApiCall
};