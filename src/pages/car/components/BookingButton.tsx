import React from "react";

type Props = {
    isAvailable: boolean;
    loading?: boolean;
    onBook: () => void;
    isDisabled?: boolean;
};

const BookingButton: React.FC<Props> = ({ isAvailable, loading = false, onBook }) => {
    const isDisabled = !isAvailable || loading;

    return (
        <div className="mt-6 flex justify-end">
            <button
                type="button"
                onClick={onBook}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                className={`group relative overflow-hidden rounded-full border px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] transition-all duration-300 ${
                    isDisabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 shadow-none"
                        : "border-[#3d1d13] bg-gradient-to-r from-[#3d1d13] via-[#7c2d12] to-[#b45309] text-white shadow-[0_18px_35px_rgba(124,45,18,0.35)] hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(124,45,18,0.42)]"
                }`}
            >
                <span className="absolute inset-y-0 left-0 w-1/3 bg-white/10 blur-xl transition-all duration-300 group-hover:translate-x-8" />
                <span className="relative flex items-center justify-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] ${
                        isDisabled ? "border-slate-300 bg-slate-200 text-slate-500" : "border-white/30 bg-white/10 text-white"
                    }`}>
                        {loading ? "•" : "→"}
                    </span>
                    <span>{loading ? "Booking…" : isAvailable ? "Book Now" : "Unavailable"}</span>
                </span>
            </button>
        </div>
    );
};

export default BookingButton;
