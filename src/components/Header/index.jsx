import { useNavigate } from "react-router-dom";
import { Input, Badge, Dropdown, Avatar } from "antd";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth.context";
import { useCart } from "../../context/cart.context";
import logo from "../../assets/souvenir-hub-logo.png";
import { toast } from "react-toastify";
import { useEffect } from "react";
const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const { cartCount, getCartCount, cart } = useCart();
  useEffect(() => {
    getCartCount();
  }, [getCartCount]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const getMenuItems = () => {
    if (!userInfo) return [];

    const role = userInfo.role;

    switch (role) {
      case "admin":
        return [
          {
            key: "dashboard",
            label: "Dashboard",
            onClick: () => navigate("/admin"),
          },
          { key: "logout", label: "Log out", onClick: handleLogout },
        ];
      case "seller":
        return [
          {
            key: "dashboard",
            label: "Dashboard",
            onClick: () => navigate("/seller"),
          },
          { key: "logout", label: "Log out", onClick: handleLogout },
        ];
      case "buyer":
      default:
        return [
          {
            key: "profile",
            label: "Profile",
            onClick: () => navigate("/buyer/profile"),
          },
          {
            key: "orders",
            label: "My Orders",
            onClick: () => navigate("/buyer/orders"),
          },
          {
            key: "dashboard-buyer",
            label: "Dashboard",
            onClick: () => navigate("/buyer/dashboard"),
          },
          { key: "logout", label: "Log out", onClick: handleLogout },
        ];
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#FFA690] shadow-md z-50 px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Souvenir Hub" className="h-24 ml-13" />
      </div>

      {/* Search */}
      <div className="w-[30%] hidden md:block">
        <Input
          size="large"
          placeholder="personalized gift, gift for loved ones..."
          prefix={<span className="text-gray-400 text-lg"></span>}
          className="rounded-full"
        />
      </div>

      {/* Menu */}
      <nav className="hidden md:flex gap-6 text-base font-medium text-black">
        <span onClick={() => navigate("/products")} className="cursor-pointer">
          Products
        </span>
        <span onClick={() => navigate("/gift-box")} className="cursor-pointer">
          Gift Box
        </span>
        <span onClick={() => navigate("/blogs")} className="cursor-pointer">
          Blogs
        </span>
        <span onClick={() => navigate("/contact")} className="cursor-pointer">
          Contact
        </span>
      </nav>

      {/* Auth + Cart */}
      <div className="flex items-center gap-6 text-[15px]">
        {userInfo ? (
          <Dropdown menu={{ items: getMenuItems() }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size={32} src={userInfo.avatar} icon={<UserOutlined />} />
              <span className="font-semibold text-gray-800">
                {userInfo.name}
              </span>
            </div>
          </Dropdown>
        ) : (
          <div className="text-sm text-gray-800 space-x-1">
            <span className="cursor-pointer" onClick={() => navigate("/login")}>
              Login
            </span>
            <span>|</span>
            <span
              className="cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </div>
        )}

        <div
          className="flex items-center cursor-pointer text-brown-700 font-semibold"
          onClick={() => navigate("/cart")}
        >
          <Badge count={cart?.total_quantity || 0} size="small" offset={[0, 6]}>
            <ShoppingOutlined style={{ fontSize: 22 }} />
          </Badge>
          <span className="ml-1">Cart</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
