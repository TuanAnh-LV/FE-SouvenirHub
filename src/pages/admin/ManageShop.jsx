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
      message.error("Failed to load the list of shops.");
    }
  };

  const confirmDelete = async (shopId) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        console.log("Deleting shop with ID:", shopId);
        await AdminService.deleteShop(shopId);
        message.success("Shop deleted successfully!");
        fetchShops();
      } catch (error) {
        message.error("Failed to delete the shop.");
      }
    }
  };

  const columns = [
    {
      title: "Shop Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total Products",
      dataIndex: "productCount",
      key: "productCount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "approved"
            ? "green"
            : status === "pending"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/admin/shops/${record._id}`)}
          >
            Details
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
            Delete
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
