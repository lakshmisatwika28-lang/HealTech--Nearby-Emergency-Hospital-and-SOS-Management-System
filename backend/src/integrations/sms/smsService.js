import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const smsService = {
  async sendSMS(to, message) {
    if (!to) {
      throw new Error("Recipient phone number is required");
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status
    };
  }
};

export default smsService;