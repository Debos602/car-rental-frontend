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
        <div className="bg-[#FFF6E9]" >
            <section
                ref={ref}
                className="py-16 container mx-auto "

            >

                <motion.h4
                    className="text-2xl font-bold text-[#FF7F3E] mb-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    Testimonials
                </motion.h4>
                <motion.p
                    className="text-3xl font-bold text-[#4335A7] text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                >
                    What Our Customers Say
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-white shadow-md rounded-xl relative"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                        >
                            {/* Decorative triangles */}
                            <div className="absolute top-0 left-0 w-0 h-0 border-t-[50px] border-t-[#FF7F3E] border-r-[50px] border-r-transparent"></div>
                            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[50px] border-b-[#FF7F3E] border-l-[50px] border-l-transparent"></div>

                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 object-cover rounded-full mx-auto mb-4 border-4 border-[#80C4E9]"
                            />
                            <p className="text-lg mb-2 text-[#4335A7] italic">
                                "{testimonial.review}"
                            </p>
                            <Rate
                                disabled
                                defaultValue={testimonial.rating}
                                className="text-[#FF7F3E]"
                            />
                            <h4 className="mt-4 font-bold text-[#4335A7]">
                                {testimonial.name}
                            </h4>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CustomerTestimonials;
