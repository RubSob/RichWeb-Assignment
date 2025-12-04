import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri =
  "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // must match frontend

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");

    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Email not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password",
      });
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      account_type: user.account_type,
    });
  } catch (err) {
    console.log("LOGIN API ERROR:", err);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
