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
        <div className="bg-gradient-to-b to-[#80C4E9] from-[#FFF6E9]">
            <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Content Section */}
                <motion.div
                    className="p-8 text-[#4335A7]"
                    variants={contentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-3xl font-medium text-[#FF7F3E] mb-4">
                        Commitment
                    </h3>
                    <p className="text-3xl font-bold mb-6">
                        Our Commitment to You
                    </p>
                    <p className="text-lg font-medium text-[#0f2e3f] max-w-2xl mx-auto ">

                        We are dedicated to providing the best possible
                        experience for our customers. With quality vehicles,
                        affordable pricing, and outstanding customer support, we
                        ensure your journey is seamless and enjoyable.
                    </p>
                    <ul className="list-disc pl-5 text-[#0f2e3f] text-base">
                        <li className="mb-4">Reliable and safe transportation</li>
                        <li className="mb-4">
                            Affordable and transparent pricing
                        </li>
                        <li>24/7 customer support for peace of mind</li>
                    </ul>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    className="relative rounded-lg overflow-hidden shadow-lg"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <img
                        src={commitmentImage}
                        alt="Commitment"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#80C4E9] bg-opacity-30"></div>
                </motion.div>
            </section>
        </div>
    );
};

export default CommitmentSection;
