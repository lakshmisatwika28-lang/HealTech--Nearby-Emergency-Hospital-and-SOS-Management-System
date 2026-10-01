import React, { useState } from "react";
import { useEmergency } from "../../context/EmergencyContext";
import locationService from "../../services/locationService";
import notificationService from "../../services/notificationService";
import "./SOSButton.css";

const SOSButton = ({ onClick, disabled = false }) => {
  const { triggerEmergency, loading: contextLoading } =
    useEmergency();

  const [error, setError] = useState("");

  const loading = disabled || contextLoading;


  const handleSOS = async () => {
    try {
      setError("");

      /*
        IMPORTANT:
        If the parent page provides its own SOS handler,
        use that handler.

        This allows Emergency.jsx to control the
        emergency flow and status.
      */

      if (onClick) {
        await onClick();
        return;
      }


      /*
        Fallback:
        Keep the Context-based emergency flow for
        other places where SOSButton may be used.
      */

      const permission =
        await notificationService.requestPermission();

      const location =
        await locationService.getCurrentLocation();

      const emergency =
        await triggerEmergency(
          location.latitude,
          location.longitude,
          "Medical Emergency"
        );

      if (permission === "granted") {
        notificationService.showEmergencyNotification(
          `Emergency request #${emergency.id} created successfully.`
        );
      }

      alert(
        "🚨 Emergency request sent successfully!"
      );

    } catch (err) {
      console.error(
        "SOS failed:",
        err
      );

      setError(
        err.message ||
        "Unable to send emergency request."
      );
    }
  };


  return (
    <div className="sos-button-container">

      <button
        className="sos-button"
        onClick={handleSOS}
        disabled={loading}
      >
        {loading
          ? "SENDING..."
          : "SOS"}
      </button>

      {error && (
        <p className="sos-error">
          {error}
        </p>
      )}

    </div>
  );
};

export default SOSButton;