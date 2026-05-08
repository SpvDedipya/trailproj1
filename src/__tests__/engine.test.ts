import { describe, it, expect, vi } from 'vitest';
import { TravelExperienceCoordinator } from '../engine/TravelExperienceCoordinator';
import { useTripStore } from '../store/useTripStore';

const mockSetItinerary = vi.fn();
const mockAddLog = vi.fn();
const mockSetUpdating = vi.fn();

vi.mock('../store/useTripStore', () => ({
  useTripStore: {
    getState: vi.fn(() => ({
      itinerary: [
        { id: '1', title: 'Beach', isIndoor: false, coordinates: { lat: 10, lng: 10 } },
        { id: '2', title: 'Museum', isIndoor: true, coordinates: { lat: 1, lng: 1 } },
        { id: '3', title: 'Park', isIndoor: false, coordinates: { lat: 5, lng: 5 } },
      ],
      setItinerary: mockSetItinerary,
      addLog: mockAddLog,
      setUpdating: mockSetUpdating,
    })),
  },
}));

describe('TravelExperienceCoordinator', () => {
  it('RAIN trigger should prioritize indoor activities', async () => {
    await TravelExperienceCoordinator.evaluateAndPivot('RAIN', {});
    
    const callArgs = mockSetItinerary.mock.calls[0][0];
    expect(callArgs[0].isIndoor).toBe(true);
    expect(callArgs[0].title).toBe('Museum');
  });

  it('TRAFFIC trigger should re-order sequence to bypass bottlenecks', async () => {
    await TravelExperienceCoordinator.evaluateAndPivot('TRAFFIC', {});
    
    const callArgs = mockSetItinerary.mock.calls[1][0];
    expect(callArgs[1].title).toBe('Park');
  });

  it('Distance Matrix optimization should sort by distance', async () => {
    const activities = [
      { id: '1', coordinates: { lat: 10, lng: 10 } },
      { id: '2', coordinates: { lat: 1, lng: 1 } },
    ] as any;
    
    const optimized = await TravelExperienceCoordinator.calculateOptimalSequence(activities);
    expect(optimized[0].id).toBe('2'); // Closer to 0,0
  });
});
