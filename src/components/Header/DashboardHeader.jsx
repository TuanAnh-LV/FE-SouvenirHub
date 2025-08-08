import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Avatar, Dropdown, Menu, message, Button } from "antd";
import { useAuth } from "../../context/auth.context";
import { useNotification } from "../../context/notification.context"; // 👈 NEW
import logo from "../../assets/souvenir-hub-logo.png";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const DashboardHeader = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead, deleteAll } =
    useNotification();

  const handleLogout = () => {
    logout();
    message.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const notificationMenu = (
    <div
      style={{
        width: 320,
        maxHeight: 400,
        overflowY: "auto",
        padding: "12px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        background: "white",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-base">Thông báo</span>
        <div className="flex gap-2">
          <Button type="link" size="small" onClick={markAllAsRead}>
            Đọc tất cả
          </Button>
          <Button type="link" size="small" danger onClick={deleteAll}>
            Xoá tất
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-4">Không có thông báo</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="rounded-md bg-[#f9f9f9] p-3 shadow-sm hover:bg-[#f1f1f1] transition"
            >
              <div className="text-sm text-gray-800">{n.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {dayjs(n.created_at).format("HH:mm - DD/MM/YYYY")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#FFE1D6] border-b border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Souvenir Hub"
          className="h-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="flex items-center gap-6">
        <Dropdown
          trigger={["click"]}
          overlay={notificationMenu}
          placement="bottomRight"
        >
          <Badge count={unreadCount} size="small">
            <BellOutlined className="text-xl cursor-pointer hover:text-blue-500 transition" />
          </Badge>
        </Dropdown>

        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar icon={<UserOutlined />} src={userInfo?.avatar || null} />
            <span className="font-medium">
              {userInfo?.name || "Người dùng"}
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default DashboardHeader;
