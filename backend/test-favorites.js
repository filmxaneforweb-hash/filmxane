const testFavoritesAPI = async () => {
  const baseUrl = 'http://localhost:3005/api'
  
  console.log('🧪 Testing Favorites API...\n')
  
  // Test data
  const testData = {
    userId: 'test-user-id',
    videoId: 'test-video-id',
    type: 'movie'
  }
  
  try {
    // 1. Test add to favorites
    console.log('1️⃣ Testing add to favorites...')
    const addResponse = await fetch(`${baseUrl}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (addResponse.ok) {
      const result = await addResponse.json()
      console.log('✅ Add to favorites successful:', result)
    } else {
      console.log('❌ Add to favorites failed:', addResponse.status, addResponse.statusText)
    }
    
    // 2. Test check favorite status
    console.log('\n2️⃣ Testing check favorite status...')
    const checkResponse = await fetch(`${baseUrl}/favorites/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testData.userId, videoId: testData.videoId })
    })
    
    if (checkResponse.ok) {
      const result = await checkResponse.json()
      console.log('✅ Check favorite status successful:', result)
    } else {
      console.log('❌ Check favorite status failed:', checkResponse.status, checkResponse.statusText)
    }
    
    // 3. Test remove from favorites
    console.log('\n3️⃣ Testing remove from favorites...')
    const removeResponse = await fetch(`${baseUrl}/favorites`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testData.userId, videoId: testData.videoId })
    })
    
    if (removeResponse.ok) {
      console.log('✅ Remove from favorites successful')
    } else {
      console.log('❌ Remove from favorites failed:', removeResponse.status, removeResponse.statusText)
    }
    
    // 4. Test video share increment
    console.log('\n4️⃣ Testing video share increment...')
    const shareResponse = await fetch(`${baseUrl}/videos/${testData.videoId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (shareResponse.ok) {
      console.log('✅ Video share increment successful')
    } else {
      console.log('❌ Video share increment failed:', shareResponse.status, shareResponse.statusText)
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run tests
testFavoritesAPI()
