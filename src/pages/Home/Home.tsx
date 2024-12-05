import HeroSection from "../HeroSection";
import CommitmentSection from "./Commitment";
import CustomerTestimonials from "./CustomerTestimonials";
import FeaturedCars from "./FeaturedCar";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
    return (
        <div>
            <HeroSection />
            <FeaturedCars />
            <WhyChooseUs />
            <CustomerTestimonials />
            <CommitmentSection />
        </div>
    );
};

export default Home;
