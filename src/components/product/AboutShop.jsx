import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import { ShopOutlined, StarFilled } from "@ant-design/icons";

const AboutShop = () => {
  const [showContent, setShowContent] = useState(true);
  const navigate = useNavigate();

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
                  src="https://res.cloudinary.com/du5lr3xri/image/upload/v1748081377/souvenirhub/products/u8ucjztycjnbwr5w7hsw.webp"
                  alt="Đỏ Art"
                  className="w-24 h-24 rounded object-cover"
                />

                <div className="flex-1">
                  <div className="font-semibold text-lg">Đỏ Art</div>
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
                      <span className="font-semibold">5</span>
                      <span>Đánh giá</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gray-200 rounded-full px-8 py-2 font-semibold text-base"
                  style={{ height: "48px" }}
                  onClick={() => navigate(`/shop-profile/{$id}`)}
                >
                  Xem shop
                </Button>
              </div>

              <ul className="list-disc list-inside text-sm text-black space-y-1 mt-4">
                <li>
                  Khởi nguồn từ tình yêu với văn hoá dân gian và lịch sử Việt Nam.
                  Chính vì lẽ đó, các sản phẩm đậm chất truyền thống, mang màu sắc Á
                  Đông và văn hoá Việt Nam.
                </li>
                <li>
                  Những nhân vật lịch sử, câu chuyện dân gian Việt Nam,… được tái hiện
                  trên nền da mộc mạc, với những đường nét thanh, mảnh, dày, đặc
                  khiếu vũ cùng màu sắc dường như sống động hơn, tạo nên tác phẩm
                  độc nhất vô nhị, mang giá trị nghệ thuật và nét văn hoá riêng.
                </li>
                <li>
                  Hy vọng thông qua sản phẩm của mình, những di sản truyền thống,
                  sự giàu và đẹp của văn hoá Việt Nam sẽ đến gần hơn với công chúng.
                </li>
                <li>
                  Ngoài ra, thương hiệu này cũng muốn mang tới những sản phẩm khác
                  biệt với các sản phẩm đại trà trên thị trường và tạo giá trị riêng
                  cho mỗi người sở hữu.
                </li>
              </ul>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutShop;
