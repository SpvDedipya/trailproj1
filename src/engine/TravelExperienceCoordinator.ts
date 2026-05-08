import { Activity, useTripStore } from '../store/useTripStore';

export class TravelExperienceCoordinator {
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
        reasoning = "Heavy rain detected. Pivoting to indoor activities to maintain experience quality.";
        // Prioritize indoor activities in the sequence
        updatedItinerary = updatedItinerary.sort((a, b) => {
          if (a.isIndoor === b.isIndoor) return 0;
          return a.isIndoor ? -1 : 1;
        });
        break;

      case 'TRAFFIC':
        reasoning = "Traffic surge detected (+30 min delay). Re-optimizing route sequence to bypass bottlenecks.";
        // Simple mock of re-optimization (e.g., swapping two stops)
        if (updatedItinerary.length > 2) {
          const [first, second, ...rest] = updatedItinerary;
          updatedItinerary = [first, rest[0], second, ...rest.slice(1)];
        }
        break;

      case 'USER_DELAY':
        reasoning = `User check-in delayed by ${payload.minutes}m. Compressing transition times to protect hard constraints.`;
        // In a real app, this would recalculate timestamps
        break;
    }

    // Simulate AI reasoning time
    await new Promise(resolve => setTimeout(resolve, 1500));

    store.setItinerary(updatedItinerary);
    store.addLog(reasoning);
    store.setUpdating(false);
  }
}
