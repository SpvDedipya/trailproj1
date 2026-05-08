"use server";
import { generateTravelPlan } from '@/lib/gemini';


export async function handleTravelForm(formData: FormData) {
  console.log('DEBUG: API Key present?', !!process.env.GOOGLE_AI_STUDIO_API_KEY);

  const destination = formData.get('destination')?.toString() ?? '';
  const budget = formData.get('budget')?.toString() ?? '';
  const weather = formData.get('weather')?.toString() ?? '';
  const rainMode = formData.get('rainMode')?.toString() === 'true';

  // Call the Gemini helper (server-side, uses env variable)
  const plan = await generateTravelPlan(destination, budget, weather, rainMode);
  return plan; // JSON will be returned to the client
}
