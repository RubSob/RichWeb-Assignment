import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email, pname } = await req.json();

    //validate
    if (!email || !pname) {
      return NextResponse.json(
        { success: false, message: "Email and product name required" }
      );
    }

    //database connection
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    //inserting
    const cart = db.collection("shopping_cart");

    await cart.insertOne({
      email,
      pname,
      date: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    });

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
