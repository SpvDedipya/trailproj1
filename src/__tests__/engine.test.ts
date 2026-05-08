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

  it('TRAFFIC trigger should re-order sequence and show traffic reasoning', async () => {
    const store = useTripStore.getState();
    await TravelExperienceCoordinator.evaluateAndPivot('TRAFFIC', {});
    
    const callArgs = mockSetItinerary.mock.calls[1][0];
    expect(callArgs[1].title).toBe('Park');
    
    const logArgs = mockAddLog.mock.calls[1][0];
    expect(logArgs).toContain('Logistics Trigger');
    expect(logArgs).toContain('TRAFFIC_AWARE');
  });

  it('USER_DELAY should protect Hard Constraints (Flight Departure)', async () => {
    await TravelExperienceCoordinator.evaluateAndPivot('USER_DELAY', { minutes: 45 });
    const logArgs = mockAddLog.mock.calls[2][0];
    expect(logArgs).toContain('protect "Hard Constraints"');
  });

  it('Distance Matrix optimization should solve the TSP problem logic', async () => {
    const activities = [
      { id: '1', title: 'Far Spot', coordinates: { lat: 10, lng: 10 } },
      { id: '2', title: 'Near Spot', coordinates: { lat: 1, lng: 1 } },
    ] as any;
    
    const optimized = await TravelExperienceCoordinator.calculateOptimalSequence(activities);
    expect(optimized[0].title).toBe('Near Spot');
  });
});
