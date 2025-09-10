import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface PaymentMethod {
  type: 'venmo' | 'paypal' | 'cashapp';
  handle: string;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    bio: 'Love making friendly bets with friends! 🎲',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { type: 'venmo', handle: '@alexj123' },
    { type: 'paypal', handle: 'alex.johnson@email.com' },
  ]);

  const stats = {
    totalEvents: 12,
    totalBets: 47,
    totalWinnings: 234.50,
    winRate: 68,
  };

  const recentActivity = [
    { id: 1, event: "Sarah's Wedding", action: 'Won $25', date: '2 days ago', type: 'win' },
    { id: 2, event: "Mike's Birthday", action: 'Lost $10', date: '1 week ago', type: 'loss' },
    { id: 3, event: "Company Retreat", action: 'Won $40', date: '2 weeks ago', type: 'win' },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'venmo': return 'card';
      case 'paypal': return 'logo-paypal';
      case 'cashapp': return 'cash';
      default: return 'card';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons
              name={isEditing ? 'close' : 'create-outline'}
              size={20}
              color={isEditing ? '#ef4444' : '#0ea5e9'}
            />
            <Text style={[styles.editButtonText, { color: isEditing ? '#ef4444' : '#0ea5e9' }]}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
                style={styles.avatar}
              />
              {isEditing && (
                <TouchableOpacity style={styles.avatarEditButton}>
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={profile.name}
                    onChangeText={(text) => setProfile({ ...profile, name: text })}
                  />
                ) : (
                  <Text style={styles.value}>{profile.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={profile.email}
                    onChangeText={(text) => setProfile({ ...profile, email: text })}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.value}>{profile.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={profile.bio}
                    onChangeText={(text) => setProfile({ ...profile, bio: text })}
                    multiline
                    numberOfLines={2}
                  />
                ) : (
                  <Text style={styles.value}>{profile.bio}</Text>
                )}
              </View>

              {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Betting Stats</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${stats.totalWinnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Winnings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalBets}</Text>
              <Text style={styles.statLabel}>Total Bets</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Payment Methods</Text>
          </View>

          {paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentMethod}>
              <View style={styles.paymentMethodInfo}>
                <View style={styles.paymentIcon}>
                  <Ionicons name={getPaymentIcon(method.type) as any} size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.paymentType}>{method.type.charAt(0).toUpperCase() + method.type.slice(1)}</Text>
                  <Text style={styles.paymentHandle}>{method.handle}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addPaymentButton}>
            <Ionicons name="add" size={20} color="#0ea5e9" />
            <Text style={styles.addPaymentText}>Add Payment Method</Text>
          </TouchableOpacity>

          <View style={styles.paymentNotice}>
            <Text style={styles.paymentNoticeText}>
              Payment methods are used for settlement reminders only. All transactions happen outside the app.
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={24} color="#d946ef" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: activity.type === 'win' ? '#10b981' : '#ef4444' }]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityEvent}>{activity.event}</Text>
                <Text style={[styles.activityAction, { color: activity.type === 'win' ? '#10b981' : '#ef4444' }]}>
                  {activity.action}
                </Text>
              </View>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          ))}
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  paymentHandle: {
    fontSize: 14,
    color: '#64748b',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 12,
  },
  addPaymentText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '500',
  },
  paymentNotice: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  paymentNoticeText: {
    fontSize: 12,
    color: '#1e40af',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityInfo: {
    flex: 1,
  },
  activityEvent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  activityAction: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    color: '#64748b',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
});