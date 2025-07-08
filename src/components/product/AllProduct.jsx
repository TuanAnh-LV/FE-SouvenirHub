import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
import { Motion as Motion } from "framer-motion";
import fallbackImg from "../../assets/souvenir-hub-logo.png";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <Row gutter={[16, 16]} className="mb-8">
      {Array.isArray(products) &&
        products.map((product, index) => {
          const basePrice = parseFloat(product.price?.$numberDecimal || 0);
          const priceDisplay =
            product.variants?.length > 1
              ? `Từ ${basePrice.toLocaleString()}₫`
              : `${basePrice.toLocaleString()}₫`;

          const rating = product.averageRating || 0;
          const reviewCount = product.reviewCount ?? 0;

          return (
            <Col key={product._id} xs={24} sm={12} md={8} lg={8}>
              <Motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  hoverable
                  onClick={() => handleCardClick(product._id)}
                  className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
                  bodyStyle={{ padding: "12px" }}
                  cover={
                    <img
                      src={product.images?.[0] || fallbackImg}
                      onError={(e) => (e.target.src = fallbackImg)}
                      alt={product.name}
                      className="h-[240px] w-full object-cover rounded-t-xl bg-white"
                    />
                  }
                >
                  <h3 className="text-base font-semibold line-clamp-2 min-h-[48px] text-gray-800">
                    {product.name}
                  </h3>

                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Rate
                      disabled
                      allowHalf
                      value={rating}
                      character={<StarFilled />}
                      style={{ fontSize: 18 }}
                    />
                    <span className="text-xs">({reviewCount} đánh giá)</span>
                  </div>

                  <p className="text-[#d0011b] text-lg font-bold mt-1">
                    {priceDisplay}
                  </p>
                </Card>
              </Motion.div>
            </Col>
          );
        })}
    </Row>
  );
};

export default ProductGrid;
