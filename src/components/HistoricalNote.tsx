import { BookOpen } from 'lucide-react';

interface HistoricalNoteProps {
  text: string;
}

export function HistoricalNote({ text }: HistoricalNoteProps) {
  return (
    <div className="flex gap-3 border-l-4 border-red-900 bg-red-50/40 pl-4 py-2 rounded-r-md">
      <BookOpen className="w-4 h-4 text-red-900 shrink-0 mt-0.5" />
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-red-900 block mb-1">
          Historical Note
        </span>
        <p className="font-serif-display text-sm italic text-stone-700 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
