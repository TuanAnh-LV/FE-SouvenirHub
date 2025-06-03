import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
const SVNH = lazy(() => import("../../assets/souvenir-hub-logo.png"));

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <Row gutter={[16, 16]}>
      {Array.isArray(products) && products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={8} lg={8}>
          <Card
            hoverable
            onClick={() => handleCardClick(product._id)}
            cover={
              <img
                src={product.images[0] || SVNH}
                alt={product.name}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
            style={{ background: "#FFD1B3" }}
          >
            <Card.Meta
              title={product.name}
              description={`${parseInt(product.price.$numberDecimal).toLocaleString()}đ`}
            />
            <div style={{ marginTop: 8 }}>
              <Rate
                disabled
                allowHalf
                value={product.averageRating || 0}
                character={<StarFilled />}
                style={{ fontSize: 16 }}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>
                {product.reviewCount || 0} đánh giá
              </span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
