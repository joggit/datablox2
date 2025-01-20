import axios from "axios";

const CLICKATELL_API_URL = "https://platform.clickatell.com/messages";
const CLICKATELL_API_KEY = process.env.CLICKATELL_API_KEY; // Add this to your .env file

export async function sendSMS({ to, message }) {
  try {
    const response = await axios.post(
      CLICKATELL_API_URL,
      {
        content: message,
        to: [to],
      },
      {
        headers: {
          Authorization: `Bearer ${CLICKATELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.messages[0].accepted) {
      console.log(`SMS sent successfully to ${to}`);
      return true;
    } else {
      console.error(`Failed to send SMS to ${to}:`, response.data.messages[0]);
      return false;
    }
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    return false;
  }
}
