import React from 'react';
import { Dice6, User, Plus, Trophy, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dice6 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bet On It
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/events">
              <Button 
                variant={isActive('/events') ? 'default' : 'ghost'} 
                size="sm"
                className="text-sm"
              >
                Events
              </Button>
            </Link>
            <Link to="/my-bets">
              <Button 
                variant={isActive('/my-bets') ? 'default' : 'ghost'} 
                size="sm"
                className="text-sm"
              >
                <Trophy className="w-4 h-4 mr-2" />
                My Bets
              </Button>
            </Link>
            <Link to="/create-event">
              <Button 
                variant={isActive('/create-event') ? 'default' : 'ghost'} 
                size="sm"
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/create-event" className="md:hidden">
              <Button size="sm" className="p-2">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button 
                variant={isActive('/profile') ? 'default' : 'ghost'} 
                size="sm" 
                className="p-2"
              >
                <User className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          <Link to="/events">
            <Button 
              variant={isActive('/events') ? 'default' : 'ghost'} 
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              Events
            </Button>
          </Link>
          <Link to="/my-bets">
            <Button 
              variant={isActive('/my-bets') ? 'default' : 'ghost'} 
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 mr-1" />
              My Bets
            </Button>
          </Link>
          <Link to="/create-event">
            <Button 
              variant={isActive('/create-event') ? 'default' : 'ghost'} 
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};