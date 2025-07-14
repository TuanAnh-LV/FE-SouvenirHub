import { createContext, useContext, useEffect, useState } from "react";
import socket from "../utils/socket";
import { NotificationService } from "../services/notification/notification.service";
import { useAuth } from "./auth.context";
import { message as toast } from "antd";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!userInfo?._id) return;
    try {
      const res = await NotificationService.getByUserId(userInfo._id);
      const data = res.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error(" Lỗi fetch notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    await NotificationService.markAllAsRead(userInfo._id);
    fetchNotifications();
  };

  const deleteAll = async () => {
    await NotificationService.deleteAllByUser(userInfo._id);
    fetchNotifications();
  };

  useEffect(() => {
    if (!userInfo?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userInfo._id);

    fetchNotifications();

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(data.message);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [userInfo]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        deleteAll,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
