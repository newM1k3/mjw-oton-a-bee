interface NarrativePanelProps {
  text: string;
  className?: string;
}

export function NarrativePanel({ text, className = '' }: NarrativePanelProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div className={`narrative-panel bg-stone-100 border border-stone-200 rounded-lg px-6 py-5 ${className}`}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="font-serif-display text-stone-800 leading-[1.75] text-base mb-4 last:mb-0"
        >
          {para.trim()}
        </p>
      ))}
    </div>
  );
}
