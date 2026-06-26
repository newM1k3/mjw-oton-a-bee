import { RoleId } from '../types/game';

export function generateBackstory(name: string, surname: string, roleId: RoleId, origin: string): string {
  const fullName = surname ? `${name} ${surname}` : name;
  const originPhrase = origin === 'Otonabee Township (born here)'
    ? 'their whole life'
    : `since arriving from ${origin}`;

  const templates: Record<RoleId, string> = {
    farmer: `${fullName} has worked this land for ${originPhrase}. The soil along the Otonabee is good when the season cooperates, and bad years have taught hard lessons. This year — the year Canada became a nation — there is cautious hope in the air.`,
    merchant: `${fullName} has kept the store on the Smith-Ennismore Road for ${originPhrase}. Credit is the lifeblood of the township and trust is its currency. Both must be carefully managed through what promises to be a consequential year.`,
    blacksmith: `${fullName} has kept the forge burning for ${originPhrase}. Every farm in the township has passed through these doors at some point — a broken plough share, a loose shoe, a gate hinge that wouldn't hold. Iron and fire are demanding masters.`,
    teacher: `${fullName} has stood at the front of the common school for ${originPhrase}. Thirty families have opinions about what their children should learn, and the trustees have opinions about everything else. It takes patience to navigate both.`,
    councillor: `${fullName} has served on the township council for ${originPhrase}. Roads, taxes, and the perpetual disagreement between the north and south concessions — the work is unglamorous, but someone must do it. This year, with Confederation reshaping the country, it feels more significant than usual.`,
    midwife: `${fullName} has served the families of this township for ${originPhrase}. She has delivered more than half the children born in the past decade and seen more of the township's private life than any minister or magistrate. That knowledge is both her greatest asset and her most careful responsibility.`,
  };

  return templates[roleId] ?? `${fullName} has lived and worked in Otonabee Township through seasons of hardship and seasons of plenty.`;
}
