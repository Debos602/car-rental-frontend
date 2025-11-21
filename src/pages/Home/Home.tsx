import HeroSection from "../HeroSection";
import CommitmentSection from "./Commitment";
import CustomerTestimonials from "./CustomerTestimonials";
import FeaturedCars from "./FeaturedCar";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
    return (
        <div data-theme="light">
            <HeroSection />
            <FeaturedCars />
            <WhyChooseUs />
            <CustomerTestimonials />
            <CommitmentSection />
        </div>
    );
};

export default Home;
