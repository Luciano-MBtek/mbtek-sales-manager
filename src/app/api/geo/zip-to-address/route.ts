import { NextRequest, NextResponse } from "next/server";

const ZIPPO_TIMEOUT_MS = 2500; // 2.5 seconds timeout

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get("zip");
  const country = searchParams.get("country") || "US";

  // Input validation: empty zip returns 400
  if (!zip || zip.trim().length === 0) {
    return NextResponse.json(
      { error: "zip parameter is required" },
      { status: 400 }
    );
  }

  // Normalize postal code for API call
  const isCanada = /[a-zA-Z]/.test(zip);
  const apiCountry = isCanada ? "CA" : country.toUpperCase();
  const postalCode = isCanada ? zip.slice(0, 3).toUpperCase() : zip;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ZIPPO_TIMEOUT_MS);

    let response: Response;
    let data: any;

    try {
      response = await fetch(
        `https://api.zippopotam.us/${apiCountry}/${postalCode}`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        if (process.env.NODE_ENV === "development") {
          console.debug(
            `[zip-to-address] Zippopotam returned ${response.status} for ${apiCountry}/${postalCode}`
          );
        }
        return NextResponse.json({
          country: null,
          province: null,
          state: null,
          city: null,
          error: `Zippopotam returned ${response.status}`,
        });
      }

      data = await response.json();
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle timeout or network errors
      if (fetchError.name === "AbortError") {
        if (process.env.NODE_ENV === "development") {
          console.debug(
            `[zip-to-address] Timeout after ${ZIPPO_TIMEOUT_MS}ms for ${apiCountry}/${postalCode}`
          );
        }
        return NextResponse.json({
          country: null,
          province: null,
          state: null,
          city: null,
          error: "Request timeout",
        });
      }

      // Handle other fetch errors (521, network failures, etc.)
      if (process.env.NODE_ENV === "development") {
        console.debug(
          `[zip-to-address] Fetch error for ${apiCountry}/${postalCode}:`,
          fetchError.message
        );
      }
      return NextResponse.json({
        country: null,
        province: null,
        state: null,
        city: null,
        error: fetchError.message || "Network error",
      });
    }

    // Validate response structure
    if (!data.places || !Array.isArray(data.places) || data.places.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.debug(
          `[zip-to-address] No places found for ${apiCountry}/${postalCode}`
        );
      }
      return NextResponse.json({
        country: null,
        province: null,
        state: null,
        city: null,
        error: "No location data found",
      });
    }

    // Extract and normalize data
    const place = data.places[0];
    const placeName = place["place name"] || "";
    const city = placeName.includes("(")
      ? placeName.split("(")[0].trim()
      : placeName.trim();

    // For Canada: province is the abbreviation, state is full name
    // For US: province/state is the full state name
    const province = isCanada
      ? place["state abbreviation"] || null
      : place["state"] || null;
    
    // Full state/province name (used for display)
    const stateFullName = place["state"] || null;

    const countryName = isCanada ? "Canada" : "USA";

    if (process.env.NODE_ENV === "development") {
      console.debug(
        `[zip-to-address] Resolved ${apiCountry}/${postalCode} → ${countryName}, ${province}, ${city}`
      );
    }

    return NextResponse.json({
      country: countryName,
      province: province,
      state: stateFullName, // Full state/province name
      city: city,
    });
  } catch (error: any) {
    // Unexpected errors (should not happen, but handle gracefully)
    console.error("[zip-to-address] Unexpected error:", error);
    return NextResponse.json(
      {
        country: null,
        province: null,
        state: null,
        city: null,
        error: "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

