type RangeString = { from?: string; to?: string };

export function getDateRange(
  { from, to }: RangeString = {},
  fallback?: () => { from: Date; to: Date }
) {
  // default = first day of this month ➜ now
  const today = new Date();
  const def = fallback?.() ?? {
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  };

  const safe = (d: string | undefined, alt: Date) => {
    const parsed = d ? new Date(d) : alt;
    return isNaN(parsed.getTime()) ? alt : parsed;
  };

  const fromDate = safe(from, def.from);
  const toDate = safe(to, def.to);

  return {
    from,
    to,
    fromDate,
    toDate,
    fromISO: fromDate.toISOString(),
    toISO: toDate.toISOString(),
    durationMs: toDate.getTime() - fromDate.getTime(),
  };
}

export function getPreviousRange(r: { fromDate: Date; durationMs: number }) {
  const previousTo = new Date(r.fromDate.getTime() - 1); // 1 ms earlier
  const previousFrom = new Date(previousTo.getTime() - r.durationMs);
  return { previousFrom, previousTo };
}
