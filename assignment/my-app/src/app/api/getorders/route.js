import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    const ordersCollection = db.collection("orders");

    //getting all orders, newest first
    const orders = await ordersCollection.find().sort({ date: -1 }).toArray();

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
