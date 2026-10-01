import axios from "axios";
import env from "../../config/env.js";

const placesService = {
  async findNearbyHospitals(latitude, longitude) {
    if (!env.googleMapsApiKey) {
      throw new Error(
        "Google Maps API key is not configured."
      );
    }

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["hospital"],

        maxResultCount: 10,

        locationRestriction: {
          circle: {
            center: {
              latitude: Number(latitude),
              longitude: Number(longitude)
            },

            radius: 5000
          }
        }
      },

      {
        headers: {
          "Content-Type":
            "application/json",

          "X-Goog-Api-Key":
            env.googleMapsApiKey,

          "X-Goog-FieldMask":
            [
              "places.id",
              "places.displayName",
              "places.formattedAddress",
              "places.location",
              "places.rating",
              "places.googleMapsUri",
              "places.nationalPhoneNumber",
              "places.internationalPhoneNumber",
              "places.websiteUri"
            ].join(",")
        }
      }
    );

    const places =
      response.data?.places || [];

    return places.map((place) => ({
      id: place.id,

      name:
        place.displayName?.text ||
        "Hospital",

      formatted_address:
        place.formattedAddress ||
        "Address unavailable",

      vicinity:
        place.formattedAddress ||
        "Address unavailable",

      geometry: {
        location: {
          lat:
            place.location?.latitude,

          lng:
            place.location?.longitude
        }
      },

      rating:
        place.rating,

      googleMapsUri:
        place.googleMapsUri,

      phone:
        place.nationalPhoneNumber ||
        place.internationalPhoneNumber ||
        null,

      website:
        place.websiteUri ||
        null
    }));
  },

  async getHospitalDetails(placeId) {
    if (!env.googleMapsApiKey) {
      throw new Error(
        "Google Maps API key is not configured."
      );
    }

    if (!placeId) {
      throw new Error(
        "Hospital place ID is required."
      );
    }

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(
        placeId
      )}`,
      {
        headers: {
          "X-Goog-Api-Key":
            env.googleMapsApiKey,

          "X-Goog-FieldMask":
            [
              "id",
              "displayName",
              "formattedAddress",
              "location",
              "rating",
              "googleMapsUri",
              "nationalPhoneNumber",
              "internationalPhoneNumber",
              "websiteUri",
              "regularOpeningHours"
            ].join(",")
        }
      }
    );

    const place = response.data;

    return {
      id: place.id,

      name:
        place.displayName?.text ||
        "Hospital",

      formatted_address:
        place.formattedAddress ||
        "Address unavailable",

      geometry: {
        location: {
          lat:
            place.location?.latitude,

          lng:
            place.location?.longitude
        }
      },

      rating:
        place.rating,

      googleMapsUri:
        place.googleMapsUri,

      phone:
        place.nationalPhoneNumber ||
        place.internationalPhoneNumber ||
        null,

      website:
        place.websiteUri ||
        null,

      openingHours:
        place.regularOpeningHours || null
    };
  }
};

export default placesService;