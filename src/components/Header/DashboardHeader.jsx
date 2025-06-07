import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Input, Badge, Avatar, Dropdown, Menu, message } from "antd";
import { useAuth } from "../../context/auth.context";
import logo from "../../assets/souvenir-hub-logo.png";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully!");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<SettingOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#FFE1D6] border-b border-gray-200">
      {/* Logo + Search */}
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Souvenir Hub"
          className="h-24"
          onClick={() => navigate("/")}
        />
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="w-80 rounded-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Badge count={2} size="small">
          <BellOutlined className="text-xl cursor-pointer" />
        </Badge>
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar icon={<UserOutlined />} src={userInfo?.avatar || null} />
            <span className="font-medium">{userInfo?.name || "User"}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default DashboardHeader;
