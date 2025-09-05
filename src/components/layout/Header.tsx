import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dice6, User, LogOut, Plus } from 'lucide-react'
import { Button } from '../ui/Button'

interface HeaderProps {
  user?: any
  onSignOut?: () => void
}

export function Header({ user, onSignOut }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Dice6 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Bet On It</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Events
            </Link>
            <Link to="/my-bets" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              My Bets
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/create-event')}
                  className="hidden sm:flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700">
                      {user.name || user.email}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={onSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}