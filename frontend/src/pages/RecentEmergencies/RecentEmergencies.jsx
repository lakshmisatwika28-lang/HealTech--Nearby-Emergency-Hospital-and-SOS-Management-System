import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RecentEmergencies.css";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

import emergencyService from "../../services/emergencyService";

function RecentEmergencies() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [emergencies, setEmergencies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* --------------------------------
     LOAD RECENT EMERGENCIES
  -------------------------------- */

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await emergencyService.getAllEmergencies();

      const results =
        response?.data || [];

      setEmergencies(
        Array.isArray(results)
          ? results
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load recent emergencies:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load recent emergencies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  /* --------------------------------
     FORMAT DATE
  -------------------------------- */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  /* --------------------------------
     FORMAT TIME
  -------------------------------- */

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  /* --------------------------------
     STATUS CLASS
  -------------------------------- */

  const getStatusClass = (
    status
  ) => {
    const normalizedStatus =
      String(
        status || ""
      ).toUpperCase();

    if (
      normalizedStatus ===
      "ACTIVE"
    ) {
      return "status-active";
    }

    if (
      normalizedStatus ===
        "COMPLETED" ||
      normalizedStatus ===
        "DONE" ||
      normalizedStatus ===
        "REACHED_HOSPITAL"
    ) {
      return "status-completed";
    }

    if (
      normalizedStatus ===
      "CANCELLED"
    ) {
      return "status-cancelled";
    }

    return "status-default";
  };

  /* --------------------------------
     STATUS TEXT
  -------------------------------- */

  const getStatusText = (
    status
  ) => {
    if (!status) {
      return "Unknown";
    }

    const normalizedStatus =
      String(status)
        .toUpperCase();

    if (
      normalizedStatus ===
      "ACTIVE"
    ) {
      return "Active";
    }

    if (
      normalizedStatus ===
        "COMPLETED" ||
      normalizedStatus ===
        "DONE" ||
      normalizedStatus ===
        "REACHED_HOSPITAL"
    ) {
      return "Completed";
    }

    if (
      normalizedStatus ===
      "CANCELLED"
    ) {
      return "Cancelled";
    }

    return status;
  };

  /* --------------------------------
     RENDER
  -------------------------------- */

  return (
    <div className="recent-emergencies-page">

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

      <main className="recent-emergencies-main">

        {/* HEADER */}

        <div className="recent-emergencies-header">

          <div>

            <button
              className="recent-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Back
            </button>

            <span className="recent-page-label">
              EMERGENCY HISTORY
            </span>

            <h1>
              Recent Emergencies
            </h1>

            <p>
              View your previous emergency
              requests and their status.
            </p>

          </div>

        </div>

        {/* CONTENT */}

        <section className="recent-emergencies-section">

          {/* LOADING */}

          {loading && (
            <div className="recent-empty-state">

              <span className="recent-empty-icon">
                ⏳
              </span>

              <h3>
                Loading emergencies...
              </h3>

              <p>
                Please wait while we retrieve
                your emergency history.
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="recent-error-state">

              <span>
                ⚠️
              </span>

              <div>

                <h3>
                  Unable to load emergencies
                </h3>

                <p>
                  {error}
                </p>

                <button
                  onClick={
                    loadEmergencies
                  }
                >
                  Try Again
                </button>

              </div>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            emergencies.length === 0 && (
              <div className="recent-empty-state">

                <span className="recent-empty-icon">
                  🚨
                </span>

                <h3>
                  No Recent Emergencies
                </h3>

                <p>
                  Your emergency history will
                  appear here after an emergency
                  request is created.
                </p>

                <button
                  onClick={() =>
                    navigate("/emergency")
                  }
                >
                  Go to Emergency Mode
                </button>

              </div>
            )}

          {/* EMERGENCY LIST */}

          {!loading &&
            !error &&
            emergencies.length > 0 && (
              <div className="recent-emergency-list">

                {emergencies.map(
                  (
                    emergency,
                    index
                  ) => {

                    const emergencyId =
                      emergency.id ||
                      emergency._id ||
                      index;

                    const createdAt =
                      emergency.createdAt ||
                      emergency.created_at;

                    const emergencyType =
                      emergency.emergencyType ||
                      emergency.emergency_type ||
                      "Medical Emergency";

                    const statusValue =
                      emergency.status ||
                      "Unknown";

                    const latitude =
                      emergency.latitude;

                    const longitude =
                      emergency.longitude;

                    /*
                     * Hospital information now comes
                     * from emergency_trips through the
                     * backend LEFT JOIN.
                     */

                    const hospitalName =
                      emergency.hospitalName ||
                      emergency.hospital_name;

                    const hospitalAddress =
                      emergency.hospitalAddress ||
                      emergency.hospital_address;

                    const hospitalRating =
                      emergency.hospitalRating ||
                      emergency.hospital_rating;

                    return (
                      <article
                        className="recent-emergency-card"
                        key={emergencyId}
                      >

                        {/* CARD HEADER */}

                        <div className="recent-card-header">

                          <div className="recent-card-title">

                            <span className="recent-card-icon">
                              🚨
                            </span>

                            <div>

                              <h3>
                                {emergencyType}
                              </h3>

                              <span>
                                Emergency #
                                {emergencyId}
                              </span>

                            </div>

                          </div>

                          <span
                            className={`recent-status-badge ${getStatusClass(
                              statusValue
                            )}`}
                          >
                            {getStatusText(
                              statusValue
                            )}
                          </span>

                        </div>

                        {/* CARD DETAILS */}

                        <div className="recent-card-details">

                          {/* DATE */}

                          <div className="recent-detail">

                            <span className="recent-detail-icon">
                              📅
                            </span>

                            <div>

                              <span>
                                Date
                              </span>

                              <strong>
                                {formatDate(
                                  createdAt
                                )}
                              </strong>

                            </div>

                          </div>

                          {/* TIME */}

                          <div className="recent-detail">

                            <span className="recent-detail-icon">
                              🕐
                            </span>

                            <div>

                              <span>
                                Time
                              </span>

                              <strong>
                                {formatTime(
                                  createdAt
                                ) ||
                                  "Time unavailable"}
                              </strong>

                            </div>

                          </div>

                          {/* LOCATION */}

                          <div className="recent-detail">

                            <span className="recent-detail-icon">
                              📍
                            </span>

                            <div>

                              <span>
                                Location
                              </span>

                              <strong>
                                {latitude !==
                                  undefined &&
                                latitude !==
                                  null &&
                                longitude !==
                                  undefined &&
                                longitude !==
                                  null
                                  ? `${Number(
                                      latitude
                                    ).toFixed(
                                      5
                                    )}, ${Number(
                                      longitude
                                    ).toFixed(
                                      5
                                    )}`
                                  : "Location unavailable"}
                              </strong>

                            </div>

                          </div>

                          {/* HOSPITAL */}

                          <div className="recent-detail">

                            <span className="recent-detail-icon">
                              🏥
                            </span>

                            <div>

                              <span>
                                Hospital
                              </span>

                              <strong>
                                {hospitalName ||
                                  "Hospital information unavailable"}
                              </strong>

                            </div>

                          </div>

                          {/* HOSPITAL ADDRESS */}

                          {hospitalAddress && (
                            <div className="recent-detail">

                              <span className="recent-detail-icon">
                                🗺️
                              </span>

                              <div>

                                <span>
                                  Hospital Address
                                </span>

                                <strong>
                                  {hospitalAddress}
                                </strong>

                              </div>

                            </div>
                          )}

                          {/* HOSPITAL RATING */}

                          {hospitalRating !==
                            null &&
                            hospitalRating !==
                              undefined && (
                              <div className="recent-detail">

                                <span className="recent-detail-icon">
                                  ⭐
                                </span>

                                <div>

                                  <span>
                                    Hospital Rating
                                  </span>

                                  <strong>
                                    {hospitalRating}
                                  </strong>

                                </div>

                              </div>
                            )}

                        </div>

                        {/* VIEW BUTTON */}

                        <div className="recent-card-footer">

                          <button
                            className="recent-view-button"
                            onClick={() =>
                              navigate(
                                `/recent-emergencies/${emergencyId}`
                              )
                            }
                          >
                            View Details →
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default RecentEmergencies;