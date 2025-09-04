import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users as UsersIcon, 
  Crown,
  Shield,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { adminApi } from '../lib/adminApi'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  emailVerified: boolean
  subscription?: {
    plan: 'basic' | 'premium' | 'family'
    status: 'active' | 'expired' | 'cancelled'
  }
  createdAt: string
  lastLogin?: string
}

const Users: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const usersData = await adminApi.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Failed to load users:', error)
      alert('Kullanıcılar yüklenemedi!')
    } finally {
      setIsLoading(false)
    }
  }

  // Kullanıcı silme fonksiyonu
  const deleteUser = async (userId: string) => {
    if (!confirm('Bikarhêner bi rastî dixwazî jê bibî? Ev kar nayê vegerandin.')) {
      return
    }

    try {
      await adminApi.deleteUser(userId)
      console.log('✅ Kullanıcı başarıyla silindi')
      // Kullanıcı listesini yenile
      loadUsers()
    } catch (error) {
      console.error('❌ Kullanıcı silme hatası:', error)
      alert('Kullanıcı silinemedi!')
    }
  }

  // Kullanıcı durumu güncelleme
  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      await adminApi.updateUser(userId, { status: newStatus })
      console.log('✅ Kullanıcı durumu güncellendi')
      loadUsers()
    } catch (error) {
      console.error('❌ Kullanıcı durumu güncelleme hatası:', error)
      alert('Kullanıcı durumu güncellenemedi!')
    }
  }

  // Kullanıcı rolü güncelleme
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUser(userId, { role: newRole })
      console.log('✅ Kullanıcı rolü güncellendi')
      loadUsers()
    } catch (error) {
      console.error('❌ Kullanıcı rolü güncelleme hatası:', error)
      alert('Kullanıcı rolü güncellenemedi!')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'user':
        return <UsersIcon className="w-4 h-4 text-blue-600" />
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const getSubscriptionBadge = (subscription?: any) => {
    if (!subscription) return null
    
    const colors = {
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      family: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[subscription.plan as keyof typeof colors] || colors.basic}`}>
        {subscription.plan === 'basic' ? 'Bingehîn' : 
         subscription.plan === 'premium' ? 'Premium' : 
         subscription.plan === 'family' ? 'Malbat' : 'Bingehîn'}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-gray-200 h-96 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bikarhêner
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hemû bikarhêneran birêvebirin û kontrol bike
          </p>
        </div>
      </motion.div>

      {/* Users Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Birêvebirina Bikarhêneran</h3>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Lêgerîn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Hemû Rewş</option>
              <option value="active">Çalak</option>
              <option value="inactive">Neçalak</option>
              <option value="suspended">Hate Rawestandin</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Hemû Rol</option>
              <option value="user">Bikarhêner</option>
              <option value="admin">Birêvebir</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Bikarhêner</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rol</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rewş</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Abonetî</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">E-mail</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Çalakî</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {user.role === 'admin' ? 'Birêvebir' : 'Bikarhêner'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        const newStatus = user.status === 'active' ? 'inactive' : 'active'
                        if (confirm(`Rewşê ${user.firstName} ${user.lastName} bi ${newStatus === 'active' ? 'Çalak' : 'Neçalak'} biguherîne?`)) {
                          updateUserStatus(user.id, newStatus)
                        }
                      }}
                      className="cursor-pointer"
                      title="Rewş biguherîne"
                    >
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Çalak' : 
                         user.status === 'inactive' ? 'Neçalak' : 
                         user.status === 'suspended' ? 'Hate Rawestandin' : 'Neçalak'}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    {getSubscriptionBadge(user.subscription)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
                      {user.emailVerified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Bikarhêner bibîne"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newRole = user.role === 'admin' ? 'user' : 'admin'
                          if (confirm(`Rolê ${user.firstName} ${user.lastName} bi ${newRole === 'admin' ? 'Birêvebir' : 'Bikarhêner'} biguherîne?`)) {
                            updateUserRole(user.id, newRole)
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Bikarhêner biguherîne"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Bikarhêner jê bibe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Bikarhêner tune ye
          </div>
        )}
      </motion.div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.role === 'admin' ? 'Birêvebir' : 'Bikarhêner'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.email}</span>
                  {selectedUser.emailVerified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedUser.lastLogin && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Dawî têketin: {new Date(selectedUser.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Girtin
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Biguherîne
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Users
