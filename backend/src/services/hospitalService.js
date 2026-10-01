import axios from "axios";
import env from "../config/env.js";

const normalizePlace = (place) => ({
  id: place.id,
  name: place.displayName?.text || place.name || "Hospital",
  formatted_address: place.formattedAddress || place.formatted_address || "Address unavailable",
  vicinity: place.formattedAddress || place.vicinity || "Address unavailable",
  geometry: {
    location: {
      lat: place.location?.latitude ?? place.geometry?.location?.lat,
      lng: place.location?.longitude ?? place.geometry?.location?.lng
    }
  },
  rating: place.rating ?? null,
  googleMapsUri: place.googleMapsUri ?? place.googleMapsUri,
  phone: place.nationalPhoneNumber || place.internationalPhoneNumber || place.phone || null,
  website: place.websiteUri || place.website || null
});

const requireKey = () => {
  if (!env.googleMapsApiKey) throw new Error("Google Maps API key is not configured.");
};

const hospitalService = {
  async searchHospitals(query, latitude, longitude) {
    requireKey();
    if (!query?.trim()) return [];

    const body = {
      textQuery: query.trim(),
      maxResultCount: 20
    };

    if (latitude !== undefined && longitude !== undefined) {
      body.locationBias = {
        circle: {
          center: { latitude: Number(latitude), longitude: Number(longitude) },
          radius: 10000
        }
      };
    }

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.googleMapsApiKey,
          "X-Goog-FieldMask": [
            "places.id","places.displayName","places.formattedAddress",
            "places.location","places.rating","places.googleMapsUri",
            "places.nationalPhoneNumber","places.internationalPhoneNumber",
            "places.websiteUri"
          ].join(",")
        }
      }
    );

    return (response.data?.places || []).map(normalizePlace);
  },

  async nearbyHospitals(latitude, longitude, radius = 5000) {
    requireKey();
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["hospital"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: Number(latitude), longitude: Number(longitude) },
            radius: Number(radius)
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.googleMapsApiKey,
          "X-Goog-FieldMask": [
            "places.id","places.displayName","places.formattedAddress",
            "places.location","places.rating","places.googleMapsUri",
            "places.nationalPhoneNumber","places.internationalPhoneNumber",
            "places.websiteUri"
          ].join(",")
        }
      }
    );
    return (response.data?.places || []).map(normalizePlace);
  },

  async getHospitalDetails(placeId) {
    requireKey();
    if (!placeId) throw new Error("Hospital place ID is required.");

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": env.googleMapsApiKey,
          "X-Goog-FieldMask": [
            "id","displayName","formattedAddress","location","rating",
            "googleMapsUri","nationalPhoneNumber","internationalPhoneNumber",
            "websiteUri","regularOpeningHours"
          ].join(",")
        }
      }
    );

    return {
      ...normalizePlace(response.data),
      openingHours: response.data?.regularOpeningHours || null
    };
  },

  async getDirections(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
    const apiKey = env.googleMapsApiKey;
    if (!apiKey) return null;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${originLatitude},${originLongitude}`,
          destination: `${destinationLatitude},${destinationLongitude}`,
          mode: "driving",
          key: apiKey
        }
      }
    );

    const route = response.data?.routes?.[0];
    const leg = route?.legs?.[0];

    return {
      distanceText: leg?.distance?.text || null,
      distanceMeters: leg?.distance?.value || null,
      durationText: leg?.duration?.text || null,
      durationSeconds: leg?.duration?.value || null,
      polyline: route?.overview_polyline?.points || null
    };
  }
};

export default hospitalService;
