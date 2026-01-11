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
import { FaLinkedin, FaTwitter, FaEnvelope, FaStar, FaHandshake, FaLeaf, FaCar } from "react-icons/fa";

const About = () => {
    const bgImage = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(210, 105, 30, 0.3)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const { ref: commitmentRef, inView: commitmentInView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.2 });

    const values = [
        { icon: <FaStar />, title: "Excellence", desc: "Uncompromising quality in every service we provide" },
        { icon: <FaHandshake />, title: "Integrity", desc: "Honest, transparent, and trustworthy in all dealings" },
        { icon: <FaLeaf />, title: "Sustainability", desc: "Eco-friendly practices for a greener future" },
        { icon: <FaCar />, title: "Innovation", desc: "Constantly evolving to meet your needs" }
    ];

    const teamMembers = [
        { img: team1, name: "Jane Doe", role: "CEO", tag: "Leader", desc: "Leading with vision and passion since day one." },
        { img: team2, name: "Bob Lee", role: "CFO", tag: "Finance Expert", desc: "Ensuring financial stability and sustainable growth." },
        { img: team3, name: "Emma Brown", role: "CMO", tag: "Marketing Guru", desc: "Driving marketing strategies that truly connect." },
        { img: team4, name: "Daniel White", role: "CTO", tag: "Tech Innovator", desc: "Innovating solutions for seamless operations." }
    ];

    return (
        <div data-theme="light" className="overflow-hidden bg-gradient-to-b from-white to-[#D2691E]/10">
            {/* Hero About Section */}
            <div className="relative min-h-[80vh] flex items-center justify-center" style={bgImage}>
                <div className="absolute inset-0 bg-black/40"></div>
                <motion.div
                    className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Our <span className="text-[#D2691E]">Story</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                        Discover the journey that drives us to deliver exceptional car rental experiences,
                        blending passion with excellence since 2000.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                            24/7 Service
                        </span>
                        <span className="px-6 py-2 bg-[#D2691E] text-white rounded-full">
                            500+ Happy Clients
                        </span>
                        <span className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                            Nationwide Coverage
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Company History */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E9] via-white to-[#D2691E]/5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            A Legacy of <span className="text-[#D2691E]">Excellence</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Founded with a vision to revolutionize car rentals through exceptional service
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="relative"
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                <img
                                    src={image2}
                                    className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                                    alt="Our Showroom"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-[#D2691E] text-white p-6 rounded-2xl shadow-xl">
                                    <p className="text-2xl font-bold">20+ Years</p>
                                    <p className="text-sm">Of Excellence</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="space-y-6"
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-[#FF7F3E] mb-4">Our Mission</h3>
                                <p className="text-gray-700 mb-6">
                                    To provide seamless, reliable, and affordable car rental solutions that empower
                                    our customers to travel with confidence and comfort.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-[#4335A7] mb-4">Our Vision</h3>
                                <p className="text-gray-700">
                                    To become the most trusted car rental service globally, known for innovation,
                                    sustainability, and unparalleled customer satisfaction.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#D2691E]">500+</div>
                                    <div className="text-gray-600">Vehicles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#D2691E]">50+</div>
                                    <div className="text-gray-600">Locations</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#D2691E]">98%</div>
                                    <div className="text-gray-600">Satisfaction</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section ref={valuesRef} className="py-24 bg-gradient-to-r from-black to-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: valuesInView ? 1 : 0, y: valuesInView ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Core <span className="text-[#D2691E]">Values</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            The principles that guide every decision we make
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 hover:border-[#D2691E] transition-all duration-300 hover:-translate-y-2"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: valuesInView ? 1 : 0, y: valuesInView ? 0 : 50 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl text-[#D2691E] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-gray-300">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section
                ref={teamRef}
                className="py-24 bg-gradient-to-b from-white to-[#D2691E]/10 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2691E]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4335A7]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: teamInView ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Meet Our <span className="text-[#D2691E]">Leadership</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The passionate individuals driving our success forward
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: teamInView ? 1 : 0, y: teamInView ? 0 : 50 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4 bg-[#D2691E] text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {member.tag}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                                    <p className="text-[#D2691E] font-medium mb-4">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-6">{member.desc}</p>

                                    <div className="flex gap-4">
                                        <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#D2691E] hover:text-white transition-colors duration-300">
                                            <FaLinkedin />
                                        </a>
                                        <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#D2691E] hover:text-white transition-colors duration-300">
                                            <FaTwitter />
                                        </a>
                                        <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#D2691E] hover:text-white transition-colors duration-300">
                                            <FaEnvelope />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment Section - FIXED VERSION */}
            <section ref={commitmentRef} className="py-24 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
                {/* Simplified background pattern without complex SVG string */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[length:60px_60px]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D2691E' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-4xl mx-auto text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: commitmentInView ? 1 : 0, y: commitmentInView ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-4xl md:text-5xl font-bold mb-6">
                            Our <span className="text-[#D2691E]">Commitment</span> to You
                        </h3>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            We're dedicated to providing exceptional service while minimizing our environmental footprint.
                            Every rental contributes to a greener future through our sustainability initiatives.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="space-y-8"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: commitmentInView ? 0 : -100, opacity: commitmentInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                                <h4 className="text-xl font-bold text-white mb-3">Eco-Friendly Fleet</h4>
                                <p className="text-gray-300">30% of our vehicles are hybrid or electric, with plans to reach 50% by 2025.</p>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                                <h4 className="text-xl font-bold text-white mb-3">Carbon Offset Program</h4>
                                <p className="text-gray-300">We offset 100% of our operational carbon emissions through verified projects.</p>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                                <h4 className="text-xl font-bold text-white mb-3">Community Impact</h4>
                                <p className="text-gray-300">Supporting local communities through various outreach and employment programs.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-2 gap-6"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: commitmentInView ? 0 : 100, opacity: commitmentInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={carLeft}
                                    alt="Eco-friendly Car"
                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white font-medium">Sustainable Choices</p>
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={carRight}
                                    alt="Luxury Car"
                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white font-medium">Premium Experience</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: commitmentInView ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-[#D2691E] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#b3591a] transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            Join Our Sustainable Journey
                        </a>
                    </motion.div>
                </div>
            </section>


        </div>
    );
};

export default About;