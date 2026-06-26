import { Dispatch, useState } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen, ChoiceId } from '../types/game';
import { LoadingQuill } from '../components/LoadingQuill';
import { NarrativePanel } from '../components/NarrativePanel';
import { ChoiceCard } from '../components/ChoiceCard';
import { HistoricalNote } from '../components/HistoricalNote';
import { ResourceBars } from '../components/ResourceBars';
import { SeasonBadge } from '../components/SeasonBadge';

interface DecisionScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

export function DecisionScreen({ state, dispatch, setScreen }: DecisionScreenProps) {
  const [error, setError] = useState<string | null>(null);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <LoadingQuill />
      </div>
    );
  }

  if (!state.currentSituation) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 italic font-serif-display">No situation loaded.</p>
      </div>
    );
  }

  const { narrative, situation, choices, historicalNote } = state.currentSituation;

  async function handleConfirm() {
    if (!state.selectedChoiceId || !state.currentSituation) return;
    setError(null);

    const choiceLabel = choices.find(c => c.id === state.selectedChoiceId)?.label ?? '';
    dispatch({ type: 'SET_LOADING', payload: true });
    setScreen('consequence');

    try {
      const res = await fetch('/.netlify/functions/generate-consequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: state.playerName,
          playerSurname: state.playerSurname,
          roleTitle: state.role?.title ?? '',
          origin: state.origin,
          season: state.season,
          resources: state.resources,
          history: state.history,
          characters: state.characters,
          choiceLabel,
          situationNarrative: situation,
        }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.newCharacters && Object.keys(data.newCharacters).length > 0) {
        dispatch({ type: 'REGISTER_CHARACTERS', payload: data.newCharacters });
      }
      dispatch({ type: 'SET_CONSEQUENCE', payload: data });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
      setScreen('decision');
      setError('Could not reach the simulation. Please try again.');
    }
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-50">
      <div className="bg-green-950 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <SeasonBadge season={state.season} />
          <span className="text-green-300 text-sm">
            {state.playerName} &middot; {state.role?.title}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left panel */}
          <div className="flex-[3] space-y-4 min-w-0">
            <NarrativePanel text={narrative} />

            <div className="bg-stone-100 border border-stone-200 rounded-lg px-6 py-4">
              <p className="font-serif-display text-stone-800 font-semibold leading-relaxed text-base">
                {situation}
              </p>
            </div>

            <HistoricalNote text={historicalNote} />
          </div>

          {/* Right panel */}
          <div className="flex-[2] space-y-4 min-w-0">
            <h2 className="font-serif-display text-sm font-semibold uppercase tracking-wider text-stone-400">
              Your Decision
            </h2>

            <div className="space-y-3">
              {choices.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  selected={state.selectedChoiceId === choice.id}
                  onSelect={() => dispatch({ type: 'SELECT_CHOICE', payload: choice.id as ChoiceId })}
                  disabled={false}
                />
              ))}
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Current Resources
              </p>
              <ResourceBars resources={state.resources} />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {state.selectedChoiceId && (
              <button
                onClick={handleConfirm}
                disabled={state.isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-semibold text-base py-3.5 rounded-lg shadow transition-colors duration-150"
              >
                Confirm Decision
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
