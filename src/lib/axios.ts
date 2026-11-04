import axios from "axios";

/**
 * Single axios instance for the whole app.
 * `withCredentials: true` is REQUIRED so the browser sends / receives
 * the HTTPOnly JWT cookie on every request (Challenge 1).
 */
/**
 * If NEXT_PUBLIC_API_URL points at a deployed backend (e.g. https://api.onrender.com)
 * we call it directly. Otherwise we use a relative path, which Next.js proxies to
 * the Express server — that keeps cookies same-origin in dev and preview.
 */
const rawBase = process.env.NEXT_PUBLIC_API_URL?.trim();
const baseURL = rawBase?.startsWith("http") ? rawBase : "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
