import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { OrderService } from "../services/order/order.service";

export const CartStatusEnum = {
  new: "pending",
  waiting_paid: "waiting_paid",
  completed: "completed",
};

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCompletedItems, setCartCompletedItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const updateCartItems = useCallback(
    async (status) => {
      if (!token) return;
      try {
        const response = await OrderService.getOrders();
        // Filter orders by status (pending = cart)
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
    const count = orders.length;
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