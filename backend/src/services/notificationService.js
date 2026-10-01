import voiceService from "../integrations/twilio/voiceService.js";

const notificationService = {
  async sendEmergencyNotification(emergency) {
    console.log("🚨 Processing emergency notification");

    return {
      success: true,
      emergencyId: emergency.id
    };
  },

  async sendContactNotification(contact, emergency) {
    if (!contact || !emergency) {
      throw new Error("Contact and emergency details are required");
    }

    const result = await voiceService.makeEmergencyCall(
      contact,
      emergency
    );

    return {
      success: true,
      contact: contact.name,
      phone: contact.phone,
      call: result
    };
  }
};

export default notificationService;