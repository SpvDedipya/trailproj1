export class GoogleMapsService {
  private static API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  /**
   * Google Places API (New): Semantic Search
   * Fetches ratings, photos, and semantic tags for travel spots.
   */
  static async searchPlace(query: string) {
    if (!this.API_KEY) return null;
    
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.reviews,places.googleMapsUri'
        },
        body: JSON.stringify({ textQuery: query })
      });
      return await response.json();
    } catch (e) {
      console.error("Places API Error", e);
      return null;
    }
  }

  /**
   * Google Routes API: Traffic-Aware Routing
   * Used for the "Self-Healing" pivot logic when traffic is detected.
   */
  static async getTrafficAwareRoute(origin: string, destination: string) {
    if (!this.API_KEY) return null;

    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.API_KEY,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline'
        },
        body: JSON.stringify({
          origin: { address: origin },
          destination: { address: destination },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          departureTime: new Date().toISOString(),
          computeAlternativeRoutes: false,
        })
      });
      return await response.json();
    } catch (e) {
      console.error("Routes API Error", e);
      return null;
    }
  }
}
