const notificationService = {
  async requestPermission() {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return "unsupported";
    }

    if (Notification.permission === "default") {
      return Notification.requestPermission();
    }

    return Notification.permission;
  },

  showEmergencyNotification(message) {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("HEALTECH Emergency", {
        body: message
      });
    }
  }
};

export default notificationService;