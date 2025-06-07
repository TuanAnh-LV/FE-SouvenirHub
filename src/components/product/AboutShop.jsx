import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography } from "antd";
import { ShopOutlined, StarFilled } from "@ant-design/icons";
import { ProductService } from "../../services/shop-service/shop.service";

const { Title, Text, Paragraph } = Typography;

const AboutShop = ({ shop_id }) => {
  const [shopProfile, setShopProfile] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const navigate = useNavigate();

  const fetchShopProfile = useCallback(async () => {
    try {
      const response = await ProductService.getShopById(shop_id);
      setShopProfile(response.data.shop);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [shop_id]);

  useEffect(() => {
    fetchShopProfile();
  }, [fetchShopProfile]);

  const getShortDescription = (desc, maxLength = 150) => {
    if (!desc) return "";
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + "...";
  };

  if (!shopProfile) return null;

  return (
    <div
      className="mx-auto p-4"
      style={{
        width: "100%",
        marginTop: "3%",
      }}
    >
      <Card
        className="mb-6"
        style={{ padding: 24 }}
        title={
          <Button
            type="text"
            className="font-semibold text-lg flex items-center"
            onClick={() => setShowContent((prev) => !prev)}
            style={{ padding: 0, display: "flex", alignItems: "center" }}
          >
            Về thương hiệu
            <span
              className="ml-2"
              style={{
                display: "inline-block",
                transition: "transform 0.3s",
                transform: showContent ? "rotate(0deg)" : "rotate(180deg)",
                fontSize: 18,
              }}
            >
              ▼
            </span>
          </Button>
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
            <Row gutter={24} align="top">
              <Col xs={24} sm={8} md={6} lg={5} xl={4}>
                <img
                  src={shopProfile.logo_url}
                  alt={shopProfile.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: 8,
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} sm={16} md={18} lg={19} xl={20}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      {shopProfile.name}
                    </Title>
                    <Text
                      strong
                      className="text-base"
                      style={{
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Địa chỉ: Khu phố 2, Hiệp Bình Chánh, Thủ Đức, TP.HCM
                    </Text>
                    <div
                      className="flex items-center mb-1"
                      style={{ marginBottom: 8 }}
                    >
                      <ShopOutlined style={{ fontSize: 20, marginRight: 8 }} />
                      <span className="font-semibold">50</span>
                      <span className="ml-1">Sản phẩm</span>
                      <StarFilled
                        style={{
                          color: "#faad14",
                          fontSize: 20,
                          marginLeft: 24,
                          marginRight: 8,
                        }}
                      />
                      <span className="font-semibold">
                        {shopProfile.rating || 0}
                      </span>
                      <span className="ml-1">Đánh giá</span>
                    </div>
                  </div>
                  <Button
                    className="bg-gray-200 rounded-full px-8 py-2 font-semibold text-base"
                    style={{ height: "48px", marginBottom: 16, marginLeft: 16 }}
                    onClick={() => navigate(`/shop-profile/${shopProfile._id}`)}
                  >
                    Xem shop
                  </Button>
                </div>
                <Paragraph
                  style={{
                    marginBottom: 0,
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    whiteSpace: "pre-line",
                  }}
                >
                  {showFullDesc
                    ? shopProfile.description
                    : getShortDescription(shopProfile.description)}

                  {shopProfile.description?.length > 150 && (
                    <span
                      onClick={() => setShowFullDesc((prev) => !prev)}
                      style={{
                        color: "black",
                        cursor: "pointer",
                        marginLeft: 8,
                        fontSize: "12px",
                      }}
                    >
                      {showFullDesc ? "Thu gọn" : "Xem thêm"}
                    </span>
                  )}
                </Paragraph>
              </Col>
            </Row>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutShop;
