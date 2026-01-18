import { useState } from "react";
import BookingCarList from "./BookingCarList";
import BookingList from "./BookingList";
import CustomSection from "@/components/CustomSection";
import image from "../../assets/about.png";

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
            <CustomSection
                image={image}
                title="Home/BookingList/Car"
                paragraph="Learn more about our company, our team, and our commitment to excellence."
            />
            <BookingList />
            <BookingCarList searchParams={searchParams} />
        </div>
    );
};

export default Booking;
