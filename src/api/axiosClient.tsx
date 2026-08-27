import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("crs_token");
  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const tokenWasPresent = Boolean(localStorage.getItem("crs_token"));

      if (tokenWasPresent) {
        localStorage.removeItem("crs_token");
        localStorage.removeItem("crs_auth_session");
        window.dispatchEvent(new Event("crs:session-expired"));

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
