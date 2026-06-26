import { GameState } from '../types/game';

export const initialState: GameState = {
  playerName: '',
  playerSurname: '',
  role: null,
  origin: 'Otonabee Township (born here)',
  season: 'spring',
  resources: {
    funds: 0,
    reputation: 0,
    harvest: 0,
    health: 0,
  },
  history: [],
  currentSituation: null,
  currentConsequence: null,
  isLoading: false,
  classroomMode: false,
  selectedChoiceId: null,
};
