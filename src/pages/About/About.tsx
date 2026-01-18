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
            <CustomSection
                image={backgroundImage}
                title="Home/AboutUs/Company"
                paragraph="Discover our journey, values, and the team dedicated to providing you with exceptional car rental experiences."

            />

            {/* Company History */}
            <section className="py-20 relative overflow-hidden">
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
                className="py-12 lg:py-16 bg-gradient-to-b from-white via-amber-50/30 to-slate-50 relative overflow-hidden"
            >
                {/* Subtle decorative blobs */}
                <div className="absolute -right-20 top-20 w-96 h-96 bg-[#D2691E]/5 rounded-full blur-3xl opacity-60" />
                <div className="absolute -left-20 bottom-20 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl opacity-70" />

                <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16 lg:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: teamInView ? 1 : 0, y: teamInView ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-5 py-2 rounded-full bg-[#D2691E]/10 text-[#D2691E] font-medium text-sm tracking-wider mb-5">
                            MEET OUR TEAM
                        </span>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            The People Behind <span className="text-[#D2691E]">Your Journey</span>
                        </h2>

                        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
                            Passionate professionals dedicated to delivering exceptional car rental experiences with integrity and innovation.
                        </p>
                    </motion.div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{
                                    opacity: teamInView ? 1 : 0,
                                    y: teamInView ? 0 : 50,
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: index * 0.12,
                                    ease: "easeOut",
                                }}
                            >
                                {/* Image + Overlay */}
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Role badge */}
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                                        <span className="px-5 py-2 bg-[#D2691E]/90 text-white text-sm font-medium rounded-full backdrop-blur-sm shadow-lg">
                                            {member.tag}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-7 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#D2691E] transition-colors duration-300">
                                        {member.name}
                                    </h3>

                                    <p className="text-[#D2691E] font-medium mb-4">{member.role}</p>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-7 line-clamp-3">
                                        {member.desc}
                                    </p>

                                    {/* Social Icons */}
                                    <div className="flex justify-center gap-4">
                                        {[
                                            { icon: <FaLinkedin className="w-5 h-5" />, label: "LinkedIn" },
                                            { icon: <FaTwitter className="w-5 h-5" />, label: "Twitter" },
                                            { icon: <FaEnvelope className="w-5 h-5" />, label: "Email" },
                                        ].map((social, idx) => (
                                            <motion.a
                                                key={idx}
                                                href="#"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 hover:text-[#D2691E] transition-colors duration-300"
                                                aria-label={social.label}
                                                whileHover={{ scale: 1.2, rotate: 8 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {social.icon}
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D2691E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Optional bottom CTA */}
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: teamInView ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <p className="text-gray-600 mb-6">
                            Want to join our growing team? We're always looking for passionate people!
                        </p>
                        <a
                            href="/about"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D2691E] hover:bg-[#c15c18] text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            View Career Opportunities
                            <span>→</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Commitment Section - FIXED VERSION */}
            <section
                ref={commitmentRef}
                className="py-12 lg:py-16 bg-gradient-to-b from-white via-amber-50/30 to-slate-50 relative overflow-hidden"
            >
                {/* Decorative subtle blobs - same style as team section */}
                <div className="absolute -right-20 top-20 w-96 h-96 bg-[#D2691E]/5 rounded-full blur-3xl opacity-60" />
                <div className="absolute -left-32 bottom-10 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl opacity-70" />

                <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8 lg:mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: commitmentInView ? 1 : 0, y: commitmentInView ? 0 : 30 }}
                        transition={{ duration: 0.9 }}
                    >
                        <span className="inline-block px-5 py-2 rounded-full bg-[#D2691E]/10 text-[#D2691E] font-medium text-sm tracking-wider mb-5">
                            OUR COMMITMENT
                        </span>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Driving with <span className="text-[#D2691E]">Purpose</span>
                        </h2>

                        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
                            We're committed to making every journey more sustainable, responsible, and enjoyable — today and for future generations.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        {/* Left - Text commitments */}
                        <motion.div
                            className="space-y-8 order-2 lg:order-1"
                            initial={{ x: -60, opacity: 0 }}
                            animate={{ x: commitmentInView ? 0 : -60, opacity: commitmentInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {[
                                {
                                    title: "Green Fleet Initiative",
                                    desc: "Over 40% of our vehicles are already hybrid or fully electric — with a clear goal to reach 75% sustainable fleet by 2026.",
                                    progress: 68,
                                },
                                {
                                    title: "Carbon Neutral Operations",
                                    desc: "Every rental is 100% carbon offset through verified renewable energy and global reforestation programs.",
                                    progress: 100,
                                },
                                {
                                    title: "Community & Responsibility",
                                    desc: "We invest 5% of annual profits into local environmental projects and community development programs.",
                                    progress: null,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#D2691E]/30 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#D2691E] transition-colors duration-300">
                                        {item.title}
                                    </h4>

                                    <p className="text-gray-600 mb-5 leading-relaxed">{item.desc}</p>

                                    {item.progress !== null && (
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#D2691E] to-amber-600 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: commitmentInView ? `${item.progress}%` : '0%' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* Right - Visual + highlight */}
                        <motion.div
                            className="order-1 lg:order-2"
                            initial={{ x: 60, opacity: 0 }}
                            animate={{ x: commitmentInView ? 0 : 60, opacity: commitmentInView ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-gray-100">
                                <img
                                    src={carLeft}
                                    alt="Sustainable mobility - electric and hybrid vehicles"
                                    className="w-full h-[380px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                                    <div className="inline-block px-5 py-2 bg-[#D2691E]/90 text-white font-medium rounded-full mb-4 backdrop-blur-sm">
                                        Eco-Conscious Choice
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                        Cleaner Mobility Today
                                    </h3>

                                    <p className="text-white/90 text-lg">
                                        Premium electric & hybrid options • Fast charging network • Real impact with every mile
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>


                </div>
            </section>


        </div>
    );
};

export default About;