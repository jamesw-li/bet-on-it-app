import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import toast from 'react-hot-toast'

export function AuthPage() {
  const { user, signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  if (user) {
    return <Navigate to="/events" replace />
  }

  const getErrorMessage = (error: any) => {
    const message = error.message || 'Authentication failed'
    
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.'
    }
    if (message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.'
    }
    if (message.includes('User not found')) {
      return 'No account found with this email address. Please sign up first.'
    }
    if (message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.'
    }
    
    return message
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isSignUp) {
        if (!formData.name.trim()) {
          toast.error('Please enter your name')
          return
        }
        const { error } = await signUp(formData.email, formData.password, formData.name)
        if (error) throw error
        toast.success('Account created successfully! Please check your email to verify your account.')
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) throw error
        toast.success('Signed in successfully!')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-slate-600">
            {isSignUp 
              ? 'Start creating amazing betting experiences' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                required
                minLength={6}
              />
            </div>

            {!isSignUp && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Having trouble signing in?</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Double-check your email and password</li>
                      <li>• Make sure you've confirmed your email address</li>
                      <li>• Try creating a new account if you haven't signed up yet</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-2 font-medium">
            🚨 This app does not process payments. All settlements happen outside the platform.
          </p>
        </div>
      </div>
    </div>
  )
}