import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

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

    const appear = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };



    return (
        <>
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-chocolate max-w-2xl mx-auto mb-6">
                            Have questions or need assistance? We're here to help you with your car rental journey.
                        </p>
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full px-6 py-2 shadow-sm">
                            <a href="/" className="text-sm text-chocolate hover:text-chocolate-dark font-medium transition">Home</a>
                            <span className="text-sm text-stone-400">/</span>
                            <span className="text-sm text-stone-700 font-medium">Contact</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 bg-stone-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <motion.div
                            className="lg:col-span-1"
                            initial="hidden"
                            whileInView="visible"
                            variants={appear}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 h-full">
                                <div className="flex items-center mb-6">
                                    <div className="bg-chocolate p-2.5 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-3">Get in Touch</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-chocolate/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-chocolate" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Phone</div>
                                                    <div className="font-medium text-gray-800">+1 (555) 123-4567</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-chocolate/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-chocolate" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Email</div>
                                                    <div className="font-medium text-gray-800">contact@rentalhub.com</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-chocolate/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-chocolate" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Address</div>
                                                    <div className="font-medium text-gray-800">123 Example St, New York, NY 10001</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-stone-200">
                                        <h3 className="font-semibold text-gray-700 mb-3">Business Hours</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Monday - Friday</span>
                                                <span className="font-medium">9:00 AM - 7:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Saturday</span>
                                                <span className="font-medium">10:00 AM - 5:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sunday</span>
                                                <span className="font-medium text-chocolate">Closed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className="lg:col-span-2"
                            initial="hidden"
                            whileInView="visible"
                            variants={appear}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-stone-200 h-full">
                                <div className="flex items-center mb-6">
                                    <div className="bg-chocolate p-2.5 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Send us a Message</h2>
                                        <p className="text-sm text-gray-600 mt-1">Fill out the form below and we'll get back to you soon</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                {...register("name", { required: "Name is required" })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:border-chocolate focus:ring-2 focus:ring-chocolate/20 outline-none transition"
                                                placeholder="John Doe"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:border-chocolate focus:ring-2 focus:ring-chocolate/20 outline-none transition"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            {...register("message", {
                                                required: "Message is required",
                                                minLength: {
                                                    value: 10,
                                                    message: "Message must be at least 10 characters"
                                                }
                                            })}
                                            rows={5}
                                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:border-chocolate focus:ring-2 focus:ring-chocolate/20 outline-none transition resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-chocolate hover:bg-chocolate-dark text-white font-semibold py-3 rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map Section */}
                    <motion.div
                        className="mt-8"
                        initial="hidden"
                        whileInView="visible"
                        variants={appear}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
                            <div className="flex items-center mb-6">
                                <div className="bg-chocolate p-2.5 rounded-lg mr-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Find Us</h2>
                                    <p className="text-sm text-gray-600 mt-1">Visit our office location</p>
                                </div>
                            </div>

                            <div className="h-80 rounded-lg overflow-hidden border border-stone-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.614586876632!2d-73.98785423465336!3d40.74844997932787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635942464218!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>



            {/* Add chocolate theme CSS */}
            <style>{`
                :root {
                    --chocolate: #7B3F00;
                    --chocolate-dark: #5C2E00;
                    --chocolate-light: #A0522D;
                }
                .bg-chocolate { background-color: #7B3F00 !important; }
                .bg-chocolate-dark { background-color: #5C2E00 !important; }
                .bg-chocolate-light { background-color: #A0522D !important; }
                .text-chocolate { color: #7B3F00 !important; }
                .text-chocolate-dark { color: #5C2E00 !important; }
                .text-chocolate-light { color: #A0522D !important; }
                .border-chocolate { border-color: #7B3F00 !important; }
            `}</style>
        </>
    );
};

export default Contact; 