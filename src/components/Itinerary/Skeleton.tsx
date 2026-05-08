import React from 'react';

export const ItinerarySkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-5 w-1/3 bg-zinc-800 rounded" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded" />
            </div>
            <div className="h-5 w-5 bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
