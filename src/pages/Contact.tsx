import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoLocation } from "react-icons/io5";
import { MdAttachEmail } from "react-icons/md";
import { MdAddIcCall } from "react-icons/md";



// Define the interface for form data
interface IFormInput {
    name: string;
    email: string;
    message: string;
}

const Contact = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        console.log("Form Data:", data);
        reset();
    };

    const leftAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const rightAnimation = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div className="relative bg-offwhite">
            <div className="container mx-auto  ">
                <div className="absolute top-0 left-0 w-full h-full  opacity-60 -z-10"></div>
                <div className="flex flex-col items-center justify-center py-16">


                    <motion.div
                        className=" bg-[#FFF6E9] shadow-xl rounded-xl p-10 w-full max-w-4xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-4xl text-center font-bold text-[#4335A7] mb-12">
                            Get In Touch
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 ">
                            {/* Contact Details */}
                            <motion.div
                                className="col-span-2 text-[#4335A7] m-0"
                                variants={leftAnimation}
                            >
                                <div>
                                    <MdAddIcCall className="text-2xl" />
                                    <h3 className="text-xl font-semibold mb-1">Phone</h3>
                                    <p className="hover:text-[#FF7F3E] transition duration-300">
                                        +88 01834491602
                                    </p>
                                </div>

                                <div>
                                    <MdAttachEmail className="text-2xl" />
                                    <h3 className="text-xl font-semibold mb-1">Email</h3>
                                    <p className="hover:text-[#FF7F3E] transition duration-300">
                                        debos.das.02@gmail.com
                                    </p>
                                </div>

                                <div>
                                    <IoLocation className="text-2xl" />
                                    <h3 className="text-xl font-semibold mb-1">Address</h3>
                                    <p className="hover:text-[#FF7F3E] transition duration-300">
                                        1234 Example St, City, State, ZIP
                                    </p>
                                </div>

                                {/* Add New Description Here */}
                                <div >
                                    <h3 className="text-xl font-semibold mb-1">Our Commitment</h3>
                                    <p className="hover:text-[#FF7F3E] transition duration-300">
                                        We are committed to providing exceptional service and support to all our customers, ensuring that your needs are met with the utmost care and attention.
                                    </p>
                                </div>
                            </motion.div>


                            {/* Contact Form */}
                            <motion.div
                                className="col-span-4"
                                variants={rightAnimation}
                            >
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="bg-white p-6 rounded-lg shadow-lg"
                                >
                                    <div className="mb-6">
                                        <label
                                            htmlFor="name"
                                            className="block text-lg font-semibold mb-2 text-[#4335A7]"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            {...register("name", { required: "Name is required" })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#80C4E9] outline-none"
                                        />
                                        {errors.name && (
                                            <p className="text-[#FF7F3E] mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label
                                            htmlFor="email"
                                            className="block text-lg font-semibold mb-2 text-[#4335A7]"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register("email", { required: "Email is required" })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#80C4E9] outline-none"
                                        />
                                        {errors.email && (
                                            <p className="text-[#FF7F3E] mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label
                                            htmlFor="message"
                                            className="block text-lg font-semibold mb-2 text-[#4335A7]"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={4}
                                            {...register("message", { required: "Message is required" })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#80C4E9] outline-none"
                                        ></textarea>
                                        {errors.message && (
                                            <p className="text-[#FF7F3E] mt-1">
                                                {errors.message.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl py-3 bg-[#4335A7] text-white font-semibold  hover:bg-[#FF7F3E] transition duration-300"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
