export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';
export type AppScreen = 'title' | 'roles' | 'character' | 'seasonIntro' | 'decision' | 'consequence' | 'yearEnd';
export type RoleId = 'farmer' | 'merchant' | 'blacksmith' | 'teacher' | 'councillor' | 'midwife';
export type ChoiceId = 'a' | 'b' | 'c';
export type BudgetTier = 'budget-friendly' | 'mid-range' | 'premium';

export interface Resources {
  funds: number;
  reputation: number;
  harvest: number;
  health: number;
}

export interface ResourceDelta {
  funds: number;
  reputation: number;
  harvest: number;
  health: number;
}

export interface Choice {
  id: ChoiceId;
  label: string;
  description: string;
  hint: string;
}

export interface AISituation {
  narrative: string;
  situation: string;
  choices: Choice[];
  historicalNote: string;
}

export interface AIConsequence {
  immediateOutcome: string;
  communityRipple: string;
  resourceDelta: ResourceDelta;
  historicalConnection: string;
  lookingAhead: string;
}

export interface TurnRecord {
  season: SeasonName;
  situationSummary: string;
  choiceMade: string;
  consequenceSummary: string;
  resourceDelta: ResourceDelta;
}

export interface Role {
  id: RoleId;
  title: string;
  description: string;
  flavour: string;
  startingResources: Resources;
  historicalContext: string;
  iconLetter: string;
}

export interface GameState {
  playerName: string;
  playerSurname: string;
  role: Role | null;
  origin: string;
  season: SeasonName;
  resources: Resources;
  history: TurnRecord[];
  currentSituation: AISituation | null;
  currentConsequence: AIConsequence | null;
  isLoading: boolean;
  classroomMode: boolean;
  selectedChoiceId: ChoiceId | null;
}
