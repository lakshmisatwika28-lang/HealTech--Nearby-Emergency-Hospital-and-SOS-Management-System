import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "./EmergencyMap.css";

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      reject(
        new Error(
          "Google Maps API key is not configured."
        )
      );
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => {
          if (window.google?.maps) {
            resolve(window.google.maps);
          } else {
            reject(
              new Error(
                "Google Maps failed to load."
              )
            );
          }
        },
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => {
          reject(
            new Error(
              "Google Maps script failed to load."
            )
          );
        },
        { once: true }
      );

      return;
    }

    const script =
      document.createElement("script");

    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;

    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(
          new Error(
            "Google Maps failed to initialize."
          )
        );
      }
    };

    script.onerror = () => {
      reject(
        new Error(
          "Unable to load Google Maps."
        )
      );
    };

    document.head.appendChild(script);
  });
};

const calculateDistance = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const earthRadius = 6371;

  const latDifference =
    ((lat2 - lat1) * Math.PI) / 180;

  const lngDifference =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(lngDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

const EmergencyMap = ({
  location,
  hospitals = [],
  selectedHospital,
  onHospitalSelect,
  ambulanceActive = false,
  onAmbulanceUpdate
}) => {
  const mapContainerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const userMarkerRef =
    useRef(null);

  const hospitalMarkersRef =
    useRef([]);

  const ambulanceOverlayRef =
    useRef(null);

  const ambulanceAnimationRef =
    useRef(null);

  /*
   * IMPORTANT:
   * Keep the latest callback in a ref.
   *
   * This prevents the ambulance animation
   * from restarting every time ETA/distance
   * updates the parent component.
   */

  const onAmbulanceUpdateRef =
    useRef(onAmbulanceUpdate);

  const [mapError, setMapError] =
    useState("");

  const [mapReady, setMapReady] =
    useState(false);

  /*
   * ================================
   * KEEP CALLBACK UPDATED
   * ================================
   */

  useEffect(() => {
    onAmbulanceUpdateRef.current =
      onAmbulanceUpdate;
  }, [onAmbulanceUpdate]);

  /*
   * ================================
   * INITIALIZE MAP
   * ================================
   */

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      try {
        if (!location) {
          return;
        }

        const googleMaps =
          await loadGoogleMaps();

        if (cancelled) {
          return;
        }

        if (!mapContainerRef.current) {
          return;
        }

        const userLat =
          Number(location.latitude);

        const userLng =
          Number(location.longitude);

        if (
          Number.isNaN(userLat) ||
          Number.isNaN(userLng)
        ) {
          throw new Error(
            "Invalid location coordinates."
          );
        }

        setMapError("");

        const map =
          new googleMaps.Map(
            mapContainerRef.current,
            {
              center: {
                lat: userLat,
                lng: userLng
              },

              zoom: 14,

              mapTypeControl: false,

              streetViewControl: false,

              fullscreenControl: true,

              zoomControl: true
            }
          );

        mapRef.current = map;

        /*
         * USER MARKER
         */

        const userMarker =
          new googleMaps.Marker({
            position: {
              lat: userLat,
              lng: userLng
            },

            map,

            title: "Your Location",

            icon: {
              path:
                googleMaps.SymbolPath.CIRCLE,

              scale: 10,

              fillColor: "#2563eb",

              fillOpacity: 1,

              strokeColor: "#ffffff",

              strokeWeight: 3
            },

            label: {
              text: "You",

              color: "#ffffff",

              fontWeight: "700"
            },

            zIndex: 100
          });

        userMarkerRef.current =
          userMarker;

        setMapReady(true);

      } catch (error) {
        console.error(
          "Google Maps initialization failed:",
          error
        );

        if (!cancelled) {
          setMapError(
            error.message ||
              "Unable to load Google Maps."
          );
        }
      }
    };

    initializeMap();

    return () => {
      cancelled = true;

      if (
        ambulanceAnimationRef.current
      ) {
        cancelAnimationFrame(
          ambulanceAnimationRef.current
        );

        ambulanceAnimationRef.current =
          null;
      }

      if (
        ambulanceOverlayRef.current
      ) {
        ambulanceOverlayRef.current.setMap(
          null
        );

        ambulanceOverlayRef.current =
          null;
      }

      if (
        userMarkerRef.current
      ) {
        userMarkerRef.current.setMap(
          null
        );

        userMarkerRef.current =
          null;
      }

      hospitalMarkersRef.current.forEach(
        (marker) => {
          marker.setMap(null);
        }
      );

      hospitalMarkersRef.current = [];

      mapRef.current = null;

      setMapReady(false);
    };

  }, [location]);

  /*
   * ================================
   * HOSPITAL MARKERS
   * ================================
   */

  useEffect(() => {
    if (
      !mapReady ||
      !mapRef.current
    ) {
      return;
    }

    if (!window.google?.maps) {
      return;
    }

    const googleMaps =
      window.google.maps;

    const map =
      mapRef.current;

    hospitalMarkersRef.current.forEach(
      (marker) => {
        marker.setMap(null);
      }
    );

    hospitalMarkersRef.current = [];

    hospitals.forEach(
      (hospital) => {
        const lat =
          hospital.geometry
            ?.location?.lat;

        const lng =
          hospital.geometry
            ?.location?.lng;

        if (
          lat === undefined ||
          lng === undefined
        ) {
          return;
        }

        const hospitalLat =
          Number(lat);

        const hospitalLng =
          Number(lng);

        if (
          Number.isNaN(
            hospitalLat
          ) ||
          Number.isNaN(
            hospitalLng
          )
        ) {
          return;
        }

        const marker =
          new googleMaps.Marker({
            position: {
              lat: hospitalLat,
              lng: hospitalLng
            },

            map,

            title:
              hospital.name ||
              "Hospital",

            zIndex: 50
          });

        marker.addListener(
          "click",
          () => {
            if (
              onHospitalSelect
            ) {
              onHospitalSelect(
                hospital
              );
            }
          }
        );

        hospitalMarkersRef.current.push(
          marker
        );
      }
    );

  }, [
    hospitals,
    onHospitalSelect,
    mapReady
  ]);

  /*
   * ================================
   * AMBULANCE ANIMATION
   * ================================
   */

  useEffect(() => {
    if (!ambulanceActive) {
      if (
        ambulanceAnimationRef.current
      ) {
        cancelAnimationFrame(
          ambulanceAnimationRef.current
        );

        ambulanceAnimationRef.current =
          null;
      }

      if (
        ambulanceOverlayRef.current
      ) {
        ambulanceOverlayRef.current.setMap(
          null
        );

        ambulanceOverlayRef.current =
          null;
      }

      return;
    }

    if (
      !mapReady ||
      !mapRef.current ||
      !location ||
      !selectedHospital
    ) {
      return;
    }

    if (!window.google?.maps) {
      return;
    }

    const googleMaps =
      window.google.maps;

    const map =
      mapRef.current;

    /*
     * USER
     */

    const userLat =
      Number(location.latitude);

    const userLng =
      Number(location.longitude);

    /*
     * HOSPITAL
     */

    const hospitalLat =
      Number(
        selectedHospital.geometry
          ?.location?.lat
      );

    const hospitalLng =
      Number(
        selectedHospital.geometry
          ?.location?.lng
      );

    if (
      Number.isNaN(userLat) ||
      Number.isNaN(userLng) ||
      Number.isNaN(hospitalLat) ||
      Number.isNaN(hospitalLng)
    ) {
      return;
    }

    /*
     * REMOVE PREVIOUS ANIMATION
     */

    if (
      ambulanceAnimationRef.current
    ) {
      cancelAnimationFrame(
        ambulanceAnimationRef.current
      );

      ambulanceAnimationRef.current =
        null;
    }

    if (
      ambulanceOverlayRef.current
    ) {
      ambulanceOverlayRef.current.setMap(
        null
      );

      ambulanceOverlayRef.current =
        null;
    }

    /*
     * START AT HOSPITAL
     */

    const startLat =
      hospitalLat;

    const startLng =
      hospitalLng;

    /*
     * TOTAL DISTANCE
     */

    const totalDistance =
      calculateDistance(
        startLat,
        startLng,
        userLat,
        userLng
      );

    /*
     * HTML AMBULANCE
     */

    class AmbulanceOverlay
      extends googleMaps.OverlayView {

      constructor(position) {
        super();

        this.position =
          position;

        this.div = null;
      }

      onAdd() {
        const div =
          document.createElement(
            "div"
          );

        div.textContent = "🚑";

        div.style.position =
          "absolute";

        div.style.width =
          "48px";

        div.style.height =
          "48px";

        div.style.display =
          "flex";

        div.style.alignItems =
          "center";

        div.style.justifyContent =
          "center";

        div.style.fontSize =
          "38px";

        div.style.lineHeight =
          "1";

        div.style.background =
          "transparent";

        div.style.border =
          "none";

        div.style.boxShadow =
          "none";

        div.style.zIndex =
          "999999";

        div.style.pointerEvents =
          "none";

        div.style.userSelect =
          "none";

        div.style.fontFamily =
          "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";

        this.div = div;

        const panes =
          this.getPanes();

        if (
          panes &&
          panes.floatPane
        ) {
          panes.floatPane.appendChild(
            div
          );
        }
      }

      draw() {
        if (!this.div) {
          return;
        }

        const projection =
          this.getProjection();

        if (!projection) {
          return;
        }

        const latLng =
          new googleMaps.LatLng(
            this.position.lat,
            this.position.lng
          );

        const point =
          projection.fromLatLngToDivPixel(
            latLng
          );

        if (!point) {
          return;
        }

        this.div.style.left =
          `${point.x - 24}px`;

        this.div.style.top =
          `${point.y - 24}px`;
      }

      onRemove() {
        if (this.div) {
          this.div.remove();

          this.div = null;
        }
      }

      setPosition(position) {
        this.position =
          position;

        this.draw();
      }
    }

    const ambulance =
      new AmbulanceOverlay({
        lat: startLat,
        lng: startLng
      });

    ambulanceOverlayRef.current =
      ambulance;

    ambulance.setMap(map);

    /*
     * ================================
     * 15 SECOND JOURNEY
     * ================================
     */

    const duration = 15000;

    /*
     * ================================
     * ANIMATION FUNCTION
     *
     * FIRST:
     * Hospital → Patient
     *
     * THEN:
     * Patient → Hospital
     * ================================
     */

    const animateJourney = (
      journeyStartLat,
      journeyStartLng,
      journeyEndLat,
      journeyEndLng,
      journeyType
    ) => {

      const journeyDistance =
        calculateDistance(
          journeyStartLat,
          journeyStartLng,
          journeyEndLat,
          journeyEndLng
        );

      const journeyStartTime =
        performance.now();

      const animate = (
        currentTime
      ) => {

        if (
          ambulanceOverlayRef.current !==
          ambulance
        ) {
          return;
        }

        const elapsed =
          currentTime -
          journeyStartTime;

        const progress =
          Math.min(
            elapsed / duration,
            1
          );

        /*
         * SMOOTH MOVEMENT
         */

        const easedProgress =
          progress < 0.5
            ? 2 *
              progress *
              progress
            : 1 -
              Math.pow(
                -2 * progress + 2,
                2
              ) /
                2;

        /*
         * CURRENT POSITION
         */

        const currentLat =
          journeyStartLat +
          (journeyEndLat -
            journeyStartLat) *
            easedProgress;

        const currentLng =
          journeyStartLng +
          (journeyEndLng -
            journeyStartLng) *
            easedProgress;

        /*
         * MOVE SAME AMBULANCE
         */

        ambulance.setPosition({
          lat: currentLat,
          lng: currentLng
        });

        /*
         * REMAINING DISTANCE
         */

        const remainingDistance =
          calculateDistance(
            currentLat,
            currentLng,
            journeyEndLat,
            journeyEndLng
          );

        /*
         * REMAINING ETA
         */

        const remainingSeconds =
          Math.max(
            0,
            Math.ceil(
              (duration *
                (1 - progress)) /
                1000
            )
          );

        /*
         * SEND ETA + DISTANCE
         */

        if (
          onAmbulanceUpdateRef.current
        ) {
          onAmbulanceUpdateRef.current({
            etaSeconds:
              remainingSeconds,

            distanceKm:
              remainingDistance,

            totalDistanceKm:
              journeyDistance,

            progress,

            journeyType
          });
        }

        /*
         * CONTINUE CURRENT JOURNEY
         */

        if (
          progress < 1
        ) {

          ambulanceAnimationRef.current =
            requestAnimationFrame(
              animate
            );

          return;
        }

        /*
         * CURRENT JOURNEY FINISHED
         */

        ambulanceAnimationRef.current =
          null;

        /*
         * ================================
         * HOSPITAL → PATIENT FINISHED
         * ================================
         */

        if (
          journeyType ===
          "TO_PATIENT"
        ) {

          /*
           * Make sure ambulance is
           * exactly at patient.
           */

          ambulance.setPosition({
            lat: userLat,
            lng: userLng
          });

          /*
           * Notify parent that ambulance
           * reached patient.
           */

          if (
            onAmbulanceUpdateRef.current
          ) {
            onAmbulanceUpdateRef.current({
              etaSeconds: 0,

              distanceKm: 0,

              totalDistanceKm:
                journeyDistance,

              progress: 1,

              journeyType:
                "PATIENT_REACHED"
            });
          }

          console.log(
            "Ambulance reached patient."
          );

          /*
           * ================================
           * START PATIENT → HOSPITAL
           * ================================
           *
           * Same ambulance.
           * No new marker.
           */

          setTimeout(() => {

            if (
              ambulanceOverlayRef.current !==
              ambulance
            ) {
              return;
            }

            animateJourney(
              userLat,
              userLng,
              hospitalLat,
              hospitalLng,
              "TO_HOSPITAL"
            );

          }, 1000);

          return;
        }

        /*
         * ================================
         * PATIENT → HOSPITAL FINISHED
         * ================================
         */

        if (
          journeyType ===
          "TO_HOSPITAL"
        ) {

          /*
           * Make sure ambulance is
           * exactly at hospital.
           */

          ambulance.setPosition({
            lat: hospitalLat,
            lng: hospitalLng
          });

          /*
           * FINAL UPDATE
           */

          if (
            onAmbulanceUpdateRef.current
          ) {
            onAmbulanceUpdateRef.current({
              etaSeconds: 0,

              distanceKm: 0,

              totalDistanceKm:
                journeyDistance,

              progress: 1,

              journeyType:
                "COMPLETED"
            });
          }

          console.log(
            "Patient reached hospital."
          );

          return;
        }
      };

      ambulanceAnimationRef.current =
        requestAnimationFrame(
          animate
        );
    };

    /*
     * ================================
     * START FIRST JOURNEY
     *
     * HOSPITAL → PATIENT
     *
     * THIS IS THE SAME JOURNEY
     * YOU ALREADY HAD.
     * ================================
     */

    animateJourney(
      startLat,
      startLng,
      userLat,
      userLng,
      "TO_PATIENT"
    );

    /*
     * CLEANUP
     */

    return () => {

      if (
        ambulanceAnimationRef.current
      ) {
        cancelAnimationFrame(
          ambulanceAnimationRef.current
        );

        ambulanceAnimationRef.current =
          null;
      }

      if (
        ambulanceOverlayRef.current ===
        ambulance
      ) {
        ambulance.setMap(null);

        ambulanceOverlayRef.current =
          null;
      }

    };

  }, [
    ambulanceActive,
    location,
    selectedHospital,
    mapReady
  ]);

  /*
   * ================================
   * NO LOCATION
   * ================================
   */

  if (!location) {
    return (
      <div className="emergency-map-container">

        <div className="emergency-map-error">
          Location is not available yet.
        </div>

      </div>
    );
  }

  /*
   * ================================
   * RENDER
   * ================================
   */

  return (
    <div className="emergency-map-container">

      {mapError ? (
        <div className="emergency-map-error">

          <div>

            <strong>
              Google Maps could not be
              loaded.
            </strong>

            <p>
              {mapError}
            </p>

            <small>
              Check your Google Maps
              JavaScript API configuration
              and API key.
            </small>

          </div>

        </div>
      ) : (
        <div
          ref={mapContainerRef}
          className="emergency-map"
        />
      )}

    </div>
  );
};

export default EmergencyMap;