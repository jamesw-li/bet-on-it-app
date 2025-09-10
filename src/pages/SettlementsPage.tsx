import React, { useState } from 'react'
import { DollarSign, CheckCircle, Clock, AlertTriangle, Users, Filter } from 'lucide-react'
import { useSettlements } from '../hooks/useSettlements'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../lib/utils'
import { format } from 'date-fns'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'

type FilterType = 'all' | 'pending' | 'completed' | 'disputed'

export function SettlementsPage() {
  const { user } = useAuth()
  const { settlements, loading, updateSettlementStatus } = useSettlements()
  const [filter, setFilter] = useState<FilterType>('all')

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const filteredSettlements = settlements.filter(settlement => 
    filter === 'all' || settlement.status === filter
  )

  const stats = {
    totalOwed: settlements
      .filter(s => s.payer_id === user.id && s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0),
    totalOwing: settlements
      .filter(s => s.payee_id === user.id && s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0),
    totalSettled: settlements
      .filter(s => (s.payer_id === user.id || s.payee_id === user.id) && s.status === 'completed')
      .reduce((sum, s) => sum + s.amount, 0),
    pendingCount: settlements.filter(s => s.status === 'pending').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'disputed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'disputed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleMarkAsSettled = async (settlementId: string) => {
    try {
      await updateSettlementStatus(settlementId, 'completed')
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDispute = async (settlementId: string) => {
    try {
      await updateSettlementStatus(settlementId, 'disputed')
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Settlements
        </h1>
        <p className="text-slate-600">
          Track and manage your bet settlements with other players
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalOwed)}</p>
          <p className="text-sm text-gray-600">You Owe</p>
        </Card>

        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalOwing)}</p>
          <p className="text-sm text-gray-600">Owed to You</p>
        </Card>

        <Card className="text-center">
          <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalSettled)}</p>
          <p className="text-sm text-gray-600">Total Settled</p>
        </Card>

        <Card className="text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Filter Settlements</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'completed', 'disputed'] as FilterType[]).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption === 'all' ? 'All Settlements' : filterOption}
              {filterOption !== 'all' && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {settlements.filter(s => s.status === filterOption).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </Card>

      {/* Settlements List */}
      <div className="space-y-4">
        {filteredSettlements.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settlements found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any settlements yet. Place some bets to get started!"
                : `No ${filter} settlements found. Try a different filter.`
              }
            </p>
          </Card>
        ) : (
          filteredSettlements.map((settlement) => (
            <Card key={settlement.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(settlement.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {settlement.bet?.event?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {settlement.bet?.question?.title}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {settlement.payer_id === user.id ? 'You owe' : 'Owes you'}:
                      </span>
                      <span className="font-bold text-lg text-gray-900">
                        {formatCurrency(settlement.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {settlement.payer_id === user.id 
                          ? `To: ${settlement.payee?.name}`
                          : `From: ${settlement.payer?.name}`
                        }
                      </span>
                      {settlement.payment_method && (
                        <span className="text-gray-600">
                          via {settlement.payment_method}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {format(new Date(settlement.created_at), 'MMM d, yyyy')}
                      {settlement.settled_at && (
                        <span className="ml-4">
                          Settled: {format(new Date(settlement.settled_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(settlement.status)}`}>
                        {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                      </span>

                      {settlement.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsSettled(settlement.id)}
                          >
                            Mark as Settled
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDispute(settlement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Dispute
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Settlement Notice */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Settlement Instructions</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• Settlements are tracked here but payments happen outside the app</p>
              <p>• Use Venmo, PayPal, Cash App, or cash to settle your debts</p>
              <p>• Mark settlements as completed once payment is made</p>
              <p>• Dispute any settlements you believe are incorrect</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}