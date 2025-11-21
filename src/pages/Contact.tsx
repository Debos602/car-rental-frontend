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

    /* StyledMap component: tries to use Google Maps JS API with a custom style matching
       black / white / chocolate theme. If `VITE_GOOGLE_MAPS_API_KEY` is not provided
       the component falls back to a black-and-white tile iframe (Stamen Toner) and
       places a small chocolate marker overlay. */
    const StyledMap: React.FC = () => {
        const mapRef = useRef<HTMLDivElement | null>(null);
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

            // Styled map JSON: mostly greyscale with chocolate accents for points/labels
            const themeStyles = [
                { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#111827" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
                { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
                { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6b6b6b" }] },
                { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
                { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6b6b6b" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                // Chocolate accent: use as marker icon color and subtle highlights
            ];

            if (apiKey && mapRef.current && !(window as any).google) {
                // Dynamically load Google Maps script
                const script = document.createElement("script");
                script.src = `${apiKey}`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    try {
                        const google = (window as any).google;
                        const center = { lat: 22.3569, lng: 91.7832 }; // Chittagong
                        const map = new google.maps.Map(mapRef.current, {
                            center,
                            zoom: 13,
                            styles: themeStyles,
                            disableDefaultUI: true,
                        });

                        // Chocolate SVG marker as data URL
                        const svg = encodeURIComponent(`
                            <svg xmlns='http://www.w3.org/2000/svg' width='28' height='40' viewBox='0 0 24 24' fill='none' stroke='none'>
                              <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='%23D2691E'/>
                              <circle cx='12' cy='9' r='2.5' fill='%23fff'/>
                            </svg>
                        `);

                        new google.maps.Marker({
                            position: center,
                            map,
                            icon: `data:image/svg+xml;utf8,${svg}`,
                        });

                        setLoaded(true);
                    } catch (err) {
                        // loading failed --- fallback will show iframe
                        setLoaded(false);
                    }
                };
                document.head.appendChild(script);
                return () => {
                    // remove script? keep it
                };
            } else if (apiKey && (window as any).google && mapRef.current) {
                // already loaded
                const google = (window as any).google;
                const center = { lat: 22.3569, lng: 91.7832 };
                const map = new google.maps.Map(mapRef.current, {
                    center,
                    zoom: 13,
                    styles: themeStyles,
                    disableDefaultUI: true,
                });
                const svg = encodeURIComponent(`
                    <svg xmlns='http://www.w3.org/2000/svg' width='28' height='40' viewBox='0 0 24 24' fill='none' stroke='none'>
                      <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='%23D2691E'/>
                      <circle cx='12' cy='9' r='2.5' fill='%23fff'/>
                    </svg>
                `);
                new google.maps.Marker({ position: center, map, icon: `data:image/svg+xml;utf8,${svg}` });
                setLoaded(true);
            }
        }, []);

        // If Google couldn't load or no API key, fallback to black/white Stamen Toner tiles
        const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return (
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                    <iframe
                        title="company-map"
                        className="w-full h-full border-0"
                        src="https://stamen-tiles.a.ssl.fastly.net/toner-lite/10/501/320.png"
                    // Note: a single-tile URL above is just a placeholder; use a proper map embed for full coverage.
                    />
                    {/* chocolate marker overlay centered */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                        <div style={{ width: 28, height: 40 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="40">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#D2691E" />
                                <circle cx="12" cy="9" r="2.5" fill="#fff" />
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }

        return <div ref={mapRef} className="w-full h-64 rounded-md" />;
    };

    return (
        <>
            {/* Hero / Banner */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif text-[#111827] leading-tight">Contact Us</h1>
                    <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-full px-6 py-2">
                            <a href="/" className="text-sm text-[#D2691E] font-medium">Home</a>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-700">Contact</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main contact card */}
            <section data-theme="dark" className="py-12 bg-gradient-to-br from-[#fff] via-[#0f0f0f] to-[#fff]">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mx-auto bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/6"
                        initial="hidden"
                        whileInView="visible"
                        variants={appear}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">

                            {/* Decorative left column */}
                            <div className="relative p-8 md:p-10 bg-black/70 text-white">
                                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-br from-[#D2691E] to-transparent transform skew-x-[-12deg] -translate-x-6 hidden md:block" />
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl font-extrabold">Let's talk</h2>
                                    <p className="mt-3 text-white/80">Whether you have a question about pricing, need a demo, or anything else, our team is ready to answer all your questions.</p>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#D2691E] flex items-center justify-center">📞</div>
                                            <div>
                                                <div className="text-sm text-white/70">Phone</div>
                                                <div className="font-semibold">+88 01834491602</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#D2691E] flex items-center justify-center">✉️</div>
                                            <div>
                                                <div className="text-sm text-white/70">Email</div>
                                                <div className="font-semibold">debos.das.02@gmail.com</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#D2691E] flex items-center justify-center">📍</div>
                                            <div>
                                                <div className="text-sm text-white/70">Address</div>
                                                <div className="font-semibold">1234 Example St, City</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <span className="inline-block bg-[#D2691E] text-white px-3 py-1 rounded-full text-sm font-semibold">Open: 9am — 6pm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form right column */}
                            <div className="p-6 md:p-10 bg-white">
                                <h3 className="text-2xl font-bold text-[#111827]">Send a message</h3>
                                <p className="text-sm text-gray-600 mt-2 mb-6">Fill out the form and we'll get back to you shortly.</p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="relative">
                                            <input
                                                {...register("name", { required: "Name is required" })}
                                                placeholder=" "
                                                className="peer w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm focus:outline-none"
                                            />
                                            <label className="absolute left-3 top-1 text-xs text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs transition-all">Full name</label>
                                            {errors.name && <div className="text-sm text-[#D2691E] mt-1">{errors.name.message}</div>}
                                        </div>

                                        <div className="relative">
                                            <input
                                                {...register("email", { required: "Email is required" })}
                                                placeholder=" "
                                                className="peer w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm focus:outline-none"
                                            />
                                            <label className="absolute left-3 top-1 text-xs text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs transition-all">Email address</label>
                                            {errors.email && <div className="text-sm text-[#D2691E] mt-1">{errors.email.message}</div>}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            {...register("message", { required: "Message is required" })}
                                            placeholder=" "
                                            rows={5}
                                            className="peer w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm focus:outline-none"
                                        />
                                        <label className="absolute left-3 top-1 text-xs text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs transition-all">Your message</label>
                                        {errors.message && <div className="text-sm text-[#D2691E] mt-1">{errors.message.message}</div>}
                                    </div>

                                    <div className="pt-2">
                                        <button type="submit" className="w-full rounded-md bg-[#D2691E] hover:bg-[#46220f] text-white py-3 font-semibold transition">Send Message</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </motion.div>

                    {/* Map / Location section */}
                    <div className="mt-10">

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h4 className="text-lg font-semibold mb-3">Our Location</h4>
                            <p className="text-sm text-gray-600 mb-4">1234 Example St, City, Country — come visit us during business hours.</p>
                            <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                                {/* Styled map: uses Google Maps JS API when `VITE_GOOGLE_MAPS_API_KEY` is set, otherwise falls back */}
                                <StyledMap />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
