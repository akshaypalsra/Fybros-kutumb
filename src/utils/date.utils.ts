
export const toIsoStart = (date: string): string =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

export const toIsoEnd = (date: string): string =>
    new Date(`${date}T23:59:59.999Z`).toISOString();

export const toIsoDateRange = (
    fromDate?: string,
    toDate?: string,
): { fromDateIso?: string; toDateIso?: string } => ({
    fromDateIso: fromDate ? toIsoStart(fromDate) : undefined,
    toDateIso: toDate ? toIsoEnd(toDate) : undefined,
});