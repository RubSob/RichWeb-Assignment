import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://root:myPassword123@cluster0.kcvhuf2.mongodb.net/?retryWrites=true&w=majority";

export async function POST(req) {
  console.log("In the /api/login route");

  try {
    const { email, pass } = await req.json();
    const loginName = email; 

    console.log("Login attempt:", loginName);

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");
    const collection = db.collection("login");

    const user =
      (await collection.findOne({ email: loginName })) ||
      (await collection.findOne({ username: loginName }));

    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ success: false });
    }

    console.log("Found user role:", user.acc_type);
    console.log("Typed pass:", pass);
    console.log("Stored pass:", user.pass);

    let validPass = false;

    if (typeof user.pass === "string" && user.pass.startsWith("$2")) {
      validPass = await bcrypt.compare(pass, user.pass);
      console.log("bcrypt.compare result:", validPass);
    } else {
      
      validPass = pass === user.pass;
      console.log("Plaintext compare result:", validPass);
    }

    if (!validPass) {
      console.log("Password incorrect");
      return NextResponse.json({ success: false });
    }

    console.log("Login valid!");
    return NextResponse.json({
      success: true,
      role: user.acc_type,
      email: user.email || user.username,
    });
  } catch (err) {
    console.error("LOGIN API ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
