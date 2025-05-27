import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
const SVNH = lazy(() => import("../../assets/souvenir-hub-logo.png"));

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
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
          >
            <Card.Meta
              title={product.name}
              description={`${parseInt(product.price.$numberDecimal).toLocaleString()}đ`}
            />
            <Rate disabled defaultValue={5} character={<StarFilled />} style={{ marginTop: 8 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
