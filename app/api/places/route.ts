import {  NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
        return NextResponse.json([]);
    }

    const radius = 1000;
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
        console.error("GEOAPIFY_API_KEY is not defined");
        return NextResponse.json({ error: "GEOAPIFY_API_KEY is not defined" }, { status: 500 });
    }

    const categories = "catering.restaurant,catering.cafe";
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radius}&limit=20&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Geoapify error: ${response.status}`, errorBody);
            return NextResponse.json([], { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Geoapify fetch failed:", error);
        return NextResponse.json([], { status: 500 });
    }
}