import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Question {
  id: string;
  type: 'yes_no' | 'multiple_choice' | 'numeric';
  text: string;
  options?: string[];
}

export default function CreateEventScreen({ navigation }: any) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    minBet: '5',
    maxBet: '100',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'yes_no',
    text: '',
    options: [],
  });

  const addQuestion = () => {
    if (!currentQuestion.text) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as Question['type'],
      text: currentQuestion.text,
      options: currentQuestion.type === 'multiple_choice' ? currentQuestion.options : undefined,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({ type: 'yes_no', text: '', options: [] });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = () => {
    if (currentQuestion.type === 'multiple_choice') {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...(currentQuestion.options || []), ''],
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
  };

  const handleSubmit = () => {
    if (!eventData.title || questions.length === 0) {
      Alert.alert('Error', 'Please fill in the event title and add at least one question');
      return;
    }

    Alert.alert(
      'Success',
      'Event created successfully! (Demo mode)',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={24} color="#0ea5e9" />
            <Text style={styles.sectionTitle}>Event Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Title *</Text>
            <TextInput
              style={styles.input}
              value={eventData.title}
              onChangeText={(text) => setEventData({ ...eventData, title: text })}
              placeholder="e.g., Sarah's Wedding Predictions"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={eventData.description}
              onChangeText={(text) => setEventData({ ...eventData, description: text })}
              placeholder="Tell guests what this event is about..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Event Date *</Text>
              <TextInput
                style={styles.input}
                value={eventData.date}
                onChangeText={(text) => setEventData({ ...eventData, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Event Time</Text>
              <TextInput
                style={styles.input}
                value={eventData.time}
                onChangeText={(text) => setEventData({ ...eventData, time: text })}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Min Bet ($)</Text>
              <TextInput
                style={styles.input}
                value={eventData.minBet}
                onChangeText={(text) => setEventData({ ...eventData, minBet: text })}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Max Bet ($)</Text>
              <TextInput
                style={styles.input}
                value={eventData.maxBet}
                onChangeText={(text) => setEventData({ ...eventData, maxBet: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Add Question */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="add-circle-outline" size={24} color="#d946ef" />
            <Text style={styles.sectionTitle}>Add Betting Question</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Question Type</Text>
            <View style={styles.segmentedControl}>
              {[
                { key: 'yes_no', label: 'Yes/No' },
                { key: 'multiple_choice', label: 'Multiple Choice' },
                { key: 'numeric', label: 'Numeric' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.segmentButton,
                    currentQuestion.type === option.key && styles.segmentButtonActive,
                  ]}
                  onPress={() =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      type: option.key as Question['type'],
                      options: option.key === 'multiple_choice' ? [''] : [],
                    })
                  }
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      currentQuestion.type === option.key && styles.segmentButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Question Text</Text>
            <TextInput
              style={styles.input}
              value={currentQuestion.text}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, text })}
              placeholder="e.g., Will the groom cry during the vows?"
            />
          </View>

          {currentQuestion.type === 'multiple_choice' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Answer Options</Text>
              {currentQuestion.options?.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={option}
                    onChangeText={(text) => updateOption(index, text)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeOption(index)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                <Ionicons name="add" size={20} color="#d946ef" />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, !currentQuestion.text && styles.primaryButtonDisabled]}
            onPress={addQuestion}
            disabled={!currentQuestion.text}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Add Question</Text>
          </TouchableOpacity>
        </View>

        {/* Questions List */}
        {questions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={24} color="#10b981" />
              <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
            </View>

            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionType}>
                    {question.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={() => removeQuestion(question.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.questionText}>{question.text}</Text>
                {question.options && (
                  <View style={styles.questionOptions}>
                    {question.options.map((option, optIndex) => (
                      <Text key={optIndex} style={styles.questionOption}>
                        • {option}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Submit */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!eventData.title || questions.length === 0) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!eventData.title || questions.length === 0}
          >
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.submitButtonText}>Create Event</Text>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  removeButton: {
    padding: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d946ef',
    borderRadius: 12,
    borderStyle: 'dashed',
    gap: 8,
  },
  addOptionText: {
    color: '#d946ef',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  questionOptions: {
    gap: 4,
  },
  questionOption: {
    fontSize: 14,
    color: '#64748b',
  },
  submitSection: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});