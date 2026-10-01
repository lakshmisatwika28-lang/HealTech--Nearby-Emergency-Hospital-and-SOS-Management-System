import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./HospitalDetails.css";

const HospitalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hospital = location.state?.hospital;

  if (!hospital) {
    return (
      <div className="hospital-details-page">
        <Navbar />

        <main className="hospital-details-main">
          <div className="hospital-details-error">

            <h2>
              Hospital information unavailable
            </h2>

            <p>
              Please go back and select a hospital again.
            </p>

            <button
              onClick={() => navigate("/emergency")}
            >
              Back to Emergency
            </button>

          </div>
        </main>
      </div>
    );
  }

  const name =
    hospital.name || "Hospital";

  const address =
    hospital.formatted_address ||
    hospital.vicinity ||
    "Address unavailable";

  const latitude =
    hospital.geometry?.location?.lat;

  const longitude =
    hospital.geometry?.location?.lng;

  const phone =
    hospital.phone || null;

  const website =
    hospital.website || null;

  const googleMapsUrl =
    hospital.googleMapsUri ||
    (
      latitude !== undefined &&
      longitude !== undefined
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        : null
    );

  const handleBookAmbulance = () => {
    navigate("/ambulance-booking", {
      state: {
        hospital
      }
    });
  };

  return (
    <div className="hospital-details-page">

      <Navbar />

      <main className="hospital-details-main">

        <button
          className="hospital-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <section className="hospital-details-header">

          <span className="hospital-details-label">
            HOSPITAL DETAILS
          </span>

          <h1>{name}</h1>

          <p>
            Information and emergency services for
            the selected hospital.
          </p>

        </section>

        <section className="hospital-details-card">

          <div className="hospital-details-icon">
            🏥
          </div>

          <div className="hospital-details-content">

            <h2>{name}</h2>

            {hospital.rating && (
              <div className="hospital-detail-rating">
                ⭐ {hospital.rating} Google rating
              </div>
            )}

            <div className="hospital-detail-item">

              <span>📍</span>

              <div>
                <strong>
                  Address
                </strong>

                <p>
                  {address}
                </p>
              </div>

            </div>

            {phone && (
              <div className="hospital-detail-item">

                <span>📞</span>

                <div>
                  <strong>
                    Phone
                  </strong>

                  <p>
                    {phone}
                  </p>
                </div>

              </div>
            )}

            {website && (
              <div className="hospital-detail-item">

                <span>🌐</span>

                <div>
                  <strong>
                    Website
                  </strong>

                  <p>
                    {website}
                  </p>
                </div>

              </div>
            )}

          </div>

        </section>

        <section className="hospital-details-actions">

          {phone ? (
            <a
              href={`tel:${phone}`}
              className="hospital-call-button"
            >
              📞 Call Hospital
            </a>
          ) : (
            <button
              className="hospital-call-button disabled"
              disabled
            >
              📞 Phone Not Available
            </button>
          )}

          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hospital-map-button"
            >
              🗺️ View on Google Maps
            </a>
          )}

          <button
            className="hospital-ambulance-button"
            onClick={handleBookAmbulance}
          >
            🚑 Book an Ambulance
          </button>

        </section>

      </main>

    </div>
  );
};

export default HospitalDetails;