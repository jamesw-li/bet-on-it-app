import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
}

type FilterType = 'all' | 'pending' | 'won' | 'lost' | 'settled';

const mockBets: Bet[] = [
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
  },
  {
    id: '3',
    eventTitle: 'Super Bowl Party',
    question: 'Total points scored in game?',
    answer: '52 points',
    amount: 30,
    status: 'pending',
    potentialWinning: 75,
    eventDate: '2024-02-11',
    placedAt: '2024-02-08',
  },
];

export default function MyBetsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [bets] = useState<Bet[]>(mockBets);

  const filteredBets = bets.filter(bet => 
    activeFilter === 'all' || bet.status === activeFilter
  );

  const stats = {
    totalBets: bets.length,
    totalWagered: bets.reduce((sum, bet) => sum + bet.amount, 0),
    totalWon: bets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialWinning, 0),
    pendingBets: bets.filter(bet => bet.status === 'pending').length,
  };

  const getStatusColor = (status: Bet['status']) => {
    switch (status) {
      case 'won': return '#10b981';
      case 'lost': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'settled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Bet['status']) => {
    switch (status) {
      case 'won': return 'checkmark-circle';
      case 'lost': return 'close-circle';
      case 'pending': return 'time';
      case 'settled': return 'cash';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderBetCard = ({ item }: { item: Bet }) => (
    <View style={styles.betCard}>
      <View style={styles.betHeader}>
        <View style={styles.betTitleContainer}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={20}
            color={getStatusColor(item.status)}
          />
          <Text style={styles.eventTitle}>{item.eventTitle}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>Your Answer: {item.answer}</Text>
      </View>

      <View style={styles.betStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Bet Amount</Text>
          <Text style={styles.statValue}>${item.amount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Potential Win</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>${item.potentialWinning}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Event Date</Text>
          <Text style={styles.statValue}>{formatDate(item.eventDate)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bets</Text>
        <Text style={styles.headerSubtitle}>Track all your betting activity and winnings</Text>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#0ea5e9" />
          <Text style={styles.statCardValue}>{stats.totalBets}</Text>
          <Text style={styles.statCardLabel}>Total Bets</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#d946ef" />
          <Text style={styles.statCardValue}>${stats.totalWagered}</Text>
          <Text style={styles.statCardLabel}>Total Wagered</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#10b981" />
          <Text style={[styles.statCardValue, { color: '#10b981' }]}>${stats.totalWon}</Text>
          <Text style={styles.statCardLabel}>Total Won</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#f59e0b" />
          <Text style={styles.statCardValue}>{stats.pendingBets}</Text>
          <Text style={styles.statCardLabel}>Pending</Text>
        </View>
      </ScrollView>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {(['all', 'pending', 'won', 'lost', 'settled'] as FilterType[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter && styles.filterButtonTextActive,
                  ]}
                >
                  {filter === 'all' ? 'All Bets' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
                {filter !== 'all' && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {bets.filter(bet => bet.status === filter).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Bets List */}
      {filteredBets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No bets found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'all' 
              ? "You haven't placed any bets yet. Join an event to get started!"
              : `No ${activeFilter} bets found. Try a different filter.`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBets}
          renderItem={renderBetCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.betsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Settlement Notice */}
      <View style={styles.settlementNotice}>
        <Ionicons name="information-circle" size={20} color="#0ea5e9" />
        <Text style={styles.settlementText}>
          Remember to settle your bets outside the app using Venmo, PayPal, or cash.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginRight: 16,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  betsList: {
    padding: 20,
    gap: 16,
  },
  betCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  betTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  questionContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  question: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  betStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  settlementNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  settlementText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
  },
});