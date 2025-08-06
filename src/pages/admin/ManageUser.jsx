import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  message,
  Button,
  Popconfirm,
  Tooltip,
} from "antd";
import { FormOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { AdminService } from "../../services/admin/admin.service";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await AdminService.getAllUsers();
      setUsers(res.data || []);
    } catch {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await AdminService.deleteUser(userId);
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } catch {
      message.error("Không thể xóa người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Tooltip title="Xem chi tiết người dùng">
            <Button
              icon={<EyeOutlined />}
              type="text"
              onClick={() => navigate(`/admin/users/${record._id}`)}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa người dùng">
            <Button
              icon={<FormOutlined />}
              type="text"
              onClick={() => navigate(`/admin/users/${record._id}/edit`)}
            />
          </Tooltip>

          <Popconfirm
            title="Bạn có muốn xóa người dùng này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xoá người dùng">
              <Button icon={<DeleteOutlined />} type="text" danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <Title level={3}>Quản lý người dùng</Title>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ManageUser;
