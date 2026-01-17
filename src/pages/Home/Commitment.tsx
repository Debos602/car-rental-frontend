import { motion } from "framer-motion";
import commitmentImage from "../../assets/Team/451780062_1673973180021940_4839194116411732488_n.jpg";

const CommitmentSection = () => {
    const contentVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 100, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="overflow-hidden relative bg-gradient-to-br from-white via-gray-50 to-amber-50">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#D2691E]/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full translate-x-40 translate-y-40 blur-3xl" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[length:60px_60px]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D2691E' fill-opacity='0.1'%3E%3Cpath d='M30 30v-5h-5v5h-5v5h5v5h5v-5h5v-5h-5zM30 0v-5h-5v5h-5v5h5v5h5V5h5V0h-5zM0 30v-5H-5v5h-5v5h5v5h5v-5h5v-5H0zM0 0v-5H-5v5h-5v5h5v5h5V5h5V0H0z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <section className="container mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
                {/* Content Section */}
                <motion.div
                    className="relative"
                    variants={contentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {/* Accent element */}
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#D2691E]/20 to-amber-500/20 rounded-full blur-xl" />

                    <div className="bg-gradient-to-br from-white via-white to-amber-50/30 rounded-2xl p-8 shadow-2xl border border-gray-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        {/* Subtle shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        <motion.div variants={itemVariants} className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 text-[#D2691E] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-200">
                                <span className="w-2 h-2 bg-gradient-to-r from-[#D2691E] to-amber-600 rounded-full"></span>
                                Our Promise
                            </div>

                            <h3 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="text-black">Our Commitment</span>
                                <span className="text-[#D2691E] ml-2">
                                    to You
                                </span>
                            </h3>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-gray-700 mb-8 leading-relaxed"
                        >
                            We are dedicated to providing the best possible experience for our
                            customers. With quality vehicles, affordable pricing, and outstanding
                            customer support, we ensure your journey is seamless and enjoyable.
                        </motion.p>

                        <motion.ul
                            variants={contentVariants}
                            className="space-y-4 mb-8"
                        >
                            {[
                                { text: "Reliable and safe transportation", icon: "🛡️" },
                                { text: "Affordable and transparent pricing", icon: "💰" },
                                { text: "24/7 customer support for peace of mind", icon: "📞" },
                                { text: "Latest models with regular maintenance", icon: "🚗" },
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-amber-50/50 transition-colors duration-200"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#D2691E] to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <span className="text-white text-lg">{item.icon}</span>
                                    </div>
                                    <span className="text-gray-800 font-medium pt-1">{item.text}</span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#D2691E] to-amber-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">✓</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black mb-1">100% Satisfaction Guaranteed</h4>
                                    <p className="text-gray-600 text-sm">Your comfort and satisfaction is our top priority</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    className="relative"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Frame decoration */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#D2691E]/10 via-amber-500/10 to-transparent rounded-3xl blur-xl opacity-50"></div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>

                        {/* Subtle radial gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#D2691E]/10 via-transparent to-amber-500/10 z-0"></div>

                        <img
                            src={commitmentImage}
                            alt="Our dedicated team ensuring customer satisfaction"
                            className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-md border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#D2691E] to-amber-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">👥</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black">Dedicated Team</h4>
                                        <p className="text-gray-600 text-sm">Always here to help</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#D2691E] to-amber-500"
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="text-gray-800 font-medium">50+ Team Members</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating stats */}
                    <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-white to-amber-50 rounded-xl p-5 shadow-xl border border-gray-200 z-20">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#D2691E] mb-1">10+</div>
                            <div className="text-sm text-gray-600 font-medium">Years Experience</div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default CommitmentSection;