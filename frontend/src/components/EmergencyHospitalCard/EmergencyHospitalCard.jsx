import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyHospitalCard.css";

const EmergencyHospitalCard = ({
  hospital,
  selected = false,
  onSelect
}) => {
  const navigate = useNavigate();

  if (!hospital) {
    return null;
  }

  const name =
    hospital.name || "Hospital";

  const address =
    hospital.vicinity ||
    hospital.formatted_address ||
    "Address unavailable";

  const rating =
    hospital.rating;

  const latitude =
    hospital.geometry?.location?.lat;

  const longitude =
    hospital.geometry?.location?.lng;

  const handleHospitalClick = () => {
    navigate("/hospital-details", {
      state: {
        hospital
      }
    });
  };

  return (
    <button
      type="button"
      className={`emergency-hospital-card ${
        selected ? "hospital-selected" : ""
      }`}
      onClick={handleHospitalClick}
    >
      <div className="hospital-card-main">

        <div className="hospital-icon">
          🏥
        </div>

        <div className="hospital-info">

          <h3>{name}</h3>

          <p>{address}</p>

          <div className="hospital-meta">

            {rating && (
              <span>
                ⭐ {rating}
              </span>
            )}

            {latitude !== undefined &&
              longitude !== undefined && (
                <span>
                  📍 Location available
                </span>
              )}

          </div>

        </div>

      </div>

      <div className="hospital-card-arrow">
        →
      </div>

    </button>
  );
};

export default EmergencyHospitalCard;