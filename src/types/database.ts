export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          bio: string
          venmo_handle: string | null
          paypal_handle: string | null
          cashapp_handle: string | null
          total_winnings: number
          total_bets: number
          events_created: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          bio?: string
          venmo_handle?: string | null
          paypal_handle?: string | null
          cashapp_handle?: string | null
          total_winnings?: number
          total_bets?: number
          events_created?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          bio?: string
          venmo_handle?: string | null
          paypal_handle?: string | null
          cashapp_handle?: string | null
          total_winnings?: number
          total_bets?: number
          events_created?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string
          event_date: string
          event_code: string
          status: 'upcoming' | 'active' | 'completed'
          min_bet: number
          max_bet: number
          total_pool: number
          participant_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description?: string
          event_date: string
          event_code: string
          status?: 'upcoming' | 'active' | 'completed'
          min_bet?: number
          max_bet?: number
          total_pool?: number
          participant_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string
          event_date?: string
          event_code?: string
          status?: 'upcoming' | 'active' | 'completed'
          min_bet?: number
          max_bet?: number
          total_pool?: number
          participant_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          event_id: string
          title: string
          description: string
          type: 'yes_no' | 'multiple_choice' | 'numeric' | 'free_text'
          options: string[]
          betting_closes_at: string
          status: 'open' | 'closed' | 'resolved'
          correct_answer: string | null
          total_pool: number
          bet_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          title: string
          description?: string
          type: 'yes_no' | 'multiple_choice' | 'numeric' | 'free_text'
          options?: string[]
          betting_closes_at: string
          status?: 'open' | 'closed' | 'resolved'
          correct_answer?: string | null
          total_pool?: number
          bet_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          description?: string
          type?: 'yes_no' | 'multiple_choice' | 'numeric' | 'free_text'
          options?: string[]
          betting_closes_at?: string
          status?: 'open' | 'closed' | 'resolved'
          correct_answer?: string | null
          total_pool?: number
          bet_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          user_id: string
          question_id: string
          event_id: string
          chosen_answer: string
          bet_amount: number
          potential_winnings: number
          status: 'active' | 'won' | 'lost' | 'settled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          event_id: string
          chosen_answer: string
          bet_amount: number
          potential_winnings?: number
          status?: 'active' | 'won' | 'lost' | 'settled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          event_id?: string
          chosen_answer?: string
          bet_amount?: number
          potential_winnings?: number
          status?: 'active' | 'won' | 'lost' | 'settled'
          created_at?: string
          updated_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          bet_id: string
          payer_id: string
          payee_id: string
          amount: number
          payment_method: string | null
          status: 'pending' | 'completed' | 'disputed'
          settled_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bet_id: string
          payer_id: string
          payee_id: string
          amount: number
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'disputed'
          settled_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bet_id?: string
          payer_id?: string
          payee_id?: string
          amount?: number
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'disputed'
          settled_at?: string | null
          created_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          event_id: string | null
          total_winnings: number
          total_bets: number
          win_rate: number
          rank: number | null
          period: 'all_time' | 'monthly' | 'weekly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id?: string | null
          total_winnings?: number
          total_bets?: number
          win_rate?: number
          rank?: number | null
          period?: 'all_time' | 'monthly' | 'weekly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string | null
          total_winnings?: number
          total_bets?: number
          win_rate?: number
          rank?: number | null
          period?: 'all_time' | 'monthly' | 'weekly'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_event_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      calculate_potential_winnings: {
        Args: {
          p_bet_amount: number
          p_question_id: string
          p_chosen_answer: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}