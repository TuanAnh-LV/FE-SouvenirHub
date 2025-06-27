import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  InputNumber,
  Checkbox,
  Image,
  Rate,
  Tag,
  message,
  Tabs,
} from "antd";
import { ShoppingCartOutlined, EditOutlined } from "@ant-design/icons";
import { ProductService } from "../../services/product-service/product.service";
import { ReviewService } from "../../services/review/review.service";
import ReviewPage from "../../pages/ReviewPage";
// import { CartService } from "../../services/cart/cart.service";

import AboutShop from "./AboutShop";
import { useCart } from "../../context/cart.context";

const { Title, Paragraph, Text } = Typography;
const ProductDetail = () => {
  const { id } = useParams();
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState(false);
  // Add this state for main image
  const [mainImg, setMainImg] = useState(null);
  const { getCartCount, addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await ProductService.getByid(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImg(product.images[0]);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-10">Đang tải sản phẩm...</div>;
  }

  const basePrice = selectedVariant
    ? selectedVariant.finalPrice || selectedVariant.price
    : product.finalPrice || parseInt(product.price?.$numberDecimal || 0, 10);

  const price = parseInt(basePrice);

  const engravingCost = 50000;
  const totalPrice = engraving ? price + engravingCost : price;

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity, selectedVariant?._id || null);
      message.success("Đã thêm vào giỏ hàng!");
      await getCartCount(); // cập nhật số lượng giỏ
    } catch (error) {
      message.error("Thêm vào giỏ hàng thất bại!");
      console.error(error);
    }
  };
  // Cuối file ProductDetail.jsx, sau đoạn useEffect và handleAddToCart
  const scrollToSection = (id, offset = 80) => {
    const el = document.getElementById(id);
    if (el) {
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        className="mx-auto p-4"
        style={{
          maxWidth: "80%",
          width: "100%",
          marginTop: "3%",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "5%" }}>
          {/* Images */}
          <div>
            {/* Main Image */}
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #eee",
              }}
            >
              <img
                src={mainImg}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {(product.images || []).map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    border:
                      mainImg === img ? "2px solid #faad14" : "1px solid #ddd",
                    borderRadius: 4,
                    padding: 2,
                    background: "#fff",
                    cursor: "pointer",
                    width: 56,
                    height: 56,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setMainImg(img)}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 2,
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div>
            <Title level={3} className="mb-2">
              {product.name}
            </Title>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="blue">{product.category_id?.name}</Tag>
              <Tag color="green">{product.shop_id?.name}</Tag>
              <div className="flex flex-col">
                <Rate
                  disabled
                  allowHalf
                  value={product.averageRating || 0}
                  className="ml-2"
                  style={{ fontSize: 16 }}
                />
                <span className="text-xs text-gray-500">
                  {product.reviewCount || 0} đánh giá
                </span>
              </div>
            </div>
            <div className="text-[#d0011b] font-bold text-2xl mb-2">
              {totalPrice.toLocaleString()}₫
            </div>
            <Paragraph className="mt-2 mb-1 font-semibold">
              Mô tả sản phẩm:
            </Paragraph>
            <Text
              type="secondary"
              className="block mb-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {product.description}
            </Text>
            {product.variants && product.variants.length > 0 && (
              <div className="mb-2">
                <Paragraph className="font-semibold mb-1">Mẫu mã:</Paragraph>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant._id}
                      size="small"
                      onClick={() => {
                        setSelectedVariant(variant);
                        if (variant.images?.[0]) setMainImg(variant.images[0]);
                      }}
                      style={{
                        backgroundColor:
                          selectedVariant?._id === variant._id
                            ? "#E07B50"
                            : "#fff",
                        borderColor: "#ddd",
                        color:
                          selectedVariant?._id === variant._id
                            ? "#fff"
                            : "inherit",
                      }}
                    >
                      {variant.name || variant.attributes?.color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Paragraph className="mt-2 mb-1 font-semibold">Số lượng:</Paragraph>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={setQuantity}
              className="mb-2"
            />
            <Paragraph className="mt-2 mb-1 font-semibold">
              Còn lại:{" "}
              {product.stock === 0 ? (
                <span className="text-red-500 font-bold">Hết hàng</span>
              ) : (
                <span className="text-green-600">{product.stock}</span>
              )}{" "}
              sản phẩm
            </Paragraph>
            <Paragraph className="mt-4 text-gray-500">
              Giao hàng dự kiến: 3-4 ngày + (Thời gian thực hiện 7-12 ngày)
            </Paragraph>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              className="mt-4 w-full"
              style={{ background: "#E07B50", borderColor: "#E07B50" }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
        <div className="p-4 bg-[#fff7f6] mt-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <EditOutlined className="text-lg text-black" />
            <Title level={5} className="!mb-0">
              Lưu ý từ cửa hàng
            </Title>
          </div>

          <Paragraph className="text-sm text-black">
            Hãy biến chiếc ví đựng thẻ trở thành tác phẩm dành cho riêng bạn
            bằng cách khắc tên cá nhân hóa:
          </Paragraph>

          <ul className="list-disc list-inside text-sm text-black space-y-1">
            <li>
              Vui lòng ghi tên mà bạn muốn khắc trên ví vào ô &quot;Lưu ý từ
              khách hàng&quot;
            </li>
            <li>Độ dài tên riêng để khắc tối đa 10 ký tự</li>
          </ul>

          <Paragraph className="text-sm text-black mt-2">
            <strong>Lưu ý:</strong> Thời gian làm có thể kéo dài từ 7–12 ngày.
            Khách hàng có thể cân nhắc trước khi đặt.
          </Paragraph>
        </div>
        <div className="flex justify-center gap-12 mt-6 sticky top-[64px] z-10 py-2 border-b">
          <button
            onClick={() => scrollToSection("specs", 150)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Thông số kỹ thuật
          </button>
          <button
            onClick={() => scrollToSection("desc", 150)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Mô tả
          </button>
          {/* {product.specifications && product.specifications.trim() && (
            <button
              onClick={() => scrollToSection("specation", 150)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Lưu ý đặc biệt
            </button>
          )} */}
          <button
            onClick={() => scrollToSection("brand", 150)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Về thương hiệu
          </button>
          <button
            onClick={() => scrollToSection("reviews", 300)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Đánh giá
          </button>
        </div>

        {/* <div id="specs" className="mt-10">
          <Title level={5}>Lưu ý đặc biệt</Title>
          <Text
            type="secondary"
            style={{ whiteSpace: "pre-line" }}
            className="text-sm text-gray-700"
          >
            {product.specialNotes}
          </Text>
        </div> */}

        <div id="desc" className="mt-10">
          <Title level={5} className="text-black">
            Mô tả
          </Title>
          <Text
            type="secondary"
            style={{ whiteSpace: "pre-line" }}
            className="text-sm text-gray-700"
          >
            {product.description}
          </Text>
        </div>
        <div id="specation" className="mt-10">
            <Title level={5}>Lưu ý đặc biệt</Title>
            <Text
              type="secondary"
              // style={{ whiteSpace: "pre-line" }}
              className="text-base text-black"
            >
              <div dangerouslySetInnerHTML={{ __html: product.specialNotes}} />
            </Text>
            
        </div>
        
        <div id="notes" className="mt-10">
          <Title level={5} className="text-black">
            Thông số kỹ thuật
          </Title>
          <Text
              type="secondary"
              style={{ whiteSpace: "pre-line" }}
              className="text-sm text-black"
            >
              {product.specifications}
            </Text>
        </div>

        <div id="brand" className="mt-10">
          <Title level={5}>Về thương hiệu</Title>
          <AboutShop shop_id={product.shop_id._id} />
        </div>

        <div id="reviews" className="mt-10">
          <Title level={5}>Đánh giá sản phẩm</Title>
          <ReviewPage />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
