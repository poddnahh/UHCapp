require('dotenv').config();
const axios = require('axios');

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

const getAccessToken = async () => {
  try {
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log('Access token:', response.data.access_token);
  } catch (error) {
    console.error('Failed to get access token');
    console.error('HTTP Error:', error.response?.status);
    console.error('Details:', error.response?.data || error.message);
  }
};

getAccessToken();
