# Otonabee Township: 1867
### A Historical Simulation for Ontario Classroom Use

An AI-driven narrative simulation set in Otonabee Township, Peterborough County, Ontario during the year of Confederation.

## Setup
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your Anthropic API key
4. Add `ANTHROPIC_API_KEY` to your Netlify environment variables
5. Run `npm run dev` for local development
6. Deploy to Netlify

## Classroom Use
- Select **Classroom Mode** on the title screen for projection-optimized layout
- Suggested use: 30–45 minutes for one full year arc (four seasons)
- Works best as a class discussion tool with teacher leading decisions, or as individual student play on devices
- Curriculum connections display on the Year End Summary screen in Classroom Mode

## Curriculum Alignment
- Ontario Grade 7 Social Studies: Heritage and Identity: Communities in Canada, 1780–1850
- Ontario Grade 8 History: Canada, 1850–1890: Confederation and Its Aftermath
- Historical Thinking Concepts: Cause and Consequence, Historical Perspective, Ethical Dimension

## Historical Sources
Content is grounded in the documented history of Otonabee Township and Peterborough County, Ontario. Real place names, economic conditions, and social structures reflect the 1867 period.

## Technical
Built with React 18 + Vite + TypeScript + Tailwind CSS. AI narrative generation powered by Anthropic Claude API via Netlify Functions.
