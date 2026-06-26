import { Choice } from '../types/game';

interface ChoiceCardProps {
  choice: Choice;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export function ChoiceCard({ choice, selected, onSelect, disabled }: ChoiceCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`choice-card w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${selected
          ? 'border-amber-500 bg-amber-50 shadow-sm'
          : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
            ${selected
              ? 'border-amber-500 bg-amber-500 text-white'
              : 'border-stone-300 text-stone-400'
            }`}
        >
          {choice.id.toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-snug mb-1 ${selected ? 'text-amber-900' : 'text-stone-800'}`}>
            {choice.label}
          </p>
          <p className="text-sm text-stone-600 leading-relaxed mb-2">
            {choice.description}
          </p>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium
            ${selected ? 'bg-amber-200 text-amber-800' : 'bg-stone-100 text-stone-500'}`}>
            {choice.hint}
          </span>
        </div>
      </div>
    </button>
  );
}
