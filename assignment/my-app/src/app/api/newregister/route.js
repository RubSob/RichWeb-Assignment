import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

  //myPassword123

export async function POST(req) {
  const { email, username, pass, acc_type } = await req.json();

  if (!email && !username) {
    return NextResponse.json(
      { success: false, message: "Email or username is required" },
      { status: 400 }
    );
  }

  if (!pass) {
    return NextResponse.json(
      { success: false, message: "Password is required" },
      { status: 400 }
    );
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("app");
  const collection = db.collection("login");

  const finalUsername = username || email;

  const existing = await collection.findOne({
    $or: [{ email }, { username: finalUsername }],
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 400 }
    );
  }

  // 🔐 HASH THE PASSWORD HERE
  const hash = await bcrypt.hash(pass, 10);

  const doc = {
    email,
    username: finalUsername,
    pass: hash,        // store hash, not plain password
    acc_type: acc_type || "customer",
  };

  await collection.insertOne(doc);

  return NextResponse.json({
    success: true,
    message: "User registered",
  });
}
