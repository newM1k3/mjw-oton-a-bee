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
- Real place names: Otonabee River, Rice Lake, Smith-Ennismore Road, Peterborough, Keene, Bridgenorth, Selwyn, Nassau Mills, Bensfort Bridge, 4th Line, 7th Concession
- Real context: Ontario Common Schools Act (1850), Baldwin Act (1849), Confederation July 1 1867, Grand Trunk Railway reached Peterborough 1858, the timber trade along the Otonabee, Orange Order presence, Irish Catholic and Protestant settler tensions, Anishinaabe (Mississauga Ojibwe) history along Rice Lake
- Seasonal accuracy: Upper Canadian farming calendar, period-accurate crops (wheat, oats, potatoes, hay), realistic weather events
- Economic accuracy: wheat approximately $1/bushel in 1867, barter economy, credit extended by merchants

WRITING STYLE:
- Third person limited perspective following the player character
- Literary and immersive but accessible to Grade 7/8 students (approximately Grade 8 reading level)
- Period-appropriate vocabulary without being impenetrable
- No anachronisms under any circumstances
- Tensions should reflect real historical tensions: settler vs established families, Irish Catholic vs Protestant, emerging municipal politics, role of women, relationships with Indigenous neighbours

EDUCATIONAL INTEGRITY:
- Every situation must teach something true about this period
- Do not romanticize or sanitize — hardship, inequality, and social tension were real
- Do not sensationalize — this is a classroom tool
- Include one genuine historical fact

CRITICAL: Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation. Raw JSON only.`;

function buildPrompt(body: Record<string, unknown>): string {
  const { roleTitle, playerName, origin, season, resources, history } = body as {
    roleTitle: string;
    playerName: string;
    origin: string;
    season: string;
    resources: { funds: number; reputation: number; harvest: number; health: number };
    history: Array<{ season: string; choiceMade: string }>;
  };

  const previousDecisions = history.length > 0
    ? history.map(h => `${h.season}: ${h.choiceMade}`).join('; ')
    : 'None — this is the first season';

  return `Generate a seasonal decision scenario for this player:

Name: ${playerName}
Role: ${roleTitle}
Origin: ${origin}
Current Season: ${season} 1867
Resources: Funds ${resources.funds}/100, Reputation ${resources.reputation}/100, Harvest ${resources.harvest}/100, Health ${resources.health}/100
Previous decisions: ${previousDecisions}

Generate a situation appropriate to their role and the ${season} season. Resource levels should influence the challenge type (low funds = financial pressure, low reputation = community conflict, low health = personal hardship). Make it consequential but survivable.

Return this exact JSON structure:
{
  "narrative": "2-3 paragraphs of immersive scene-setting",
  "situation": "1 paragraph describing the specific challenge or decision point",
  "choices": [
    { "id": "a", "label": "8-12 word choice label", "description": "1 sentence elaboration", "hint": "e.g. Prioritizes community or Protects finances" },
    { "id": "b", "label": "8-12 word choice label", "description": "1 sentence elaboration", "hint": "e.g. Takes a risk" },
    { "id": "c", "label": "8-12 word choice label", "description": "1 sentence elaboration", "hint": "e.g. Cautious approach" }
  ],
  "historicalNote": "1 sentence of genuine historical context"
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
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { statusCode: 200, headers: CORS, body: JSON.stringify(parsed) };
  } catch (error) {
    console.error('generate-situation error:', error);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'The simulation encountered an error. Please try again.' }),
    };
  }
};
