import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { QuestionFormItem, type FormQuestion } from './QuestionFormItem';
import { PollMetaFields } from './PollMetaFields';
import { pollsApi } from '../../api/polls-api';
import type { Poll } from '../../types/polls';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (poll: Poll) => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [isAnonymousAllowed, setIsAnonymousAllowed] = useState(true);
  const [questions, setQuestions] = useState<FormQuestion[]>([
    { questionText: '', isMandatory: true, options: [{ optionText: '' }, { optionText: '' }] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdateQuestion = (idx: number, field: keyof FormQuestion, val: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: val } : q)));
  };

  const handleAddOption = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, { optionText: '' }] } : q))
    );
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, oi) => (oi === optIdx ? { ...opt, optionText: val } : opt)) }
          : q
      )
    );
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) } : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('Poll title is required');

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) return setError(`Question ${i + 1} text is required`);
      if (questions[i].options.filter((o) => o.optionText.trim()).length < 2) {
        return setError(`Question ${i + 1} must have at least 2 filled options`);
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        expiryDays,
        isAnonymousAllowed,
        questions: questions.map((q, qIndex) => ({
          questionText: q.questionText.trim(),
          isMandatory: q.isMandatory,
          questionOrder: qIndex + 1,
          options: q.options
            .filter((o) => o.optionText.trim())
            .map((o, optIndex) => ({
              optionText: o.optionText.trim(),
              optionOrder: optIndex + 1,
            })),
        })),
      };

      const response = await pollsApi.createPoll(payload);
      if (response.data) onSuccess(response.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Poll</h2>
              <p className="text-xs text-slate-400">Set up questions and real-time options</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PollMetaFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            expiryDays={expiryDays}
            setExpiryDays={setExpiryDays}
            isAnonymousAllowed={isAnonymousAllowed}
            setIsAnonymousAllowed={setIsAnonymousAllowed}
          />

          <div className="pt-2 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Questions</h3>
              <button
                type="button"
                onClick={() => setQuestions((prev) => [...prev, { questionText: '', isMandatory: false, options: [{ optionText: '' }, { optionText: '' }] }])}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <QuestionFormItem
                  key={idx}
                  question={q}
                  index={idx}
                  canRemoveQuestion={questions.length > 1}
                  onUpdateQuestion={(f, v) => handleUpdateQuestion(idx, f, v)}
                  onRemoveQuestion={() => setQuestions((prev) => prev.filter((_, i) => i !== idx))}
                  onAddOption={() => handleAddOption(idx)}
                  onUpdateOption={(oi, v) => handleUpdateOption(idx, oi, v)}
                  onRemoveOption={(oi) => handleRemoveOption(idx, oi)}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
              Launch Poll
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
