import { Rate } from "antd";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import testi1 from "../../assets/team2.jpg";
import testi2 from "../../assets/testi-2-removebg-preview.png";
import testi3 from "../../assets/testi-3-removebg-preview.png";

const CustomerTestimonials = () => {
    const testimonials = [
        {
            name: "John Doe",
            image: testi1,
            rating: 5,
            review: "The best car rental service I’ve ever used! The process was smooth and the customer support was amazing.",
        },
        {
            name: "Jane Smith",
            image: testi2,
            rating: 4,
            review: "Great experience! The car was in perfect condition, and the prices were very reasonable.",
        },
        {
            name: "Mark Wilson",
            rating: 5,
            image: testi3,
            review: "Super convenient and fast service! Highly recommend.",
        },
    ];



    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 text-black">
            <section ref={ref} className="py-16 container mx-auto">

                <div className="relative max-w-6xl mx-auto">
                    {/* decorative big quote (soft) */}
                    <div className="absolute -right-12 -top-12 text-[140px] text-[#A66A3A] opacity-5 pointer-events-none select-none">“</div>

                    <motion.h4
                        className="text-2xl font-bold text-[#D2691E] mb-4 text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        Testimonials
                    </motion.h4>

                    <motion.p
                        className="text-3xl font-bold text-black text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1 }}
                    >
                        What Our Customers Say
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-white rounded-2xl relative border border-gray-100 shadow-md transform transition-transform duration-300 hover:-translate-y-2 hover:scale-102"
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                variants={cardVariants}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                            >
                                {/* small top-left soft-chocolate triangle */}
                                <div className="absolute top-0 left-0 w-0 h-0 border-t-[28px] border-t-[#A66A3A] border-r-[28px] border-r-transparent"></div>

                                {/* top-right ribbon (muted indigo) */}
                                <div className="absolute right-4 top-4 bg-[#000] text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</div>

                                <div className="flex flex-col items-center text-center px-2">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-[#6FB2C0]"
                                    />

                                    <p className="text-base mb-3 text-[#1f2937] italic">"{testimonial.review}"</p>

                                    <div className="mb-3">
                                        <Rate disabled defaultValue={testimonial.rating} className="text-[#A66A3A]" />
                                    </div>

                                    <h4 className="mt-2 font-bold text-[#000]">{testimonial.name}</h4>
                                </div>

                                {/* subtle decorative circle */}
                                <div className="absolute -right-5 -bottom-5 w-16 h-16 rounded-full bg-[#A66A3A] opacity-6 blur-xl pointer-events-none"></div>

                                {/* speech-bubble tail centered (soft) */}
                                <div className="absolute left-1/2 -bottom-5 transform -translate-x-1/2 w-0 h-0 border-t-[12px] border-t-[#F8F8F8] border-x-[12px] border-x-transparent" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerTestimonials;
