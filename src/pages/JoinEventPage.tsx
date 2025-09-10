import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Search } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import toast from 'react-hot-toast'

export function JoinEventPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { joinEvent } = useEvents()
  const [eventCode, setEventCode] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    navigate('/auth')
    return null
  }

  const handleJoinEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventCode.trim()) {
      toast.error('Please enter an event code')
      return
    }

    setLoading(true)
    try {
      const event = await joinEvent(eventCode.trim())
      navigate(`/events/${event.id}`)
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Join an Event
        </h1>
        <p className="text-slate-600">
          Enter the event code to join a betting event and start placing bets
        </p>
      </div>

      <Card>
        <form onSubmit={handleJoinEvent} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Code
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Enter event code (e.g., WEDDING2025)"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                className="pl-10 text-center font-mono text-lg"
                maxLength={20}
                required
              />
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Event codes are usually 6-8 characters long and provided by the event host
            </p>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={!eventCode.trim()}
          >
            <Users className="h-4 w-4 mr-2" />
            Join Event
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-medium text-blue-900 mb-2">
            Don't have an event code?
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            Ask the event host to share the event code with you, or browse public events.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/events')}
            className="w-full"
          >
            Browse Events
          </Button>
        </div>
      </Card>
    </div>
  )
}