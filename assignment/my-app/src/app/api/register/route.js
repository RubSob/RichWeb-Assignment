import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

//register
export async function POST(req) {
  try {
    //read user detail
    const { firstname, lastname, email, password } = await req.json();

    //validation
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" }
      );
    }

    //cnnect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("app");
    const users = db.collection("users");

    //check if email exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" }
      );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    await users.insertOne({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      account_type: "customer",
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });

  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }
    );
  }
}
