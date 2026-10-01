import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import ambulanceService
  from "../../services/ambulanceService";

import locationService
  from "../../services/locationService";

import "./AmbulanceBooking.css";


const AmbulanceBooking = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const hospital =
    location.state?.hospital;


  const [patientName, setPatientName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [bookingDate, setBookingDate] =
    useState("");

  const [bookingTime, setBookingTime] =
    useState("");

  const [dayName, setDayName] =
    useState("");

  const [ambulanceType, setAmbulanceType] =
    useState("Basic");


  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [booking, setBooking] =
    useState(null);

  const [error, setError] =
    useState("");


  /* =========================
     GET CURRENT LOCATION
  ========================= */

  useEffect(() => {

    const getLocation = async () => {

      try {

        setLoadingLocation(true);
        setError("");

        const userLocation =
          await locationService.getCurrentLocation();

        setCurrentLocation(
          userLocation
        );

      } catch (err) {

        console.error(
          "Location error:",
          err
        );

        setError(
          err.message ||
          "Unable to get your current location."
        );

      } finally {

        setLoadingLocation(false);

      }

    };

    getLocation();

  }, []);


  /* =========================
     TODAY'S DATE
  ========================= */

  const getTodayDate = () => {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  };


  /* =========================
     DATE CHANGE
  ========================= */

  const handleDateChange = (
    event
  ) => {

    const selectedDate =
      event.target.value;

    setBookingDate(
      selectedDate
    );

    if (!selectedDate) {

      setDayName("");

      return;

    }

    const date =
      new Date(
        `${selectedDate}T00:00:00`
      );

    const weekday =
      date.toLocaleDateString(
        "en-IN",
        {
          weekday: "long"
        }
      );

    setDayName(
      weekday
    );

  };


  /* =========================
     BOOK AMBULANCE
  ========================= */

  const handleBooking = async (
    event
  ) => {

    event.preventDefault();

    try {

      setError("");


      if (!patientName.trim()) {

        setError(
          "Please enter the patient's name."
        );

        return;

      }


      if (!phone.trim()) {

        setError(
          "Please enter a contact number."
        );

        return;

      }


      if (!bookingDate) {

        setError(
          "Please select a booking date."
        );

        return;

      }


      if (!bookingTime) {

        setError(
          "Please select a booking time."
        );

        return;

      }


      if (!currentLocation) {

        setError(
          "Current location is not available."
        );

        return;

      }


      if (!hospital) {

        setError(
          "Please select a hospital first."
        );

        return;

      }


      const hospitalLatitude =
        hospital.geometry?.location?.lat;

      const hospitalLongitude =
        hospital.geometry?.location?.lng;


      if (
        hospitalLatitude === undefined ||
        hospitalLongitude === undefined
      ) {

        setError(
          "Hospital location is unavailable."
        );

        return;

      }


      setLoading(true);


      const bookingData = {

        patientName:
          patientName.trim(),

        phone:
          phone.trim(),

        bookingDate,

        bookingTime,

        pickupLatitude:
          currentLocation.latitude,

        pickupLongitude:
          currentLocation.longitude,

        destination:
          hospital.formatted_address ||
          hospital.vicinity ||
          hospital.name,

        ambulanceType

      };


      const response =
        await ambulanceService.createBooking(
          bookingData
        );


      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Ambulance booking failed."
        );

      }


      setBooking(
        response.data
      );

    } catch (err) {

      console.error(
        "Ambulance booking failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to book ambulance."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     NO HOSPITAL
  ========================= */

  if (!hospital) {

    return (

      <div className="ambulance-booking-page">

        <Navbar />

        <main className="ambulance-booking-main">

          <div className="ambulance-booking-error-card">

            <div className="ambulance-error-icon">
              🚑
            </div>

            <h2>
              Hospital not selected
            </h2>

            <p>
              Please select a hospital before
              booking an ambulance.
            </p>

            <button
              onClick={() =>
                navigate("/emergency")
              }
            >
              Back to Emergency
            </button>

          </div>

        </main>

      </div>

    );

  }


  /* =========================
     SUCCESS PAGE
  ========================= */

  if (booking) {

    const displayDate =
      booking.booking_date ||
      booking.bookingDate ||
      bookingDate;

    const displayTime =
      booking.booking_time ||
      booking.bookingTime ||
      bookingTime;


    return (

      <div className="ambulance-booking-page">

        <Navbar />

        <main className="ambulance-booking-main">

          <section className="booking-success-card">

            <div className="booking-success-icon">
              ✓
            </div>

            <span className="booking-label">
              AMBULANCE BOOKING
            </span>

            <h1>
              Booking Confirmed
            </h1>

            <p>
              Your ambulance request has been
              successfully created.
            </p>


            <div className="booking-summary">

              <div className="booking-summary-row">

                <span>
                  Booking ID
                </span>

                <strong>
                  #{booking.id}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Patient
                </span>

                <strong>
                  {booking.patientName ||
                    patientName}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Date
                </span>

                <strong>
                  {displayDate}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Day
                </span>

                <strong>
                  {dayName}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Time
                </span>

                <strong>
                  {displayTime}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Ambulance
                </span>

                <strong>
                  {booking.ambulanceType ||
                    ambulanceType}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Destination
                </span>

                <strong>
                  {hospital.name}
                </strong>

              </div>


              <div className="booking-summary-row">

                <span>
                  Status
                </span>

                <strong className="booking-status">
                  {booking.status ||
                    "REQUESTED"}
                </strong>

              </div>

            </div>


            <div className="booking-success-actions">

              <button
                className="booking-back-button"
                onClick={() =>
                  navigate("/emergency")
                }
              >
                Back to Emergency
              </button>

            </div>

          </section>

        </main>

      </div>

    );

  }


  /* =========================
     BOOKING FORM
  ========================= */

  return (

    <div className="ambulance-booking-page">

      <Navbar />


      <main className="ambulance-booking-main">


        <button
          className="ambulance-back-button"
          onClick={() =>
            navigate(-1)
          }
        >
          ← Back
        </button>


        <section className="ambulance-booking-header">

          <span className="ambulance-booking-label">
            AMBULANCE SERVICE
          </span>

          <h1>
            Book an Ambulance
          </h1>

          <p>
            Schedule ambulance transportation
            to your selected hospital.
          </p>

        </section>


        {error && (

          <div className="ambulance-booking-error">

            <span>
              ⚠️
            </span>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>

        )}


        <section className="ambulance-booking-layout">


          {/* =====================
              FORM
          ===================== */}

          <div className="ambulance-booking-form-card">


            <div className="booking-card-title">

              <div className="booking-card-icon">
                🚑
              </div>

              <div>

                <h2>
                  Booking Information
                </h2>

                <p>
                  Enter the details required
                  for the ambulance.
                </p>

              </div>

            </div>


            <form
              onSubmit={handleBooking}
            >


              <div className="booking-form-group">

                <label>
                  Patient Name
                </label>

                <input
                  type="text"
                  value={patientName}
                  onChange={(event) =>
                    setPatientName(
                      event.target.value
                    )
                  }
                  placeholder="Enter patient name"
                />

              </div>


              <div className="booking-form-group">

                <label>
                  Contact Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="Enter contact number"
                />

              </div>


              <div className="booking-date-time-row">


                <div className="booking-form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={bookingDate}
                    min={getTodayDate()}
                    onChange={
                      handleDateChange
                    }
                  />

                </div>


                <div className="booking-form-group">

                  <label>
                    Day
                  </label>

                  <input
                    type="text"
                    value={dayName}
                    placeholder="Select date"
                    readOnly
                  />

                </div>


              </div>


              <div className="booking-form-group">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={bookingTime}
                  onChange={(event) =>
                    setBookingTime(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="booking-form-group">

                <label>
                  Ambulance Type
                </label>

                <select
                  value={ambulanceType}
                  onChange={(event) =>
                    setAmbulanceType(
                      event.target.value
                    )
                  }
                >

                  <option value="Basic">
                    Basic
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>

                  <option value="ICU">
                    ICU
                  </option>

                </select>

              </div>


              <button
                type="submit"
                className="request-ambulance-button"
                disabled={
                  loading ||
                  loadingLocation
                }
              >

                {loading
                  ? "REQUESTING..."
                  : loadingLocation
                    ? "GETTING LOCATION..."
                    : "🚑 Request Ambulance"}

              </button>


            </form>

          </div>


          {/* =====================
              ROUTE INFORMATION
          ===================== */}

          <div className="ambulance-route-card">


            <div className="route-card-header">

              <h2>
                Ambulance Route
              </h2>

              <p>
                Pickup and destination
              </p>

            </div>


            <div className="route-point">


              <div className="route-dot pickup-dot">
                📍
              </div>


              <div>

                <span>
                  PICKUP LOCATION
                </span>

                <h3>
                  {loadingLocation
                    ? "Getting your location..."
                    : currentLocation
                      ? "Your Current Location"
                      : "Location unavailable"}
                </h3>

                {currentLocation && (

                  <p>
                    {Number(
                      currentLocation.latitude
                    ).toFixed(6)}

                    ,{" "}

                    {Number(
                      currentLocation.longitude
                    ).toFixed(6)}
                  </p>

                )}

              </div>

            </div>


            <div className="route-line" />


            <div className="route-point">


              <div className="route-dot hospital-dot">
                🏥
              </div>


              <div>

                <span>
                  DESTINATION HOSPITAL
                </span>

                <h3>
                  {hospital.name}
                </h3>

                <p>
                  {hospital.formatted_address ||
                    hospital.vicinity ||
                    "Address unavailable"}
                </p>

              </div>

            </div>


          </div>


        </section>


      </main>

    </div>

  );

};


export default AmbulanceBooking;