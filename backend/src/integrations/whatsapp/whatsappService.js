import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const whatsappService = {
  async sendWhatsAppMessage(to) {
    if (!to) {
      throw new Error("Recipient WhatsApp number is required");
    }

    const whatsappTo = to.startsWith("whatsapp:")
      ? to
      : `whatsapp:${to}`;

    const result = await client.messages.create({
      contentSid: process.env.TWILIO_CONTENT_SID,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: whatsappTo
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status
    };
  }
};

export default whatsappService;