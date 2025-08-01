import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Image,
  Spin,
  message,
  Divider,
  Button,
  Modal,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { OrderService } from "../../../services/order/order.service";
import { AddressService } from "../../../services/adress/address.service";

const statusColor = {
  pending: "orange",
  processing: "gold",
  shipped: "blue",
  completed: "green",
  cancelled: "red",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      const res = await OrderService.getOrderById(id);
      setOrder(res.data);
      if (res.data.shipping_address_id) {
        const addrRes = await AddressService.getAddressesById(
          res.data.shipping_address_id
        );
        setAddress(addrRes.data);
      }
    } catch {
      message.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    Modal.confirm({
      title: "Xác nhận đơn hàng?",
      content: "Bạn có chắc muốn chuyển đơn hàng sang trạng thái 'Đang xử lý'?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        setUpdating(true);
        try {
          await OrderService.updateOrderStatus(order._id, "processing");
          message.success("Đơn hàng đã được xác nhận");
          fetchOrderDetail();
        } catch {
          message.error("Lỗi khi xác nhận đơn hàng");
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleCompleteOrder = () => {
    Modal.confirm({
      title: "Hoàn tất đơn hàng?",
      content: "Bạn có chắc muốn chuyển đơn hàng sang trạng thái 'Hoàn thành'?",
      okText: "Hoàn tất",
      cancelText: "Hủy",
      onOk: async () => {
        setUpdating(true);
        try {
          await OrderService.updateOrderStatus(order._id, "completed");
          message.success("Đơn hàng đã được hoàn tất");
          fetchOrderDetail();
        } catch {
          message.error("Lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-gray-500">Không tìm thấy đơn hàng</div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card
        title={<b>Chi tiết đơn hàng #{order._id}</b>}
        bordered
        className="shadow"
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã đơn hàng" span={2}>
            {order._id}
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">
            {order.user_id?.name || order.user_id || ""}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColor[order.status] || "default"}>
              {order.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {parseInt(
              order.total_price?.$numberDecimal || order.total_price || 0
            ).toLocaleString()}{" "}
            ₫
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(order.created_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        {/* Các nút chuyển trạng thái */}
        {order.status === "pending" && (
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              loading={updating}
              onClick={handleConfirmOrder}
            >
              Xác nhận đơn hàng
            </Button>
          </div>
        )}

        {order.status === "shipped" && (
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              loading={updating}
              onClick={handleCompleteOrder}
            >
              Hoàn tất đơn hàng
            </Button>
          </div>
        )}

        <Divider orientation="left">Địa chỉ giao hàng</Divider>
        {address ? (
          <div style={{ paddingLeft: 12 }}>
            <div>
              <b>{address.recipient_name || address.name}</b>
            </div>
            <div>{address.phone}</div>
            <div>{address.address_line}</div>
            <div>
              {[address.ward, address.district, address.city]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Không có thông tin địa chỉ</div>
        )}

        <Divider orientation="left">Sản phẩm</Divider>
        {order.items?.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              gap: "12px",
            }}
          >
            <Image
              src={item.product?.image}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
              fallback="https://via.placeholder.com/60x60?text=No+Image"
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>
                {item.product?.name || "Sản phẩm"}
              </div>
              <div style={{ color: "#555" }}>Số lượng: {item.quantity}</div>
              <div style={{ color: "#555" }}>
                Giá:{" "}
                {parseInt(
                  item.price?.$numberDecimal || item.price || 0
                ).toLocaleString()}{" "}
                ₫
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
