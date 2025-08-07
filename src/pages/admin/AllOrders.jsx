import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Typography } from "antd";
import { OrderService } from "../../services/order/order.service";

const { Title } = Typography;

const statusMap = {
  pending: { label: "Đang chờ", color: "gold" },
  processing: { label: "Đang xử lý", color: "blue" },
  shipped: { label: "Đã giao", color: "green" },
  completed: { label: "Đã hoàn thành", color: "lime" },
  cancelled: { label: "Đã hủy", color: "red" },
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await OrderService.getAllOrder();
        setOrders(res.data || []);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id) => <span className="font-mono">{id.slice(-6)}</span>,
    },
    {
      title: "Người mua",
      dataIndex: "user_id",
      key: "user_id",
      render: (user) => user?.name || user?._id || "Ẩn danh",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusMap[status]?.color || "default"}>
          {statusMap[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) =>
        price && price.$numberDecimal
          ? parseInt(price.$numberDecimal).toLocaleString() + "₫"
          : (price || 0).toLocaleString() + "₫",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        date ? new Date(date).toLocaleString("vi-VN") : "",
    },
    {
      title: "Số sản phẩm",
      dataIndex: "items",
      key: "items",
      render: (items) => (Array.isArray(items) ? items.length : 0),
    },
  ];

  return (
    <div className="p-8">
      <Card>
        <Title level={3}>Tất cả đơn hàng hệ thống</Title>
        <Table
          columns={columns}
          dataSource={orders.map((o) => ({ ...o, key: o._id }))}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default AllOrders;
