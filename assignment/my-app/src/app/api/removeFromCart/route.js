import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { id } = await req.json();

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");
    const cart = db.collection("shopping_cart");

    await cart.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("REMOVE CART ERROR:", err);
    return NextResponse.json({ success: false });
  }
}
