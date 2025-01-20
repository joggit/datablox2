import crypto from "crypto";

const generatePayFastSignature = (data, passPhrase = null) => {
  console.log("Data to sign:", data);
  // Create parameter string
  let pfOutput = "";
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== "") {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
      }
    }
  }
  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  console.log("String to sign:", getString);
  // Append passphrase if provided
  if (passPhrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }
    // Return MD5 hash of the string
  return crypto.createHash("md5").update(getString).digest("hex");
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, amount, user } = body;

    // Validate required fields
    if (!orderId || !amount || !user || !user.email) {
      return new Response(JSON.stringify({ error: "Invalid request data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: process.env.PAYFAST_RETURN_URL,
      cancel_url: process.env.PAYFAST_CANCEL_URL,
      notify_url: process.env.PAYFAST_NOTIFY_URL,
      email_address: user.email,
      m_payment_id: orderId,
      amount:"5.00",
      // amount: Number(amount).toFixed(2),
      item_name: `Order${orderId}`,
    };

    // Generate signature with or without passphrase
    const signature = generatePayFastSignature(
      data,
      process.env.PAYFAST_PASSPHRASE || null // Passphrase may be null
    );
    const payload = { ...data, signature };

    console.log("Payload sent to PayFast:", payload);

    const response = await fetch("https://www.payfast.co.za/onsite/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("PayFast Response Status:", response.status);
    const responseText = await response.text();
    console.log("Raw PayFast Response:", responseText);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: responseText }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(responseText);
    return new Response(
      JSON.stringify({ uuid: result.uuid, amount: data.amount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating UUID:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate UUID" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
