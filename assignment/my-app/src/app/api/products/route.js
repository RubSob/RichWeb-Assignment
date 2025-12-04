import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");
    const collection = db.collection("products");

    const products = await collection.find({}).toArray();

    return NextResponse.json(products);
  } catch (err) {
    console.error("PRODUCT API ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
