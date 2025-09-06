const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3005/api';

async function testUserActions() {
  try {
    console.log('🧪 Testing user actions...');
    
    // First, get all users
    console.log('\n1. Getting all users...');
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
    const users = await usersResponse.json();
    console.log('Users found:', users.length);
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log('Test user:', testUser);
      
      // Test role change
      console.log('\n2. Testing role change...');
      const roleChangeResponse = await fetch(`${API_BASE_URL}/admin/users/${testUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'moderator' })
      });
      const roleResult = await roleChangeResponse.json();
      console.log('Role change result:', roleResult);
      
      // Test user update
      console.log('\n3. Testing user update...');
      const updateResponse = await fetch(`${API_BASE_URL}/admin/users/${testUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName: 'Updated',
          lastName: 'User',
          email: testUser.email
        })
      });
      const updateResult = await updateResponse.json();
      console.log('Update result:', updateResult);
      
      // Test delete (only if not admin)
      if (testUser.role !== 'admin') {
        console.log('\n4. Testing user delete...');
        const deleteResponse = await fetch(`${API_BASE_URL}/admin/users/${testUser.id}`, {
          method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        console.log('Delete result:', deleteResult);
      } else {
        console.log('\n4. Skipping delete test for admin user');
      }
    } else {
      console.log('No users found to test with');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUserActions();
