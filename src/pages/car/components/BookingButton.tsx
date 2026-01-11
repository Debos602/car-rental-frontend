import React from "react";

type Props = {
    isAvailable: boolean;
    loading?: boolean;
    onBook: () => void;
    isDisabled?: boolean;
};

const BookingButton: React.FC<Props> = ({ isAvailable, loading = false, onBook }) => {
    return (
        <div className="flex justify-end mt-6">
            <button
                type="button"
                onClick={onBook}
                disabled={!isAvailable || loading}
                aria-disabled={!isAvailable || loading}
                className={`mt-2 inline-block bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate  text-black font-bold uppercase px-6 py-3 rounded-lg shadow-lg hover:shadow-xl ${!isAvailable || loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
            >
                {loading ? "Booking…" : isAvailable ? "Book Now" : "Unavailable"}
            </button>
        </div>
    );
};

export default BookingButton;
