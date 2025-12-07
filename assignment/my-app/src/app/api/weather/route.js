import { NextResponse } from "next/server";

export async function GET() {
  const fakeWeather = {
    temp: 12,       
    desc: "Rainy",  
  };

  return NextResponse.json(fakeWeather);
}
