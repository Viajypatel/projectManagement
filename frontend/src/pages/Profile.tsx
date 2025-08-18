import { clearAuthToken } from '../lib/auth'
import { useEffect, useState } from 'react'
import api from '../lib/api'

type Profile = {
  _id?: string
  name?: string
  email?: string
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/users/profile')
        setProfile(data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load profile')
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    clearAuthToken()
    window.location.href = '/login'
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <a href="/login" className="text-blue-600 underline">Go to login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {profile && Object.keys(profile).length > 0 ? (
          <div className="space-y-2">
            <div><span className="font-medium">Name:</span> {profile.name}</div>
            <div><span className="font-medium">Email:</span> {profile.email}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">No profile data found.</div>
        )}
        <button onClick={handleLogout} className="mt-6 bg-gray-800 text-white py-2 px-4 rounded">Logout</button>
      </div>
    </div>
  )
}

export default ProfilePage


