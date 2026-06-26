import { RoleId } from '../types/game';

const ORIGIN_PHRASES: Record<string, string> = {
  'Otonabee Township (born here)':       'their whole life',
  'Smith Township (neighbouring)':        'years now, having come from Smith Township',
  'Ennismore Township (Irish settlement)':'years now, having settled from Ennismore',
  'New arrival from Ireland':             'a short time, having arrived from Ireland',
  'New arrival from Scotland':            'a short time, having arrived from Scotland',
  'New arrival from England':             'a short time, having arrived from England',
  'Other Upper Canada township':          'years now',
};

function originPhrase(origin: string): string {
  return ORIGIN_PHRASES[origin] ?? 'years now';
}

export function generateBackstory(name: string, surname: string, roleId: RoleId, origin: string): string {
  const fullName = surname ? `${name} ${surname}` : name;
  const phrase = originPhrase(origin);

  const templates: Record<RoleId, string> = {
    farmer:     `${fullName} has worked this land for ${phrase}. The soil along the Otonabee is good when the season cooperates, and bad years have taught hard lessons. This year — the year Canada became a nation — there is cautious hope in the air.`,
    merchant:   `${fullName} has kept the store on the Smith-Ennismore Road for ${phrase}. Credit is the lifeblood of the township and trust is its currency. Both must be carefully managed through what promises to be a consequential year.`,
    blacksmith: `${fullName} has kept the forge burning for ${phrase}. Every farm in the township has passed through these doors at some point — a broken plough share, a loose shoe, a gate hinge that wouldn't hold. Iron and fire are demanding masters.`,
    teacher:    `${fullName} has stood at the front of the common school for ${phrase}. Thirty families have opinions about what their children should learn, and the trustees have opinions about everything else. It takes patience to navigate both.`,
    councillor: `${fullName} has served on the township council for ${phrase}. Roads, taxes, and the perpetual disagreement between the north and south concessions — the work is unglamorous, but someone must do it. This year, with Confederation reshaping the country, it feels more significant than usual.`,
    midwife:    `${fullName} has served the families of this township for ${phrase}. She has delivered more than half the children born in the past decade and seen more of the township's private life than any minister or magistrate. That knowledge is both her greatest asset and her most careful responsibility.`,
  };

  return templates[roleId] ?? `${fullName} has lived and worked in Otonabee Township through seasons of hardship and seasons of plenty.`;
}
