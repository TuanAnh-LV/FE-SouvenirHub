import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { message } from "antd";
import { OrderService } from "../services/order/order.service";
import { CartService } from "../services/cart/cart.service";

export const CartStatusEnum = {
  pending: "pending",
  shipped: "shipped",
  done: "done",
  cancelled: "cancelled",
};

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCompletedItems, setCartCompletedItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState({
    items: [],
    total_price: 0,
    total_quantity: 0,
  });
  const [loading, setLoading] = useState(true);

  const updateCartItems = useCallback(
    async (status) => {
      if (!token) return;
      try {
        const response = await OrderService.getOrders();
        const orders = response?.data || [];
        const filtered = orders.filter((o) => o.status === status);
        setCartItems(filtered);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },
    [token]
  );

  const updateCartStatus = async (orderIds, status) => {
    if (!token) return;
    try {
      const idsArray = Array.isArray(orderIds) ? orderIds : [orderIds];
      await Promise.all(
        idsArray.map((id) => OrderService.updateOrderStatus(id, status))
      );
      updateCartItems(CartStatusEnum.new);
      getCartCount();
    } catch (error) {
      console.error("Error updating cart status:", error);
    }
  };

  const deleteCartItem = async (orderId) => {
    if (!token) return;
    try {
      await OrderService.deleteOrder(orderId);
      updateCartItems(CartStatusEnum.new);
      getCartCount();
      message.success("The item has been removed from your cart.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const getCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const response = await OrderService.getOrders();
      const orders = response?.data || [];
      const count = orders.filter(
        (o) => o.status === CartStatusEnum.pending
      ).length;
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
      console.error("Error fetching cart count:", error);
    }
  }, [token]);

  const getCompletedCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await OrderService.getOrders();
      const orders = response?.data || [];
      setCartCompletedItems(
        orders.filter((o) => o.status === CartStatusEnum.completed)
      );
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
  }, [token]);

  useEffect(() => {
    const initCart = async () => {
      if (token) {
        await updateCartItems(CartStatusEnum.new);
        await getCartCount();
        await getCompletedCount();
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    };
    initCart();
  }, [token]);

  const refreshCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await CartService.getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return;
    try {
      const res = await CartService.addToCart({ productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      const res = await CartService.updateCart({ productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    if (!token) return;
    try {
      const res = await CartService.removeItem(productId);
      setCart(res.data);
      message.success("Đã xoá sản phẩm khỏi giỏ hàng.");
    } catch (err) {
      message.error("Xoá sản phẩm thất bại.");
      console.error(
        "Failed to remove item:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartCompletedItems,
        updateCartItems,
        updateCartStatus,
        deleteCartItem,
        getCartCount,
        getCompletedCount,
        cart,
        setCart,
        refreshCart,
        updateQuantity,
        removeItem,
        addToCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
