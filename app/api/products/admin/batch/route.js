import { db } from "@/lib/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

export async function POST(request) {
  try {
    const data = await request.json(); // Expecting products data as JSON
    const batch = writeBatch(db);
    const productsCollection = collection(db, "products");

    // Iterate through products and add them to Firestore
    for (const [productId, productData] of Object.entries(data.products)) {
      const productRef = doc(productsCollection, productId); // Use `doc` for unique product IDs
      batch.set(productRef, productData);
    }

    // Commit the batch operation
    await batch.commit();

    return new Response(JSON.stringify({ message: "Products added successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding products:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
