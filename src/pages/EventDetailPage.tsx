import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Users, Share2, Settings, ArrowLeft, Copy, Check } from 'lucide-react'
import { format } from 'date-fns'
import { Event, Question, Bet } from '../types'
import { QuestionCard } from '../components/questions/QuestionCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

// Mock data - replace with real API calls
const mockEvent: Event = {
  id: '1',
  host_id: 'user1',
  title: 'Sarah & Mike\'s Wedding',
  description: 'Place your bets on our special day! Will Mike cry during the vows? How long will the best man\'s speech be? Let\'s make this wedding unforgettable!',
  event_date: '2025-06-15T18:00:00Z',
  event_code: 'WEDDING2025',
  status: 'upcoming',
  created_at: '2025-01-01T00:00:00Z',
  host: {
    id: 'user1',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    created_at: '2025-01-01T00:00:00Z'
  },
  participants: [
    { id: '1', event_id: '1', user_id: 'user1', joined_at: '2025-01-01T00:00:00Z' },
    { id: '2', event_id: '1', user_id: 'user2', joined_at: '2025-01-01T00:00:00Z' },
    { id: '3', event_id: '1', user_id: 'user3', joined_at: '2025-01-01T00:00:00Z' },
  ],
  questions: [
    {
      id: '1',
      event_id: '1',
      title: 'Will Mike cry during the vows?',
      description: 'Mike is known to be emotional. Place your bets!',
      type: 'yes_no',
      betting_closes_at: '2025-06-15T17:30:00Z',
      status: 'open',
      created_at: '2025-01-01T00:00:00Z',
      bets: [
        { id: '1', user_id: 'user1', question_id: '1', chosen_answer: 'Yes', bet_amount: 25, status: 'active', created_at: '2025-01-01T00:00:00Z' },
        { id: '2', user_id: 'user2', question_id: '1', chosen_answer: 'No', bet_amount: 15, status: 'active', created_at: '2025-01-01T00:00:00Z' },
        { id: '3', user_id: 'user3', question_id: '1', chosen_answer: 'Yes', bet_amount: 30, status: 'active', created_at: '2025-01-01T00:00:00Z' },
      ]
    },
    {
      id: '2',
      event_id: '1',
      title: 'How long will the best man\'s speech be?',
      description: 'Tommy loves to talk. Guess the duration in minutes!',
      type: 'numeric',
      betting_closes_at: '2025-06-15T19:00:00Z',
      status: 'open',
      created_at: '2025-01-01T00:00:00Z',
      bets: [
        { id: '4', user_id: 'user2', question_id: '2', chosen_answer: '8', bet_amount: 20, status: 'active', created_at: '2025-01-01T00:00:00Z' },
        { id: '5', user_id: 'user3', question_id: '2', chosen_answer: '12', bet_amount: 15, status: 'active', created_at: '2025-01-01T00:00:00Z' },
      ]
    },
    {
      id: '3',
      event_id: '1',
      title: 'What will be the first dance song?',
      type: 'multiple_choice',
      options: ['Perfect by Ed Sheeran', 'At Last by Etta James', 'Thinking Out Loud by Ed Sheeran', 'All of Me by John Legend'],
      betting_closes_at: '2025-06-15T20:00:00Z',
      status: 'open',
      created_at: '2025-01-01T00:00:00Z',
      bets: [
        { id: '6', user_id: 'user1', question_id: '3', chosen_answer: 'Perfect by Ed Sheeran', bet_amount: 35, status: 'active', created_at: '2025-01-01T00:00:00Z' },
      ]
    }
  ]
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvent(mockEvent)
      setLoading(false)
    }, 500)
  }, [id])

  const handlePlaceBet = (questionId: string, answer: string, amount: number) => {
    toast.success(`Bet placed: ${answer} for $${amount}`)
    // In real app, make API call to place bet
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join/${event?.event_code}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Join "${event?.title}" and place your bets!`,
          url: shareUrl,
        })
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareUrl)
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Event not found</h2>
          <p className="text-slate-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalPool = event.questions?.reduce((sum, q) => 
    sum + (q.bets?.reduce((betSum, bet) => betSum + bet.bet_amount, 0) || 0), 0
  ) || 0

  const participantCount = event.participants?.length || 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
      </div>

      <div className="space-y-8">
        {/* Event Header */}
        <Card className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {event.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-slate-500">
                  {format(new Date(event.event_date), 'h:mm a')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {participantCount} Participants
                </p>
                <p className="text-sm text-slate-500">
                  Hosted by {event.host?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {formatCurrency(totalPool)} Total Pool
                </p>
                <p className="text-sm text-slate-500">
                  Code: <span className="font-mono">{event.event_code}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Betting Questions ({event.questions?.length || 0})
          </h2>
          
          {event.questions && event.questions.length > 0 ? (
            <div className="space-y-6">
              {event.questions.map(question => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onPlaceBet={handlePlaceBet}
                  userBet={question.bets?.find(bet => bet.user_id === 'current-user')}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No betting questions yet
              </h3>
              <p className="text-slate-600 mb-4">
                The host hasn't added any questions to bet on yet.
              </p>
              <Button variant="secondary">
                Suggest a Question
              </Button>
            </Card>
          )}
        </div>

        {/* Settlement Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">
                Settlement Reminder
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                This app does not process payments. All bet settlements should be handled outside the platform 
                using Venmo, PayPal, cash, or your preferred payment method. Winners and amounts will be 
                displayed here for your reference.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}