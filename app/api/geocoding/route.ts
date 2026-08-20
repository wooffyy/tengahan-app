import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 3) {
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Photon error: ${response.status}`, errorBody);
      return NextResponse.json([], { status: response.status === 429 ? 429 : 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Photon fetch failed:", error);
    return NextResponse.json([]);
  }
}