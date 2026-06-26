import { Dispatch } from 'react';
import { GameAction } from '../state/gameReducer';
import { AppScreen } from '../types/game';

interface TitleScreenProps {
  dispatch: Dispatch<GameAction>;
  setScreen: (screen: AppScreen) => void;
}

export function TitleScreen({ dispatch, setScreen }: TitleScreenProps) {
  function handleMode(classroomMode: boolean) {
    dispatch({ type: 'SET_CLASSROOM_MODE', payload: classroomMode });
    setScreen('roles');
  }

  return (
    <div className="screen-enter min-h-screen bg-green-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-stone-100 border border-amber-200 rounded-2xl shadow-2xl px-8 py-10 text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-amber-300" />
            <span className="text-amber-600 text-lg">✦</span>
            <div className="flex-1 h-px bg-amber-300" />
          </div>

          <h1 className="font-serif-display text-4xl font-bold text-stone-900 mb-2 tracking-tight">
            Otonabee Township
          </h1>
          <p className="font-serif-display text-base text-stone-500 italic mb-6 tracking-wide">
            A Historical Simulation &middot; 1867
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-amber-300" />
            <span className="text-amber-600 text-lg">✦</span>
            <div className="flex-1 h-px bg-amber-300" />
          </div>

          <p className="font-serif-display text-stone-700 leading-relaxed text-base mb-5">
            Canada has just become a nation. In Peterborough County, life continues
            as it always has&nbsp;&mdash; but change is coming. The choices you make
            this year will shape your family&rsquo;s future and your community&rsquo;s story.
          </p>

          <p className="font-serif-display text-xs italic text-stone-400 mb-8">
            Based on the history of Otonabee Township, Peterborough County, Ontario
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleMode(false)}
              className="flex-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base py-3.5 px-6 rounded-lg transition-colors duration-150 shadow-sm"
            >
              Solo Play
            </button>
            <button
              onClick={() => handleMode(true)}
              className="flex-1 bg-stone-700 hover:bg-stone-600 active:bg-stone-800 text-white font-semibold text-base py-3.5 px-6 rounded-lg transition-colors duration-150 shadow-sm"
            >
              Classroom Mode
            </button>
          </div>
        </div>

        <p className="text-center text-green-700 text-xs mt-6">
          Developed by MJW Design &middot; Peterborough, Ontario
        </p>
      </div>
    </div>
  );
}
