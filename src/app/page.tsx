"use client";
import { useState, useTransition } from 'react';

// --- IMPORTANT: Define or Import your logic ---
// If you have this in a separate file, uncomment the line below:
// import { handleTravelForm } from './actions/travel'; 

// Placeholder function in case your action isn't imported yet
async function handleTravelForm(formData: FormData) {
  // This is where your Gemini AI logic usually lives
  // For now, it returns a mock object so the UI doesn't crash
  return {
    destination: formData.get('destination'),
    status: "Success",
    message: "AI Plan generated successfully!"
  };
}

export default function Page() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [weather, setWeather] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [rainMode, setRainMode] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append('destination', destination);
      formData.append('budget', budget);
      formData.append('weather', weather);
      formData.append('rainMode', String(rainMode));

      try {
        const result = await handleTravelForm(formData);
        setPlan(result);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Travel Experience Engine</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl" onSubmit={onSubmit}>
        <input
          className="rounded p-2 bg-gray-800 text-white border border-gray-700"
          placeholder="Destination"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
        <input
          className="rounded p-2 bg-gray-800 text-white border border-gray-700"
          placeholder="Budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          required
        />
        <input
          className="rounded p-2 bg-gray-800 text-white border border-gray-700"
          placeholder="Weather (e.g., sunny, rainy)"
          value={weather}
          onChange={e => setWeather(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setRainMode(!rainMode)}
          className={`flex items-center justify-center gap-2 rounded p-2 transition ${rainMode ? 'bg-blue-600' : 'bg-gray-700'
            }`}
        >
          {rainMode ? 'Rain Mode: ON' : 'Rain Mode: OFF'}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="col-span-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded p-3 font-bold transition"
        >
          {isPending ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {plan && (
        <div className="mt-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Travel Plan Created!</h2>
          <pre className="bg-black/50 p-6 rounded-lg border border-green-500/30 overflow-x-auto whitespace-pre-wrap font-mono text-sm">
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}