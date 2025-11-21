import CustomSection from "@/components/CustomSection";
import image from "../../assets/about.png";
import CarList from "./CarList";

const Car = () => {
    return (
        <div data-theme="light">
            <CustomSection
                image={image}
                title="Home/Car List/Car"
                paragraph="Learn more about our company, our team, and our commitment to excellence."
            />
            <CarList></CarList>
        </div>
    );
};

export default Car;
