/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Card, InputNumber, Button, message, Tag } from "antd";
import { OrderService } from "../../services/order/order.service";
import { ProductService } from "../../services/product-service/product.service";
import { DeleteOutlined } from "@ant-design/icons";

const statusColor = {
  pending: "orange",
  shipped: "blue",
  done: "green",
  cancelled: "red",
};

const BuyerCart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy tất cả order (không filter pending)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders();
      let allOrders = [];
      if (res && Array.isArray(res.data)) {
        allOrders = res.data;
        // Đảm bảo đồng bộ: fetch từng product tuần tự
        for (const order of allOrders) {
          for (const item of order.items) {
            if (!item.product_id || typeof item.product_id !== "object")
              continue;
            if (!item.product_id.images) {
              try {
                const productRes = await ProductService.getByid(
                  item.product_id._id
                );
                item.product_id = productRes.data;
              } catch {
                item.product_id.images = [];
              }
            }
          }
        }
      }
      setOrders(allOrders);
    } catch (err) {
      message.error("Không thể lấy danh sách đơn hàng");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật số lượng sản phẩm trong order
  const handleQuantityChange = async (orderId, itemId, newQuantity) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    const updatedItems = order.items.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    try {
      await OrderService.updateOrderStatus(orderId, {
        ...order,
        items: updatedItems,
      });
      message.success("Cập nhật số lượng thành công");
      fetchOrders();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  // Xử lý xóa sản phẩm khỏi order (hủy đơn hàng)
  const handleDeleteItem = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      message.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      message.error("Hủy đơn hàng thất bại");
    }
  };

  // Đếm tổng số sản phẩm
  const totalProductCount = orders.reduce(
    (acc, order) => acc + order.items.length,
    0
  );

  return (
    <div
      style={{
        background: "#FFF6F2",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
          Giỏ hàng
        </h2>
        {/* Header row */}
        <div
          className="cart-header-row"
          style={{
            background: "#FFD1B3",
            borderRadius: 12,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: 16,
            padding: "16px 0 16px 0",
            width: "100%",
            minHeight: 60,
          }}
        >
          <div style={{ width: 142 }}></div>
          <div style={{ width: 20, textAlign: "center" }}></div>

          <div style={{ flex: 1 }}>Sản phẩm ({totalProductCount} sản phẩm)</div>
          <div style={{ flex: 3, display: "flex" }}>
            <div style={{ flex: 1, textAlign: "left" }}>Giá sản phẩm</div>
            <div style={{ flex: 1, textAlign: "left" }}>Số lượng</div>
            <div style={{ flex: 1, textAlign: "left" }}>Tổng giá</div>
            <div style={{ flex: 1, textAlign: "left" }}>Trạng thái</div>
          </div>
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 48 }}>
            Không có đơn hàng.
          </div>
        ) : (
          orders.map((order) =>
            order.items.map((item, idx) => (
              <Card
                key={item._id}
                className="cart-card"
                style={{
                  background: "#FFD1B3",
                  borderRadius: 12,
                  marginBottom: 24,
                  boxShadow: "0 2px 8px #0001",
                  border: "none",
                  width: "100%",
                  padding: 0,
                }}
                styles={{
                  body: {
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    minHeight: 142,
                  },
                }}
              >
                {/* Thùng rác */}
                <div
                  style={{
                    width: 20,
                    textAlign: "center",
                    paddingRight: 20,
                  }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteItem(order._id)}
                  />
                </div>
                {/* Ảnh sản phẩm */}
                <div
                  style={{
                    width: 142,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={
                      item.product_id.images &&
                      item.product_id.images.length > 0
                        ? item.product_id.images[0]
                        : "https://via.placeholder.com/80"
                    }
                    alt={item.product_id.name}
                    style={{
                      width: 110,
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </div>
                {/* Tên sản phẩm và danh mục */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 4,
                      maxWidth: 260,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={item.product_id.name}
                  >
                    {item.product_id.name.length > 20
                      ? item.product_id.name.slice(0, 20) + "..."
                      : item.product_id.name}
                  </div>
                  <div
                    style={{
                      color: "#666",
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  >
                    {item.product_id.category_id?.name || ""}
                  </div>
                </div>
                {/* Giá, số lượng, tổng giá */}
                <div style={{ flex: 3, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {parseInt(item.price, 10).toLocaleString()}đ
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <InputNumber
                      min={1}
                      max={item.product_id.stock}
                      value={item.quantity}
                      onChange={(value) =>
                        handleQuantityChange(order._id, item._id, value)
                      }
                      style={{
                        width: 80,
                        height: 40,
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                  {/* Trạng thái */}
                  <div style={{ flex: 1, textAlign: "start" }}>
                    <Tag
                      color={statusColor[order.status] || "default"}
                      style={{ fontSize: 14, padding: "2px 12px" }}
                    >
                      {order.status === "pending"
                        ? "Chờ xác nhận"
                        : order.status === "shipped"
                        ? "Đã giao"
                        : order.status === "done"
                        ? "Hoàn thành"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : order.status}
                    </Tag>
                  </div>
                </div>
              </Card>
            ))
          )
        )}
      </div>
      {/* Responsive CSS */}
      <style>
        {`
        @media (max-width: 1100px) {
          .cart-header-row, .cart-card .ant-card-body {
            font-size: 13px !important;
          }
          .cart-header-row > div,
          .cart-card .ant-card-body > div {
            font-size: 13px !important;
          }
        }
        @media (max-width: 900px) {
          .cart-header-row, .cart-card .ant-card-body {
            font-size: 12px !important;
          }
          .cart-header-row > div,
          .cart-card .ant-card-body > div {
            font-size: 12px !important;
          }
          .cart-header-row > div[style*="width: 142px"],
          .cart-card .ant-card-body > div[style*="width: 142px"] {
            width: 80px !important;
            min-width: 80px !important;
          }
        }
        @media (max-width: 700px) {
          .cart-header-row, .cart-card .ant-card-body {
            flex-wrap: wrap !important;
            font-size: 11px !important;
          }
          .cart-header-row > div,
          .cart-card .ant-card-body > div {
            min-width: 100px;
            font-size: 11px !important;
          }
          .cart-card .ant-card-body {
            min-height: 100px !important;
          }
        }
        @media (max-width: 500px) {
          .cart-header-row, .cart-card .ant-card-body {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 8px 0 !important;
          }
          .cart-header-row > div,
          .cart-card .ant-card-body > div {
            width: 100% !important;
            min-width: 0 !important;
            text-align: left !important;
            margin-bottom: 6px;
          }
          .cart-card .ant-card-body {
            min-height: 60px !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default BuyerCart;
