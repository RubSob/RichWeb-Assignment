import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");
    const cart = db.collection("shopping_cart");

    const items = await cart.find({ email }).toArray();

    return NextResponse.json({ success: true, items });

  } catch (err) {
    console.log("GET CART ERROR:", err);
    return NextResponse.json({ success: false });
  }
}
