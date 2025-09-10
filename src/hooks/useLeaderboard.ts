import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type LeaderboardEntry = {
  user_id: string
  name: string
  avatar_url: string | null
  total_winnings: number
  total_bets: number
  win_rate: number
  rank: number
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLeaderboard = async (eventId?: string, period: 'all_time' | 'monthly' | 'weekly' = 'all_time') => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          avatar_url,
          total_winnings,
          total_bets
        `)

      // Calculate win rate and rank based on bets
      const { data: profiles, error: profilesError } = await query

      if (profilesError) throw profilesError

      // Get bet statistics for each user
      const leaderboardData: LeaderboardEntry[] = []

      for (const profile of profiles || []) {
        let betsQuery = supabase
          .from('bets')
          .select('status, bet_amount, potential_winnings')
          .eq('user_id', profile.id)

        if (eventId) {
          betsQuery = betsQuery.eq('event_id', eventId)
        }

        // Add date filtering for period
        if (period === 'monthly') {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          betsQuery = betsQuery.gte('created_at', oneMonthAgo.toISOString())
        } else if (period === 'weekly') {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          betsQuery = betsQuery.gte('created_at', oneWeekAgo.toISOString())
        }

        const { data: bets, error: betsError } = await betsQuery

        if (betsError) continue

        const totalBets = bets?.length || 0
        const wonBets = bets?.filter(bet => bet.status === 'won').length || 0
        const totalWinnings = bets?.filter(bet => bet.status === 'won')
          .reduce((sum, bet) => sum + (bet.potential_winnings || 0), 0) || 0
        const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0

        if (totalBets > 0) {
          leaderboardData.push({
            user_id: profile.id,
            name: profile.name,
            avatar_url: profile.avatar_url,
            total_winnings: totalWinnings,
            total_bets: totalBets,
            win_rate: winRate,
            rank: 0 // Will be set after sorting
          })
        }
      }

      // Sort by total winnings and assign ranks
      leaderboardData.sort((a, b) => b.total_winnings - a.total_winnings)
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1
      })

      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserRank = async (userId: string, eventId?: string) => {
    try {
      await fetchLeaderboard(eventId)
      const userEntry = leaderboard.find(entry => entry.user_id === userId)
      return userEntry?.rank || null
    } catch (error) {
      console.error('Error getting user rank:', error)
      return null
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return {
    leaderboard,
    loading,
    fetchLeaderboard,
    getUserRank
  }
}