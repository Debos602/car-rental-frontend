import {
    CarFilled,
    CustomerServiceOutlined,
    WeiboCircleFilled,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const WhyChooseUs = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2, // Animation triggers when 20% of the section is in view
    });

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-black/80 bg-gradient-to-l from-white/20 to-black text-white relative overflow-hidden">
            <section ref={ref} className="container mx-auto py-20 relative">
                {/* Decorative chocolate circle behind heading */}
                <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#D2691E] opacity-10 blur-xl pointer-events-none"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left: Heading + Description */}
                    <div>
                        <motion.h2
                            className="text-3xl md:text-4xl font-extrabold text-[#D2691E] mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            Why Choose Us?
                        </motion.h2>

                        <motion.p
                            className="text-2xl md:text-3xl font-semibold text-white mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1 }}
                        >
                            Fast, Reliable, and Affordable Transportation
                        </motion.p>

                        <p className="text-lg text-white/80 max-w-xl mb-8">
                            We combine a premium fleet with transparent pricing and
                            24/7 customer support so you can focus on the journey.
                        </p>

                        <div className="flex gap-4">
                            <a className="inline-block px-6 py-3 bg-[#D2691E] hover:bg-[#a8581a] rounded-lg font-semibold text-white transition">Get Started</a>
                            {/* <a className="inline-block px-6 py-3 border border-white/10 rounded-lg text-white/90 hover:bg-white/5 transition">Learn More</a> */}
                        </div>
                    </div>

                    {/* Right: Feature cards in a staggered layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div
                            className="relative rounded-xl overflow-hidden bg-white/5 p-8 pt-10 shadow-lg border border-white/5"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.7, delay: 0 }}
                        >
                            {/* top-right chocolate badge */}
                            <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-[#D2691E] flex items-center justify-center text-white shadow-lg"></div>
                            <div className="w-14 h-14 rounded-md bg-[#D2691E] text-white flex items-center justify-center text-2xl mb-4">
                                <CarFilled />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Best Prices</h4>
                            <p className="text-sm text-white/80">Transparent rates and flexible packages to suit every budget.</p>
                            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#D2691E] to-black"></div>
                        </motion.div>

                        <motion.div
                            className="relative rounded-xl overflow-hidden bg-white/5 p-8 pt-10 shadow-lg border border-white/5 mt-8 sm:mt-0"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.7, delay: 0.15 }}
                        >
                            <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-[#D2691E] flex items-center justify-center text-white shadow-lg"></div>
                            <div className="w-14 h-14 rounded-md bg-[#D2691E] text-white flex items-center justify-center text-2xl mb-4">
                                <WeiboCircleFilled />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Wide Selection</h4>
                            <p className="text-sm text-white/80">From compact city cars to premium SUVs — pick what suits your trip.</p>
                            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#D2691E] to-black"></div>
                        </motion.div>

                        <motion.div
                            className="relative rounded-xl overflow-hidden bg-white/5 p-8 pt-10 shadow-lg border border-white/5"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-[#D2691E] flex items-center justify-center text-white shadow-lg"></div>
                            <div className="w-14 h-14 rounded-md bg-[#D2691E] text-white flex items-center justify-center text-2xl mb-4">
                                <CustomerServiceOutlined />
                            </div>
                            <h4 className="text-lg font-bold mb-2">24/7 Support</h4>
                            <p className="text-sm text-white/80">Always-on support to help with bookings, emergencies, or changes.</p>
                            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#D2691E] to-black"></div>
                        </motion.div>

                        <motion.div
                            className="relative rounded-xl overflow-hidden bg-white/5 p-8 pt-10 shadow-lg border border-white/5 mt-8 sm:mt-0"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.7, delay: 0.45 }}
                        >
                            <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-[#D2691E] flex items-center justify-center text-white shadow-lg"></div>
                            <div className="w-14 h-14 rounded-md bg-[#D2691E] text-white flex items-center justify-center text-2xl mb-4">
                                <CarFilled />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Easy Booking</h4>
                            <p className="text-sm text-white/80">Frictionless booking flow — reserve in seconds and hit the road.</p>
                            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#D2691E] to-black"></div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WhyChooseUs;
