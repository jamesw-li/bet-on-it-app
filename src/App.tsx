import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { CreateEventPage } from './pages/CreateEventPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyBetsPage } from './pages/MyBetsPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { SettlementsPage } from './pages/SettlementsPage'
import { JoinEventPage } from './pages/JoinEventPage'

function App() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-600">Loading Bet On It...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header user={user} profile={profile} onSignOut={signOut} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/join" element={<JoinEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-bets" element={<MyBetsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App