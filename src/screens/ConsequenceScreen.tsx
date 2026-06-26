import { Dispatch } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen, Resources, SeasonName } from '../types/game';
import { LoadingQuill } from '../components/LoadingQuill';
import { NarrativePanel } from '../components/NarrativePanel';
import { HistoricalNote } from '../components/HistoricalNote';
import { ResourceBars } from '../components/ResourceBars';
import { SeasonBadge } from '../components/SeasonBadge';

interface ConsequenceScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

const SEASON_ORDER: SeasonName[] = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_LABELS: Record<SeasonName, string> = {
  spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
};

function nextSeasonLabel(current: SeasonName): string {
  const idx = SEASON_ORDER.indexOf(current);
  return SEASON_LABELS[SEASON_ORDER[idx + 1] ?? 'winter'];
}

export function ConsequenceScreen({ state, dispatch, setScreen }: ConsequenceScreenProps) {
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <LoadingQuill />
      </div>
    );
  }

  if (!state.currentConsequence) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 italic font-serif-display">No consequence loaded.</p>
      </div>
    );
  }

  const { immediateOutcome, communityRipple, resourceDelta, historicalConnection, lookingAhead } =
    state.currentConsequence;

  const previousResources: Resources = {
    funds: Math.max(0, Math.min(100, state.resources.funds - resourceDelta.funds)),
    reputation: Math.max(0, Math.min(100, state.resources.reputation - resourceDelta.reputation)),
    harvest: Math.max(0, Math.min(100, state.resources.harvest - resourceDelta.harvest)),
    health: Math.max(0, Math.min(100, state.resources.health - resourceDelta.health)),
  };

  const isWinter = state.season === 'winter';

  function handleContinue() {
    if (isWinter) {
      setScreen('yearEnd');
    } else {
      dispatch({ type: 'ADVANCE_SEASON' });
      setScreen('seasonIntro');
    }
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-50">
      <div className="bg-green-950 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <SeasonBadge season={state.season} />
          <span className="text-green-300 text-sm">
            {state.playerName} &middot; {state.role?.title}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">The Outcome</h2>

        <NarrativePanel text={immediateOutcome} />

        <div className="pl-4 border-l-4 border-stone-300">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Neighbours say&hellip;
          </p>
          <p className="font-serif-display italic text-stone-700 leading-relaxed text-sm">
            {communityRipple}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            How This Changed Your Standing
          </p>
          <ResourceBars resources={state.resources} previousResources={previousResources} />
        </div>

        <HistoricalNote text={historicalConnection} />

        <p className="font-serif-display text-sm italic text-stone-500 leading-relaxed text-center">
          {lookingAhead}
        </p>

        <div className="pt-2">
          <button
            onClick={handleContinue}
            className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base py-4 rounded-xl shadow transition-colors duration-150"
          >
            {isWinter
              ? 'See Your Year in Review \u2192'
              : `Continue to ${nextSeasonLabel(state.season)} \u2192`}
          </button>
        </div>
      </div>
    </div>
  );
}
