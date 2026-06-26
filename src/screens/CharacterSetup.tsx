import { Dispatch, useState } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen } from '../types/game';
import { ResourceBars } from '../components/ResourceBars';
import { generateBackstory } from '../utils/generateBackstory';

interface CharacterSetupProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

const ORIGIN_OPTIONS = [
  'Otonabee Township (born here)',
  'Smith Township (neighbouring)',
  'Ennismore Township (Irish settlement)',
  'New arrival from Ireland',
  'New arrival from Scotland',
  'New arrival from England',
  'Other Upper Canada township',
];

export function CharacterSetup({ state, dispatch, setScreen }: CharacterSetupProps) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [origin, setOrigin] = useState(ORIGIN_OPTIONS[0]);

  const role = state.role!;
  const canBegin = firstName.trim().length > 0;

  const backstory = firstName.trim()
    ? generateBackstory(firstName.trim(), surname.trim(), role.id, origin)
    : null;

  const displayName = firstName.trim()
    ? surname.trim() ? `${firstName.trim()} ${surname.trim()}` : firstName.trim()
    : 'Your Character';

  function handleBegin() {
    if (!canBegin) return;
    dispatch({ type: 'SET_PLAYER_NAME', payload: { name: firstName.trim(), surname: surname.trim() } });
    dispatch({ type: 'SET_ORIGIN', payload: origin });
    dispatch({ type: 'START_GAME' });
    setScreen('seasonIntro');
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-50">
      <div className="bg-green-950 px-6 py-8 text-center">
        <h1 className="font-serif-display text-2xl font-bold text-amber-100 mb-1">Your Character</h1>
        <p className="text-green-300 text-sm">
          {role.title} &mdash; Otonabee Township, 1867
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm px-6 py-6 space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
                Character Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Your given name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Mary, James, Bridget"
                  className="w-full border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Your family name{' '}
                  <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="e.g. Sullivan, MacPherson, Clarke"
                  className="w-full border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Where do you come from?
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition bg-white"
                >
                  {ORIGIN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleBegin}
              disabled={!canBegin}
              className={`w-full py-4 rounded-xl font-semibold text-base shadow-sm transition-all duration-150
                ${canBegin
                  ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
            >
              Begin Your Year in 1867
            </button>
          </div>

          {/* Preview card */}
          <div className="space-y-4">
            <div className="bg-stone-100 border border-amber-200 rounded-xl shadow-sm px-6 py-6">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-amber-200">
                <div className="w-14 h-14 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-2xl shrink-0 font-serif-display">
                  {role.iconLetter}
                </div>
                <div>
                  <p className="font-serif-display text-xl font-bold text-stone-900">{displayName}</p>
                  <p className="text-sm text-stone-500">{role.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{origin}</p>
                </div>
              </div>

              {backstory ? (
                <p className="font-serif-display text-sm text-stone-700 leading-relaxed mb-5 italic">
                  {backstory}
                </p>
              ) : (
                <p className="font-serif-display text-sm text-stone-400 italic mb-5">
                  Enter your name to see your character&rsquo;s story&hellip;
                </p>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Starting Resources
                </p>
                <ResourceBars resources={role.startingResources} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
