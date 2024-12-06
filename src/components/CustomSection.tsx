import { motion } from 'framer-motion';

interface CustomSectionProps {
    image: string;
    title: string;
    paragraph: string;
}

const CustomSection = ({ image, title, paragraph }: CustomSectionProps) => {
    return (
        <motion.section
            className="bg-cover bg-center bg-no-repeat py-20 mt-[82px] md:mt-[102px] relative z-10"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute inset-0 w-full h-full bg-[#4335A7] opacity-50 -z-10"></div>
            <div className="container mx-auto px-4 text-center text-[#FFF6E9]">
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="text-lg mb-8 text-[#FFF6E9]"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {paragraph}
                </motion.p>
            </div>
        </motion.section>
    );
};

export default CustomSection;
