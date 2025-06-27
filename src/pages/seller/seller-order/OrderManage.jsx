import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Card, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { OrderService } from "../../../services/order/order.service";

const { Title } = Typography;

const statusColor = {
  pending: "orange",
  processing: "gold",
  shipped: "blue",
  completed: "green",
  cancelled: "red",
};

export default function OrderManage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getShopOrders();
      setOrders(res.data || []);
    } catch (err) {
      message.error("Không thể lấy danh sách đơn hàng của shop");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user_id",
      key: "user_id",
      render: (user) => user?.name || user || "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) =>
        parseInt(price?.$numberDecimal || price || 0).toLocaleString() + "₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="text"
          onClick={() => navigate(`/seller/orders/${record._id}`)}
        />
      ),
    },
  ];

  return (
    <div className="p-2">
      <Card>
        <Title level={2}>Quản lý đơn hàng của shop</Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
