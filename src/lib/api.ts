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
export const getFeaturedStudios = () => axiosInstance.get<Studio[]>("/studios/featured");

export const getStudios = (params: Record<string, string>) =>
  axiosInstance.get<Studio[]>("/studios", { params });

export const getMyStudios = () => axiosInstance.get<Studio[]>("/studios/mine");

export const getStudioById = (id: string) => axiosInstance.get(`/studio/${id}`);

export const createStudio = (payload: Partial<Studio>) =>
  axiosInstance.post("/add-studio", payload);

export const updateStudio = (id: string, payload: Partial<Studio>) =>
  axiosInstance.patch(`/studio/${id}`, payload);

export const deleteStudio = (id: string) => axiosInstance.delete(`/studio/${id}`);

/* ------------------------------ Bookings ---------------------------- */
export const createBooking = (payload: {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
}) => axiosInstance.post("/add-booking", payload);

export const getMyBookings = () => axiosInstance.get<Booking[]>("/bookings");

export const getHostBookings = () =>
  axiosInstance.get<Booking[]>("/bookings", { params: { host: "true" } });

export const getStudioBookings = (studioId: string) =>
  axiosInstance.get<Booking[]>(`/bookings/${studioId}`);

export const updateBookingStatus = (id: string, status: string) =>
  axiosInstance.patch(`/booking/${id}`, { status });

export const cancelBooking = (id: string) => axiosInstance.delete(`/booking/${id}`);

/* ------------------------------ Wishlist ---------------------------- */
export const getWishlist = () => axiosInstance.get<string[]>("/wishlist");

export const toggleWishlist = (studioId: string) =>
  axiosInstance.post<{ saved: boolean; message: string }>("/wishlist/toggle", { studioId });

/* --------------------------- Image upload --------------------------- */
/** Uploads to imgbb and returns the hosted image URL */
export const uploadImageToImgbb = async (file: File): Promise<string> => {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("Image upload key is not configured.");

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!data?.success) throw new Error(data?.error?.message || "Image upload failed.");
  return data.data.url as string;
};
