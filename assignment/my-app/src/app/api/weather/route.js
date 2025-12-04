import { NextResponse } from "next/server";

export async function GET() {
  // Fake weather for assignment
  const fakeWeather = {
    temp: 12,          // any number you want
    desc: "Cloudy",    // any description you want
  };

  return NextResponse.json(fakeWeather);
}
