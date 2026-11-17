import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface FormQuestion {
  questionText: string;
  isMandatory: boolean;
  options: { optionText: string }[];
}

interface QuestionFormItemProps {
  question: FormQuestion;
  index: number;
  canRemoveQuestion: boolean;
  onUpdateQuestion: (field: keyof FormQuestion, value: any) => void;
  onRemoveQuestion: () => void;
  onAddOption: () => void;
  onUpdateOption: (optIdx: number, value: string) => void;
  onRemoveOption: (optIdx: number) => void;
}

export const QuestionFormItem: React.FC<QuestionFormItemProps> = ({
  question,
  index,
  canRemoveQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Question {index + 1}
        </span>
        {canRemoveQuestion && (
          <button
            type="button"
            onClick={onRemoveQuestion}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder={`e.g. What is your team's favorite programming language?`}
        value={question.questionText}
        onChange={(e) => onUpdateQuestion('questionText', e.target.value)}
        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none transition-all"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Options (Min 2 required)</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={question.isMandatory}
              onChange={(e) => onUpdateQuestion('isMandatory', e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
            />
            <span>Required answer</span>
          </label>
        </div>

        <div className="space-y-2">
          {question.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-2">
              <span className="w-5 text-center text-xs font-mono text-slate-500">
                {optIdx + 1}.
              </span>
              <input
                type="text"
                placeholder={`Option ${optIdx + 1}`}
                value={opt.optionText}
                onChange={(e) => onUpdateOption(optIdx, e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-500 outline-none"
              />
              {question.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveOption(optIdx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {question.options.length < 10 && (
          <button
            type="button"
            onClick={onAddOption}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 pt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Option</span>
          </button>
        )}
      </div>
    </div>
  );
};

