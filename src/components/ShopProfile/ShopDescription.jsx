import { Card, Rate, Row, Col, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

const ShopDescripton = ({ shop }) => {
  if (!shop) return null; // Prevent rendering if shop is undefined

  // Format join date
  const joinDate = new Date(shop.created_at).toLocaleDateString("vi-VN");

  return (
    <Card className="mb-6" style={{ padding: 24 }}>
      <Row gutter={24} align="top">
        <Col xs={24} sm={8} md={6} lg={5} xl={4}>
          <img
            src={shop.logo_url}
            alt={shop.name}
            style={{
              width: "180px", // Increased width
              height: "180px", // Increased height
              borderRadius: 8,
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Col>
        <Col xs={24} sm={16} md={18} lg={19} xl={20}>
          <Title level={2} style={{ marginBottom: 8 }}>
            {shop.name}
          </Title>
          <Text
            strong
            className="text-lg"
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            Địa chỉ: {shop.address}
          </Text>
          <div className="flex items-center mb-1" style={{ marginBottom: 8 }}>
            <Rate
              disabled
              defaultValue={shop.rating}
              allowHalf
              style={{ fontSize: 20, color: "#faad14" }}
            />
            <span className="ml-2 font-semibold">{shop.rating}</span>
            {/* <span className="ml-1 text-gray-500 text-sm">(200 đánh giá)</span> */}
          </div>
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            Thời gian tham gia: {joinDate}
          </Text>
          <Paragraph
            style={{ marginBottom: 0, fontSize: "1rem", fontWeight: 350 }}
          >
            {shop.description}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ShopDescripton;
