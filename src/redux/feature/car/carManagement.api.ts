import { baseApi } from "@/redux/api/baseApi";


const carManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCar: builder.mutation({
            query: (data) => ({
                url: "/cars",
                method: "POST",
                body: data,
            }),
        }),
        getAllCars: builder.query({
            query: (params) => ({
                url: "/cars",
                method: "GET",
                params,
            }),
            providesTags: ["Car"],
        }),
        getCarById: builder.query({
            query: (id) => ({
                url: `/cars/${id}`,
                method: "GET",
            }),
        }),
        getAvailableCars: builder.query({
            query: (params) => ({
                url: "/cars/available",
                method: "GET",
                params,
            }),
            providesTags: ["Car"],
        }),
        updateCar: builder.mutation({
            query: (car) => ({
                url: `/cars/update`, // Ensure data includes _id
                method: "PATCH",
                body: car,
            }),
            invalidatesTags: ["Car"], // Invalidate cached data after update
        }),
        updateCarStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/cars/${id}/status`, // dynamic id
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Car"],
        }),
        deleteCar: builder.mutation({
            query: (id) => ({
                url: `/cars/${id}`,
                method: "DELETE",
            }),
        }),
        returnCar: builder.mutation({
            query: (data) => ({
                url: `/cars/return`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllCarsQuery,
    useGetCarByIdQuery,
    useGetAvailableCarsQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useUpdateCarStatusMutation,
    useDeleteCarMutation,
    useReturnCarMutation,
} = carManagementApi;
