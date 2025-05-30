import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {  Button, Typography, InputNumber, Checkbox, Image, Rate, Tag } from "antd";
import { ShoppingCartOutlined, EditOutlined } from "@ant-design/icons";
import { ProductService } from "../../services/product-service/product.service";
import AboutShop from "./AboutShop";

const { Title, Paragraph, Text } = Typography;
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState(false);

  // Add this state for main image
  const [mainImg, setMainImg] = useState(null);

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

  const price = parseInt(product.price?.$numberDecimal || 0, 10);
  const engravingCost = 50000;
  const totalPrice = engraving ? price + engravingCost : price;

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
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "5%" }}
        >
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
                    border: mainImg === img ? "2px solid #faad14" : "1px solid #ddd",
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
            <Title level={3} className="mb-2">{product.name}</Title>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="blue">{product.category_id?.name}</Tag>
              <Tag color="green">{product.shop_id?.name}</Tag>
              <div className="flex flex-col">
                <Rate
                  disabled
                  defaultValue={5}
                  className="ml-2"
                  style={{ fontSize: 16 }}
                />
              </div>
            </div>
            <Title level={3} className="text-red-500 mb-2">
              {totalPrice.toLocaleString()}₫
            </Title>
            <Checkbox
              checked={engraving}
              onChange={(e) => setEngraving(e.target.checked)}
              className="mb-2"
            >
              Khắc tên (+50.000₫)
            </Checkbox>
            <Paragraph className="mt-2 mb-1 font-semibold">Mô tả sản phẩm:</Paragraph>
            <Text type="secondary" className="block mb-2" style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </Text>
            <Paragraph className="mt-2 mb-1 font-semibold">Số lượng:</Paragraph>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={setQuantity}
              className="mb-2"
            />
            <Paragraph className="mt-2 mb-1 font-semibold">
              Còn lại: <span className="text-green-600">{product.stock}</span> sản phẩm
            </Paragraph>
            <Paragraph className="mt-4 text-gray-500">
              Giao hàng dự kiến: 3-4 ngày + (Thời gian thực hiện 7-12 ngày)
            </Paragraph>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600"
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
          Hãy biến chiếc ví đựng thẻ trở thành tác phẩm dành cho riêng bạn bằng cách khắc tên cá nhân hóa:
        </Paragraph>

        <ul className="list-disc list-inside text-sm text-black space-y-1">
          <li>Vui lòng ghi tên mà bạn muốn khắc trên ví vào ô &quot;Lưu ý từ khách hàng&quot;</li>
          <li>Độ dài tên riêng để khắc tối đa 10 ký tự</li>
        </ul>

        <Paragraph className="text-sm text-black mt-2">
          <strong>Lưu ý:</strong> Thời gian làm có thể kéo dài từ 7–12 ngày. Khách hàng có thể cân nhắc trước khi đặt.
        </Paragraph>
      </div>
      </div>
      {/* Remove or reduce marginTop for AboutShop */}
      <div style={{ marginBottom: "5%" }}>
        <AboutShop shop_id={product.shop_id._id} />
      </div>
    </>
  );
};

export default ProductDetail;
