import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Emergency.css";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import EmergencyMap from "../../components/EmergencyMap/EmergencyMap";
import EmergencyHospitalCard from "../../components/EmergencyHospitalCard/EmergencyHospitalCard";
import EmergencyStatus from "../../components/EmergencyStatus/EmergencyStatus";
import SOSButton from "../../components/SOSButton/SOSButton";

import locationService from "../../services/locationService";
import emergencyService from "../../services/emergencyService";
import ambulanceService from "../../services/ambulanceService";
import emergencyTripService from "../../services/emergencyTripService";

function Emergency() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [emergencyMode, setEmergencyMode] =
    useState(null);

  const [location, setLocation] =
    useState(null);

  const [hospitals, setHospitals] =
    useState([]);

  const [selectedHospital, setSelectedHospital] =
    useState(null);

  const [status, setStatus] =
    useState("Ready");

  const [loading, setLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [ambulanceStatus, setAmbulanceStatus] =
    useState("Not started");

  const [emergency, setEmergency] =
    useState(null);

  const [emergencyTrip, setEmergencyTrip] =
    useState(null);

  /* --------------------------------
     ETA AND DISTANCE
  -------------------------------- */

  const [ambulanceETA, setAmbulanceETA] =
    useState(null);

  const [ambulanceDistance, setAmbulanceDistance] =
    useState(null);


  /* --------------------------------
     GET USER LOCATION
  -------------------------------- */

  const loadLocation = async () => {

    try {

      setLocationError("");

      const currentLocation =
        await locationService.getCurrentLocation();

      setLocation(currentLocation);

      return currentLocation;

    } catch (error) {

      console.error(error);

      setLocationError(
        "Unable to access your location. Please enable location services."
      );

      return null;
    }
  };


  /* --------------------------------
     LOAD NEARBY HOSPITALS
  -------------------------------- */

  const loadHospitals = async (
    currentLocation
  ) => {

    if (!currentLocation) {
      return [];
    }

    try {

      const response =
        await emergencyService.findNearbyHospitals(
          currentLocation.latitude,
          currentLocation.longitude
        );

      const results =
        response?.data || [];

      setHospitals(results);

      return results;

    } catch (error) {

      console.error(
        "Failed to load nearby hospitals:",
        error
      );

      setHospitals([]);

      return [];
    }
  };


  /* --------------------------------
     PRE-PLANNED MODE
  -------------------------------- */

  const handlePrePlannedMode =
    async () => {

      try {

        setEmergencyMode(
          "PRE_PLANNED"
        );

        setStatus(
          "Getting your location..."
        );

        setSelectedHospital(null);

        setHospitals([]);

        setEmergency(null);

        setEmergencyTrip(null);

        setAmbulanceStatus(
          "Not started"
        );

        setAmbulanceETA(null);

        setAmbulanceDistance(null);

        const currentLocation =
          await loadLocation();

        if (!currentLocation) {

          setStatus(
            "Location unavailable"
          );

          return;
        }

        setStatus(
          "Finding nearby hospitals..."
        );

        await loadHospitals(
          currentLocation
        );

        setStatus("Ready");

      } catch (error) {

        console.error(error);

        setStatus(
          "Unable to load nearby hospitals"
        );
      }
    };


  /* --------------------------------
     UNPLANNED MODE
  -------------------------------- */

  const handleUnplannedMode = () => {

    setEmergencyMode(
      "UNPLANNED"
    );

    setStatus(
      "Ready for emergency"
    );

    setLocation(null);

    setHospitals([]);

    setSelectedHospital(null);

    setEmergency(null);

    setEmergencyTrip(null);

    setAmbulanceStatus(
      "Not started"
    );

    setAmbulanceETA(null);

    setAmbulanceDistance(null);

    setLocationError("");
  };


  /* --------------------------------
     SELECT BEST HOSPITAL
  -------------------------------- */

  const selectBestHospital = (
    hospitalList,
    currentLocation
  ) => {

    if (
      !hospitalList ||
      hospitalList.length === 0
    ) {
      return null;
    }

    const userLat =
      Number(
        currentLocation.latitude
      );

    const userLng =
      Number(
        currentLocation.longitude
      );


    const calculateDistance = (
      hospital
    ) => {

      const lat =
        Number(
          hospital.geometry
            ?.location?.lat
        );

      const lng =
        Number(
          hospital.geometry
            ?.location?.lng
        );

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng)
      ) {
        return Infinity;
      }

      const earthRadius = 6371;

      const latDifference =
        ((lat - userLat) *
          Math.PI) /
        180;

      const lngDifference =
        ((lng - userLng) *
          Math.PI) /
        180;

      const a =
        Math.sin(
          latDifference / 2
        ) ** 2 +

        Math.cos(
          (userLat * Math.PI) / 180
        ) *

        Math.cos(
          (lat * Math.PI) / 180
        ) *

        Math.sin(
          lngDifference / 2
        ) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return (
        earthRadius * c
      );
    };


    const rankedHospitals =
      hospitalList

        .map((hospital) => ({

          hospital,

          distance:
            calculateDistance(
              hospital
            ),

          rating:
            Number(
              hospital.rating
            ) || 0

        }))

        .filter(
          (item) =>
            item.distance !==
            Infinity
        )

        .sort((a, b) => {

          const scoreA =
            a.rating * 2 -
            a.distance;

          const scoreB =
            b.rating * 2 -
            b.distance;

          return (
            scoreB - scoreA
          );
        });


    return (
      rankedHospitals[0]
        ?.hospital || null
    );
  };


  /* --------------------------------
     SOS
  -------------------------------- */

  const handleSOS = async () => {

    try {

      setLoading(true);

      setStatus(
        "Capturing your location..."
      );


      let currentLocation =
        location;


      if (!currentLocation) {

        currentLocation =
          await loadLocation();
      }


      if (!currentLocation) {

        setStatus(
          "Location unavailable"
        );

        return;
      }


      setStatus(
        "Finding emergency hospitals..."
      );


      const hospitalList =
        await loadHospitals(
          currentLocation
        );


      if (
        hospitalList.length === 0
      ) {

        setStatus(
          "No nearby hospitals found"
        );

        return;
      }


      const bestHospital =
        selectBestHospital(
          hospitalList,
          currentLocation
        );


      if (!bestHospital) {

        setStatus(
          "Unable to select a hospital"
        );

        return;
      }


      setSelectedHospital(
        bestHospital
      );


      /* --------------------------------
         CREATE EMERGENCY
      -------------------------------- */

      setStatus(
        "Activating Emergency..."
      );


      const response =
        await emergencyService.createEmergency(
          currentLocation.latitude,
          currentLocation.longitude,
          "Medical Emergency"
        );


      if (!response?.success) {

        setStatus(
          "Emergency activation failed"
        );

        return;
      }


      setEmergency(
        response.data
      );


      /* --------------------------------
         START AMBULANCE
      -------------------------------- */

      setStatus(
        "Starting ambulance..."
      );

      setAmbulanceStatus(
        "Starting ambulance..."
      );


      const now =
        new Date();


      const emergencyDate =
        now
          .toISOString()
          .split("T")[0];


      const emergencyStartTime =
        now
          .toTimeString()
          .split(" ")[0];


      const hospitalLatitude =
        Number(
          bestHospital.geometry
            ?.location?.lat
        );


      const hospitalLongitude =
        Number(
          bestHospital.geometry
            ?.location?.lng
        );


      if (
        Number.isNaN(
          hospitalLatitude
        ) ||
        Number.isNaN(
          hospitalLongitude
        )
      ) {

        throw new Error(
          "Hospital location is unavailable."
        );
      }


      const hospitalName =
        bestHospital.name ||
        "Selected Hospital";


      const hospitalAddress =
        bestHospital.formatted_address ||
        bestHospital.vicinity ||
        "";


      const hospitalRating =
        Number(
          bestHospital.rating
        ) || null;


      /* --------------------------------
         CREATE EMERGENCY TRIP
      -------------------------------- */

      const tripResponse =
        await emergencyTripService.createTrip(
          {

            emergencyRequestId:
              response.data.id,

            emergencyDate,

            emergencyStartTime,

            patientLatitude:
              currentLocation.latitude,

            patientLongitude:
              currentLocation.longitude,

            hospitalName,

            hospitalAddress,

            hospitalLatitude,

            hospitalLongitude,

            hospitalRating,

            ambulanceStartTime:
              emergencyStartTime

          }
        );


      if (
        !tripResponse?.success ||
        !tripResponse?.data
      ) {

        throw new Error(
          "Failed to start emergency ambulance."
        );
      }


      setEmergencyTrip(
        tripResponse.data
      );


      setAmbulanceStatus(
        "Ambulance on the way"
      );


      setStatus(
        "Ambulance is on the way"
      );

    } catch (error) {

      console.error(
        "SOS failed:",
        error
      );


      setStatus(
        error.response?.data?.message ||
        error.message ||
        "Emergency activation failed"
      );


      setAmbulanceStatus(
        "Ambulance could not start"
      );

    } finally {

      setLoading(false);
    }
  };


  /* --------------------------------
     AMBULANCE POSITION UPDATE

     EmergencyMap sends:

     TO_PATIENT
     ARRIVED_PATIENT
     GOING_TO_HOSPITAL
     REACHED_HOSPITAL
  -------------------------------- */

  const handleAmbulanceUpdate = ({
    etaSeconds,
    distanceKm,
    totalDistanceKm,
    progress,
    stage
  }) => {

    setAmbulanceETA(
      etaSeconds
    );

    setAmbulanceDistance(
      distanceKm
    );


    if (
      stage ===
      "TO_PATIENT"
    ) {

      setAmbulanceStatus(
        "Ambulance on the way"
      );

      setStatus(
        "Ambulance is on the way"
      );

    }


    if (
      stage ===
      "ARRIVED_PATIENT"
    ) {

      setAmbulanceStatus(
        "Ambulance arrived to patient"
      );

      setStatus(
        "Ambulance arrived to patient"
      );

    }


    if (
      stage ===
      "GOING_TO_HOSPITAL"
    ) {

      setAmbulanceStatus(
        "Going to hospital"
      );

      setStatus(
        "Going to hospital"
      );

    }


    if (
      stage ===
      "REACHED_HOSPITAL"
    ) {

      setAmbulanceStatus(
        "Reached hospital"
      );

      setStatus(
        "Reached hospital"
      );

    }
  };


  /* --------------------------------
     PRE-PLANNED AMBULANCE
  -------------------------------- */

  const handleAmbulanceRequest =
    async () => {

      try {

        if (!location) {

          setStatus(
            "Location required"
          );

          return;
        }


        if (!selectedHospital) {

          setStatus(
            "Please select a hospital first"
          );

          return;
        }


        setAmbulanceStatus(
          "Requesting ambulance..."
        );


        const response =
          await ambulanceService.createBooking(
            {

              patientName:
                "Emergency Patient",

              phone:
                "0000000000",

              pickupLatitude:
                location.latitude,

              pickupLongitude:
                location.longitude,

              destination:
                selectedHospital.vicinity ||
                selectedHospital.formatted_address ||
                "Selected Hospital",

              ambulanceType:
                "Basic"

            }
          );


        if (
          response?.success
        ) {

          setAmbulanceStatus(
            "Ambulance requested"
          );

        } else {

          setAmbulanceStatus(
            "Request failed"
          );
        }


      } catch (error) {

        console.error(error);

        setAmbulanceStatus(
          error.response?.data?.message ||
          "Request failed"
        );
      }
    };


  /* --------------------------------
     RENDER
  -------------------------------- */

  return (

    <div className="emergency-page">


      <Navbar
        onMenuClick={() =>
          setSidebarOpen(true)
        }
      />


      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      <main className="emergency-main">


        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div className="emergency-page-header">

          <div>

            <button
              className="back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Back
            </button>


            <span className="emergency-page-label">
              EMERGENCY MODE
            </span>


            <h1>
              Get Emergency Help
            </h1>


            <p>
              Choose how you want to
              handle your emergency.
            </p>

          </div>

        </div>


        {/* --------------------------------
            MODE SELECTION
        -------------------------------- */}

        {!emergencyMode && (

          <>

            <section className="emergency-actions">

              <div>

                <span className="emergency-action-icon">
                  🟢
                </span>


                <div>

                  <h3>
                    Pre-Planned Emergency
                  </h3>


                  <p>
                    Find nearby hospitals,
                    choose your preferred
                    hospital and arrange
                    assistance.
                  </p>

                </div>

              </div>


              <button
                className="ambulance-request-button"
                onClick={
                  handlePrePlannedMode
                }
              >
                🏥 Find Hospitals
              </button>

            </section>


            <section className="emergency-actions">

              <div>

                <span className="emergency-action-icon">
                  🔴
                </span>


                <div>

                  <h3>
                    Unplanned Emergency
                  </h3>


                  <p>
                    Press SOS when you need
                    immediate emergency
                    assistance.
                  </p>

                </div>

              </div>


              <button
                className="ambulance-request-button"
                onClick={
                  handleUnplannedMode
                }
              >
                🚨 Start Emergency
              </button>

            </section>

          </>
        )}


        {/* --------------------------------
            UNPLANNED EMERGENCY
            ONLY SOS BUTTON
        -------------------------------- */}

        {emergencyMode ===
          "UNPLANNED" && (

          <section
            style={{
              width: "100%",
              minHeight: "430px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "35px",
              padding: "35px 20px",
              boxSizing: "border-box"
            }}
          >

            <SOSButton
              onClick={handleSOS}
              disabled={loading}
            />

          </section>

        )}


        {/* --------------------------------
            EMERGENCY STATUS
            BELOW SOS
        -------------------------------- */}

        {emergencyMode ===
          "UNPLANNED" && (

          <section
            style={{
              width: "100%",
              marginTop: "5px"
            }}
          >

            <EmergencyStatus
              status={status}

              location={location}

              ambulanceStatus={
                ambulanceStatus
              }

              emergency={emergency}

              ambulanceETA={
                ambulanceETA
              }

              ambulanceDistance={
                ambulanceDistance
              }

            />

          </section>

        )}


        {/* --------------------------------
            LOCATION ERROR
        -------------------------------- */}

        {locationError && (

          <div className="emergency-error">

            ⚠️

            <span>
              {locationError}
            </span>


            <button
              onClick={loadLocation}
            >
              Retry
            </button>

          </div>

        )}


        {/* --------------------------------
            MAP
        -------------------------------- */}

        {emergencyMode &&
          location && (

          <section className="emergency-section">

            <div className="emergency-section-title">

              <div>

                <h2>
                  Your Location
                </h2>

                <p>
                  Nearby emergency
                  hospitals are shown
                  around you.
                </p>

              </div>

            </div>


            <EmergencyMap

              location={location}


              hospitals={
                emergencyMode ===
                "UNPLANNED"

                  ? selectedHospital
                    ? [selectedHospital]
                    : []

                  : hospitals
              }


              selectedHospital={
                selectedHospital
              }


              onHospitalSelect={
                emergencyMode ===
                "PRE_PLANNED"

                  ? setSelectedHospital

                  : undefined
              }


              ambulanceActive={
                emergencyMode ===
                  "UNPLANNED" &&
                emergencyTrip !== null
              }


              onAmbulanceUpdate={
                handleAmbulanceUpdate
              }

            />

          </section>

        )}


        {/* --------------------------------
            PRE-PLANNED HOSPITALS
        -------------------------------- */}

        {emergencyMode ===
          "PRE_PLANNED" && (

          <>

            <section className="emergency-section">

              <div className="emergency-section-title">

                <div>

                  <h2>
                    Nearby Hospitals
                  </h2>

                  <p>
                    Select the hospital
                    you prefer.
                  </p>

                </div>


                <span className="hospital-count">
                  {hospitals.length} found
                </span>

              </div>


              {hospitals.length ===
              0 ? (

                <div className="empty-emergency">

                  <span>
                    🏥
                  </span>


                  <h3>
                    No hospitals loaded
                  </h3>


                  <p>
                    Make sure your location
                    is enabled and try again.
                  </p>


                  <button
                    onClick={async () => {

                      const currentLocation =
                        await loadLocation();


                      if (
                        currentLocation
                      ) {

                        await loadHospitals(
                          currentLocation
                        );

                      }

                    }}
                  >
                    Find Hospitals
                  </button>

                </div>

              ) : (

                <div className="hospital-list">

                  {hospitals.map(
                    (
                      hospital,
                      index
                    ) => {

                      const hospitalId =
                        hospital.id ||
                        hospital.placeId ||
                        hospital._id ||
                        index;


                      const selectedId =
                        selectedHospital?.id ||
                        selectedHospital?.placeId ||
                        selectedHospital?._id;


                      return (

                        <EmergencyHospitalCard

                          key={
                            hospitalId
                          }

                          hospital={
                            hospital
                          }

                          selected={
                            selectedId ===
                            hospitalId
                          }

                          onSelect={
                            setSelectedHospital
                          }

                        />

                      );

                    }
                  )}

                </div>

              )}

            </section>


            {/* --------------------------------
                PRE-PLANNED AMBULANCE
            -------------------------------- */}

            {selectedHospital && (

              <section className="emergency-actions">

                <div>

                  <span className="emergency-action-icon">
                    🏥
                  </span>


                  <div>

                    <h3>
                      Selected Hospital
                    </h3>


                    <p>
                      {selectedHospital.name}
                    </p>

                  </div>

                </div>


                <button
                  className="ambulance-request-button"

                  onClick={
                    handleAmbulanceRequest
                  }

                  disabled={
                    ambulanceStatus.includes(
                      "Requesting"
                    )
                  }
                >
                  🚑 Book Ambulance
                </button>

              </section>

            )}

          </>
        )}


        {/* --------------------------------
            CONTACT SHORTCUT
        -------------------------------- */}

        <section className="emergency-contact-shortcut">

          <div>

            <h3>
              Emergency Contacts
            </h3>


            <p>
              Quickly access the people
              you have added as emergency
              contacts.
            </p>

          </div>


          <button
            onClick={() =>
              navigate(
                "/emergency-contacts"
              )
            }
          >
            Manage Contacts →
          </button>

        </section>


      </main>

    </div>
  );
}


export default Emergency;