// In ./components/BookingButton.tsx

import { FC } from 'react'; // Assuming you're using functional components

interface Props {
    isAvailable: boolean;
    loading: boolean;
    onBook: () => Promise<void>;
    isDisabled: boolean; // Add this line
}

const BookingButton: FC<Props> = ({ isAvailable, loading, onBook, isDisabled }) => {
    return (
        <button
            className="btn btn-primary w-full"
            disabled={loading || isDisabled || !isAvailable} // Update to respect isDisabled
            onClick={onBook}
        >
            {loading ? 'Booking...' : 'Book Now'}
        </button>
    );
};

export default BookingButton;