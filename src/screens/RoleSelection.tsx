import { Dispatch } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen, Role } from '../types/game';
import { roles } from '../data/roles';

interface RoleSelectionProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

const RESOURCE_COLORS: Record<string, string> = {
  funds: 'bg-amber-500',
  reputation: 'bg-teal-500',
  harvest: 'bg-green-500',
  health: 'bg-rose-500',
};

function ResourceMini({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-stone-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-stone-400 w-6 text-right tabular-nums">{value}</span>
    </div>
  );
}

function RoleCard({ role, selected, onSelect }: { role: Role; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        ${selected
          ? 'border-amber-500 bg-amber-50 shadow-md'
          : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-lg text-white transition-colors font-serif-display
            ${selected ? 'bg-amber-600' : 'bg-green-800'}`}
        >
          {role.iconLetter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className={`font-serif-display font-bold text-base ${selected ? 'text-amber-900' : 'text-stone-900'}`}>
              {role.title}
            </p>
            {selected && (
              <span className="shrink-0 inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                &#10003; Selected
              </span>
            )}
          </div>
          <p className="text-sm text-stone-600 leading-relaxed mb-2">{role.description}</p>
          <p className="font-serif-display text-xs italic text-stone-500 mb-3">{role.flavour}</p>
          <div className="space-y-1 mb-3">
            <ResourceMini label="Funds" value={role.startingResources.funds} color={RESOURCE_COLORS.funds} />
            <ResourceMini label="Reputation" value={role.startingResources.reputation} color={RESOURCE_COLORS.reputation} />
            <ResourceMini label="Harvest" value={role.startingResources.harvest} color={RESOURCE_COLORS.harvest} />
            <ResourceMini label="Health" value={role.startingResources.health} color={RESOURCE_COLORS.health} />
          </div>
          <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-100 pt-2">
            {role.historicalContext}
          </p>
        </div>
      </div>
    </button>
  );
}

export function RoleSelection({ state, dispatch, setScreen }: RoleSelectionProps) {
  const selectedId = state.role?.id ?? null;

  function handleSelect(role: Role) {
    dispatch({ type: 'SELECT_ROLE', payload: role });
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-50 pb-24">
      <div className="bg-green-950 px-6 py-8 text-center">
        <h1 className="font-serif-display text-2xl font-bold text-amber-100 mb-1">
          Choose Your Role in 1867
        </h1>
        <p className="text-green-300 text-sm">Each role offers a different window into township life.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selectedId === role.id}
              onSelect={() => handleSelect(role)}
            />
          ))}
        </div>
      </div>

      {/* Sticky Continue bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg px-4 py-3 flex items-center justify-between gap-4 transition-all duration-300 ${selectedId ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <p className="text-sm text-stone-600 truncate">
          <span className="font-semibold text-amber-700">{state.role?.title}</span>
          {state.role && <span className="text-stone-400"> — ready to continue</span>}
        </p>
        <button
          type="button"
          onClick={() => { if (state.role) setScreen('character'); }}
          disabled={!selectedId}
          className="shrink-0 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base py-2.5 px-8 rounded-lg shadow transition-colors duration-150"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  );
}
