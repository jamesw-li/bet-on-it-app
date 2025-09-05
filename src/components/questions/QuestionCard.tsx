import React, { useState } from 'react'
import { Clock, DollarSign, Users, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { Question, Bet } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { formatCurrency, calculatePotentialWinnings } from '../../lib/utils'

interface QuestionCardProps {
  question: Question
  onPlaceBet?: (questionId: string, answer: string, amount: number) => void
  userBet?: Bet
  disabled?: boolean
}

export function QuestionCard({ question, onPlaceBet, userBet, disabled }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [betAmount, setBetAmount] = useState<string>('')
  const [showBetForm, setShowBetForm] = useState(false)

  const totalPool = question.bets?.reduce((sum, bet) => sum + bet.bet_amount, 0) || 0
  const participantCount = new Set(question.bets?.map(bet => bet.user_id)).size || 0

  const getAnswerPool = (answer: string) => {
    return question.bets?.filter(bet => bet.chosen_answer === answer)
      .reduce((sum, bet) => sum + bet.bet_amount, 0) || 0
  }

  const handlePlaceBet = () => {
    if (!selectedAnswer || !betAmount || !onPlaceBet) return
    
    const amount = parseFloat(betAmount)
    if (amount <= 0) return

    onPlaceBet(question.id, selectedAnswer, amount)
    setShowBetForm(false)
    setSelectedAnswer('')
    setBetAmount('')
  }

  const renderOptions = () => {
    if (question.type === 'yes_no') {
      return ['Yes', 'No'].map(option => {
        const pool = getAnswerPool(option)
        const percentage = totalPool > 0 ? (pool / totalPool) * 100 : 0
        
        return (
          <div
            key={option}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => !disabled && setSelectedAnswer(option)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{option}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(pool)}
                </div>
                <div className="text-xs text-slate-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )
      })
    }

    if (question.type === 'multiple_choice' && question.options) {
      return question.options.map(option => {
        const pool = getAnswerPool(option)
        const percentage = totalPool > 0 ? (pool / totalPool) * 100 : 0
        
        return (
          <div
            key={option}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => !disabled && setSelectedAnswer(option)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{option}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(pool)}
                </div>
                <div className="text-xs text-slate-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )
      })
    }

    if (question.type === 'numeric') {
      return (
        <Input
          type="number"
          placeholder="Enter your guess"
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          disabled={disabled}
        />
      )
    }

    return null
  }

  const isExpired = new Date(question.betting_closes_at) < new Date()
  const canBet = !disabled && !userBet && !isExpired && question.status === 'open'

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {question.title}
          </h3>
          {question.description && (
            <p className="text-slate-600 text-sm">
              {question.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className={`px-2 py-1 rounded-full ${
            question.status === 'open' ? 'bg-green-100 text-green-800' :
            question.status === 'closed' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {question.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {isExpired ? 'Expired' : `Closes ${format(new Date(question.betting_closes_at), 'MMM d, h:mm a')}`}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{participantCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-green-600 font-medium">
          <DollarSign className="h-4 w-4" />
          <span>{formatCurrency(totalPool)}</span>
        </div>
      </div>

      {userBet && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Your Bet</p>
              <p className="text-sm text-blue-700">
                {userBet.chosen_answer} • {formatCurrency(userBet.bet_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">
                Potential Win
              </p>
              <p className="text-sm text-blue-700">
                {formatCurrency(
                  calculatePotentialWinnings(
                    userBet.bet_amount,
                    totalPool,
                    getAnswerPool(userBet.chosen_answer)
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {renderOptions()}
      </div>

      {canBet && (
        <div className="space-y-3">
          {!showBetForm ? (
            <Button
              onClick={() => setShowBetForm(true)}
              disabled={!selectedAnswer}
              className="w-full"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Place Bet
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
              <Input
                type="number"
                label="Bet Amount ($)"
                placeholder="0.00"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
              {selectedAnswer && betAmount && (
                <div className="text-sm text-slate-600">
                  Potential winnings: {formatCurrency(
                    calculatePotentialWinnings(
                      parseFloat(betAmount),
                      totalPool + parseFloat(betAmount),
                      getAnswerPool(selectedAnswer) + parseFloat(betAmount)
                    )
                  )}
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  onClick={handlePlaceBet}
                  disabled={!selectedAnswer || !betAmount || parseFloat(betAmount) <= 0}
                  className="flex-1"
                >
                  Confirm Bet
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowBetForm(false)
                    setBetAmount('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}