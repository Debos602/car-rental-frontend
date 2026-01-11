import React from "react";

type Props = {
    images?: string[];
    name?: string;
};

const CarGallery: React.FC<Props> = ({ images = [], name }) => {
    const placeholder =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='Arial' font-size='20'>No image available</text></svg>";

    const gallery = images.length > 0 ? images : [placeholder];

    const [index, setIndex] = React.useState(0);
    const [zoomVisible, setZoomVisible] = React.useState(false);
    const [zoomPos, setZoomPos] = React.useState({ left: 0, top: 0, bgX: "50%", bgY: "50%" });
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const prev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);
    const next = () => setIndex((i) => (i + 1) % gallery.length);

    // keyboard navigation
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [gallery.length]);

    const onMove = (e: React.MouseEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; // x within image
        const y = e.clientY - rect.top; // y within image
        const w = rect.width;
        const h = rect.height;

        const pctX = (x / w) * 100;
        const pctY = (y / h) * 100;

        // position zoom box center near cursor, but clamp inside image
        const zoomW = Math.min(260, w * 0.50);
        const zoomH = Math.min(260, h * 0.50);
        let left = x - zoomW / 2;
        let top = y - zoomH / 2;
        left = Math.max(0, Math.min(left, w - zoomW));
        top = Math.max(0, Math.min(top, h - zoomH));

        setZoomPos({ left, top, bgX: `${pctX}%`, bgY: `${pctY}%` });
    };

    const imageSrc = gallery[index];

    return (
        <figure className="border border-black/10 p-4 h-full rounded-xl bg-black">
            <div className="relative flex items-center justify-center">
                <button aria-label="Previous image" onClick={prev} className="absolute left-2 z-10 p-2 bg-white/30 rounded-full hover:bg-white/50">◀</button>

                <div ref={containerRef} onMouseMove={onMove} onMouseEnter={() => setZoomVisible(true)} onMouseLeave={() => setZoomVisible(false)} className="w-full flex items-center justify-center">
                    <img src={imageSrc} alt={name || "car image"} className="max-w-full max-h-[520px] object-contain rounded-lg shadow-lg" />

                    {/* zoom box */}
                    {zoomVisible && (
                        <div
                            aria-hidden
                            className="absolute pointer-events-none hidden md:block"
                            style={{
                                left: zoomPos.left,
                                top: zoomPos.top,
                                width: Math.min(260, (containerRef.current?.clientWidth ?? 520) * 0.5),
                                height: Math.min(260, (containerRef.current?.clientHeight ?? 520) * 0.5),
                                backgroundImage: `url(${imageSrc})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: `${zoomPos.bgX} ${zoomPos.bgY}`,
                                backgroundSize: `${(containerRef.current?.clientWidth ?? 520) * 2}px auto`,
                                borderRadius: 8,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                                border: "1px solid rgba(0,0,0,0.12)",
                            }}
                        />
                    )}
                </div>

                <button aria-label="Next image" onClick={next} className="absolute right-2 z-10 p-2 bg-white/30 rounded-full hover:bg-white/50">▶</button>
            </div>

            <figcaption className="mt-3 flex gap-2 overflow-x-auto">
                {gallery.map((src, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`flex-none w-20 h-14 overflow-hidden rounded-md border ${i === index ? "ring-2 ring-brand-500" : "border-gray-200"}`}
                        aria-label={`Show image ${i + 1}`}
                    >
                        <img src={src} alt={`${name || "car"} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </figcaption>
        </figure>
    );
};

export default CarGallery;
