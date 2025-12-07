import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" }
      );
    }

    //connect MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    //collections
    const cart = db.collection("shopping_cart");
    const orders = db.collection("orders");

    const items = await cart.find({ email }).toArray();

    if (!items.length) {
      return NextResponse.json({
        success: false,
        message: "Your cart is empty",
      });
    }

    //new order
    const newOrder = {
      email,
      items,
      totalItems: items.length,
      date: new Date(),
    };

    //inserting
    await orders.insertOne(newOrder);

    //clear
    await cart.deleteMany({ email });

    console.log(`Order placed successfully for: ${email}`);

    return NextResponse.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
