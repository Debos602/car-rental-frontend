export const formatOnlyTime = (isoTime: string) => {
    if (!isoTime) return "";

    return new Date(isoTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // AM/PM
    });
};
