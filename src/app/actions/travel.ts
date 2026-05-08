"use server";
import { generateTravelPlan } from '@/lib/gemini';
import { z } from 'zod';

const TravelSchema = z.object({
  destination: z.string().min(2).max(100),
  budget: z.string().min(1),
  weather: z.string().optional(),
  rainMode: z.boolean().default(false),
});

export async function handleTravelForm(formData: FormData) {
  const rawData = {
    destination: formData.get('destination')?.toString(),
    budget: formData.get('budget')?.toString(),
    weather: formData.get('weather')?.toString(),
    rainMode: formData.get('rainMode')?.toString() === 'true',
  };

  const validated = TravelSchema.parse(rawData);
  
  // Call the Gemini helper with validated data
  const plan = await generateTravelPlan(
    validated.destination, 
    validated.budget, 
    validated.weather || 'unknown', 
    validated.rainMode
  );
  return plan;
}
