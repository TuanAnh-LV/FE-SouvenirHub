import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ROUTER_URL } from "../../const/router.const";
import { useAuth } from "../../context/auth.context";

const SidebarMenu = () => {
  const location = useLocation();
  const { userInfo } = useAuth();
  const role = userInfo?.role;

  const common = [
    {
      path: ROUTER_URL.COMMON.PROFILE,
      label: "Profile",
      icon: <UserOutlined />,
    },
  ];

  const buyer = [
    {
      path: "/buyer/dashboard",
      label: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      path: "/buyer/register-shop",
      label: "Register Shop",
      icon: <ShopOutlined />,
    },
    {
      path: "/buyer/orders",
      label: "My Orders",
      icon: <ShoppingCartOutlined />,
    },
  ];

  const seller = [
    {
      path: "/seller/dashboard",
      label: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      path: "/seller/products",
      label: "Products",
      icon: <AppstoreOutlined />,
    },
    {
      path: "/seller/orders",
      label: "Orders",
      icon: <ShoppingCartOutlined />,
    },
  ];

  const admin = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      path: "/admin/manage-shop",
      label: "Shop Management",
      icon: <ShopOutlined />,
    },
  ];

  const getMenu = () => {
    if (role === "buyer") return [...buyer, ...common];
    if (role === "seller") return [...seller, ...common];
    if (role === "admin") return [...admin, ...common];
    return [];
  };

  return (
    <div className="w-64 bg-[#FFF1E6] p-6 min-h-screen">
      <div className="text-2xl font-bold mb-6">SOUVENIR HUB</div>
      {getMenu().map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-[#FFE1D6] transition-all duration-200 ${
            location.pathname === item.path ? "bg-[#FFE1D6]" : ""
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
