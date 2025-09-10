import React, { useState } from 'react'
import { Trophy, Medal, Award, TrendingUp, Users, Calendar } from 'lucide-react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../lib/utils'
import { Navigate } from 'react-router-dom'

export function LeaderboardPage() {
  const { user } = useAuth()
  const { leaderboard, loading, fetchLeaderboard } = useLeaderboard()
  const [period, setPeriod] = useState<'all_time' | 'monthly' | 'weekly'>('all_time')

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const handlePeriodChange = (newPeriod: 'all_time' | 'monthly' | 'weekly') => {
    setPeriod(newPeriod)
    fetchLeaderboard(undefined, newPeriod)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-slate-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-600'
    }
  }

  const userEntry = leaderboard.find(entry => entry.user_id === user.id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Leaderboard
        </h1>
        <p className="text-slate-600">
          See who's winning the most across all betting events
        </p>
      </div>

      {/* Period Filter */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Time Period</h2>
          <Calendar className="h-5 w-5 text-slate-400" />
        </div>
        <div className="flex space-x-2">
          {[
            { key: 'all_time', label: 'All Time' },
            { key: 'monthly', label: 'This Month' },
            { key: 'weekly', label: 'This Week' }
          ].map((option) => (
            <Button
              key={option.key}
              variant={period === option.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePeriodChange(option.key as any)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* User's Rank */}
      {userEntry && (
        <Card className="mb-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(userEntry.rank)}`}>
                {getRankIcon(userEntry.rank)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Your Rank</h3>
                <p className="text-sm text-slate-600">
                  {formatCurrency(userEntry.total_winnings)} • {userEntry.win_rate.toFixed(1)}% win rate
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">#{userEntry.rank}</p>
              <p className="text-sm text-slate-600">{userEntry.total_bets} bets</p>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard */}
      <div className="space-y-4">
        {leaderboard.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No rankings yet
            </h3>
            <p className="text-slate-600">
              Be the first to place some bets and climb the leaderboard!
            </p>
          </Card>
        ) : (
          leaderboard.map((entry, index) => (
            <Card
              key={entry.user_id}
              className={`transition-all duration-200 hover:shadow-lg ${
                entry.user_id === user.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="flex items-center space-x-3">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {entry.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {entry.name}
                        {entry.user_id === user.id && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {entry.total_bets} bets • {entry.win_rate.toFixed(1)}% win rate
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(entry.total_winnings)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Total Winnings</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <Card className="mt-8 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-4">Leaderboard Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {leaderboard.length}
              </p>
              <p className="text-sm text-slate-600">Total Players</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  leaderboard.reduce((sum, entry) => sum + entry.total_winnings, 0)
                )}
              </p>
              <p className="text-sm text-slate-600">Total Winnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {leaderboard.reduce((sum, entry) => sum + entry.total_bets, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Bets</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}