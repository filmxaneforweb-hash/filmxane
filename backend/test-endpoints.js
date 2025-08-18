const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3005/api';

async function testEndpoints() {
  console.log('Testing admin endpoints...\n');

  try {
    // Test settings endpoint
    console.log('1. Testing GET /admin/settings...');
    const settingsResponse = await fetch(`${API_BASE_URL}/admin/settings`);
    console.log('Status:', settingsResponse.status);
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      console.log('Settings data:', JSON.stringify(settings, null, 2));
    } else {
      console.log('Error response:', await settingsResponse.text());
    }
    console.log('');

    // Test users endpoint
    console.log('2. Testing GET /admin/users...');
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
    console.log('Status:', usersResponse.status);
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log('Users data:', JSON.stringify(users, null, 2));
    } else {
      console.log('Error response:', await usersResponse.text());
    }
    console.log('');

  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

testEndpoints();
