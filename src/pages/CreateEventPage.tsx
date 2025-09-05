import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface Question {
  id: string;
  type: 'yes_no' | 'multiple_choice' | 'numeric';
  text: string;
  options?: string[];
  minBet?: number;
  maxBet?: number;
}

export const CreateEventPage: React.FC = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    minBet: 5,
    maxBet: 100,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'yes_no',
    text: '',
    options: [],
  });

  const addQuestion = () => {
    if (!currentQuestion.text) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as Question['type'],
      text: currentQuestion.text,
      options: currentQuestion.type === 'multiple_choice' ? currentQuestion.options : undefined,
      minBet: eventData.minBet,
      maxBet: eventData.maxBet,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to Supabase
    console.log('Creating event:', { eventData, questions });
    alert('Event created successfully! (Demo mode)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Event
            </h1>
            <p className="text-gray-600 mt-1">Set up your betting event and questions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Details */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Event Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <Input
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="e.g., Sarah's Wedding Predictions"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Tell guests what this event is about..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <Input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Time
                </label>
                <Input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Bet ($)
                </label>
                <Input
                  type="number"
                  value={eventData.minBet}
                  onChange={(e) => setEventData({ ...eventData, minBet: Number(e.target.value) })}
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Bet ($)
                </label>
                <Input
                  type="number"
                  value={eventData.maxBet}
                  onChange={(e) => setEventData({ ...eventData, maxBet: Number(e.target.value) })}
                  min="1"
                />
              </div>
            </div>
          </Card>

          {/* Add Question */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Add Betting Question</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    type: e.target.value as Question['type'],
                    options: e.target.value === 'multiple_choice' ? [''] : []
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="yes_no">Yes/No Question</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="numeric">Numeric Guess</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <Input
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  placeholder="e.g., Will the groom cry during the vows?"
                />
              </div>

              {currentQuestion.type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={addOption}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={addQuestion}
                disabled={!currentQuestion.text}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </Card>

          {/* Questions List */}
          {questions.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          {question.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          ${question.minBet} - ${question.maxBet}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                      {question.options && (
                        <div className="flex flex-wrap gap-2">
                          {question.options.map((option, optIndex) => (
                            <span key={optIndex} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="ghost" className="flex-1">
              Save as Draft
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!eventData.title || questions.length === 0}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};