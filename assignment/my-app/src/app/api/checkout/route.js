import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");
    const cart = db.collection("shopping_cart");
    const orders = db.collection("orders");

    // Get all cart items for user
    const items = await cart.find({ email }).toArray();

    if (items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart empty" });
    }

    // Create order document
    const order = {
      email,
      items,
      totalItems: items.length,
      date: new Date(),
    };

    // Insert into orders collection
    await orders.insertOne(order);

    // Clear cart after checkout
    await cart.deleteMany({ email });

    console.log("Order confirmation email sent to:", email);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.log("CHECKOUT ERROR:", err);
    return NextResponse.json({ success: false });
  }
}
