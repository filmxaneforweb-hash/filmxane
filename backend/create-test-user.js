const axios = require('axios');

const API_BASE_URL = 'http://localhost:3005/api';

async function createTestUser() {
  try {
    console.log('🧪 Creating test user...\n');

    const userData = {
      firstName: 'Serkan',
      lastName: 'Yamal',
      email: 'sekolikelamineyamal@gmail.com',
      password: 'serkan21'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (response.data.success) {
      console.log('✅ Test user created successfully!');
      console.log(`   Name: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   Role: ${response.data.data.user.role}`);
      console.log(`   ID: ${response.data.data.user.id}`);
    } else {
      console.log('❌ Failed to create test user:', response.data.error);
    }

  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  Test user already exists');
    } else {
      console.error('❌ Error creating test user:', error.response?.data?.message || error.message);
    }
  }
}

// Run the script
createTestUser();
