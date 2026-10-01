import React from "react";

import "./EmergencyStatus.css";

const EmergencyStatus = ({
  status,
  location,
  ambulanceStatus,
  emergency,
  ambulanceETA,
  ambulanceDistance
}) => {
  const formatDistance = (
    distance
  ) => {
    if (
      distance === null ||
      distance === undefined
    ) {
      return "Calculating...";
    }

    if (distance < 1) {
      return `${Math.round(
        distance * 1000
      )} m`;
    }

    return `${distance.toFixed(
      2
    )} km`;
  };

  const formatETA = (
    seconds
  ) => {
    if (
      seconds === null ||
      seconds === undefined
    ) {
      return "Calculating...";
    }

    if (seconds === 0) {
      return "Arrived";
    }

    if (seconds < 60) {
      return `${seconds} sec`;
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${minutes} min ${
      remainingSeconds
    } sec`;
  };

  return (
    <div className="emergency-status">

      <div className="emergency-status-header">

        <span>
          EMERGENCY STATUS
        </span>

        <span className="status-indicator">
          <span className="status-dot"></span>
          Active
        </span>

      </div>

      <div className="emergency-status-title">
        {status}
      </div>

      <div className="emergency-status-grid">

        <div className="status-item">

          <span className="status-item-icon">
            📍
          </span>

          <div>
            <span className="status-item-label">
              Location
            </span>

            <strong>
              {location
                ? "Available"
                : "Unavailable"}
            </strong>
          </div>

        </div>

        <div className="status-item">

          <span className="status-item-icon">
            🚑
          </span>

          <div>
            <span className="status-item-label">
              Ambulance
            </span>

            <strong>
              {ambulanceStatus ||
                "Not started"}
            </strong>
          </div>

        </div>

        <div className="status-item">

          <span className="status-item-icon">
            ⏱️
          </span>

          <div>
            <span className="status-item-label">
              ETA
            </span>

            <strong>
              {formatETA(
                ambulanceETA
              )}
            </strong>
          </div>

        </div>

        <div className="status-item">

          <span className="status-item-icon">
            📏
          </span>

          <div>
            <span className="status-item-label">
              Distance
            </span>

            <strong>
              {formatDistance(
                ambulanceDistance
              )}
            </strong>
          </div>

        </div>

      </div>

      {emergency && (
        <div className="emergency-request-info">

          <span>
            Emergency Request
          </span>

          <strong>
            #{emergency.id}
          </strong>

        </div>
      )}

    </div>
  );
};

export default EmergencyStatus;