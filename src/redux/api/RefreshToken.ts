const refreshToken = async () => {
    const res = await fetch(`https://car-rental-backend-nine.vercel.app/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
    });

    const data = await res.json();
    return data?.token;
};

export default refreshToken;
