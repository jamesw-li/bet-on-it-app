import React from 'react'
import { Link } from 'react-router-dom'
import { Dice6, Users, TrendingUp, Shield, Smartphone, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Social Betting',
      description: 'Create fun betting pools for weddings, parties, and events with friends and family.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Odds',
      description: 'Watch live odds and potential winnings update as more people place their bets.'
    },
    {
      icon: Shield,
      title: 'No Payment Processing',
      description: 'We track bets, you settle outside the app. Keep it simple and legal.'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed for mobile with a beautiful, intuitive interface that works everywhere.'
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Create an event and start betting in under 2 minutes. Share with a simple code.'
    },
    {
      icon: Dice6,
      title: 'Multiple Bet Types',
      description: 'Yes/No questions, multiple choice, numeric guesses, and more betting options.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                <span className="gradient-text">Bet On It</span>
                <br />
                <span className="text-slate-900">Make Every Event</span>
                <br />
                <span className="text-slate-900">More Exciting</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Create social betting pools for weddings, parties, sports events, and more. 
                Track bets in USD, settle outside the app, and make every gathering unforgettable.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>No payment processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Mobile optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything You Need for Social Betting
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and social. Create memorable experiences at every event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center space-y-4 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and make your next event unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Event',
                description: 'Set up your event with a title, date, and betting questions. Get a shareable code instantly.'
              },
              {
                step: '2',
                title: 'Invite Participants',
                description: 'Share your event code or link. Friends join and place bets in USD on your questions.'
              },
              {
                step: '3',
                title: 'Track & Settle',
                description: 'Watch real-time results and leaderboards. Settle winnings outside the app with Venmo, PayPal, or cash.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Make Your Next Event Legendary?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of event hosts who are making their gatherings more engaging with social betting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-50 w-full sm:w-auto">
                  Create Your First Event
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Public Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}