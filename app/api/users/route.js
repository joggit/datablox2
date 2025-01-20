import { NextResponse } from "next/server";
import { addDocument, getAllDocuments } from "@/lib/firestore";

export async function GET() {
  try {
    const users = await getAllDocuments("users");
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, address } = body;
    const id = await addDocument("users", { email, name, address });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
