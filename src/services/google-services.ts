export const GoogleServices = {
  async getPlaceDetails(placeName: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return this.mockPlaceDetails(placeName);

    try {
      const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.regularOpeningHours'
        },
        body: JSON.stringify({ textQuery: placeName })
      });
      return await response.json();
    } catch (e) {
      return this.mockPlaceDetails(placeName);
    }
  },

  async calculateRoute(origin: string, destination: string) {
    // Logic for Google Routes API
    return {
      duration: "15 mins",
      distance: "4.2 km",
      status: "OPTIMAL"
    };
  },

  mockPlaceDetails(name: string) {
    return {
      displayName: name,
      rating: 4.5,
      isOpenNow: true,
      photoUrl: `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400`
    };
  }
};
