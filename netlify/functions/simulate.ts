import { Handler } from '@netlify/functions';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are the narrative engine for an educational historical simulation set in Otonabee Township, Peterborough County, Ontario, Canada in 1867 — the year of Confederation.

HISTORICAL ACCURACY REQUIREMENTS:
- All content must be factually grounded in real Otonabee Township and Peterborough County history
- Real place names to use: Otonabee River, Rice Lake, Smith-Ennismore Road, Peterborough, Keene, Bridgenorth, Selwyn, Nassau Mills, Bensfort Bridge, 4th Line, 7th Concession
- Real historical context: Ontario Common Schools Act (1850), Municipal Corporations Act / Baldwin Act (1849), Dominion of Canada established July 1 1867, Grand Trunk Railway reached Peterborough in 1858, the timber trade along the Otonabee, the Orange Order presence in the township, mix of Irish Catholic and Protestant settlers in Ennismore and Smith townships, Anishinaabe (Mississauga Ojibwe) history along Rice Lake
- Seasonal accuracy: Upper Canadian farming calendar, period-accurate crops (wheat, oats, potatoes, hay), realistic weather events
- Economic accuracy: wheat approximately $1/bushel in 1867, barter economy alongside cash, credit extended by merchants

WRITING STYLE:
- Third person limited perspective following the player character
- Literary and immersive but accessible to Grade 7/8 students (approximately Grade 8 reading level)
- Period-appropriate vocabulary without being impenetrable
- No anachronisms under any circumstances
- Consequences must feel earned and reflect real 1860s rural Ontario logic
- Tensions should reflect real historical tensions: settler vs established families, Irish Catholic vs Protestant, emerging municipal politics, role of women, relationships with Indigenous neighbours

EDUCATIONAL INTEGRITY:
- Every situation and consequence must teach something true about this period
- Do not romanticize or sanitize — hardship, inequality, and social tension were real
- Do not sensationalize — this is a classroom tool
- Include one genuine historical fact per turn

CRITICAL: Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation. Raw JSON only.`;

function buildSituationPrompt(body: any): string {
  const { playerName, roleTitle, origin, season, resources, history } = body.gameState;
  const previousDecisions = history.length > 0
    ? history.map((h: any) => `${h.season}: ${h.choiceMade}`).join('; ')
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

function buildConsequencePrompt(body: any): string {
  const { playerName, roleTitle, season, resources } = body.gameState;
  const { choiceLabel, situationNarrative } = body;

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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { type } = body;

    if (!type || !['situation', 'consequence'].includes(type)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid type' }) };
    }

    const userPrompt = type === 'situation'
      ? buildSituationPrompt(body)
      : buildConsequencePrompt(body);

    const maxTokens = type === 'situation' ? 1200 : 1000;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (error) {
    console.error('Simulate function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'The simulation encountered an error. Please try again.' }),
    };
  }
};
