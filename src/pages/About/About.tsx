import image from "../../assets/about.png";
import image2 from "../../assets/shop.jpg";
import team1 from "../../assets/team.jpg";
import team2 from "../../assets/team2.jpg";
import team3 from "../../assets/team3.jpg";
import team4 from "../../assets/team4.jpg";
import backgroundImage from "../../assets/about.png";
import carRight from "../../assets/car-right.png";
import carLeft from "../../assets/commit.jpg";
import CustomSection from "@/components/CustomSection";
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";

const About = () => {
    const bgImage = {
        backgroundImage: `url(${backgroundImage})`,
    };

    const { ref: commitmentRef, inView: commitmentInView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div data-theme="light" className="overflow-hidden bg-gradient-to-b from-white to-[#D2691E]/10">
            {/* Hero About Section with Full-Width Overlay */}
            <CustomSection style={bgImage} title="Our Story" paragraph="Discover the journey that drives us to deliver exceptional car rental experiences, blending passion with excellence." image={image} />

            {/* Company History - Symmetric Two-Column Layout */}
            {/* Company History - Asymmetrical Layout */}
            <motion.section
                className="py-20 bg-[#FFF6E9]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        {/* Image taking more space */}
                        <motion.div
                            className="lg:col-span-2 order-2 lg:order-1"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <img
                                src={image2}
                                className="w-full object-cover rounded-3xl shadow-2xl transform rotate-3"
                                alt="Company Image"
                            />
                        </motion.div>
                        {/* Text with offset */}
                        <motion.div
                            className="lg:col-span-1 order-1 lg:order-2 bg-white p-8 rounded-3xl shadow-xl -mt-10 lg:-ml-20 z-10"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-semibold text-[#FF7F3E] mb-4">
                                A Legacy of Excellence
                            </h2>
                            <p className="text-[#4335A7] text-lg mb-6">
                                Founded in 2000, our mission is to provide the best car rental experience possible.
                            </p>
                            <p className="text-[#0f2e3f] text-base">
                                Our vision is to lead the industry in customer satisfaction and innovation, blending tradition with cutting-edge technology.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Our Team - Grid Layout with 2x2 Cards */}
            <motion.section
                className="py-24 bg-[#D2691E]/5 relative overflow-hidden"
                ref={teamRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: teamInView ? 1 : 0 }}
                transition={{ duration: 1 }}
            >
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-bold text-black mb-16 text-center tracking-tight">
                        Meet Our Exceptional Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Team Member 1 */}
                        <motion.div
                            className="group bg-white p-6 rounded-2xl shadow-lg border border-black/10 hover:shadow-2xl hover:border-[#D2691E] transition-all duration-300"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: teamInView ? 0 : 50, opacity: teamInView ? 1 : 0 }}
                            transition={{ duration: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-40 h-40 mx-auto relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-[#D2691E] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <img
                                    src={team1}
                                    alt="Team Member 1"
                                    className="object-cover rounded-full shadow-xl border-4 border-black/50 group-hover:border-[#D2691E] transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium shadow-md transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-110">
                                    Leader
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#D2691E] transition-colors duration-300">Jane Doe</h3>
                                <p className="text-[#D2691E] font-medium text-md mb-3">CEO</p>
                                <p className="text-black leading-relaxed group-hover:text-[#D2691E] transition-colors duration-300">
                                    Leading with vision and passion since day one.
                                </p>
                                <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">LinkedIn</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Twitter</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Email</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Team Member 2 */}
                        <motion.div
                            className="group bg-white p-6 rounded-2xl shadow-lg border border-black/10 hover:shadow-2xl hover:border-[#D2691E] transition-all duration-300"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: teamInView ? 0 : 50, opacity: teamInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-40 h-40 mx-auto relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-[#D2691E] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <img
                                    src={team2}
                                    alt="Team Member 2"
                                    className="object-cover rounded-full shadow-xl border-4 border-black/50 group-hover:border-[#D2691E] transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#D2691E] text-white px-4 py-1 rounded-full text-sm font-medium shadow-md transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-110">
                                    Finance Expert
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#D2691E] transition-colors duration-300">Bob Lee</h3>
                                <p className="text-[#D2691E] font-medium text-md mb-3">CFO</p>
                                <p className="text-black leading-relaxed group-hover:text-[#D2691E] transition-colors duration-300">
                                    Ensuring financial stability and growth.
                                </p>
                                <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">LinkedIn</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Twitter</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Email</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Team Member 3 */}
                        <motion.div
                            className="group bg-white p-6 rounded-2xl shadow-lg border border-black/10 hover:shadow-2xl hover:border-[#D2691E] transition-all duration-300"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: teamInView ? 0 : 50, opacity: teamInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-40 h-40 mx-auto relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-[#D2691E] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <img
                                    src={team3}
                                    alt="Team Member 3"
                                    className="object-cover rounded-full shadow-xl border-4 border-black/50 group-hover:border-[#D2691E] transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium shadow-md transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-110">
                                    Marketing Guru
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#D2691E] transition-colors duration-300">Emma Brown</h3>
                                <p className="text-[#D2691E] font-medium text-md mb-3">CMO</p>
                                <p className="text-black leading-relaxed group-hover:text-[#D2691E] transition-colors duration-300">
                                    Driving marketing strategies that connect.
                                </p>
                                <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">LinkedIn</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Twitter</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Email</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Team Member 4 */}
                        <motion.div
                            className="group bg-white p-6 rounded-2xl shadow-lg border border-black/10 hover:shadow-2xl hover:border-[#D2691E] transition-all duration-300"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: teamInView ? 0 : 50, opacity: teamInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-40 h-40 mx-auto relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-[#D2691E] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <img
                                    src={team4}
                                    alt="Team Member 4"
                                    className="object-cover rounded-full shadow-xl border-4 border-black/50 group-hover:border-[#D2691E] transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#D2691E] text-white px-4 py-1 rounded-full text-sm font-medium shadow-md transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-110">
                                    Tech Innovator
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#D2691E] transition-colors duration-300">Daniel White</h3>
                                <p className="text-[#D2691E] font-medium text-md mb-3">Engineer</p>
                                <p className="text-black leading-relaxed group-hover:text-[#D2691E] transition-colors duration-300">
                                    Innovating solutions for seamless operations.
                                </p>
                                <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">LinkedIn</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Twitter</a>
                                    <a href="#" className="text-black hover:text-[#D2691E] transition-colors duration-200">Email</a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Values & Commitment - Full-Width with Centered Content */}
            <section className="py-24 bg-gradient-to-b from-black to-[#D2691E] text-white" ref={commitmentRef}>
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        className="max-w-3xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{
                            y: commitmentInView ? 0 : 50,
                            opacity: commitmentInView ? 1 : 0,
                        }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-5xl font-bold mb-8">
                            Our Values & Commitment
                        </h3>
                        <p className="text-xl mb-10">
                            At the heart of our operations is a dedication to exceptional customer service and sustainability.
                        </p>
                        <p className="text-lg">
                            We minimize environmental impact while delivering innovative solutions that exceed expectations.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                        <motion.img
                            src={carLeft}
                            alt="Car"
                            className="object-cover rounded-2xl shadow-2xl mx-auto"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: commitmentInView ? 1 : 0.8,
                                opacity: commitmentInView ? 1 : 0,
                            }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        <motion.img
                            src={carRight}
                            alt="Secondary Car"
                            className="object-cover rounded-2xl shadow-2xl mx-auto"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: commitmentInView ? 1 : 0.8,
                                opacity: commitmentInView ? 1 : 0,
                            }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;