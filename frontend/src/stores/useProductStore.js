import axios from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productsData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", productsData);
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
      }));
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`);
      // changing the isFeatured property
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data, loading: false });
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
      set({ loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
      console.log(error);
    }
  },
}));
