import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotal();
    } catch (error) {
      set;
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotal();
    } catch (error) {
      console.error(
        "🔥 Error adding to cart:",
        error.response?.data?.message || error.message
      );
    }
  },
  calculateTotal: async () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { productId: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotal();
  },
  updateQuantity: async (productId, quantity) => {
    try {
      console.log("Updating product:", productId, "New quantity:", quantity);

      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      const res = await axios.put(`/cart/${productId}`, { quantity });

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));

      console.log("✅ Cart updated:", res.data);
      get().calculateTotal();
    } catch (error) {
      console.error(
        " Error updating quantity:",
        error.response?.data?.message || error.message
      );
      alert(
        "Error updating cart: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  getCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({ coupon: res.data });
    } catch (error) {
      console.log("error in getCoupon", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/coupons/validate", { code });
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotal();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error("error in applyCoupon", error);
    }
  },
  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get.calculateTotal();
    toast.success("Coupon removed successfully");
  },
}));
