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
        <div className="bg-white bg-opacity-80">
            < section
                ref={ref}
                className="container mx-auto py-16 text-center  "
            >
                <motion.h2
                    className="text-2xl font-bold text-[#FF7F3E] mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    Why Choose Us?
                </motion.h2>
                <motion.p
                    className="text-4xl font-semibold text-[#4335A7] mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                >
                    Time Quick and Easy to Transportation
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <motion.div
                        className="p-6 shadow-lg  rounded-xl bg-white border-2 border-[#4335A7] border-opacity-5 text-[#4335A7]  hover:bg-[#FF7F3E] hover:text-white transition-colors duration-300"
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={cardVariants}
                        transition={{ duration: 0.8, delay: 0 }}
                    >
                        <CarFilled className="text-5xl text-[#80C4E9] mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Best Prices</h3>
                        <p className="text-lg text-[#0f2e3f] hover:text-[#4335A7]">
                            We offer unbeatable prices on all our cars, ensuring you
                            get the best value for your money.
                        </p>
                    </motion.div>
                    <motion.div
                        className="p-6 shadow-lg  rounded-xl bg-white border-2 border-[#4335A7] border-opacity-5 text-[#4335A7] hover:bg-[#FF7F3E] hover:text-white transition-colors duration-300"
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={cardVariants}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <WeiboCircleFilled className="text-5xl text-[#80C4E9] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Wide Selection
                        </h3>
                        <p className="text-lg text-[#0f2e3f] hover:text-[#4335A7]">
                            Choose from a diverse range of cars that suit every
                            occasion and budget.
                        </p>
                    </motion.div>
                    <motion.div
                        className="p-6 shadow-lg rounded-xl bg-white border-2 border-[#4335A7] border-opacity-5 text-[#4335A7] hover:bg-[#FF7F3E] hover:text-white transition-colors duration-300"
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={cardVariants}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <CustomerServiceOutlined className="text-5xl text-[#80C4E9] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                        <p className="text-lg text-[#0f2e3f]">
                            Our customer service team is available round the clock
                            to assist you whenever you need help.
                        </p>
                    </motion.div>
                </div>
            </section ></div>

    );
};

export default WhyChooseUs;
