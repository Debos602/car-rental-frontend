export function formatISOOrTime(value?: string | null) {
    if (!value) return "";
    // Detect ISO datetime (simple check)
    const isoMatch = /^\d{4}-\d{2}-\d{2}T/.test(value);
    if (isoMatch) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            return d.toLocaleString(undefined, {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    }

    // If it's an HH:mm or H:mm string, format to 2-digit hour with AM/PM
    const timeMatch = /^\d{1,2}:\d{2}/.test(value);
    if (timeMatch) {
        const [hh, mm] = value.split(":");
        const d = new Date();
        d.setHours(Number(hh), Number(mm), 0, 0);
        return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    }

    // Fallback: return as-is
    return value;
}

export function formatTimeRange(start?: string | null, end?: string | null) {
    if (!start && !end) return "";
    // If both are ISO and same date, show date once and times
    const startIso = /^\d{4}-\d{2}-\d{2}T/.test(start || "");
    const endIso = /^\d{4}-\d{2}-\d{2}T/.test(end || "");
    if (startIso && endIso && start && end) {
        const sd = new Date(start);
        const ed = new Date(end);
        if (!isNaN(sd.getTime()) && !isNaN(ed.getTime())) {
            const sameDate = sd.toDateString() === ed.toDateString();
            const timeStart = sd.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
            const timeEnd = ed.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
            if (sameDate) {
                const date = sd.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
                return `${date} • ${timeStart} - ${timeEnd}`;
            }
            // different dates
            const startFmt = sd.toLocaleString(undefined, { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
            const endFmt = ed.toLocaleString(undefined, { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
            return `${startFmt} → ${endFmt}`;
        }
    }

    // Fallback to formatting each
    const s = formatISOOrTime(start || "");
    const e = formatISOOrTime(end || "");
    if (s && e) return `${s} - ${e}`;
    return s || e || "";
}
