import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const queryString = request.nextUrl.search.slice(1);
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY is not set");
    return NextResponse.json({ features: [] }, { status: 500 });
  }

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?${queryString}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Autocomplete error: ${response.status}`, errorBody);
      return NextResponse.json({ features: [] }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Autocomplete fetch failed:", error);
    return NextResponse.json({ features: [] });
  }
}