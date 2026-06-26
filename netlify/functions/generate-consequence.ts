import Anthropic from '@anthropic-ai/sdk';
import { Handler } from '@netlify/functions';

const client = new Anthropic();

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const SYSTEM_PROMPT = `You are the narrative engine for an educational historical simulation set in Otonabee Township, Peterborough County, Ontario, Canada in 1867 — the year of Confederation.

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

function buildPrompt(body: Record<string, unknown>): string {
  const { roleTitle, playerName, season, resources, choiceLabel, situationNarrative } = body as {
    roleTitle: string;
    playerName: string;
    season: string;
    resources: { funds: number; reputation: number; harvest: number; health: number };
    choiceLabel: string;
    situationNarrative: string;
  };

  return `The player made their decision. Generate the consequence.

Name: ${playerName}
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
  "lookingAhead": "1 sentence bridging to the next season"
}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { statusCode: 200, headers: CORS, body: JSON.stringify(parsed) };
  } catch (error) {
    console.error('generate-consequence error:', error);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'The simulation encountered an error. Please try again.' }),
    };
  }
};
