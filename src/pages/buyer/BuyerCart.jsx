/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Card, message, Tag, Button, Modal } from "antd";
import { OrderService } from "../../services/order/order.service";
import { ProductService } from "../../services/product-service/product.service";
import { ReviewService } from "../../services/review/review.service";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReviewPage from "../ReviewPage";

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
  const [canReviewMap, setCanReviewMap] = useState({});
  const [openReview, setOpenReview] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders();
      let allOrders = [];

      if (res && Array.isArray(res.data)) {
        allOrders = res.data;

        for (const order of allOrders) {
          for (const item of order.items) {
            // ✅ Fix: đồng bộ product → product_id nếu cần
            if (!item.product_id && item.product) {
              item.product_id = item.product;
            }

            const productId = item.product_id?._id;
            if (!productId || typeof item.product_id !== "object") continue;

            // Nếu chưa có hình ảnh → fetch chi tiết sản phẩm
            if (!item.product_id.images) {
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

      setOrders(allOrders);

      // ✅ Gộp danh sách product_id duy nhất để kiểm tra quyền review
      const uniqueProducts = new Map();
      for (const order of allOrders) {
        for (const item of order.items) {
          const pid = item.product_id?._id;
          if (pid && !uniqueProducts.has(pid)) {
            uniqueProducts.set(pid, item.product_id);
          }
        }
      }

      checkReviewStatus([...uniqueProducts.keys()]);
    } catch (err) {
      message.error("Không thể lấy danh sách đơn hàng");
    }
    setLoading(false);
  };

  const checkReviewStatus = async (productIds) => {
    const results = {};
    for (const productId of productIds) {
      try {
        const res = await ReviewService.checkUserCanReview(productId);
        results[productId] = res.data?.canReview;
      } catch (error) {
        results[productId] = false;
        console.error(" Lỗi check review:", productId, error);
      }
    }
    setCanReviewMap(results);
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

  const handleDeleteItem = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      message.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      message.error("Hủy đơn hàng thất bại");
    }
  };

  const handleOpenReview = (productId) => {
    setSelectedProductId(productId);
    setOpenReview(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen p-4">
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          Không có đơn hàng.
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white mb-4 p-4 shadow-sm">
            {order.items.map((item) => {
              const productId = item.product_id?._id;
              const canReview = canReviewMap[productId];

              return (
                <div key={item._id} className="flex items-center mb-3">
                  <img
                    src={
                      item.variant?.images?.[0] ||
                      item.product?.image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product?.name || "Product image"}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {item.product?.name || "Sản phẩm không xác định"}
                      {item.variant?.name && (
                        <span className="text-sm text-gray-500">
                          {" "}
                          - Mẫu: {item.variant.name}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.product_id?.category_id?.name || ""}
                    </div>
                  </div>
                  <div className="w-24 text-right text-base">
                    {(item.price || 0).toLocaleString()}₫
                  </div>
                  <div className="w-20 text-right text-gray-600">
                    x{item.quantity}
                  </div>
                  {((order.status === "completed" || order.status === "shipped") && canReview) && (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => handleOpenReview(productId)}
                    >
                      Đánh giá
                    </Button>
                  )}
                </div>
              );
            })}
            <div className="flex justify-between items-center border-t pt-3 mt-3">
              <div className="text-base">
                Tổng tiền:{" "}
                <b>
                  {parseInt(order.total_price.$numberDecimal).toLocaleString()}₫
                </b>
              </div>
              <div className="flex items-center gap-2">
                <Tag color={statusColor[order.status] || "default"}>
                  {order.status === "pending"
                    ? "Chờ xác nhận"
                    : order.status === "processing"
                    ? "Đang giao hàng"
                    : order.status === "shipped"
                    ? "Đã giao hàng"
                    : order.status === "completed"
                    ? "Hoàn thành"
                    : order.status === "cancelled"
                    ? "Đã hủy"
                    : order.status}
                </Tag>
                {order.status === "pending" && (
                  <>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      type="text"
                      onClick={() => handleDeleteItem(order._id)}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      onClick={() =>
                        navigate("/checkout", { state: { orderId: order._id } })
                      }
                    >
                      Thanh toán
                    </Button>
                  </>
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

      <Modal
        title="Đánh giá sản phẩm"
        open={openReview}
        onCancel={() => setOpenReview(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        {selectedProductId && (
          <ReviewPage
            productIdOverride={selectedProductId}
            onReviewed={() => {
              setOpenReview(false);
              fetchOrders();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default BuyerCart;
