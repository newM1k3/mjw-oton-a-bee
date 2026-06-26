import { SeasonName } from '../types/game';

interface SeasonBadgeProps {
  season: SeasonName;
}

const SEASON_STYLES: Record<SeasonName, { bg: string; text: string; label: string }> = {
  spring: { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Spring' },
  summer: { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Summer' },
  autumn: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Autumn' },
  winter: { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'Winter' },
};

export function SeasonBadge({ season }: SeasonBadgeProps) {
  const { bg, text, label } = SEASON_STYLES[season];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {label} 1867
    </span>
  );
}
