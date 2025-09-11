import { Link } from 'react-router-dom'
import { Calendar, Users, DollarSign, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Database } from '../../types/database'
import { Card } from '../ui/Card'

type Event = Database['public']['Tables']['events']['Row'] & {
  host?: Database['public']['Tables']['profiles']['Row']
  participants?: Database['public']['Tables']['event_participants']['Row'][]
  questions?: (Database['public']['Tables']['questions']['Row'] & {
    bets?: Database['public']['Tables']['bets']['Row'][]
  })[]
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const totalPool = event.total_pool || 0
  const participantCount = event.participant_count || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2">
                {event.description}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{participantCount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-green-600 font-medium">
              <DollarSign className="h-4 w-4" />
              <span>{totalPool.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Code: <span className="font-mono font-medium">{event.event_code}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>
                {event.questions?.filter(q => q.status === 'open').length || 0} questions
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}