import React, { useState } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Filter, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Bet {
  id: string;
  eventTitle: string;
  question: string;
  answer: string;
  amount: number;
  status: 'pending' | 'won' | 'lost' | 'settled';
  potentialWinning: number;
  eventDate: string;
  placedAt: string;
  settledAt?: string;
}

type FilterType = 'all' | 'pending' | 'won' | 'lost' | 'settled';

export const MyBetsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const bets: Bet[] = [
    {
      id: '1',
      eventTitle: "Sarah's Wedding",
      question: 'Will the groom cry during vows?',
      answer: 'Yes',
      amount: 25,
      status: 'won',
      potentialWinning: 45,
      eventDate: '2024-01-15',
      placedAt: '2024-01-10',
      settledAt: '2024-01-16',
    },
    {
      id: '2',
      eventTitle: "Mike's Birthday Party",
      question: 'Which bar will we end up at?',
      answer: "O'Malley's Pub",
      amount: 15,
      status: 'lost',
      potentialWinning: 30,
      eventDate: '2024-01-08',
      placedAt: '2024-01-05',
      settledAt: '2024-01-09',
    },
    {
      id: '3',
      eventTitle: 'Company Retreat 2024',
      question: 'Who will win the scavenger hunt?',
      answer: 'Marketing Team',
      amount: 20,
      status: 'won',
      potentialWinning: 60,
      eventDate: '2024-01-20',
      placedAt: '2024-01-18',
    },
    {
      id: '4',
      eventTitle: 'Super Bowl Party',
      question: 'Total points scored in game?',
      answer: '52 points',
      amount: 30,
      status: 'pending',
      potentialWinning: 75,
      eventDate: '2024-02-11',
      placedAt: '2024-02-08',
    },
    {
      id: '5',
      eventTitle: "Emma's Baby Shower",
      question: 'Will the baby be born early?',
      answer: 'No',
      amount: 10,
      status: 'pending',
      potentialWinning: 18,
      eventDate: '2024-02-25',
      placedAt: '2024-02-20',
    },
  ];

  const filteredBets = bets.filter(bet => 
    activeFilter === 'all' || bet.status === activeFilter
  );

  const stats = {
    totalBets: bets.length,
    totalWagered: bets.reduce((sum, bet) => sum + bet.amount, 0),
    totalWon: bets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialWinning, 0),
    pendingBets: bets.filter(bet => bet.status === 'pending').length,
  };

  const getStatusIcon = (status: Bet['status']) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'lost':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'settled':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Bet['status']) => {
    switch (status) {
      case 'won':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'lost':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'settled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Bets
          </h1>
          <p className="text-gray-600 mt-1">Track all your betting activity and winnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
            <p className="text-sm text-gray-600">Total Bets</p>
          </Card>

          <Card className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">${stats.totalWagered}</p>
            <p className="text-sm text-gray-600">Total Wagered</p>
          </Card>

          <Card className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-600">${stats.totalWon}</p>
            <p className="text-sm text-gray-600">Total Won</p>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{stats.pendingBets}</p>
            <p className="text-sm text-gray-600">Pending Bets</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Filter Bets</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'won', 'lost', 'settled'] as FilterType[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="capitalize"
              >
                {filter === 'all' ? 'All Bets' : filter}
                {filter !== 'all' && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {bets.filter(bet => bet.status === filter).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bets List */}
        <div className="space-y-4">
          {filteredBets.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bets found</h3>
              <p className="text-gray-600">
                {activeFilter === 'all' 
                  ? "You haven't placed any bets yet. Join an event to get started!"
                  : `No ${activeFilter} bets found. Try a different filter.`
                }
              </p>
            </Card>
          ) : (
            filteredBets.map((bet) => (
              <Card key={bet.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(bet.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{bet.eventTitle}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Event: {formatDate(bet.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-medium text-gray-900 mb-2">{bet.question}</p>
                      <p className="text-blue-600 font-medium">Your Answer: {bet.answer}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Bet Amount</p>
                          <p className="font-bold text-gray-900">${bet.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Potential Winning</p>
                          <p className="font-bold text-green-600">${bet.potentialWinning}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Placed</p>
                          <p className="text-sm text-gray-900">{formatDate(bet.placedAt)}</p>
                        </div>
                        {bet.settledAt && (
                          <div>
                            <p className="text-sm text-gray-600">Settled</p>
                            <p className="text-sm text-gray-900">{formatDate(bet.settledAt)}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bet.status)}`}>
                          {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                        </span>
                        
                        {bet.status === 'won' && !bet.settledAt && (
                          <Button size="sm" className="mt-2 ml-2">
                            Mark as Settled
                          </Button>
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
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Settlement Reminder</h3>
              <p className="text-blue-800 text-sm">
                Remember to settle your bets outside the app using Venmo, PayPal, Cash App, or cash. 
                This app is for tracking purposes only and does not process payments.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};