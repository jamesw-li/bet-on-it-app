/*
  # Complete Bet On It Database Schema

  1. New Tables
    - `profiles` - User profiles with additional info
    - `events` - Betting events created by users
    - `event_participants` - Users who joined events
    - `questions` - Betting questions for events
    - `bets` - Individual bets placed by users
    - `settlements` - Track bet settlements
    - `leaderboard_entries` - Cached leaderboard data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Functions
    - Auto-create profile on signup
    - Calculate leaderboard stats
    - Handle bet settlements
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  bio text DEFAULT '',
  venmo_handle text,
  paypal_handle text,
  cashapp_handle text,
  total_winnings decimal(10,2) DEFAULT 0,
  total_bets integer DEFAULT 0,
  events_created integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  event_date timestamptz NOT NULL,
  event_code text UNIQUE NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  min_bet decimal(10,2) DEFAULT 5.00,
  max_bet decimal(10,2) DEFAULT 100.00,
  total_pool decimal(10,2) DEFAULT 0,
  participant_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('yes_no', 'multiple_choice', 'numeric', 'free_text')),
  options jsonb DEFAULT '[]',
  betting_closes_at timestamptz NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
  correct_answer text,
  total_pool decimal(10,2) DEFAULT 0,
  bet_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bets table
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  chosen_answer text NOT NULL,
  bet_amount decimal(10,2) NOT NULL CHECK (bet_amount > 0),
  potential_winnings decimal(10,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'settled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id uuid REFERENCES bets(id) ON DELETE CASCADE NOT NULL,
  payer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  payee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  payment_method text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'disputed')),
  settled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Leaderboard entries table (cached stats)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  total_winnings decimal(10,2) DEFAULT 0,
  total_bets integer DEFAULT 0,
  win_rate decimal(5,2) DEFAULT 0,
  rank integer,
  period text DEFAULT 'all_time' CHECK (period IN ('all_time', 'monthly', 'weekly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id, period)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- Event participants policies
CREATE POLICY "Anyone can view event participants"
  ON event_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join events"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Event hosts can manage questions"
  ON questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = questions.event_id 
      AND events.host_id = auth.uid()
    )
  );

-- Bets policies
CREATE POLICY "Users can view bets for events they participate in"
  ON bets FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM event_participants 
      WHERE event_participants.event_id = bets.event_id 
      AND event_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can place bets"
  ON bets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bets"
  ON bets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Settlements policies
CREATE POLICY "Users can view their settlements"
  ON settlements FOR SELECT
  TO authenticated
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can create settlements"
  ON settlements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can update their settlements"
  ON settlements FOR UPDATE
  TO authenticated
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Leaderboard policies
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

-- Functions and triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update event stats
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS trigger AS $$
BEGIN
  -- Update total pool and participant count
  UPDATE events SET
    total_pool = (
      SELECT COALESCE(SUM(bet_amount), 0)
      FROM bets
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    ),
    participant_count = (
      SELECT COUNT(DISTINCT user_id)
      FROM event_participants
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for event stats
DROP TRIGGER IF EXISTS update_event_stats_on_bet ON bets;
CREATE TRIGGER update_event_stats_on_bet
  AFTER INSERT OR UPDATE OR DELETE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_event_stats();

DROP TRIGGER IF EXISTS update_event_stats_on_participant ON event_participants;
CREATE TRIGGER update_event_stats_on_participant
  AFTER INSERT OR DELETE ON event_participants
  FOR EACH ROW EXECUTE FUNCTION update_event_stats();

-- Function to calculate potential winnings
CREATE OR REPLACE FUNCTION calculate_potential_winnings(
  p_bet_amount decimal,
  p_question_id uuid,
  p_chosen_answer text
)
RETURNS decimal AS $$
DECLARE
  total_pool decimal;
  winning_pool decimal;
  potential_winnings decimal;
BEGIN
  -- Get total pool for the question
  SELECT COALESCE(SUM(bet_amount), 0) INTO total_pool
  FROM bets
  WHERE question_id = p_question_id;
  
  -- Get winning pool for the chosen answer
  SELECT COALESCE(SUM(bet_amount), 0) INTO winning_pool
  FROM bets
  WHERE question_id = p_question_id AND chosen_answer = p_chosen_answer;
  
  -- Calculate potential winnings
  IF winning_pool = 0 THEN
    potential_winnings := p_bet_amount;
  ELSE
    potential_winnings := (p_bet_amount / (winning_pool + p_bet_amount)) * (total_pool + p_bet_amount);
  END IF;
  
  RETURN potential_winnings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update bet potential winnings
CREATE OR REPLACE FUNCTION update_bet_potential_winnings()
RETURNS trigger AS $$
BEGIN
  NEW.potential_winnings := calculate_potential_winnings(
    NEW.bet_amount,
    NEW.question_id,
    NEW.chosen_answer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update potential winnings on bet insert/update
DROP TRIGGER IF EXISTS update_potential_winnings ON bets;
CREATE TRIGGER update_potential_winnings
  BEFORE INSERT OR UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_bet_potential_winnings();

-- Function to generate unique event code
CREATE OR REPLACE FUNCTION generate_event_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM events WHERE event_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_code ON events(event_code);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_event_id ON questions(event_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_question_id ON bets(question_id);
CREATE INDEX IF NOT EXISTS idx_bets_event_id ON bets(event_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_settlements_payer_id ON settlements(payer_id);
CREATE INDEX IF NOT EXISTS idx_settlements_payee_id ON settlements(payee_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_user_id ON leaderboard_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_event_id ON leaderboard_entries(event_id);