export interface TCar {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    pricePerHour: number;
    description?: string;
    color?: string;
    features?: string[];
    status?: "available" | "unavailable";
    brand?: string;
    model?: string;
    year?: number;
    seats?: number;
    rating?: number;
    fuelType?: string;
    isElectric?: boolean;
    category?: string;
    location?: string;
    availableFrom?: string;
    availableUntil?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type TUser = {
    _id: string;
    name: string;
    email: string; // Ensure this property is present
    role: "user" | "admin";
    image: string;
    password?: string;
    confirmPassword?: string;
    needsPasswordChange?: boolean;
    passwordChangedAt?: Date;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface TBooking {
    _id: string;
    userId: string; // Using a separate user ID for clarity
    carId: string; // Using a separate car ID for clarity
    date: string; // ISO date string
    features?: string[]; // Optional extras
    startTime: string; // ISO date string or timestamp
    endTime: string; // ISO date string or timestamp
    totalCost: number; // Total cost as a number
}

export interface Bookings {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    totalCost: number;
    transactionId: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
        phone: string;
    };
    car: {
        _id: string;
        name: string;
        description: string;
        image: string;
        color: string;
        isElectric: boolean;
        features: string[];
        pricePerHour: number;
    };
    status: "approved" | "pending" | "canceled" | "completed";
    paymentStatus: string;
}
export interface TOrder {
    carName: string; // Assuming carName could be null if booking is not found
    date: string; // Assuming date is a Date object
    startTime: string; // Assuming startTime is a string (could also be a Date)
    endTime: string; // Assuming endTime is a string (could also be a Date)
    totalCost: number; // Total cost should be a number
    transactionId: string; // Assuming transactionId is a string
    paymentStatus: string; // Assuming payementStatus is a string
    name: string;
    email: string;
    phone: string;
}
