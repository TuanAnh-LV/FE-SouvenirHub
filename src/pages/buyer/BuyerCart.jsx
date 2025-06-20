/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Card, message, Tag, Button } from "antd";
import { OrderService } from "../../services/order/order.service";
import { ProductService } from "../../services/product-service/product.service";
import { DeleteOutlined } from "@ant-design/icons";

const statusColor = {
  pending: "orange",
  processing: "gold",
  shipped: "blue",
  completed: "green",
  cancelled: "red",
};

const BuyerCart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders();
      let allOrders = [];
      if (res && Array.isArray(res.data)) {
        allOrders = res.data;
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
  const handleConfirmReceived = async (orderId) => {
    try {
      await OrderService.confirmReceived(orderId);
      message.success("Bạn đã xác nhận đã nhận hàng");
      fetchOrders();
    } catch (err) {
      message.error("Xác nhận nhận hàng thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteItem = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      message.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      message.error("Hủy đơn hàng thất bại");
    }
  };

  return (
    <div className="cart-container">
      {orders.length === 0 ? (
        <div className="empty">Không có đơn hàng.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <img
                  src={
                    item.product_id && item.product_id.images?.[0]
                    ? item.product_id.images[0]
                    : "https://via.placeholder.com/80"
                  }
                  alt={item.product_id?.name || "Product image"}
                />
                <div className="item-info">
                  <div className="title">{item.product_id?.name || "Sản phẩm không xác định"}</div>
                  <div className="category">
                    {item.product_id?.category_id?.name || ""}
                  </div>
                </div>
                <div className="item-price">
                  {parseInt(item.product_id?.price.$numberDecimal).toLocaleString()}₫
                </div>
                <div className="item-quantity">x{item.quantity}</div>
              </div>
            ))}
            <div className="order-footer">
              <div className="order-total">
                Tổng tiền:{" "}
                <b>
                  {parseInt(order.total_price.$numberDecimal).toLocaleString()}₫
                </b>
              </div>
              <div className="order-status">
                <Tag color={statusColor[order.status] || "default"}>
                  {order.status === "pending"
                    ? "Chờ xác nhận"
                    : order.status === "processing"
                    ? "Đang xử lý"
                    : order.status === "shipped"
                    ? "Đã giao"
                    : order.status === "completed"
                    ? "Hoàn thành"
                    : order.status === "cancelled"
                    ? "Đã hủy"
                    : order.status}
                </Tag>
                {order.status === "pending" && (
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    type="text"
                    onClick={() => handleDeleteItem(order._id)}
                  >
                    Hủy
                  </Button>
                )}
                {order.status === "processing" && (
                  <Button
                    type="primary"
                    onClick={() => handleConfirmReceived(order._id)}
                  >
                    Đã nhận hàng
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <style>{`
        .cart-container {
          min-height: 100vh;
        }
        .empty {
          text-align: center;
          color: #999;
          margin-top: 48px;
        }
        .order-card {
          background: #fff;
          border: 1px solid #eee;
          margin-bottom: 16px;
          border-radius: 6px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .order-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .order-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 16px;
        }
        .item-info {
          flex: 1;
        }
        .item-info .title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .item-info .category {
          color: #888;
          font-size: 13px;
        }
        .item-price, .item-quantity {
          width: 100px;
          text-align: right;
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eee;
          padding-top: 12px;
          margin-top: 12px;
        }
        .order-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default BuyerCart;
