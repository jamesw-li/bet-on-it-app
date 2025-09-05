export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  venmo_handle?: string
  paypal_handle?: string
  created_at: string
}

export interface Event {
  id: string
  host_id: string
  title: string
  description: string
  event_date: string
  event_code: string
  status: 'upcoming' | 'active' | 'completed'
  created_at: string
  host?: User
  participants?: EventParticipant[]
  questions?: Question[]
}

export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  joined_at: string
  user?: User
}

export interface Question {
  id: string
  event_id: string
  title: string
  description?: string
  type: 'multiple_choice' | 'yes_no' | 'numeric' | 'free_text'
  options?: string[]
  betting_closes_at: string
  status: 'open' | 'closed' | 'resolved'
  correct_answer?: string
  created_at: string
  bets?: Bet[]
}

export interface Bet {
  id: string
  user_id: string
  question_id: string
  chosen_answer: string
  bet_amount: number
  potential_winnings?: number
  status: 'active' | 'won' | 'lost' | 'settled'
  created_at: string
  user?: User
}

export interface CreateEventData {
  title: string
  description: string
  event_date: string
}

export interface CreateQuestionData {
  title: string
  description?: string
  type: Question['type']
  options?: string[]
  betting_closes_at: string
}

export interface PlaceBetData {
  question_id: string
  chosen_answer: string
  bet_amount: number
}