import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Layout from './components/Layout'
import ContentManagement from './pages/ContentManagement'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
