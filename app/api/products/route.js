import { NextResponse } from "next/server";
import { addDocument, getAllDocuments } from "../../../lib/firestore";

export async function GET() {
  try {
    const products = await getAllDocuments("products");
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, price, category, stock } = body;
    const id = await addDocument("products", { name, description, price, category, stock });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
