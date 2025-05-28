"use server";

import pLimit from "p-limit";

const API = "https://api.hubapi.com";
const KEY = process.env.HUBSPOT_API_KEY!;
if (!KEY) throw new Error("HUBSPOT_API_KEY is not defined");

const limiter = pLimit(20); // max 5 concurrent requests
let MIN_GAP = 200; // ≥250 ms between calls  ≈4 rps
let lastCall = 0;

interface HubSpotRateLimitInfo {
  daily: {
    limit: number;
    remaining: number;
  };
}

function getRateLimitInfo(headers: Headers): HubSpotRateLimitInfo {
  return {
    daily: {
      limit: Number(headers.get("x-hubspot-ratelimit-daily") ?? 0),
      remaining: Number(
        headers.get("x-hubspot-ratelimit-daily-remaining") ?? 0
      ),
    },
  };
}

function calculateBackoff(rateLimitInfo: HubSpotRateLimitInfo): number {
  const { daily } = rateLimitInfo;

  // Si quedan menos del 5% de las llamadas diarias, esperamos más tiempo
  if (daily.remaining < daily.limit * 0.05) {
    return 2000; // 2 segundos
  }

  // Si quedan menos del 20% de las llamadas diarias, esperamos un poco
  if (daily.remaining < daily.limit * 0.2) {
    return 1000; // 1 segundo
  }

  return 500; // medio segundo por defecto
}

export async function hsFetch<T>(
  path: string,
  init: RequestInit & { method: "GET" | "POST" }
): Promise<T> {
  return limiter(async () => {
    /* ──  keep global spacing  ─────────────────────────────── */
    const gap = MIN_GAP - (Date.now() - lastCall);
    if (gap > 0) await new Promise((r) => setTimeout(r, gap));
    lastCall = Date.now();

    /* ──  real request  ────────────────────────────────────── */
    const res = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      ...init,
    });

    console.log("Res:", res.status);

    /* ──  handle rate limits  ───────────────────────────────── */
    const rateLimitInfo = getRateLimitInfo(res.headers);

    if (res.status === 429) {
      console.log("Rate limit info:", rateLimitInfo);
      const backoffTime = calculateBackoff(rateLimitInfo);
      console.log(`Backing off for ${backoffTime}ms`);

      await new Promise((r) => setTimeout(r, backoffTime));
      return hsFetch(path, init); // single retry
    }

    // Ajusta el espaciado para futuras llamadas basado en los límites actuales
    if (rateLimitInfo.daily.remaining) {
      const newGap = calculateBackoff(rateLimitInfo);
      if (newGap > MIN_GAP) {
        console.log(`Adjusting minimum gap to ${newGap}ms due to rate limits`);
        MIN_GAP = newGap;
      }
    }

    if (!res.ok) throw new Error(`HubSpot ${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
  });
}
