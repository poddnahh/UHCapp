// tools/generateToken.js
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

export async function getToken() {
  try {
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get access token');
    console.error('HTTP Error:', error.response?.status);
    console.error('Details:', error.response?.data || error.message);
    return null;
  }
}
