

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AUTH_EVENT, hasAuthToken } from './lib/auth'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile'
import ProjectsListPage from './pages/Projects/List'
import ProjectDetailPage from './pages/Projects/Detail'
const App = () => {
	const [isAuthed, setIsAuthed] = useState<boolean>(hasAuthToken())

	useEffect(() => {
		const handleAuthChanged = () => setIsAuthed(hasAuthToken())
		window.addEventListener(AUTH_EVENT, handleAuthChanged)
		return () => window.removeEventListener(AUTH_EVENT, handleAuthChanged)
	}, [])
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
        <Route path="/" element={<Navigate to={isAuthed ? '/projects' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={isAuthed ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/projects" element={isAuthed ? <ProjectsListPage /> : <Navigate to="/login" replace />} />
        <Route path="/projects/:id" element={isAuthed ? <ProjectDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
