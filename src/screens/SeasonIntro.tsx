import { Dispatch, useState } from 'react';
import { GameAction } from '../state/gameReducer';
import { GameState, AppScreen, SeasonName } from '../types/game';
import { SeasonBadge } from '../components/SeasonBadge';
import { seasonIntros } from '../data/historicalContent';

interface SeasonIntroProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

function SpringIllustration() {
  return (
    <div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-t-2xl"
      style={{ background: 'linear-gradient(160deg, #14532d 0%, #166534 40%, #fef3c7 100%)' }}>
      {/* Sky glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(254,240,138,0.35) 0%, transparent 60%)' }} />
      {/* Ground strip */}
      <div className="absolute bottom-0 left-0 right-0 h-14" style={{ background: 'linear-gradient(to top, #14532d, transparent)' }} />
      {/* Buds */}
      {[
        { left: '18%', bottom: '28px', size: 18, delay: '0s' },
        { left: '45%', bottom: '34px', size: 14, delay: '0.15s' },
        { left: '70%', bottom: '24px', size: 22, delay: '0.3s' },
      ].map((b, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: b.left, bottom: b.bottom,
          width: b.size, height: b.size,
          background: 'radial-gradient(circle, #fde68a 30%, #86efac 100%)',
          boxShadow: '0 0 8px 2px rgba(253,230,138,0.4)',
          animation: `pulse 2s ease-in-out ${b.delay} infinite`,
        }} />
      ))}
      {/* Thin stems */}
      {[{ left: '18.6%' }, { left: '45.4%' }, { left: '70.8%' }].map((s, i) => (
        <div key={i} className="absolute w-px bg-green-400/60" style={{ left: s.left, bottom: 0, height: 28 }} />
      ))}
    </div>
  );
}

function SummerIllustration() {
  return (
    <div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-t-2xl"
      style={{ background: 'linear-gradient(160deg, #0ea5e9 0%, #38bdf8 45%, #fbbf24 100%)' }}>
      {/* Horizon haze */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(251,191,36,0.3) 100%)' }} />
      {/* Sun */}
      <div className="absolute" style={{
        top: 24, right: 48,
        width: 56, height: 56,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fef08a 40%, #fbbf24 80%, transparent 100%)',
        boxShadow: '0 0 30px 12px rgba(251,191,36,0.5)',
      }} />
      {/* Sun rays — simple lines radiating out */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return (
          <div key={i} className="absolute bg-yellow-200/40 rounded-full" style={{
            top: 52 - 1, right: 76 - 1,
            width: 36, height: 2,
            transformOrigin: '0 50%',
            transform: `rotate(${i * 45}deg) translateX(34px)`,
          }} />
        );
      })}
      {/* Field strip */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, #92400e, transparent)' }} />
    </div>
  );
}

function AutumnIllustration() {
  return (
    <div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-t-2xl"
      style={{ background: 'linear-gradient(150deg, #7c2d12 0%, #c2410c 50%, #fbbf24 100%)' }}>
      {/* Warm sky glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(251,191,36,0.25) 0%, transparent 65%)' }} />
      {/* Falling leaves — CSS triangles */}
      {[
        { left: '12%', top: '15%', size: 12, rotate: '20deg', color: '#fbbf24' },
        { left: '30%', top: '35%', size: 10, rotate: '-15deg', color: '#f97316' },
        { left: '55%', top: '20%', size: 14, rotate: '40deg', color: '#dc2626' },
        { left: '72%', top: '45%', size: 11, rotate: '-30deg', color: '#fbbf24' },
        { left: '88%', top: '10%', size: 9,  rotate: '60deg', color: '#f97316' },
        { left: '42%', top: '55%', size: 13, rotate: '-50deg', color: '#dc2626' },
      ].map((leaf, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: leaf.left, top: leaf.top,
          width: 0, height: 0,
          borderLeft: `${leaf.size / 2}px solid transparent`,
          borderRight: `${leaf.size / 2}px solid transparent`,
          borderBottom: `${leaf.size}px solid ${leaf.color}`,
          transform: `rotate(${leaf.rotate})`,
          opacity: 0.85,
        }} />
      ))}
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-14" style={{ background: 'linear-gradient(to top, #431407, transparent)' }} />
    </div>
  );
}

function WinterIllustration() {
  return (
    <div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-t-2xl"
      style={{ background: 'linear-gradient(160deg, #1e293b 0%, #334155 50%, #94a3b8 100%)' }}>
      {/* Moonlight glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 65% 25%, rgba(148,163,184,0.2) 0%, transparent 55%)' }} />
      {/* Snowflake dots */}
      {[
        { left: '8%',  top: '18%', size: 4 },
        { left: '22%', top: '42%', size: 3 },
        { left: '38%', top: '12%', size: 5 },
        { left: '51%', top: '55%', size: 3 },
        { left: '64%', top: '28%', size: 4 },
        { left: '78%', top: '15%', size: 3 },
        { left: '85%', top: '48%', size: 5 },
        { left: '15%', top: '65%', size: 3 },
        { left: '46%', top: '38%', size: 3 },
        { left: '92%', top: '32%', size: 4 },
      ].map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white/70" style={{
          left: s.left, top: s.top,
          width: s.size, height: s.size,
        }} />
      ))}
      {/* Snow ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-none" style={{
        background: 'linear-gradient(to top, #e2e8f0 0%, rgba(226,232,240,0.4) 60%, transparent 100%)',
      }} />
    </div>
  );
}

const ILLUSTRATIONS: Record<SeasonName, () => JSX.Element> = {
  spring: SpringIllustration,
  summer: SummerIllustration,
  autumn: AutumnIllustration,
  winter: WinterIllustration,
};

const SEASON_LABELS: Record<SeasonName, string> = {
  spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
};

export function SeasonIntro({ state, dispatch, setScreen }: SeasonIntroProps) {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const Illustration = ILLUSTRATIONS[state.season];
  const label = SEASON_LABELS[state.season];

  async function fetchSituation() {
    setError(null);
    setRetrying(false);
    dispatch({ type: 'SET_LOADING', payload: true });
    setScreen('decision');

    try {
      const res = await fetch('/.netlify/functions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'situation',
          gameState: {
            playerName: state.playerName,
            roleTitle: state.role?.title ?? '',
            origin: state.origin,
            season: state.season,
            resources: state.resources,
            history: state.history,
          },
        }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      dispatch({ type: 'SET_SITUATION', payload: data });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
      setScreen('seasonIntro');
      setError('Could not reach the simulation. Please check your connection and try again.');
      setRetrying(true);
    }
  }

  return (
    <div className="screen-enter min-h-screen bg-stone-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-stone-100 border border-amber-200 rounded-2xl shadow-2xl overflow-hidden">
          <Illustration />

          <div className="px-7 py-7">
            <div className="flex items-center gap-3 mb-4">
              <SeasonBadge season={state.season} />
            </div>

            <h1 className="font-serif-display text-3xl font-bold text-stone-900 mb-5">
              {label} 1867
            </h1>

            <p className="font-serif-display text-stone-700 leading-relaxed text-base mb-7">
              {seasonIntros[state.season]}
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={fetchSituation}
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base py-3.5 rounded-lg shadow transition-colors duration-150"
            >
              {retrying ? 'Try Again' : `Enter ${label} \u2192`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
