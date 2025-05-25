import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Button, Avatar, Badge } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import { AuthService } from "../../services/authService/auth.service";
import { useAuth } from "../../context/AuthContent";
import { ROUTER_URL } from "../../const/router.const";
import { UserRole } from "../../model/User";
import { useCart } from "../../context/CartContext";
const { Header } = Layout;
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const { cartCount, getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { userInfo } = useAuth();
  const items = [
    {
      label: "HOME",
      key: "home",
      onClick: () => navigate("/"), // Navigate to the home route
    },
    {
      label: "COURSE",
      key: "courses",
      children: [
        {
          label: "All Course",
          key: "all-courses",
          onClick: () => navigate("/all"),
        },
      ],
    },
    { label: "ABOUT", key: "about" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const cartPages = ["/cart", "/checkout"];
    if (cartPages.includes(location.pathname) && cartCount === null) {
      getCartCount();
    }
  }, [getCartCount, location.pathname, cartCount]);

  const handleCartClick = () => {
    if (cartCount === null) {
      getCartCount();
    }
    navigate("/cart");
  };

  const handleLogOut = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("googleToken");
      navigate("/login");
      window.location.reload();
      toast.success("Logout successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getDashboardLink = () => {
    if (!userInfo) {
      return ROUTER_URL.COMMON.HOME;
    }
    switch (userInfo.role) {
      case UserRole.admin:
        return ROUTER_URL.ADMIN.DASHBOARD;
      case UserRole.instructor:
        return ROUTER_URL.INSTRUCTOR.INSTRUCTOR_DASHBOARD;
      case UserRole.student:
        return ROUTER_URL.STUDENT.STUDENT_DASHBOARD;
      case UserRole.all:
        return ROUTER_URL.COMMON.HOME;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const userMenuItems = [
    {
      key: "1",
      label: `Dashboard`,
      onClick: () => navigate(getDashboardLink()),
    },
    { key: "2", label: "Logout", onClick: handleLogOut },
  ];

  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#fff",
          zIndex: 10,
        }}
      >
        <div className="flex justify-between items-center px-4 md:px-8">
          <div
            className="left flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={assets.logo} className="h-8 w-auto md:h-10" alt="Logo" />
            <p className="text-lg md:text-2xl font-bold text-black ml-2">
              FLearning
            </p>
          </div>

          {isMobile ? (
            <Dropdown overlay={<Menu items={items} />} trigger={["click"]}>
              <Button icon={<MenuOutlined />} />
            </Dropdown>
          ) : (
            <Menu
              mode="horizontal"
              items={items}
              className="flex-grow flex justify-center"
              style={{ borderBottom: "none" }}
            />
          )}

          <div className="flex items-center space-x-2 md:space-x-4">
            {userInfo ? (
              <>
                <Badge count={cartCount} showZero>
                  <Button
                    icon={<ShoppingCartOutlined style={{ fontSize: "24px" }} />}
                    type="text"
                    onClick={handleCartClick}
                  />
                </Badge>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomLeft"
                >
                  <Avatar
                    size={40}
                    src={userInfo.avatar_url || null}
                    icon={!userInfo.avatar_url && <UserOutlined />}
                  />
                </Dropdown>
                <span className="font-semibold text-gray-700">
                  {userInfo.name}
                </span>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/register")}
                  type="text"
                  className="font-semibold text-gray-700"
                >
                  Register
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1 rounded-full bg-gradient-to-br from-[#d01bc7] to-[#ff5117] text-white"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </Header>
    </Layout>
  );
}
