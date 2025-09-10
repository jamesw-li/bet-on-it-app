import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_code: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  totalPool: number;
  questions: Question[];
}

interface Question {
  id: string;
  title: string;
  type: 'yes_no' | 'multiple_choice' | 'numeric';
  options?: string[];
  bets: Bet[];
}

interface Bet {
  id: string;
  user_id: string;
  chosen_answer: string;
  bet_amount: number;
}

const mockEvent: Event = {
  id: '1',
  title: "Sarah & Mike's Wedding",
  description: 'Place your bets on our special day! Will Mike cry during the vows? How long will the best man\'s speech be?',
  event_date: '2025-06-15T18:00:00Z',
  event_code: 'WEDDING2025',
  status: 'upcoming',
  participants: 12,
  totalPool: 340,
  questions: [
    {
      id: '1',
      title: 'Will Mike cry during the vows?',
      type: 'yes_no',
      bets: [
        { id: '1', user_id: 'user1', chosen_answer: 'Yes', bet_amount: 25 },
        { id: '2', user_id: 'user2', chosen_answer: 'No', bet_amount: 15 },
        { id: '3', user_id: 'user3', chosen_answer: 'Yes', bet_amount: 30 },
      ],
    },
    {
      id: '2',
      title: 'What will be the first dance song?',
      type: 'multiple_choice',
      options: ['Perfect by Ed Sheeran', 'At Last by Etta James', 'Thinking Out Loud by Ed Sheeran', 'All of Me by John Legend'],
      bets: [
        { id: '4', user_id: 'user1', chosen_answer: 'Perfect by Ed Sheeran', bet_amount: 35 },
      ],
    },
  ],
};

export default function EventDetailScreen({ navigation, route }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvent(mockEvent);
      setLoading(false);
    }, 500);
  }, [eventId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join "${event?.title}" and place your bets! Use code: ${event?.event_code}`,
        title: event?.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handlePlaceBet = (questionId: string, question: Question) => {
    Alert.alert(
      'Place Bet',
      `Place a bet on: ${question.title}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Place Bet', onPress: () => console.log('Placing bet...') },
      ]
    );
  };

  const getAnswerPool = (question: Question, answer: string) => {
    return question.bets
      .filter(bet => bet.chosen_answer === answer)
      .reduce((sum, bet) => sum + bet.bet_amount, 0);
  };

  const getTotalPool = (question: Question) => {
    return question.bets.reduce((sum, bet) => sum + bet.bet_amount, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return '#3b82f6';
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Info */}
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                <Text style={styles.statusText}>{event.status}</Text>
              </View>
            </View>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>

          <View style={styles.eventStats}>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={20} color="#64748b" />
              <Text style={styles.statText}>{formatDate(event.event_date)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color="#64748b" />
              <Text style={styles.statText}>{event.participants} Participants</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={20} color="#10b981" />
              <Text style={[styles.statText, { color: '#10b981', fontWeight: '600' }]}>
                ${event.totalPool} Total Pool
              </Text>
            </View>
          </View>

          <View style={styles.eventCode}>
            <Text style={styles.eventCodeLabel}>Event Code:</Text>
            <Text style={styles.eventCodeValue}>{event.event_code}</Text>
          </View>
        </View>

        {/* Questions */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>Betting Questions ({event.questions.length})</Text>
          
          {event.questions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionTitle}>{question.title}</Text>
              
              <View style={styles.questionStats}>
                <Text style={styles.questionPool}>
                  Pool: ${getTotalPool(question)}
                </Text>
                <Text style={styles.questionBets}>
                  {question.bets.length} bets
                </Text>
              </View>

              {question.type === 'yes_no' && (
                <View style={styles.optionsContainer}>
                  {['Yes', 'No'].map((option) => {
                    const pool = getAnswerPool(question, option);
                    const totalPool = getTotalPool(question);
                    const percentage = totalPool > 0 ? (pool / totalPool) * 100 : 0;
                    
                    return (
                      <View key={option} style={styles.optionItem}>
                        <Text style={styles.optionText}>{option}</Text>
                        <View style={styles.optionStats}>
                          <Text style={styles.optionPool}>${pool}</Text>
                          <Text style={styles.optionPercentage}>{percentage.toFixed(1)}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {question.type === 'multiple_choice' && question.options && (
                <View style={styles.optionsContainer}>
                  {question.options.map((option) => {
                    const pool = getAnswerPool(question, option);
                    const totalPool = getTotalPool(question);
                    const percentage = totalPool > 0 ? (pool / totalPool) * 100 : 0;
                    
                    return (
                      <View key={option} style={styles.optionItem}>
                        <Text style={styles.optionText} numberOfLines={2}>{option}</Text>
                        <View style={styles.optionStats}>
                          <Text style={styles.optionPool}>${pool}</Text>
                          <Text style={styles.optionPercentage}>{percentage.toFixed(1)}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              <TouchableOpacity
                style={styles.betButton}
                onPress={() => handlePlaceBet(question.id, question)}
              >
                <Ionicons name="trending-up" size={20} color="white" />
                <Text style={styles.betButtonText}>Place Bet</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Settlement Notice */}
        <View style={styles.settlementNotice}>
          <Ionicons name="information-circle" size={20} color="#f59e0b" />
          <View style={styles.settlementContent}>
            <Text style={styles.settlementTitle}>Settlement Reminder</Text>
            <Text style={styles.settlementText}>
              This app does not process payments. All bet settlements should be handled outside the platform 
              using Venmo, PayPal, cash, or your preferred payment method.
            </Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
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
  eventHeader: {
    marginBottom: 20,
  },
  eventTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  eventStats: {
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    color: '#64748b',
  },
  eventCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  eventCodeLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  eventCodeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  questionsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  questionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionPool: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  questionBets: {
    fontSize: 14,
    color: '#64748b',
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  optionStats: {
    alignItems: 'flex-end',
  },
  optionPool: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  optionPercentage: {
    fontSize: 12,
    color: '#64748b',
  },
  betButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  betButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settlementNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  settlementContent: {
    flex: 1,
  },
  settlementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  settlementText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});