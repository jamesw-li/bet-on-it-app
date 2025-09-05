import React from 'react';
import { ArrowRight, Users, DollarSign, Trophy, Sparkles, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Make Every Event
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                More Exciting
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create fun betting pools for weddings, parties, sports events, and more. Track bets, settle outside the app, and enjoy the excitement with friends!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-event">
                <Button size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BetPool?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, fun, and social betting pools that bring people together
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Social & Fun</h3>
              <p className="text-gray-600">
                Create betting pools that bring friends and family together for any occasion
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Tracking</h3>
              <p className="text-gray-600">
                Keep track of all bets and participants in one simple, organized place
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Flexible Events</h3>
              <p className="text-gray-600">
                Perfect for weddings, sports, parties, or any event where predictions add excitement
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Create your first betting pool in minutes and start having fun with friends!
          </p>
          <Button size="lg" className="text-lg px-8 py-4">
            Create Your First Event
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      </div>
    </div>
  );
}