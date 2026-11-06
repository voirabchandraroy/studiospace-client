import axiosInstance from "./axios";
import type { Booking, Studio, User } from "./types";

/* ------------------------------- Auth ------------------------------- */
export const registerUser = (payload: {
  name: string;
  email: string;
  photoURL?: string;
  password: string;
}) => axiosInstance.post("/api/auth/register", payload);

export const loginUser = (payload: { email: string; password: string }) =>
  axiosInstance.post<{ message: string; user: User }>("/api/auth/login", payload);

export const googleLogin = (payload: {
  name?: string | null;
  email: string;
  photoURL?: string | null;
}) => axiosInstance.post<{ message: string; user: User }>("/api/auth/google", payload);

export const logoutUser = () => axiosInstance.post("/api/auth/logout");

export const getMe = () => axiosInstance.get<User>("/api/auth/me");

/* ------------------------------ Studios ----------------------------- */
export const getFeaturedStudios = () => axiosInstance.get<Studio[]>("/api/studios/featured");

export const getStudios = (params: Record<string, string>) =>
  axiosInstance.get<Studio[]>("/api/studios", { params });

export const getMyStudios = () => axiosInstance.get<Studio[]>("/api/studios/mine");

export const getStudioById = (id: string) => axiosInstance.get(`/api/studio/${id}`);

export const createStudio = (payload: Partial<Studio>) =>
  axiosInstance.post("/api/add-studio", payload);

export const updateStudio = (id: string, payload: Partial<Studio>) =>
  axiosInstance.patch(`/api/studio/${id}`, payload);

export const deleteStudio = (id: string) => axiosInstance.delete(`/api/studio/${id}`);

/* ------------------------------ Bookings ---------------------------- */
export const createBooking = (payload: {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
}) => axiosInstance.post("/api/add-booking", payload);

export const getMyBookings = () => axiosInstance.get<Booking[]>("/api/bookings");

export const getHostBookings = () =>
  axiosInstance.get<Booking[]>("/api/bookings", { params: { host: "true" } });

export const getStudioBookings = (studioId: string) =>
  axiosInstance.get<Booking[]>(`/api/bookings/${studioId}`);

export const updateBookingStatus = (id: string, status: string) =>
  axiosInstance.patch(`/api/booking/${id}`, { status });

export const cancelBooking = (id: string) => axiosInstance.delete(`/api/booking/${id}`);

/* ------------------------------ Wishlist ---------------------------- */
export const getWishlist = () => axiosInstance.get<string[]>("/api/wishlist");

export const toggleWishlist = (studioId: string) =>
  axiosInstance.post<{ saved: boolean; message: string }>("/api/wishlist/toggle", { studioId });


