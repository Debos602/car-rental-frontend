import { motion } from "framer-motion";
import commitmentImage from "../../assets/Team/451780062_1673973180021940_4839194116411732488_n.jpg";

const CommitmentSection = () => {
    const contentVariants = {
        hidden: { opacity: 0, x: -100 }, // Slide in from the left
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 100 }, // Slide in from the right
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <div className="bg-black/60 overflow-hidden relative">
            {/* subtle blurred chocolate accent behind the section */}
            <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-[#D2691E] opacity-8 blur-3xl pointer-events-none" />
            <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                {/* Content Section */}
                <motion.div
                    className="p-8"
                    variants={contentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/6">
                        <h3 className="text-3xl font-medium text-[#D2691E] mb-4">Commitment</h3>
                        <p className="text-3xl font-bold mb-6 text-white">Our Commitment to You</p>

                        <p className="text-lg font-medium text-white/85 max-w-2xl">
                            We are dedicated to providing the best possible
                            experience for our customers. With quality vehicles,
                            affordable pricing, and outstanding customer support, we
                            ensure your journey is seamless and enjoyable.
                        </p>

                        <ul className="mt-6 space-y-3 list-none">
                            <li className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-[#D2691E] mt-2 shrink-0 shadow-md" />
                                <span className="text-white">Reliable and safe transportation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-[#D2691E] mt-2 shrink-0 shadow-md" />
                                <span className="text-white">Affordable and transparent pricing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-[#D2691E] mt-2 shrink-0 shadow-md" />
                                <span className="text-white">24/7 customer support for peace of mind</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    className=" rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] ring-1 ring-white/6"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <img
                        src={commitmentImage}
                        alt="Commitment"
                        className="w-full h-96 md:h-full object-cover rounded-xl"
                    />

                    {/* soft translucent overlay at the image bottom to blend with bg */}
                    <div className="absolute inset-x-0 -bottom-6 md:-bottom-8 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-2xl" />

                </motion.div>
            </section>
        </div>
    );
};

export default CommitmentSection;
