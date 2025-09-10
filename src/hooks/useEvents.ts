import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'
import toast from 'react-hot-toast'

type Event = Database['public']['Tables']['events']['Row'] & {
  host?: Database['public']['Tables']['profiles']['Row']
  participants?: Database['public']['Tables']['event_participants']['Row'][]
  questions?: (Database['public']['Tables']['questions']['Row'] & {
    bets?: Database['public']['Tables']['bets']['Row'][]
  })[]
}

type CreateEventData = {
  title: string
  description: string
  event_date: string
  min_bet?: number
  max_bet?: number
}

type CreateQuestionData = {
  title: string
  description?: string
  type: 'yes_no' | 'multiple_choice' | 'numeric' | 'free_text'
  options?: string[]
  betting_closes_at: string
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          host:profiles!events_host_id_fkey(*),
          participants:event_participants(*),
          questions(
            *,
            bets(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchEvent = async (id: string): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          host:profiles!events_host_id_fkey(*),
          participants:event_participants(*),
          questions(
            *,
            bets(
              *,
              user:profiles!bets_user_id_fkey(*)
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Failed to load event')
      return null
    }
  }

  const createEvent = async (eventData: CreateEventData, questions: CreateQuestionData[]) => {
    try {
      // Generate event code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_event_code')

      if (codeError) throw codeError

      // Create event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          ...eventData,
          event_code: codeData,
          host_id: (await supabase.auth.getUser()).data.user?.id!
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Create questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => ({
          ...q,
          event_id: event.id,
          options: q.options || []
        }))

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (questionsError) throw questionsError
      }

      // Join the event as a participant
      await supabase
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: event.host_id
        })

      toast.success('Event created successfully!')
      await fetchEvents()
      return event
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
      throw error
    }
  }

  const joinEvent = async (eventCode: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')

      // Find event by code
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('event_code', eventCode.toUpperCase())
        .single()

      if (eventError) throw eventError
      if (!event) throw new Error('Event not found')

      // Join event
      const { error: joinError } = await supabase
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: user.id
        })

      if (joinError && !joinError.message.includes('duplicate')) {
        throw joinError
      }

      toast.success('Joined event successfully!')
      await fetchEvents()
      return event
    } catch (error: any) {
      console.error('Error joining event:', error)
      if (error.message.includes('duplicate')) {
        toast.error('You are already a participant in this event')
      } else {
        toast.error('Failed to join event')
      }
      throw error
    }
  }

  const updateEventStatus = async (eventId: string, status: 'upcoming' | 'active' | 'completed') => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)

      if (error) throw error
      toast.success(`Event status updated to ${status}`)
      await fetchEvents()
    } catch (error) {
      console.error('Error updating event status:', error)
      toast.error('Failed to update event status')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    fetchEvents,
    fetchEvent,
    createEvent,
    joinEvent,
    updateEventStatus
  }
}