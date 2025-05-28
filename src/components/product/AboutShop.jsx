import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import { ShopOutlined, StarFilled } from "@ant-design/icons";
import { ProductService } from "../../services/shop-service/shop.service";

const AboutShop = ({ shop_id }) => {
  const [shopProfile, setShopProfile] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const navigate = useNavigate();

  const fetchShopProfile = useCallback(async () => {
    try {
      const response = await ProductService.getShopById(shop_id);
      setShopProfile(response.data);
      console.log("Shop profile data:", response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [shop_id]);

  useEffect(() => {
    fetchShopProfile();
  }, [fetchShopProfile]);

  if (!shopProfile) return null;

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "80%",
        width: "100%",
        marginTop: "24px",
      }}
    >
      <Card
        className="bg-[#fdf7f2] rounded-md mb-6"
        style={{ padding: 24 }}
        title={
          <button
            className="font-semibold text-lg bg-transparent border-none outline-none cursor-pointer flex items-center"
            onClick={() => setShowContent((prev) => !prev)}
            style={{ padding: 0, transition: "color 0.2s" }}
          >
            Về thương hiệu
            <span
              className="ml-2"
              style={{
                display: "inline-block",
                transition: "transform 0.3s",
                transform: showContent ? "rotate(0deg)" : "rotate(180deg)",
              }}
            >
              ▼
            </span>
          </button>
        }
      >
        <div
          style={{
            maxHeight: showContent ? 1000 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: showContent ? 1 : 0,
            pointerEvents: showContent ? "auto" : "none",
          }}
        >
          {showContent && (
            <>
              <div className="flex flex-row gap-6 items-start">
                <img
                  src={shopProfile.logo_url}
                  alt={shopProfile.name}
                  className="w-24 h-24 rounded object-cover"
                />

                <div className="flex-1">
                  <div className="font-semibold text-lg">{shopProfile.name}</div>
                  <div className="text-sm text-gray-700 font-semibold mb-2">
                    Địa chỉ:{" "}
                    <span className="font-normal">
                      Khu phố 2, Hiệp Bình Chánh, Thủ Đức, TP.HCM
                    </span>
                  </div>
                  <div className="flex gap-8 text-xs text-gray-700 mb-2">
                    <div className="flex flex-col items-center">
                      <ShopOutlined style={{ fontSize: 20 }} />
                      <span className="font-semibold">50</span>
                      <span>Sản phẩm</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <StarFilled style={{ color: "#faad14", fontSize: 20 }} />
                      <span className="font-semibold">{shopProfile.rating || 0}</span>
                      <span>Đánh giá</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gray-200 rounded-full px-8 py-2 font-semibold text-base"
                  style={{ height: "48px" }}
                  onClick={() => navigate(`/shop-profile/${shopProfile._id}`)}
                >
                  Xem shop
                </Button>
              </div>

              <div className="text-sm text-black mt-4">
                {shopProfile.description}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutShop;
