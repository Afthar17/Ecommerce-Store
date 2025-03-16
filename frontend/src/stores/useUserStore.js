import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  signUp: async (data) => {
    set({ Loading: true });
    if (data.password !== data.confirmPassword) {
      set({ Loading: false });
      return toast.error("Passwords do not match");
    }
    const { name, email, password } = data;
    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message || "Something went wrong");
    }
  },
  login: async (data) => {
    set({ Loading: true });
    const { email, password } = data;
    try {
      const response = await axios.post("/auth/login", { email, password });
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message || "Something went wrong");
    }
  },
  checkAuth: async () => {
    try {
      set({ checkingAuth: true });

      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return;
    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ checkingAuth: false, user: null });
      throw error;
    }
  },
  logOut: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null, checkingAuth: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
}));

//TODO axios interceoters for refreshing accesstoken
//axios interceptors for refreshing access token

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (refreshError) {
        // if refresh token fails, log out the user
        useUserStore.getState().logOut();
        return Promise.reject(refreshError);
      }
    }
  }
);
