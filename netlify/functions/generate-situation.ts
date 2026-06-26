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
- Real place names: Otonabee River, Rice Lake, Smith-Ennismore Road, Peterborough, Keene, Bridgenorth, Selwyn, Nassau Mills, Bensfort Bridge, 4th Line, 7th Concession
- Real context: Ontario Common Schools Act (1850), Baldwin Act (1849), Confederation July 1 1867, Grand Trunk Railway reached Peterborough 1858, the timber trade along the Otonabee, Orange Order presence, Irish Catholic and Protestant settler tensions, Anishinaabe (Mississauga Ojibwe) history along Rice Lake
- Seasonal accuracy: Upper Canadian farming calendar, period-accurate crops (wheat, oats, potatoes, hay), realistic weather events
- Economic accuracy: wheat approximately $1/bushel in 1867, barter economy alongside cash

WRITING STYLE:
- Third person limited perspective following the player character
- Literary and immersive but accessible to Grade 7/8 students
- Period-appropriate vocabulary without being impenetrable
- No anachronisms under any circumstances
- Tensions should reflect real historical tensions: settler vs established families, Irish Catholic vs Protestant, emerging municipal politics, role of women, relationships with Indigenous neighbours

EDUCATIONAL INTEGRITY:
- Every situation must teach something true about this period
- Do not romanticize or sanitize — hardship, inequality, and social tension were real
- Do not sensationalize — this is a classroom tool
- Include one genuine historical fact

CRITICAL: Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation. Raw JSON only.`;

exports.handler = async function (event: { httpMethod: string; body: string | null }) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { roleTitle, playerName, playerSurname, origin, season, resources, history, characters } = body;

    const fullName = playerSurname ? `${playerName} ${playerSurname}` : playerName;

    const characterEntries = characters && Object.keys(characters).length > 0
      ? Object.keys(characters).length
      : 0;

    const characterBlock = characterEntries > 0
      ? `\n\nESTABLISHED CHARACTERS: The following characters have already appeared in this story. Use their exact names and ages — do not change or contradict them: ${JSON.stringify(characters)}`
      : '';

    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\nCHARACTER NAME: The player character's name is ${fullName}. Use this exact name every time you refer to the character. Do not invent, alter, or substitute any part of this name.${characterBlock}`;

    const previousDecisions = history?.length > 0
      ? history.map((h: { season: string; choiceMade: string }) => `${h.season}: ${h.choiceMade}`).join('; ')
      : 'None — this is the first season';

    const userPrompt = `Generate a seasonal decision scenario for this player:

Name: ${fullName}
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
  "historicalNote": "1 sentence of genuine historical context",
  "newCharacters": {
    "Full Name": { "age": integer, "role": "brief role description e.g. neighbouring farmer" }
  }
}

Only include characters you actually introduce by name in the narrative. If no named characters appear, return "newCharacters": {}.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(parsed) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('generate-situation error:', message);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    };
  }
};
