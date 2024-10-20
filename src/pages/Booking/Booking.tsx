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
        <div>
            <BookingSearch onSearch={handleSearch} />
            <BookingCarList searchParams={searchParams} />
            <BookingList />
            <BookingForm />
        </div>
    );
};

export default Booking;
