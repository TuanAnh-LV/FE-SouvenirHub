import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
  ReadOutlined,
  TagOutlined,
  BellOutlined,
  DollarOutlined,
  PercentageOutlined,
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

  // const common = [
  //   {
  //     path: ROUTER_URL.COMMON.PROFILE,
  //     label: "Profile",
  //     icon: <UserOutlined />,
  //   },
  // ];

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
    {
      path: "/seller/blogs",
      label: "Blogs",
      icon: <ReadOutlined />,
    },
    {
      path: "/seller/vouchers",
      label: "Mã giảm giá",
      icon: <TagOutlined />,
    },
    {
      path: "/seller/commission-policy",
      label: "Chính sách hoa hồng",
      icon: <PercentageOutlined />,
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
    {
      path: "/admin/blogs",
      label: "Quản lý blog",
      icon: <ReadOutlined />,
    },
  ];

  const getMenu = () => {
    if (role === "buyer") return [...buyer];
    if (role === "seller") return [...seller];
    if (role === "admin") return [...admin];
    return [];
  };

  return (
    <div className="w-64 bg-[#FFF1E6] p-6 min-h-screen flex flex-col space-y-2 overflow-y-auto">
      <div className="text-2xl font-bold mb-6" onClick={() => navigate("/")}>
        SOUVENIR HUB
      </div>
      {getMenu().map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium 
        hover:bg-[#FFE1D6] transition-all duration-200
        ${
          location.pathname === item.path
            ? "bg-[#FFE1D6] font-semibold shadow-sm"
            : ""
        }`}
        >
          <div className="text-lg">{item.icon}</div>
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
