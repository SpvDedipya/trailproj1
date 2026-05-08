import { GoogleGenerativeAI } from '@google/generative-ai';

type TravelPlan = {
  activities: { time: string; description: string }[];
};

export async function generateTravelPlan(
  destination: string,
  budget: string,
  weather: string,
  rainMode: boolean = false
): Promise<TravelPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a travel planner. Create a JSON travel plan for a trip with the following details:
Destination: ${destination}
Budget: ${budget}
Weather: ${weather}
${rainMode ? 'User requested rain mode: prioritize indoor activities.' : ''}
Provide a JSON object with an "activities" array. Each activity should have a "time" and a "description". Keep the plan concise and suitable for the given budget and weather.`;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    // Attempt to parse JSON from the response.
    const parsed = JSON.parse(text);
    return parsed as TravelPlan;
  } catch (e) {
    // Fallback static example if the API fails.
    return {
      activities: [
        { time: 'Day 1', description: `Explore ${destination} city center.` },
        { time: 'Day 2', description: `Visit a museum (indoor).` },
        { time: 'Day 3', description: `Relax at a local café.` },
      ],
    };
  }
}
