import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { id } = await req.json();

    //validation
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Item ID is required" }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    //removing from cart
    const cart = db.collection("shopping_cart");
    await cart.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {
    console.error("REMOVE CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
