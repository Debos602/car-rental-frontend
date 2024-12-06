
import image from "../../assets/about.png";
import image2 from "../../assets/shop.jpg";
import team1 from "../../assets/team.png";
import team2 from "../../assets/team2.png";
import team3 from "../../assets/team3.png";
import team4 from "../../assets/team4.png";
import backgroundImage from "../../assets/about-banner.jpg";
import carRight from "../../assets/car-right.png";
import carLeft from "../../assets/commit.jpg";
import CustomSection from "@/components/CustomSection";
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";


const About = () => {
    const bgImage = {
        backgroundImage: `url(${backgroundImage})`,
    };

    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <div>
            {/* About Section */}
            <CustomSection
                image={image}
                title="About Us"
                paragraph="Learn more about our company, our team, and our commitment to excellence."
            />

            {/* Company History */}
            <motion.section
                className="py-16 bg-[#FFF6E9]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column (Text) */}
                        <div className="flex justify-center items-center">
                            <motion.div
                                className="w-96"
                                initial={{ x: -100, opacity: 0 }}  // Start from the left side
                                animate={{ x: 0, opacity: 1 }}    // Move to the normal position
                                transition={{ duration: 1 }}
                            >
                                <h2 className="text-2xl font-medium text-[#FF7F3E] mb-2">
                                    Company History
                                </h2>

                                <p className="text-3xl font-bold text-[#4335A7] mb-4">
                                    A Legacy of Excellence
                                </p>
                                <p className="text-lg text-[#0f2e3f] mb-10">
                                    Founded in 2000, our mission is to provide
                                    the best car rental experience possible. Our
                                    vision is to lead the industry in customer
                                    satisfaction and innovation.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Column (Image) */}
                        <motion.div
                            className="w-full"
                            initial={{ x: 100, opacity: 0 }}  // Start from the right side
                            animate={{ x: 0, opacity: 1 }}    // Move to the normal position
                            transition={{ duration: 1 }}
                        >
                            <motion.img
                                src={image2}
                                className="w-full object-cover"
                                alt="Company Image"
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1 }}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Our Team */}
            <motion.section
                className="py-16 bg-gradient-to-t to-[#4335A7] from-[#FFF6E9] relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-7xl font-thin text-[#FF7F3E] mb-4 text-center">
                        Our Team
                    </h2>
                    <div className="grid grid-cols-1 gap-8">
                        {/* First Row */}
                        <motion.div
                            className="grid grid-cols-2 gap-8"
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }} // Ensures the animation happens only once when in view
                        >
                            <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
                                <img
                                    src={team1}
                                    alt="Team Member 1"
                                    className="w-48 max-w-full object-cover mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-[#80C4E9]">Jane Doe</h3>
                                <p className="text-[#FFF6E9]">CEO</p>
                            </div>
                            <div className="rounded-lg p-6 text-center relative">
                                <div className="absolute rounded-tr-2xl bottom-2 left-2 transform h-1/2 w-1/2 border-t-2 border-r-2 border-[#FF7F3E]"></div>
                            </div>
                        </motion.div>

                        {/* Second Row with reverse order */}
                        <motion.div
                            className="grid grid-cols-2 gap-8 flex-row-reverse"
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="rounded-lg p-6 text-center relative">
                                <div className="absolute rotate-180 rounded-tr-2xl top-2 right-2 transform h-1/2 w-1/2 border-t-2 border-r-2 border-[#FF7F3E]"></div>
                            </div>
                            <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
                                <img
                                    src={team2}
                                    alt="Team Member 2"
                                    className="w-48 max-w-full object-cover mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-[#80C4E9]">Bob Lee</h3>
                                <p className="text-[#FFF6E9]">CFO</p>
                            </div>
                        </motion.div>

                        {/* Third Row */}
                        <motion.div
                            className="grid grid-cols-2 gap-8"
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
                                <img
                                    src={team3}
                                    alt="Team Member 3"
                                    className="w-48 max-w-full object-cover mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-[#80C4E9]">Emma Brown</h3>
                                <p className="text-[#FFF6E9]">CMO</p>
                            </div>
                            <div className="rounded-lg p-6 text-center relative">
                                <div className="absolute rounded-tr-2xl bottom-2 left-2 transform h-1/2 w-1/2 border-t-2 border-r-2 border-[#FF7F3E]"></div>
                            </div>
                        </motion.div>

                        {/* Fourth Row with reverse order */}
                        <motion.div
                            className="grid grid-cols-2 gap-8 flex-row-reverse"
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="rounded-lg p-6 text-center relative">
                                <div className="absolute rotate-180 rounded-tr-2xl top-2 right-2 transform h-1/2 w-1/2 border-t-2 border-r-2 border-[#FF7F3E]"></div>
                            </div>
                            <div className="bg-white shadow-lg rounded-3xl p-6 text-center">
                                <img
                                    src={team4}
                                    alt="Team Member 4"
                                    className="w-48 max-w-full object-cover mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-[#80C4E9]">Daniel White</h3>
                                <p className="text-[#FFF6E9]">Engineer</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <section
                ref={ref} // Add the ref to the section element
                className="py-16 bg-gradient-to-l from-[#4335A7] to-[#80C4E9] bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={bgImage}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Content - Text Section */}
                        <motion.div
                            className="flex justify-center items-center"
                            initial={{ x: -100, opacity: 0 }} // Start off-screen to the left
                            animate={{ x: 0, opacity: 1 }} // Animate to center screen
                            exit={{ x: -100, opacity: 0 }} // Exit back to the left
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                        >
                            <div className="w-96">
                                <h2 className="text-2xl font-medium text-[#FF7F3E] mb-4">
                                    Our Fleet
                                </h2>
                                <p className="text-3xl font-bold text-[#4335A7] mb-4">
                                    Explore Our Fleet
                                </p>
                                <p className="text-lg text-[#0f2e3f] mb-4">
                                    We offer a diverse range of vehicles including economy cars, luxury vehicles, SUVs, and more.
                                    Whether you need a car for a day or a week, we have the perfect option for you.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Content - Image Section */}
                        <motion.img
                            src={carRight}
                            alt="Car Fleet"
                            className="object-cover h-full w-full transition-all duration-700"
                            initial={{ x: 100, opacity: 0 }} // Start off-screen to the right
                            animate={{ x: 0, opacity: 1 }} // Animate to center screen
                            exit={{ x: 100, opacity: 0 }} // Exit back to the right
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </section>


            {/* Values & Commitment */}
            <section className="py-16 bg-gray-900 text-[#FFF6E9]" ref={ref}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.img
                            src={carLeft}
                            alt="Car"
                            className="object-cover"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{
                                x: inView ? 0 : -100,       // Animate from left to right when in view
                                opacity: inView ? 1 : 0,     // Fade in when in view
                            }}
                            transition={{ duration: 0.8 }}
                        />
                        <motion.div
                            className="flex flex-col justify-center w-96 self-center"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{
                                x: inView ? 0 : 100,       // Animate from right to left when in view
                                opacity: inView ? 1 : 0,    // Fade in when in view
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-3xl font-medium text-[#FF7F3E] mb-4">
                                Commitment
                            </h3>
                            <p className="text-3xl font-bold mb-6">
                                Values & Commitment
                            </p>
                            <p className="text-lg">
                                Our commitment to customer service and sustainability is at the core of everything we
                                do. We strive to offer exceptional service while minimizing our environmental impact.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
