import { useNavigate } from "react-router-dom";
import { Input, Badge, Dropdown, Avatar, message, AutoComplete } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/auth.context";
import { useCart } from "../../context/cart.context";
import logo from "../../assets/souvenir-hub-logo.png";
import { ProductService } from "../../services/product-service/product.service";
import { useEffect, useState } from "react";
const { Search } = Input;
import { useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const { getCartCount, cart } = useCart();
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchText("");
    setOptions([]);
  }, [location.pathname]);
  useEffect(() => {
    getCartCount();
  }, [getCartCount]);

  const handleLogout = () => {
    logout();
    message.success("Đăng xuất thành công!");
    navigate("/login");
  };
  const fetchSuggestions = async (value) => {
    const keyword = value.trim();
    if (!keyword) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await ProductService.getAll({ name: keyword, limit: 5 });

      const products = res.data.items || [];

      if (products.length === 0) {
        setOptions([
          {
            value: "",
            label: (
              <span className="text-gray-400 italic">
                Không tìm thấy sản phẩm nào
              </span>
            ),
            disabled: true,
          },
        ]);
      } else {
        const mapped = products.map((p) => ({
          value: p.name,
          label: (
            <div className="flex justify-between">
              <span>{p.name}</span>
            </div>
          ),
        }));

        setOptions(mapped);
      }
    } catch (err) {
      console.error("Suggestion error", err);
      setOptions([
        {
          value: "",
          label: (
            <span className="text-red-400 italic">
              Có lỗi khi tìm kiếm. Vui lòng thử lại!
            </span>
          ),
          disabled: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
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
            onClick: () => navigate("/seller/dashboard"),
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
            key: "dashboard-buyer",
            label: "Dashboard",
            onClick: () => navigate("/buyer/dashboard"),
          },
          { key: "logout", label: "Log out", onClick: handleLogout },
        ];
    }
  };

  return (
    <header className=" fixed w-full z-50">
      {/* Main header */}
      <div className="bg-[#F3B5A0] shadow-sm w-full text-[#5C3D2E]">
        <div className="max-w-screen-xl mx-auto px-10 flex items-center justify-between">
          {/* Logo + hamburger */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Souvenir Hub" className="h-18" />
          </div>

          {/* Search*/}
          <div className="flex-1 mx-8 max-w-3xl mt-10">
            <AutoComplete
              options={
                loading
                  ? [
                      {
                        value: "",
                        label: (
                          <span className="text-gray-400 italic">
                            Đang tìm...
                          </span>
                        ),
                        disabled: true,
                      },
                    ]
                  : options
              }
              loading={loading}
              onSearch={(value) => {
                setSearchText(value);
                fetchSuggestions(value);
              }}
              onSelect={(value) => {
                navigate(`/products?q=${encodeURIComponent(value)}`);
                setSearchText("");
              }}
              value={searchText}
              style={{ width: "100%" }}
            >
              <Search
                placeholder="Tìm kiếm quà tặng, hộp quà, và nhiều hơn nữa..."
                allowClear
                enterButton
                size="large"
                onSearch={(value) => {
                  navigate(`/products?q=${encodeURIComponent(value)}`);
                  setSearchText("");
                }}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </AutoComplete>

            <nav className="flex justify-center items-center gap-6 text-sm font-medium text-gray-700 h-10 ml-5">
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/products")}
              >
                Quà tặng cá nhân hóa
              </span>
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/gift-box")}
              >
                Hộp quà
              </span>
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/blog")}
              >
                Blogs
              </span>
            </nav>
          </div>

          {/* Auth + Cart */}
          <div className="flex items-center gap-6 mt-4">
            {userInfo ? (
              <Dropdown
                menu={{ items: getMenuItems() }}
                placement="bottomRight"
              >
                <div className="flex items-center gap-2 cursor-pointe px-3 py-1 rounded-full transition">
                  <Avatar
                    size={32}
                    src={userInfo.avatar}
                    icon={<UserOutlined />}
                  />
                  <span className="font-semibold text-gray-800">
                    {userInfo.name}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className="text-sm text-gray-700 space-x-2">
                <span
                  className="cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </span>
                <span>|</span>
                <span
                  className="cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Đăng ký
                </span>
              </div>
            )}

            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <Badge
                count={cart?.total_quantity || 0}
                size="small"
                offset={[2, -2]}
                style={{
                  backgroundColor: "#fff",
                  color: "#FF5722",
                  fontWeight: "bold",
                }}
              >
                <ShoppingOutlined style={{ fontSize: 24, color: "white" }} />
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Menu nav under search */}
    </header>
  );
};

export default Header;
