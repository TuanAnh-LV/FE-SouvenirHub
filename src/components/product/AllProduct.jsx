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
      {Array.isArray(products) &&
        products.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={8}>
            <Card
              hoverable
              onClick={() => handleCardClick(product._id)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
              cover={
                <img
                  src={product.images[0] || SVNH}
                  alt={product.name}
                  className="h-[200px] object-cover w-full"
                />
              }
            >
              <div className="p-2">
                <h3 className="text-base font-semibold line-clamp-2 min-h-[48px]">
                  {product.name}
                </h3>
                <div className="text-xs text-gray-500 mt-1">
                  <Rate
                    disabled
                    allowHalf
                    value={product.averageRating || 0}
                    character={<StarFilled />}
                    style={{ fontSize: 16 }}
                  />
                  ({product.reviewCount ?? 0} reviews)
                </div>
                <p className="text-[#d0011b] text-lg font-bold mt-1">
                  {parseInt(product.price.$numberDecimal).toLocaleString()}₫
                </p>
              </div>
            </Card>
          </Col>
        ))}
    </Row>
  );
};

export default ProductGrid;
