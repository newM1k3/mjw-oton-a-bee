import { GameState, Role, SeasonName, ChoiceId, AISituation, AIConsequence, TurnRecord } from '../types/game';

export type GameAction =
  | { type: 'SET_CLASSROOM_MODE'; payload: boolean }
  | { type: 'SELECT_ROLE'; payload: Role }
  | { type: 'SET_PLAYER_NAME'; payload: { name: string; surname: string } }
  | { type: 'SET_ORIGIN'; payload: string }
  | { type: 'START_GAME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SITUATION'; payload: AISituation }
  | { type: 'SELECT_CHOICE'; payload: ChoiceId }
  | { type: 'SET_CONSEQUENCE'; payload: AIConsequence }
  | { type: 'ADVANCE_SEASON' }
  | { type: 'RESET_GAME' };

const SEASON_ORDER: SeasonName[] = ['spring', 'summer', 'autumn', 'winter'];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CLASSROOM_MODE':
      return { ...state, classroomMode: action.payload };

    case 'SELECT_ROLE':
      return { ...state, role: action.payload };

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload.name, playerSurname: action.payload.surname };

    case 'SET_ORIGIN':
      return { ...state, origin: action.payload };

    case 'START_GAME':
      if (!state.role) return state;
      return {
        ...state,
        season: 'spring',
        resources: { ...state.role.startingResources },
        history: [],
        currentSituation: null,
        currentConsequence: null,
        selectedChoiceId: null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SITUATION':
      return {
        ...state,
        currentSituation: action.payload,
        currentConsequence: null,
        selectedChoiceId: null,
        isLoading: false,
      };

    case 'SELECT_CHOICE':
      return { ...state, selectedChoiceId: action.payload };

    case 'SET_CONSEQUENCE': {
      const delta = action.payload.resourceDelta;
      const updatedResources = {
        funds: clamp(state.resources.funds + delta.funds),
        reputation: clamp(state.resources.reputation + delta.reputation),
        harvest: clamp(state.resources.harvest + delta.harvest),
        health: clamp(state.resources.health + delta.health),
      };
      const choiceLabel = state.currentSituation?.choices.find(
        c => c.id === state.selectedChoiceId
      )?.label ?? '';
      const record: TurnRecord = {
        season: state.season,
        situationSummary: state.currentSituation?.situation.slice(0, 120) + '...' ?? '',
        choiceMade: choiceLabel,
        consequenceSummary: action.payload.immediateOutcome.slice(0, 120) + '...',
        resourceDelta: delta,
      };
      return {
        ...state,
        resources: updatedResources,
        currentConsequence: action.payload,
        history: [...state.history, record],
        isLoading: false,
      };
    }

    case 'ADVANCE_SEASON': {
      const currentIndex = SEASON_ORDER.indexOf(state.season);
      const nextSeason = SEASON_ORDER[currentIndex + 1] ?? 'winter';
      return {
        ...state,
        season: nextSeason,
        currentSituation: null,
        currentConsequence: null,
        selectedChoiceId: null,
      };
    }

    case 'RESET_GAME':
      return {
        ...state,
        playerName: '',
        playerSurname: '',
        role: null,
        origin: 'Otonabee Township (born here)',
        season: 'spring',
        resources: { funds: 0, reputation: 0, harvest: 0, health: 0 },
        history: [],
        currentSituation: null,
        currentConsequence: null,
        isLoading: false,
        selectedChoiceId: null,
      };

    default:
      return state;
  }
}
