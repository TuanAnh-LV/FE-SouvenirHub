/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Card, InputNumber, Button, message } from "antd";
import { OrderService } from "../../services/order/order.service";
import { ProductService } from "../../services/product-service/product.service";
import { DeleteOutlined } from "@ant-design/icons";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách order có status pending và bổ sung ảnh nếu thiếu
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders();
      let pendingOrders = [];
      if (res && Array.isArray(res.data)) {
        pendingOrders = res.data.filter((order) => order.status === "pending");
        // Đảm bảo đồng bộ: fetch từng product tuần tự
        for (const order of pendingOrders) {
          for (const item of order.items) {
            if (!item.product_id.images) {
              const productId =
                typeof item.product_id === "string"
                  ? item.product_id
                  : item.product_id._id;
              try {
                const productRes = await ProductService.getByid(productId);
                item.product_id = productRes.data;
              } catch {
                item.product_id.images = [];
              }
            }
          }
        }
      }
      setOrders(pendingOrders);
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

  // Xử lý thanh toán
  const handleCheckout = async (orderId) => {
    try {
      await OrderService.updateOrderStatus(orderId, { status: "processing" });
      message.success("Đã gửi yêu cầu thanh toán!");
      fetchOrders();
    } catch (err) {
      message.error("Thanh toán thất bại");
    }
  };

  // Xử lý xóa sản phẩm khỏi order (nếu muốn)
  const handleDeleteItem = async (orderId, itemId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    const updatedItems = order.items.filter((item) => item._id !== itemId);
    try {
      await OrderService.updateOrderStatus(orderId, {
        ...order,
        items: updatedItems,
      });
      message.success("Đã xóa sản phẩm khỏi đơn hàng");
      fetchOrders();
    } catch (err) {
      message.error("Xóa sản phẩm thất bại");
    }
  };

  // Đếm tổng số sản phẩm
  const totalProductCount = orders.reduce(
    (acc, order) => acc + order.items.length,
    0
  );

  return (
    <div style={{ background: "#FFF6F2", minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
          Giỏ hàng
        </h2>
        {/* Header row */}
        <div
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
          }}
        >
          <div style={{ flex: 2, paddingLeft: 24 }}>
            Sản phẩm ({totalProductCount} sản phẩm)
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>Giá sản phẩm</div>
          <div style={{ flex: 1, textAlign: "center" }}>Số lượng</div>
          <div style={{ flex: 1, textAlign: "center" }}>Tổng giá</div>
          <div style={{ width: 80, textAlign: "center" }}></div>
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 48 }}>
            Không có đơn hàng chờ xử lý.
          </div>
        ) : (
          orders.map((order) =>
            order.items.map((item) => (
              <Card
                key={item._id}
                style={{
                  background: "#FFD1B3",
                  borderRadius: 12,
                  marginBottom: 24,
                  boxShadow: "0 2px 8px #0001",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  width: "100%",
                }}
                styles={{
                  body: {
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  },
                }}
              >
                <img
                  src={
                    item.product_id.images && item.product_id.images.length > 0
                      ? item.product_id.images[0]
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.product_id.name}
                  style={{
                    width: 110,
                    height: 110,
                    objectFit: "cover",
                    borderRadius: 12,
                    margin: 16,
                  }}
                />
                <div style={{ flex: 2, padding: "16px 0" }}>
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
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Đơn giá:{" "}
                    <span style={{ fontWeight: 500, color: "#000" }}>
                      {parseInt(item.price, 10).toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <InputNumber
                    min={1}
                    max={item.product_id.stock}
                    value={item.quantity}
                    onChange={(value) =>
                      handleQuantityChange(order._id, item._id, value)
                    }
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
                <div
                  style={{
                    width: 80,
                    textAlign: "center",
                    paddingRight: 24,
                  }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteItem(order._id, item._id)}
                  />
                </div>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default OrderTable;