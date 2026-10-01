import twilio from "twilio";

const voiceService = {
  async makeEmergencyCall(contact, emergency) {
    if (!contact?.phone) {
      throw new Error("Emergency contact phone number is required");
    }

    if (!emergency) {
      throw new Error("Emergency details are required");
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const callUrl =
      `${process.env.TWILIO_VOICE_URL}` +
      `?accidentTime=${encodeURIComponent(
        new Date(emergency.createdAt || Date.now()).toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit"
        })
      )}` +
      `&hospitalName=${encodeURIComponent(
        emergency.hospitalName || "the nearest hospital"
      )}`;

    const call = await client.calls.create({
      to: contact.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: callUrl,
      method: "GET"
    });

    return {
      success: true,
      callSid: call.sid,
      contact: contact.name,
      phone: contact.phone
    };
  }
};

export default voiceService;