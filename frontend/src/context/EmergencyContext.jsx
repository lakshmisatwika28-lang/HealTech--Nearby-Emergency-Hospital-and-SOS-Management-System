import React, { createContext, useContext, useState } from "react";
import emergencyService from "../services/emergencyService";

const EmergencyContext = createContext(null);

export const EmergencyProvider = ({ children }) => {
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerEmergency = async (
    latitude,
    longitude,
    emergencyType = "General Emergency"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await emergencyService.createEmergency(
        latitude,
        longitude,
        emergencyType
      );

      setEmergency(response.data);

      return response.data;
    } catch (err) {
      console.error("Emergency request failed:", err);

      const message =
        err.response?.data?.message ||
        "Failed to create emergency request";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmergencyStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await emergencyService.updateEmergencyStatus(id, status);

      setEmergency(response.data);

      return response.data;
    } catch (err) {
      console.error("Emergency status update failed:", err);

      const message =
        err.response?.data?.message ||
        "Failed to update emergency status";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEmergency = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await emergencyService.cancelEmergency(id);

      setEmergency(response.data);

      return response.data;
    } catch (err) {
      console.error("Emergency cancellation failed:", err);

      const message =
        err.response?.data?.message ||
        "Failed to cancel emergency";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearEmergency = () => {
    setEmergency(null);
    setError(null);
  };

  return (
    <EmergencyContext.Provider
      value={{
        emergency,
        loading,
        error,
        triggerEmergency,
        updateEmergencyStatus,
        cancelEmergency,
        clearEmergency
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);

  if (!context) {
    throw new Error(
      "useEmergency must be used inside EmergencyProvider"
    );
  }

  return context;
};

export default EmergencyContext;