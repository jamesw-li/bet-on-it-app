import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'
import toast from 'react-hot-toast'

type Settlement = Database['public']['Tables']['settlements']['Row'] & {
  bet?: Database['public']['Tables']['bets']['Row'] & {
    question?: Database['public']['Tables']['questions']['Row']
    event?: Database['public']['Tables']['events']['Row']
  }
  payer?: Database['public']['Tables']['profiles']['Row']
  payee?: Database['public']['Tables']['profiles']['Row']
}

type CreateSettlementData = {
  bet_id: string
  payer_id: string
  payee_id: string
  amount: number
  payment_method?: string
}

export function useSettlements() {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUserSettlements = async () => {
    setLoading(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data, error } = await supabase
        .from('settlements')
        .select(`
          *,
          bet:bets(
            *,
            question:questions(*),
            event:events(*)
          ),
          payer:profiles!settlements_payer_id_fkey(*),
          payee:profiles!settlements_payee_id_fkey(*)
        `)
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSettlements(data || [])
    } catch (error) {
      console.error('Error fetching settlements:', error)
      toast.error('Failed to load settlements')
    } finally {
      setLoading(false)
    }
  }

  const createSettlement = async (settlementData: CreateSettlementData) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .insert(settlementData)
        .select()
        .single()

      if (error) throw error

      toast.success('Settlement created successfully!')
      await fetchUserSettlements()
      return data
    } catch (error) {
      console.error('Error creating settlement:', error)
      toast.error('Failed to create settlement')
      throw error
    }
  }

  const updateSettlementStatus = async (
    settlementId: string, 
    status: 'pending' | 'completed' | 'disputed'
  ) => {
    try {
      const updates: any = { status }
      if (status === 'completed') {
        updates.settled_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('settlements')
        .update(updates)
        .eq('id', settlementId)

      if (error) throw error

      // If completed, also update the bet status
      if (status === 'completed') {
        const settlement = settlements.find(s => s.id === settlementId)
        if (settlement?.bet_id) {
          await supabase
            .from('bets')
            .update({ status: 'settled' })
            .eq('id', settlement.bet_id)
        }
      }

      toast.success(`Settlement ${status}!`)
      await fetchUserSettlements()
    } catch (error) {
      console.error('Error updating settlement:', error)
      toast.error('Failed to update settlement')
    }
  }

  const generateSettlementsForEvent = async (eventId: string) => {
    try {
      // Get all resolved bets for the event
      const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select(`
          *,
          question:questions(*),
          user:profiles!bets_user_id_fkey(*)
        `)
        .eq('event_id', eventId)
        .in('status', ['won', 'lost'])

      if (betsError) throw betsError

      const settlements: CreateSettlementData[] = []

      // Group bets by question to calculate settlements
      const betsByQuestion = bets?.reduce((acc, bet) => {
        if (!acc[bet.question_id]) {
          acc[bet.question_id] = []
        }
        acc[bet.question_id].push(bet)
        return acc
      }, {} as Record<string, typeof bets>)

      // Calculate settlements for each question
      for (const questionBets of Object.values(betsByQuestion || {})) {
        const winners = questionBets.filter(bet => bet.status === 'won')
        const losers = questionBets.filter(bet => bet.status === 'lost')

        // Simple settlement: losers pay winners proportionally
        const totalLosses = losers.reduce((sum, bet) => sum + bet.bet_amount, 0)
        const totalWinnings = winners.reduce((sum, bet) => sum + (bet.potential_winnings - bet.bet_amount), 0)

        if (totalLosses > 0 && winners.length > 0) {
          for (const loser of losers) {
            for (const winner of winners) {
              const winnerShare = (winner.potential_winnings - winner.bet_amount) / totalWinnings
              const amountOwed = loser.bet_amount * winnerShare

              if (amountOwed > 0.01) { // Only create settlements for amounts > 1 cent
                settlements.push({
                  bet_id: loser.id,
                  payer_id: loser.user_id,
                  payee_id: winner.user_id,
                  amount: Math.round(amountOwed * 100) / 100 // Round to 2 decimal places
                })
              }
            }
          }
        }
      }

      // Create all settlements
      if (settlements.length > 0) {
        const { error: settlementError } = await supabase
          .from('settlements')
          .insert(settlements)

        if (settlementError) throw settlementError
        toast.success(`Generated ${settlements.length} settlements for the event`)
      } else {
        toast.info('No settlements needed for this event')
      }

      await fetchUserSettlements()
    } catch (error) {
      console.error('Error generating settlements:', error)
      toast.error('Failed to generate settlements')
    }
  }

  useEffect(() => {
    fetchUserSettlements()
  }, [])

  return {
    settlements,
    loading,
    fetchUserSettlements,
    createSettlement,
    updateSettlementStatus,
    generateSettlementsForEvent
  }
}