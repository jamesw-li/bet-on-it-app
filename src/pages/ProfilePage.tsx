import React, { useState } from 'react';
import { User, Settings, Trophy, DollarSign, Calendar, Edit3, Save, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface UserStats {
  totalEvents: number;
  totalBets: number;
  totalWinnings: number;
  winRate: number;
  favoriteEventType: string;
}

interface PaymentMethod {
  type: 'venmo' | 'paypal' | 'cashapp';
  handle: string;
}

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    bio: 'Love making friendly bets with friends! 🎲',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { type: 'venmo', handle: '@alexj123' },
    { type: 'paypal', handle: 'alex.johnson@email.com' },
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: 'venmo',
    handle: '',
  });

  const stats: UserStats = {
    totalEvents: 12,
    totalBets: 47,
    totalWinnings: 234.50,
    winRate: 68,
    favoriteEventType: 'Weddings',
  };

  const recentActivity = [
    { id: 1, event: "Sarah's Wedding", action: 'Won $25', date: '2 days ago', type: 'win' },
    { id: 2, event: "Mike's Birthday", action: 'Lost $10', date: '1 week ago', type: 'loss' },
    { id: 3, event: "Company Retreat", action: 'Won $40', date: '2 weeks ago', type: 'win' },
    { id: 4, event: "Super Bowl Party", action: 'Won $15', date: '3 weeks ago', type: 'win' },
  ];

  const handleSaveProfile = () => {
    // TODO: Save to Supabase
    setIsEditing(false);
    console.log('Saving profile:', profile);
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.handle && newPaymentMethod.type) {
      setPaymentMethods([...paymentMethods, newPaymentMethod as PaymentMethod]);
      setNewPaymentMethod({ type: 'venmo', handle: '' });
    }
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">Manage your account and betting preferences</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "ghost" : "default"}
            className={isEditing ? "text-gray-600" : ""}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>

              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-600">{profile.bio}</p>
                    )}
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} className="mt-4">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Payment Methods</h2>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {method.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{method.type}</p>
                        <p className="text-sm text-gray-600">{method.handle}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentMethod(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <select
                      value={newPaymentMethod.type}
                      onChange={(e) => setNewPaymentMethod({ 
                        ...newPaymentMethod, 
                        type: e.target.value as PaymentMethod['type'] 
                      })}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="venmo">Venmo</option>
                      <option value="paypal">PayPal</option>
                      <option value="cashapp">Cash App</option>
                    </select>
                    <Input
                      value={newPaymentMethod.handle}
                      onChange={(e) => setNewPaymentMethod({ 
                        ...newPaymentMethod, 
                        handle: e.target.value 
                      })}
                      placeholder="@username or email"
                      className="flex-1"
                    />
                    <Button onClick={addPaymentMethod} disabled={!newPaymentMethod.handle}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Payment methods are used for settlement reminders only. 
                  All transactions happen outside the app.
                </p>
              </div>
            </Card>
          </div>

          {/* Stats & Activity */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold">Betting Stats</h2>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.totalWinnings.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Winnings</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                    <p className="text-xs text-gray-600">Events</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xl font-bold text-gray-900">{stats.totalBets}</p>
                    <p className="text-xs text-gray-600">Bets</p>
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-lg font-bold text-purple-600">{stats.winRate}%</p>
                  <p className="text-xs text-gray-600">Win Rate</p>
                </div>

                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <p className="text-sm font-medium text-yellow-800">{stats.favoriteEventType}</p>
                  <p className="text-xs text-gray-600">Favorite Event Type</p>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'win' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                      <p className={`text-xs ${
                        activity.type === 'win' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.action}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-sm">
                View All Activity
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};