import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Table,
  Tag,
  Button,
  message,
  Popconfirm,
  Typography,
} from "antd";
const { Title } = Typography;
import { AdminService } from "../../services/admin/admin.service";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
const ManageShop = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  const fetchShops = async () => {
    try {
      const res = await AdminService.getAllShops();
      setShops(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách cửa hàng.");
    }
  };

  const confirmDelete = async (shopId) => {
    try {
      await AdminService.deleteShop(shopId);
      message.success("Xoá cửa hàng thành công!");
      fetchShops();
    } catch (error) {
      message.error("Xoá cửa hàng thất bại.");
    }
  };

  const columns = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng sản phẩm",
      dataIndex: "productCount",
      key: "productCount",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ duyệt", value: "pending" },
        { text: "Đã duyệt", value: "approved" },
        { text: "Đã từ chối", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "approved"
            ? "green"
            : status === "pending"
            ? "orange"
            : "red";
        const label =
          status === "approved"
            ? "Đã duyệt"
            : status === "pending"
            ? "Chờ duyệt"
            : "Đã từ chối";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Xem chi tiết cửa hàng">
            <Button
              icon={<EyeOutlined />}
              type="text"
              onClick={() => navigate(`/admin/shops/${record._id}`)}
            />
          </Tooltip>

          {record.status === "pending" && (
            <Tooltip title="Duyệt đơn đăng ký">
              <Button
                icon={<CheckOutlined />}
                type="text"
                onClick={() =>
                  navigate(`/admin/shop-applications/${record._id}`)
                }
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Bạn có muốn xóa cửa hàng?"
            onConfirm={() => confirmDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xoá cửa hàng">
              <Button icon={<DeleteOutlined />} type="text" danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-6">
      <Title level={3}>Quản lý cửa hàng</Title>
      <Table dataSource={shops} columns={columns} rowKey="_id" bordered />
    </div>
  );
};

export default ManageShop;
