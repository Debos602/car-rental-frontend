import { useState } from "react";
import BookingSearch from "@/components/BookingSearch";
import BookingCarList from "./BookingCarList";
import BookingForm from "./BookingForm";
import BookingList from "./BookingList";

const Booking = () => {
    const [searchParams, setSearchParams] = useState({
        location: "",
        startDate: "",
        endDate: "",
    });

    const handleSearch = (
        location: string,
        startDate: string,
        endDate: string
    ) => {
        setSearchParams({ location, startDate, endDate });
    };

    return (
        <div data-theme="light">
            <BookingSearch onSearch={handleSearch} />
            <BookingList />
            <BookingForm />
            <BookingCarList searchParams={searchParams} />

        </div>
    );
};

export default Booking;
