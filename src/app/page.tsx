"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  Car, 
  Clock, 
  MapPin, 
  Download, 
  RefreshCw, 
  AlertCircle,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { useTripStore, Activity } from '../store/useTripStore';
import { TravelExperienceCoordinator } from '../engine/TravelExperienceCoordinator';
import { handleTravelForm } from './actions/travel';
import { jsPDF } from 'jspdf';
import { ItinerarySkeleton } from '../components/Itinerary/Skeleton';


export default function OmniTraveDashboard() {
  const { 
    itinerary, 
    setItinerary, 
    isRainMode, 
    toggleRain, 
    isHeavyTraffic, 
    toggleTraffic,
    reasoningLog,
    isUpdating,
    setUpdating
  } = useTripStore();

  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');

  const generateInitialTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const result = await handleTravelForm(formData);
      // In a real app, we'd map the Gemini JSON to our Activity interface
      const mockActivities: Activity[] = result.activities.map((a: any, i: number) => ({
        id: `act-${i}`,
        time: a.time,
        title: a.description.split(' - ')[0],
        description: a.description,
        location: destination,
        isIndoor: i % 2 === 0, // Mocked alternation
        coordinates: { lat: 0, lng: 0 }
      }));
      setItinerary(mockActivities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`OmniTrave Itinerary: ${destination}`, 20, 20);
    doc.setFontSize(12);
    itinerary.forEach((act, i) => {
      doc.text(`${act.time}: ${act.title}`, 20, 40 + (i * 10));
    });
    doc.save('itinerary.pdf');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">OMNITRAVE</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm transition"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Simulation Center */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Trip Configuration</h2>
            <form onSubmit={generateInitialTrip} className="space-y-4">
              <input 
                name="destination"
                placeholder="Where to?" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-indigo-500 outline-none transition"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input name="budget" placeholder="Budget" className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 outline-none" required />
                <input name="weather" placeholder="Weather" className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 outline-none" required />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/10"
              >
                {loading ? 'Consulting RAG...' : 'Initialize Engine'}
              </button>
            </form>
          </section>

          {/* Simulation Center */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <RefreshCw className="w-12 h-12 rotate-12" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Simulation Center
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => { toggleRain(); TravelExperienceCoordinator.evaluateAndPivot('RAIN', {}); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${isRainMode ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex items-center gap-3">
                  <CloudRain className="w-5 h-5" />
                  <span>Toggle Heavy Rain</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${isRainMode ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-700'}`} />
              </button>
              
              <button 
                onClick={() => { toggleTraffic(); TravelExperienceCoordinator.evaluateAndPivot('TRAFFIC', {}); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${isHeavyTraffic ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5" />
                  <span>Traffic Surge (+30m)</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${isHeavyTraffic ? 'bg-amber-500 animate-pulse' : 'bg-zinc-700'}`} />
              </button>
            </div>
          </section>

          {/* Reasoning Log */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-[300px] flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Engine Reasoning</h2>
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[12px] text-zinc-500">
              <AnimatePresence initial={false}>
                {reasoningLog.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className="text-indigo-500">❯</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right Column: Itinerary View */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dynamic Itinerary</h2>
            {isUpdating && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-indigo-400 text-sm"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                Pivoting Logic...
              </motion.div>
            )}
          </div>

          <div className="space-y-4 relative">
            {loading ? (
              <ItinerarySkeleton />
            ) : itinerary.length > 0 ? (
              itinerary.map((activity, idx) => (
                <motion.div 
                  layout
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-zinc-900/40 border ${activity.isIndoor && isRainMode ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-zinc-800'} rounded-2xl p-6 hover:border-zinc-600 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <Clock className="w-3 h-3" /> {activity.time}
                        {activity.isIndoor && (
                          <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] uppercase">Indoor Pivot Available</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition">{activity.title}</h3>
                      <p className="text-sm text-zinc-400 max-w-xl">{activity.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-zinc-400 transition" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-[500px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600 gap-4">
                <div className="p-4 bg-zinc-900 rounded-full">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <p>Initialize the engine to generate your first self-healing trip.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}