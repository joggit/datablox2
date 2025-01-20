import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS({ to, message }) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // Recipient's phone number
    });
    console.log("SMS sent:", result.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}
