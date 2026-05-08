import { useState, useTransition } from 'react';
import { handleTravelForm } from './actions/travel';

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
      const result = await handleTravelForm(formData);
      setPlan(result);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Travel Experience Engine</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl" onSubmit={onSubmit}>
        <input
          className="rounded p-2 bg-gray-800 text-white"
          placeholder="Destination"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
        <input
          className="rounded p-2 bg-gray-800 text-white"
          placeholder="Budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          required
        />
        <input
          className="rounded p-2 bg-gray-800 text-white"
          placeholder="Weather (e.g., sunny, rainy)"
          value={weather}
          onChange={e => setWeather(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setRainMode(!rainMode)}
          className="flex items-center justify-center gap-2 rounded bg-blue-600 hover:bg-blue-500 p-2"
        >
          {rainMode ? 'Rain Mode: ON' : 'Rain Mode: OFF'}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="col-span-2 bg-green-600 hover:bg-green-500 rounded p-3"
        >
          {isPending ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>
      {plan && (
        <div className="mt-8 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Travel Plan</h2>
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
