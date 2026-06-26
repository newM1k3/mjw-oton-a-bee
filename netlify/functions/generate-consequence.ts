import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const BASE_SYSTEM_PROMPT = `You are the narrative engine for an educational historical simulation set in Otonabee Township, Peterborough County, Ontario, Canada in 1867 — the year of Confederation.

HISTORICAL ACCURACY REQUIREMENTS:
- All content must be factually grounded in real Otonabee Township and Peterborough County history
- Real place names: Otonabee River, Rice Lake, Smith-Ennismore Road, Peterborough, Keene, Bridgenorth, Selwyn, Nassau Mills
- Seasonal accuracy: Upper Canadian farming calendar, realistic economic conditions
- Economic accuracy: wheat approximately $1/bushel in 1867, barter economy alongside cash

WRITING STYLE:
- Third person limited perspective following the player character
- Literary and immersive but accessible to Grade 7/8 students
- Period-appropriate vocabulary, no anachronisms
- Consequences must feel earned and reflect real 1860s rural Ontario logic

CRITICAL: Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation. Raw JSON only.`;

function buildPrompt(fullName: string, body: Record<string, unknown>): string {
  const { roleTitle, season, resources, choiceLabel, situationNarrative } = body as {
    roleTitle: string;
    season: string;
    resources: { funds: number; reputation: number; harvest: number; health: number };
    choiceLabel: string;
    situationNarrative: string;
  };

  return `The player made their decision. Generate the consequence.

Name: ${fullName}
Role: ${roleTitle}
Season: ${season} 1867
Current Resources: Funds ${resources.funds}/100, Reputation ${resources.reputation}/100, Harvest ${resources.harvest}/100, Health ${resources.health}/100

The situation was: ${situationNarrative}
They chose: "${choiceLabel}"

Generate a realistic, historically grounded consequence. Resource changes must be integers between -25 and +20. At least two resources should change meaningfully. Make the outcome feel earned — this should feel like real history, not a game.

Return this exact JSON structure:
{
  "immediateOutcome": "2 paragraphs describing what happened as a direct result",
  "communityRipple": "1 paragraph describing how neighbours, family, or the township responded",
  "resourceDelta": { "funds": integer, "reputation": integer, "harvest": integer, "health": integer },
  "historicalConnection": "1-2 sentences connecting this outcome to real Otonabee or Peterborough County history",
  "lookingAhead": "1 sentence bridging to the next season",
  "newCharacters": {
    "Full Name": { "age": integer, "role": "brief role description e.g. mill owner" }
  }
}

Only include characters you actually introduce by name in the outcome text. If no new named characters appear, return "newCharacters": {}.`;
}

exports.handler = async function (event: { httpMethod: string; body: string | null }) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { playerName, playerSurname, characters } = body as {
      playerName: string;
      playerSurname?: string;
      characters?: Record<string, unknown>;
    };

    const fullName = playerSurname ? `${playerName} ${playerSurname}` : playerName;

    const characterBlock = characters && Object.keys(characters).length > 0
      ? `\n\nESTABLISHED CHARACTERS: The following characters have already appeared in this story. Use their exact names and ages — do not change or contradict them: ${JSON.stringify(characters)}`
      : '';

    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\nCHARACTER NAME: The player character's name is ${fullName}. Use this exact name every time you refer to the character. Do not invent, alter, or substitute any part of this name.${characterBlock}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: buildPrompt(fullName, body) }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(parsed) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('generate-consequence error:', message);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    };
  }
};
