import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { Event } from '../types'
import { EventCard } from '../components/events/EventCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

// Mock data - replace with real API calls
const mockEvents: Event[] = [
  {
    id: '1',
    host_id: 'user1',
    title: 'Sarah & Mike\'s Wedding',
    description: 'Place your bets on our special day! Will Mike cry during the vows?',
    event_date: '2025-06-15T18:00:00Z',
    event_code: 'WEDDING2025',
    status: 'upcoming',
    created_at: '2025-01-01T00:00:00Z',
    participants: [
      { id: '1', event_id: '1', user_id: 'user1', joined_at: '2025-01-01T00:00:00Z' },
      { id: '2', event_id: '1', user_id: 'user2', joined_at: '2025-01-01T00:00:00Z' },
    ],
    questions: [
      {
        id: '1',
        event_id: '1',
        title: 'Will Mike cry during the vows?',
        type: 'yes_no',
        betting_closes_at: '2025-06-15T17:30:00Z',
        status: 'open',
        created_at: '2025-01-01T00:00:00Z',
        bets: [
          { id: '1', user_id: 'user1', question_id: '1', chosen_answer: 'Yes', bet_amount: 25, status: 'active', created_at: '2025-01-01T00:00:00Z' },
          { id: '2', user_id: 'user2', question_id: '1', chosen_answer: 'No', bet_amount: 15, status: 'active', created_at: '2025-01-01T00:00:00Z' },
        ]
      }
    ]
  },
  {
    id: '2',
    host_id: 'user2',
    title: 'Super Bowl Party 2025',
    description: 'The biggest game of the year! Who will take home the trophy?',
    event_date: '2025-02-09T23:30:00Z',
    event_code: 'SUPERBOWL',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    participants: [
      { id: '3', event_id: '2', user_id: 'user1', joined_at: '2025-01-01T00:00:00Z' },
      { id: '4', event_id: '2', user_id: 'user2', joined_at: '2025-01-01T00:00:00Z' },
      { id: '5', event_id: '2', user_id: 'user3', joined_at: '2025-01-01T00:00:00Z' },
    ],
    questions: [
      {
        id: '2',
        event_id: '2',
        title: 'Who will win the Super Bowl?',
        type: 'multiple_choice',
        options: ['Kansas City Chiefs', 'Buffalo Bills', 'Detroit Lions', 'Philadelphia Eagles'],
        betting_closes_at: '2025-02-09T23:00:00Z',
        status: 'open',
        created_at: '2025-01-01T00:00:00Z',
        bets: [
          { id: '3', user_id: 'user1', question_id: '2', chosen_answer: 'Kansas City Chiefs', bet_amount: 50, status: 'active', created_at: '2025-01-01T00:00:00Z' },
          { id: '4', user_id: 'user2', question_id: '2', chosen_answer: 'Buffalo Bills', bet_amount: 30, status: 'active', created_at: '2025-01-01T00:00:00Z' },
          { id: '5', user_id: 'user3', question_id: '2', chosen_answer: 'Detroit Lions', bet_amount: 20, status: 'active', created_at: '2025-01-01T00:00:00Z' },
        ]
      }
    ]
  }
]

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 500)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.event_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || event.status === filter
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-600 mt-1">
            Discover and join exciting betting events
          </p>
        </div>
        <Link to="/create-event">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-field min-w-[120px]"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No events found
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create an event!'
            }
          </p>
          <Link to="/create-event">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}