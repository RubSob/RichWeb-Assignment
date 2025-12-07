import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    //getting cart items
    const cart = db.collection("shopping_cart");
    const items = await cart.find({ email }).toArray();

    return NextResponse.json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
