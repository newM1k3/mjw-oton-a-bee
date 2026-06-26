import { Dispatch } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen, SeasonName, TurnRecord } from '../types/game';
import { ResourceBars } from '../components/ResourceBars';
import { HistoricalNote } from '../components/HistoricalNote';
import {
  historicalReflections,
  whatHappenedNext,
  confederationContext,
  curriculumConnections,
} from '../data/historicalContent';

interface YearEndSummaryProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

const SEASON_LABELS: Record<SeasonName, string> = {
  spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
};

function deriveStanding(state: GameState): string {
  const { funds, reputation, health } = state.resources;
  const allNegFunds = state.history.length > 0 && state.history.every(h => h.resourceDelta.funds < 0);

  if (reputation > 70 && funds > 50) return 'A Pillar of the Community';
  if (reputation > 70) return 'Well Regarded in the Township';
  if (funds > 70) return 'Financially Secure';
  if (health < 30) return 'The Year Took Its Toll';
  if (reputation < 30) return 'Your Reputation Suffered';
  if (allNegFunds) return 'A Difficult Year for Your Finances';
  return 'A Steady Hand Through a Consequential Year';
}

function HistoryRow({ record, index }: { record: TurnRecord; index: number }) {
  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
      <td className="px-4 py-3 text-sm font-semibold text-stone-700 whitespace-nowrap">
        {SEASON_LABELS[record.season]}
      </td>
      <td className="px-4 py-3 text-sm text-stone-600 max-w-[200px]">
        <span className="line-clamp-2">{record.situationSummary}</span>
      </td>
      <td className="px-4 py-3 text-sm text-stone-700 font-medium max-w-[160px]">
        <span className="line-clamp-2">{record.choiceMade}</span>
      </td>
      <td className="px-4 py-3 text-sm text-stone-600 max-w-[200px]">
        <span className="line-clamp-2">{record.consequenceSummary}</span>
      </td>
    </tr>
  );
}

export function YearEndSummary({ state, dispatch, setScreen }: YearEndSummaryProps) {
  const role = state.role!;
  const standing = deriveStanding(state);
  const fullName = state.playerSurname
    ? `${state.playerName} ${state.playerSurname}`
    : state.playerName;

  function handlePlayAgainNewRole() {
    dispatch({ type: 'RESET_GAME' });
    setScreen('roles');
  }

  function handlePlayAgainSameRole() {
    dispatch({ type: 'START_GAME' });
    setScreen('seasonIntro');
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-50">
      <div className="bg-green-950 px-6 py-10 text-center">
        <h1 className="font-serif-display text-3xl font-bold text-amber-100 mb-2">
          Your Year: 1867
        </h1>
        <p className="text-green-300 text-base">{fullName}</p>
        <p className="text-green-400 text-sm mt-1">{role.title} &middot; Otonabee Township</p>

        <div className="mt-5 inline-block bg-amber-600/20 border border-amber-500/30 rounded-xl px-6 py-3">
          <p className="text-amber-200 text-xs uppercase tracking-wider font-semibold mb-1">
            Final Standing
          </p>
          <p className="font-serif-display text-amber-100 text-xl font-bold">{standing}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Final resources */}
        <div className="bg-white border border-stone-200 rounded-xl px-6 py-6">
          <h2 className="font-serif-display text-sm font-semibold uppercase tracking-wider text-stone-400 mb-5">
            Where You Ended Up
          </h2>
          <ResourceBars resources={state.resources} previousResources={role.startingResources} />
        </div>

        {/* Season timeline */}
        {state.history.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-serif-display text-sm font-semibold uppercase tracking-wider text-stone-400">
                Your Year in Summary
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Season</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Challenge</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Your Choice</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {state.history.map((record, i) => (
                    <HistoryRow key={i} record={record} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Historical reflection */}
        <div className="bg-stone-100 border border-amber-200 rounded-xl px-6 py-6">
          <h2 className="font-serif-display text-lg font-bold text-stone-900 mb-3">
            Life as a {role.title} in 1867
          </h2>
          <p className="font-serif-display text-stone-700 leading-relaxed text-sm">
            {historicalReflections[role.id]}
          </p>
        </div>

        {/* What happened next */}
        <div className="bg-white border border-stone-200 rounded-xl px-6 py-6">
          <h2 className="font-serif-display text-base font-bold text-stone-900 mb-3">
            What Happened Next in Otonabee Township&hellip;
          </h2>
          <p className="font-serif-display text-stone-700 leading-relaxed text-sm">
            {whatHappenedNext[role.id]}
          </p>
        </div>

        {/* Confederation context */}
        <div className="bg-stone-800 rounded-xl px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            The Bigger Picture
          </p>
          <p className="font-serif-display text-stone-200 leading-relaxed text-sm italic">
            {confederationContext}
          </p>
        </div>

        {/* Curriculum connections — classroom mode only */}
        {state.classroomMode && (
          <div className="bg-green-50 border-2 border-green-600 rounded-xl px-6 py-5">
            <h2 className="font-serif-display text-sm font-bold uppercase tracking-wider text-green-800 mb-3">
              Ontario Curriculum Connections
            </h2>
            <ul className="space-y-2">
              {curriculumConnections.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Replay */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          <button
            onClick={handlePlayAgainNewRole}
            className="flex-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base py-3.5 rounded-xl shadow transition-colors duration-150"
          >
            Play Again &mdash; New Role
          </button>
          <button
            onClick={handlePlayAgainSameRole}
            className="flex-1 bg-stone-700 hover:bg-stone-600 active:bg-stone-800 text-white font-semibold text-base py-3.5 rounded-xl shadow transition-colors duration-150"
          >
            Play Again &mdash; Same Role
          </button>
        </div>
      </div>
    </div>
  );
}
