import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Modal, Descriptions, Image, Spin } from "antd";
import { OrderService } from "../../../services/order/order.service";
import { AddressService } from "../../../services/adress/address.service";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);

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

  const handleShowDetail = async (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
    setAddress(null);
    if (order.shipping_address_id) {
      setAddressLoading(true);
      try {
        const res = await AddressService.getAddressesById(order.shipping_address_id);
        setAddress(res.data);
      } catch {
        setAddress(null);
      }
      setAddressLoading(false);
    }
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
        <Button type="link" onClick={() => handleShowDetail(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý đơn hàng của shop</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        open={modalVisible}
        title="Chi tiết đơn hàng"
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã đơn hàng">{selectedOrder._id}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{selectedOrder.user_id?.name || selectedOrder.user_id || ""}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColor[selectedOrder.status] || "default"}>{selectedOrder.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {parseInt(selectedOrder.total_price?.$numberDecimal || selectedOrder.total_price || 0).toLocaleString()}₫
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedOrder.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">
              {addressLoading ? <Spin size="small" /> : address ? (
                <div>
                  <div>{address.recipient_name || address.name}</div>
                  <div>{address.phone}</div>
                  <div>{address.address_line}</div>
                  <div>{[address.ward, address.district, address.city].filter(Boolean).join(", ")}</div>
                </div>
              ) : "Không có thông tin địa chỉ"}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              {selectedOrder.items.map((item) => (
                <div key={item._id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  {item.product_id?.image && (
                    <Image src={item.product_id.image} width={50} height={50} style={{ objectFit: "cover", marginRight: 8 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div><b>{item.product_id?.name || "Sản phẩm"}</b></div>
                    <div>Số lượng: {item.quantity}</div>
                    <div>Giá: {parseInt(item.price?.$numberDecimal || item.price || 0).toLocaleString()}₫</div>
                  </div>
                </div>
              ))}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
