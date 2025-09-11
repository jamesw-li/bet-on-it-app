import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'
import toast from 'react-hot-toast'

type Bet = Database['public']['Tables']['bets']['Row'] & {
  user?: Database['public']['Tables']['profiles']['Row']
  question?: Database['public']['Tables']['questions']['Row']
  event?: Database['public']['Tables']['events']['Row']
}

type PlaceBetData = {
  question_id: string
  event_id: string
  chosen_answer: string
  bet_amount: number
}

export function useBets() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUserBets = async () => {
    setLoading(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          user:profiles!bets_user_id_fkey(*),
          question:questions(*),
          event:events(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBets(data || [])
    } catch (error) {
      console.error('Error fetching bets:', error)
      toast.error('Failed to load bets')
    } finally {
      setLoading(false)
    }
  }

  const placeBet = async (betData: PlaceBetData) => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')

      // Check if user is participant in the event
      const { data: participant, error: participantError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', betData.event_id)
        .eq('user_id', user.id)
        .single()

      if (participantError || !participant) {
        // Auto-join the event if not already a participant
        await supabase
          .from('event_participants')
          .insert({
            event_id: betData.event_id,
            user_id: user.id
          } as Database['public']['Tables']['event_participants']['Insert'])
      }

      // Place the bet
      const { data, error } = await supabase
        .from('bets')
        .insert({
          ...betData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Bet placed successfully!')
      await fetchUserBets()
      return data
    } catch (error: any) {
      console.error('Error placing bet:', error)
      if (error.message.includes('duplicate')) {
        toast.error('You have already placed a bet on this question')
      } else {
        toast.error('Failed to place bet')
      }
      throw error
    }
  }

  const updateBetStatus = async (betId: string, status: 'active' | 'won' | 'lost' | 'settled') => {
    try {
      const { error } = await supabase
        .from('bets')
        .update({ status })
        .eq('id', betId)

      if (error) throw error
      toast.success(`Bet status updated to ${status}`)
      await fetchUserBets()
    } catch (error) {
      console.error('Error updating bet status:', error)
      toast.error('Failed to update bet status')
    }
  }

  const resolveBets = async (questionId: string, correctAnswer: string) => {
    try {
      // Update question with correct answer
      const { error: questionError } = await supabase
        .from('questions')
        .update({ 
          correct_answer: correctAnswer,
          status: 'resolved'
        })
        .eq('id', questionId)

      if (questionError) throw questionError

      // Update winning bets
      const { error: winError } = await supabase
        .from('bets')
        .update({ status: 'won' })
        .eq('question_id', questionId)
        .eq('chosen_answer', correctAnswer)

      if (winError) throw winError

      // Update losing bets
      const { error: loseError } = await supabase
        .from('bets')
        .update({ status: 'lost' })
        .eq('question_id', questionId)
        .neq('chosen_answer', correctAnswer)

      if (loseError) throw loseError

      toast.success('Bets resolved successfully!')
      await fetchUserBets()
    } catch (error) {
      console.error('Error resolving bets:', error)
      toast.error('Failed to resolve bets')
    }
  }

  useEffect(() => {
    fetchUserBets()
  }, [])

  return {
    bets,
    loading,
    fetchUserBets,
    placeBet,
    updateBetStatus,
    resolveBets
  }
}