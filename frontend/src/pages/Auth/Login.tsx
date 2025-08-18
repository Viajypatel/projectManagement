import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../../lib/api'
import { setAuthToken } from '../../lib/auth'
import { Link, useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      const { data } = await api.post('/api/users/login', values)
      if (data?.token) {
        setAuthToken(data.token)
        navigate('/projects')
      } else {
        setServerError('No token returned from server')
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Login failed'
      setServerError(message)
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {serverError && (
          <div className="mb-4 text-red-600 text-sm">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don’t have an account? <Link to="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login


