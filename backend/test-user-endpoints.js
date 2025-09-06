const axios = require('axios');

const API_BASE_URL = 'http://localhost:3005/api';

async function testUserEndpoints() {
  try {
    console.log('🧪 Testing User Management Endpoints...\n');

    // Test 1: Get all users
    console.log('1. Testing GET /admin/users');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/admin/users`);
      console.log('✅ Users fetched successfully');
      console.log(`   Found ${usersResponse.data.length} users`);
      
      if (usersResponse.data.length > 0) {
        const firstUser = usersResponse.data[0];
        console.log(`   First user: ${firstUser.firstName} ${firstUser.lastName} (${firstUser.role})`);
        
        // Test 2: Update user
        console.log('\n2. Testing PUT /admin/users/:id');
        try {
          const updateData = {
            firstName: firstUser.firstName + ' Updated',
            lastName: firstUser.lastName + ' Updated'
          };
          
          const updateResponse = await axios.put(`${API_BASE_URL}/admin/users/${firstUser.id}`, updateData);
          console.log('✅ User updated successfully');
          console.log(`   Response: ${updateResponse.data.message}`);
          
          // Test 3: Change user role
          console.log('\n3. Testing PUT /admin/users/:id/role');
          try {
            const newRole = firstUser.role === 'user' ? 'moderator' : 'user';
            const roleResponse = await axios.put(`${API_BASE_URL}/admin/users/${firstUser.id}/role`, {
              role: newRole
            });
            console.log('✅ User role changed successfully');
            console.log(`   Response: ${roleResponse.data.message}`);
            
            // Test 4: Delete user (only if not admin)
            if (firstUser.role !== 'admin') {
              console.log('\n4. Testing DELETE /admin/users/:id');
              try {
                const deleteResponse = await axios.delete(`${API_BASE_URL}/admin/users/${firstUser.id}`);
                console.log('✅ User deleted successfully');
                console.log(`   Response: ${deleteResponse.data.message}`);
              } catch (deleteError) {
                console.log('❌ Delete failed:', deleteError.response?.data?.message || deleteError.message);
              }
            } else {
              console.log('\n4. Skipping delete test (user is admin)');
            }
            
          } catch (roleError) {
            console.log('❌ Role change failed:', roleError.response?.data?.message || roleError.message);
          }
          
        } catch (updateError) {
          console.log('❌ Update failed:', updateError.response?.data?.message || updateError.message);
        }
      } else {
        console.log('   No users found to test with');
      }
      
    } catch (usersError) {
      console.log('❌ Get users failed:', usersError.response?.data?.message || usersError.message);
    }

    // Test 5: Get user stats
    console.log('\n5. Testing GET /admin/user-stats');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/admin/user-stats`);
      console.log('✅ User stats fetched successfully');
      console.log(`   Total users: ${statsResponse.data.totalUsers}`);
      console.log(`   Active users: ${statsResponse.data.activeUsers}`);
    } catch (statsError) {
      console.log('❌ Get user stats failed:', statsError.response?.data?.message || statsError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUserEndpoints();
