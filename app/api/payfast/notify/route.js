import { NextResponse } from "next/server";
import crypto from "crypto";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { sendEmail } from "../../../../lib/email";
import { sendSMS } from "../../../../lib/clickatel";

const PAYFAST_SECRET = process.env.PAYFAST_SECRET;

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const payfastData = Object.fromEntries(new URLSearchParams(rawBody));

    console.log("PayFast Notification Received:", payfastData);

    const signature = payfastData.signature;
    delete payfastData.signature;

    const paramString = new URLSearchParams(payfastData).toString();
    const calculatedSignature = crypto
      .createHash("md5")
      .update(paramString + `&passphrase=${PAYFAST_SECRET}`)
      .digest("hex");

    if (calculatedSignature !== signature) {
      console.error("Invalid PayFast signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const isValid = await verifyPaymentWithPayFast(payfastData);

    if (!isValid) {
      console.error("Payment verification failed");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const { m_payment_id, pf_payment_id } = payfastData;

    console.log(`Payment Verified for Order ID: ${m_payment_id}`);

    const ordersSnapshot = await getDocs(collection(db, "orders"));
    let orderData;

    for (const orderDoc of ordersSnapshot.docs) {
      if (orderDoc.id === m_payment_id) {
        orderData = orderDoc.data();
        await updateDoc(orderDoc.ref, { isPaid: true, pf_payment_id });
        console.log(`Order ${m_payment_id} updated successfully.`);
      }
    }

    if (!orderData) {
      console.error("Order not found in Firestore");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send Email Notification
    const emailSent = await sendEmail({
      to: orderData.deliveryInfo.email, // Replace with the user's email stored in the order
      subject: `Order #${m_payment_id} Payment Successful`,
      text: `Your payment for order #${m_payment_id} has been successfully processed.`,
      html: `<p>Your payment for <strong>order #${m_payment_id}</strong> has been successfully processed.</p>`,
    });

    // Send SMS Notification
    const smsSent = await sendSMS({
      to: orderData.deliveryInfo.phone, // Replace with the user's phone stored in the order
      message: `Your payment for order #${m_payment_id} has been processed successfully. Thank you for shopping with us!`,
    });

    console.log(`Email Sent: ${emailSent}, SMS Sent: ${smsSent}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error handling PayFast notification:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function verifyPaymentWithPayFast(data) {
  const validationUrl = "https://www.payfast.co.za/eng/query/validate";
  const response = await fetch(validationUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data),
  });

  const result = await response.text();
  return result === "VALID";
}
