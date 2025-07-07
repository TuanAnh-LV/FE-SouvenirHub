import { useState } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  LockOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  NotificationOutlined,
  SettingOutlined,
  BankOutlined,
} from "@ant-design/icons";
import BuyerProfilePage from "./BuyerProfile";
import BuyerCart from "./BuyerCart";
import RegisterShop from "./RegisterShop";
import AddressManager from "./BuyerAddress";
import EmailVerificationPage from "../EmailVerificationPage";
import ChangePassword from "../ChangePassword";

export default function BuyerDashboardSidebar() {
  const [activeKey, setActiveKey] = useState("profile");
  const menuItems = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <UserOutlined />,
      content: <BuyerProfilePage setActiveKey={setActiveKey} />,
    },
    {
      key: "orders",
      label: "Đơn hàng",
      icon: <ShoppingCartOutlined />,
      content: <BuyerCart />,
    },
    {
      key: "registerShop",
      label: "Đăng ký shop",
      icon: <ShopOutlined />,
      content: <RegisterShop />,
    },
    {
      key: "address",
      label: "Địa chỉ",
      icon: <EnvironmentOutlined />,
      content: <AddressManager />,
    },
    {
      key: "password",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      content: <ChangePassword />,
    },
    {
      key: "notification",
      label: "Cài đặt thông báo",
      icon: <NotificationOutlined />,
      content: <div>Thông báo</div>,
    },
    {
      key: "voucher",
      label: "Kho Voucher",
      icon: <GiftOutlined />,
      content: <div>Voucher</div>,
    },
  ];
  const activeItem =
    menuItems.find((item) => item.key === activeKey) ||
    (activeKey === "verifyEmail"
      ? {
          key: "verifyEmail",
          content: <EmailVerificationPage setActiveKey={setActiveKey} />,
        }
      : null);

  return (
    <div className="min-h-60 flex justify-center bg-[#f5f5f5] py-10 px-2 mt-5">
      <div className="w-full max-w-6xl flex bg-white shadow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-70 p-5 border-r border-gray-200">
          <ul className="space-y-2">
            {menuItems
              .filter((item) => item.label)
              .map((item) => (
                <li
                  key={item.key}
                  className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-100 transition ${
                    activeKey === item.key
                      ? "bg-orange-200 text-[#d35400] font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setActiveKey(item.key)}
                >
                  {item.icon} {item.label}
                </li>
              ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <h2 className="text-xl font-bold mb-4">
            {menuItems.find((m) => m.key === activeKey)?.label}
          </h2>
          <div>
            {activeItem?.content || <div>Không tìm thấy nội dung.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
