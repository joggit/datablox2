export async function GET(req) {
  try {
    console.log("Cancel URL called.");

    // Redirect to a cancel page
    return Response.redirect(process.env.NEXT_PUBLIC_CANCEL_PAGE_URL);
  } catch (error) {
    console.error("Error handling Cancel URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process cancel URL" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
