

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile'
import ProjectsListPage from './pages/Projects/List'
import ProjectDetailPage from './pages/Projects/Detail'

const isAuthenticated = () => Boolean(localStorage.getItem('auth_token'))

const App = () => {
  return (
    <BrowserRouter>
      <div className="p-4 flex items-center justify-between border-b">
        <Link to="/" className="font-bold">Project Management</Link>
        <nav className="space-x-4 text-sm">
          <Link to="/projects" className="underline">Projects</Link>
          <Link to="/profile" className="underline">Profile</Link>
          <Link to="/login" className="underline">Login</Link>
          <Link to="/register" className="underline">Register</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? '/projects' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/projects" element={isAuthenticated() ? <ProjectsListPage /> : <Navigate to="/login" replace />} />
        <Route path="/projects/:id" element={isAuthenticated() ? <ProjectDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
