import { useReducer, useState } from 'react';
import { gameReducer } from './state/gameReducer';
import { initialState } from './state/initialState';
import { AppScreen } from './types/game';
import { TitleScreen } from './screens/TitleScreen';
import { RoleSelection } from './screens/RoleSelection';
import { CharacterSetup } from './screens/CharacterSetup';
import { SeasonIntro } from './screens/SeasonIntro';
import { DecisionScreen } from './screens/DecisionScreen';
import { ConsequenceScreen } from './screens/ConsequenceScreen';
import { YearEndSummary } from './screens/YearEndSummary';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [screen, setScreen] = useState<AppScreen>('title');

  function renderScreen() {
    switch (screen) {
      case 'title':
        return <TitleScreen dispatch={dispatch} setScreen={setScreen} />;
      case 'roles':
        return <RoleSelection state={state} dispatch={dispatch} setScreen={setScreen} />;
      case 'character':
        if (!state.role) { setScreen('roles'); return null; }
        return <CharacterSetup state={state} dispatch={dispatch} setScreen={setScreen} />;
      case 'seasonIntro':
        if (!state.role) { setScreen('roles'); return null; }
        return <SeasonIntro state={state} dispatch={dispatch} setScreen={setScreen} />;
      case 'decision':
        if (!state.role) { setScreen('roles'); return null; }
        return <DecisionScreen state={state} dispatch={dispatch} setScreen={setScreen} />;
      case 'consequence':
        if (!state.role) { setScreen('roles'); return null; }
        return <ConsequenceScreen state={state} dispatch={dispatch} setScreen={setScreen} />;
      case 'yearEnd':
        if (!state.role) { setScreen('roles'); return null; }
        return <YearEndSummary state={state} dispatch={dispatch} setScreen={setScreen} />;
      default:
        return (
          <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <p className="text-stone-400 italic font-serif-display">
              Screen &ldquo;{screen}&rdquo; coming soon&hellip;
            </p>
          </div>
        );
    }
  }

  function handleExitClassroom() {
    dispatch({ type: 'SET_CLASSROOM_MODE', payload: false });
    setScreen('title');
  }

  return (
    <div className={state.classroomMode ? 'classroom-mode' : ''}>
      {state.classroomMode && (
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-stone-800/90 backdrop-blur-sm border border-stone-600 rounded-full px-3 py-1.5 shadow-lg">
          <span className="text-xs font-semibold text-amber-300 whitespace-nowrap">
            📽 Classroom Mode
          </span>
          <span className="text-stone-600">·</span>
          <button
            onClick={handleExitClassroom}
            className="text-xs text-stone-400 hover:text-white transition-colors duration-100 underline underline-offset-2"
          >
            Exit
          </button>
        </div>
      )}
      {renderScreen()}
    </div>
  );
}
