import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: 'people-outline',
    title: 'Social Betting',
    description: 'Create fun betting pools for weddings, parties, and events with friends and family.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Real-Time Odds',
    description: 'Watch live odds and potential winnings update as more people place their bets.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'No Payment Processing',
    description: 'We track bets, you settle outside the app. Keep it simple and legal.',
  },
  {
    icon: 'phone-portrait-outline',
    title: 'Mobile First',
    description: 'Designed for mobile with a beautiful, intuitive interface that works everywhere.',
  },
];

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#f0f9ff', '#ffffff', '#fdf4ff']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              <Text style={styles.gradientText}>Bet On It</Text>
              {'\n'}Make Every Event{'\n'}More Exciting
            </Text>
            <Text style={styles.heroSubtitle}>
              Create social betting pools for weddings, parties, sports events, and more.
              Track bets in USD, settle outside the app, and make every gathering unforgettable.
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Events')}
              >
                <Text style={styles.primaryButtonText}>Get Started Free</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Events')}
              >
                <Text style={styles.secondaryButtonText}>Browse Events</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusIndicators}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.statusText}>No payment processing</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.statusText}>Free to use</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#8b5cf6' }]} />
                <Text style={styles.statusText}>Mobile optimized</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Everything You Need for Social Betting</Text>
          <Text style={styles.sectionSubtitle}>
            Simple, secure, and social. Create memorable experiences at every event.
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <LinearGradient
                  colors={['#0ea5e9', '#d946ef']}
                  style={styles.featureIcon}
                >
                  <Ionicons name={feature.icon as any} size={24} color="white" />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <LinearGradient
          colors={['#f8fafc', '#f0f9ff']}
          style={styles.howItWorksSection}
        >
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>
            Get started in minutes and make your next event unforgettable.
          </Text>

          <View style={styles.stepsContainer}>
            {[
              {
                step: '1',
                title: 'Create Your Event',
                description: 'Set up your event with a title, date, and betting questions. Get a shareable code instantly.',
              },
              {
                step: '2',
                title: 'Invite Participants',
                description: 'Share your event code or link. Friends join and place bets in USD on your questions.',
              },
              {
                step: '3',
                title: 'Track & Settle',
                description: 'Watch real-time results and leaderboards. Settle winnings outside the app with Venmo, PayPal, or cash.',
              },
            ].map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <LinearGradient
                  colors={['#0ea5e9', '#d946ef']}
                  style={styles.stepNumber}
                >
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </LinearGradient>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* CTA Section */}
        <LinearGradient
          colors={['#0ea5e9', '#d946ef']}
          style={styles.ctaSection}
        >
          <Text style={styles.ctaTitle}>Ready to Make Your Next Event Legendary?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of event hosts who are making their gatherings more engaging with social betting.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Events')}
          >
            <Text style={styles.ctaButtonText}>Create Your First Event</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1e293b',
  },
  gradientText: {
    color: '#0ea5e9',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  howItWorksSection: {
    padding: 20,
  },
  stepsContainer: {
    gap: 24,
  },
  stepCard: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  ctaSection: {
    padding: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
});