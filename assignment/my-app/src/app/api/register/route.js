import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  const body = await req.json();
  const { firstname, lastname, email, password } = body;

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("app");
  const users = db.collection("users");

  // Check if email already exists
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({
      success: false,
      message: "Email already registered."
    });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Insert user
  await users.insertOne({
    firstname,
    lastname,
    email,
    password: hashed,
    account_type: "customer"
  });

  return NextResponse.json({
    success: true,
    message: "Account created!"
  });
}
