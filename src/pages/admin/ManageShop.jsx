import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
import { AdminService } from "../../services/admin/admin.service";
import { useNavigate } from "react-router-dom";

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
    if (window.confirm("Bạn có chắc muốn xoá cửa hàng này?")) {
      try {
        await AdminService.deleteShop(shopId);
        message.success("Xoá cửa hàng thành công!");
        fetchShops();
      } catch (error) {
        message.error("Xoá cửa hàng thất bại.");
      }
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
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/admin/shops/${record._id}`)}
          >
            Chi tiết
          </Button>

          {record.status === "pending" && (
            <Button
              size="small"
              onClick={() => navigate(`/admin/shop-applications/${record._id}`)}
            >
              Xét duyệt
            </Button>
          )}

          <Button danger size="small" onClick={() => confirmDelete(record._id)}>
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-6">
      <Table dataSource={shops} columns={columns} rowKey="_id" bordered />
    </div>
  );
};

export default ManageShop;
