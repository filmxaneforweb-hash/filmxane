import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Layout from './components/Layout'
import ContentManagement from './pages/ContentManagement'
import AdminRoute from './components/AdminRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ana sayfa için redirect */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Admin login */}
          <Route path="/admin" element={<Login />} />
          
          {/* Admin dashboard routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all route - redirect to admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
