import React, { useMemo } from "react";
import { Rate } from "antd";

type Props = {
    name?: string;
    description?: string;
    pricePerHour?: number | string;
    status?: string;
    features?: string[];
    rating?: number;
};

const formatPrice = (v?: number | string) => {
    const n = Number(v || 0);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
};

const CarInfo: React.FC<Props> = ({ name, description, pricePerHour, status, features = [], rating = 0 }) => {
    const isAvailable = String(status || "").toLowerCase() === "available";
    const formatted = useMemo(() => formatPrice(pricePerHour), [pricePerHour]);

    return (
        <section aria-labelledby="car-title" className="shadow-xl p-6 border border-gray-200 rounded-xl bg-white">
            <header>
                <h2 id="car-title" className="text-2xl font-bold text-black">{name}</h2>
                <p className="text-md mt-2 text-gray-700">{description?.slice(0, 220)}</p>
            </header>

            <div className="flex items-center gap-4 mt-4">
                <div>
                    <span className="font-semibold text-sm">Price per Hour:</span>
                    <div className="block text-xl font-bold text-brand-500">{formatted}</div>
                </div>

                <div>
                    <span className="font-semibold text-sm">Status:</span>
                    <div className={`block text-sm font-medium ${isAvailable ? "text-green-600" : "text-red-600"}`}>{String(status).toUpperCase()}</div>
                </div>
            </div>

            <div className="mt-4">
                <p className="font-semibold">Features:</p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                    {features.length > 0 ? (
                        features.map((feature, i) => (
                            <li key={i} className="mt-1">{feature}</li>
                        ))
                    ) : (
                        <li className="mt-1">No additional features available.</li>
                    )}
                </ul>

                <div className="mt-4 flex items-center gap-3">
                    <span className="font-semibold">Ratings:</span>
                    <Rate value={rating} disabled className="text-brand-500" />
                </div>
            </div>
        </section>
    );
};

export default CarInfo;
