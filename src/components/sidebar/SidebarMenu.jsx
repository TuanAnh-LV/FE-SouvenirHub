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
import { useNavigate } from "react-router-dom";
const SidebarMenu = () => {
  const location = useLocation();
  const { userInfo } = useAuth();
  const role = userInfo?.role;
  const navigate = useNavigate();

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
      label: "Trang chủ",
      icon: <HomeOutlined />,
    },
    {
      path: "/buyer/register-shop",
      label: "Đăng kí shop",
      icon: <ShopOutlined />,
    },
    {
      path: "/buyer/orders",
      label: "Đơn hàng",
      icon: <ShoppingCartOutlined />,
    },
    {
      path: "/buyer/profile",
      label: "Hồ sơ",
      icon: <UserOutlined />,
    },
  ];

  const seller = [
    {
      path: "/seller/dashboard",
      label: "Trang chủ",
      icon: <HomeOutlined />,
    },
    {
      path: "/seller/products",
      label: "Quản lý sản phẩmphẩm",
      icon: <AppstoreOutlined />,
    },
    {
      path: "/seller/orders",
      label: "Quản lý đơn hàng",
      icon: <ShoppingCartOutlined />,
    },
  ];

  const admin = [
    {
      path: "/admin",
      label: "Trang chủ",
      icon: <HomeOutlined />,
    },
    {
      path: "/admin/manage-shop",
      label: "Quản lý shop",
      icon: <ShopOutlined />,
    },
    {
      path: "/admin/products/pending",
      label: "Trạng thái sản phẩm",
      icon: <ShopOutlined />,
    },
  ];

  const getMenu = () => {
    if (role === "buyer") return [...buyer];
    if (role === "seller") return [...seller, ...common];
    if (role === "admin") return [...admin, ...common];
    return [];
  };

  return (
    <div className="w-64 bg-[#FFF1E6] p-6 min-h-screen">
      <div className="text-2xl font-bold mb-6" onClick={() => navigate("/")}>
        SOUVENIR HUB
      </div>
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
