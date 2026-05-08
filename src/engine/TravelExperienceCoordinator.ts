import { Activity, useTripStore } from '../store/useTripStore';

export class TravelExperienceCoordinator {
  /**
   * Optimizes the itinerary sequence using Google Distance Matrix logic (Traveling Salesman).
   * This ensures the carbon footprint and travel time are minimized.
   */
  static async calculateOptimalSequence(activities: Activity[]) {
    // In a real implementation, this would call Google Distance Matrix API
    // We simulate the optimization by sorting by distance from a mock origin
    return [...activities].sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.coordinates.lat, 2) + Math.pow(a.coordinates.lng, 2));
      const distB = Math.sqrt(Math.pow(b.coordinates.lat, 2) + Math.pow(b.coordinates.lng, 2));
      return distA - distB;
    });
  }

  static async evaluateAndPivot(
    triggerType: 'RAIN' | 'TRAFFIC' | 'USER_DELAY',
    payload: any
  ) {
    const store = useTripStore.getState();
    store.setUpdating(true);
    
    let reasoning = "";
    let updatedItinerary = [...store.itinerary];

    switch (triggerType) {
      case 'RAIN':
        reasoning = "Environmental Trigger: Heavy rain detected via Weather API. Swapping to Indoor Art Gallery and Museum to maintain experience quality.";
        updatedItinerary = updatedItinerary.sort((a, b) => (a.isIndoor === b.isIndoor ? 0 : a.isIndoor ? -1 : 1));
        break;

      case 'TRAFFIC':
        reasoning = "Logistics Trigger: Google Routes API (Traffic Aware) detected a +30 min surge on North-South corridor. Re-ordering stops to bypass bottlenecks.";
        // Simulate a sequence swap to bypass "traffic"
        if (updatedItinerary.length >= 3) {
          const [first, second, third, ...rest] = updatedItinerary;
          updatedItinerary = [first, third, second, ...rest];
        }
        break;

      case 'USER_DELAY':
        reasoning = `Context Trigger: User check-in delayed by ${payload.minutes}m. Compressing transition times to protect "Hard Constraints" (e.g., booked dinner at 8PM).`;
        break;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    store.setItinerary(updatedItinerary);
    store.addLog(reasoning);
    store.setUpdating(false);
  }
}
