const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

class AdminApiClient {
  private getHeaders() {
    const token = localStorage.getItem('filmxane_admin_token')
    if (!token) {
      throw new Error('Admin token bulunamadı')
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Kullanıcı işlemleri
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Kullanıcılar yüklenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Kullanıcı silinemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async updateUser(userId: string, updateData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData)
    })
    
    if (!response.ok) {
      throw new Error(`Kullanıcı güncellenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  // Video işlemleri
  async getVideos() {
    const response = await fetch(`${API_BASE_URL}/videos`, {
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Videolar yüklenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async deleteVideo(videoId: string) {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Video silinemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async updateVideo(videoId: string, updateData: any) {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData)
    })
    
    if (!response.ok) {
      throw new Error(`Video güncellenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  // İstatistikler
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/videos/stats/overview`, {
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`İstatistikler yüklenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/users/stats/overview`, {
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Kullanıcı istatistikleri yüklenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  // Favori işlemleri
  async getFavorites() {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Favoriler yüklenemedi: ${response.status}`)
    }
    
    return response.json()
  }

  async deleteFavorite(favoriteId: string) {
    const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Favori silinemedi: ${response.status}`)
    }
    
    return response.json()
  }
}

export const adminApi = new AdminApiClient()
