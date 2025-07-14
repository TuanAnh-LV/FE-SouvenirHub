import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography } from "antd";
import { ProductService } from "../../services/shop-service/shop.service";

const { Title, Text, Paragraph } = Typography;

const AboutShop = ({ shop_id }) => {
  const [shopProfile, setShopProfile] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigate = useNavigate();

  const fetchShopProfile = useCallback(async () => {
    try {
      const response = await ProductService.getShopById(shop_id);
      setShopProfile(response.data.shop);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu shop:", error);
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
    <div className="mx-auto" style={{ width: "100%" }}>
      <Card style={{ padding: 4 }}>
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
                  {shopProfile.address}
                </Text>
              </div>
              <Button
                className="bg-[#E07B50] rounded-full px-8 py-2 font-semibold text-base"
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
      </Card>
    </div>
  );
};

export default AboutShop;
