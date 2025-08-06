import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminService } from "../../services/admin/admin.service";
import {
  Card,
  Typography,
  Spin,
  message,
  Descriptions,
  Avatar,
  Tag,
  Button,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title } = Typography;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await AdminService.getUserById(id);
      setUser(res.data);
    } catch {
      message.error("Không thể tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Nút quay lại */}
      <div className="flex justify-starts mb-3 text-center">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </div>
      <Card>
        <div className="flex flex-col items-center text-center">
          <Avatar size={100} src={user.avatar} className="mb-4 border shadow" />
          <Title level={4} className="mb-1">
            {user.name}
          </Title>
          <Tag
            color={
              user.role === "admin"
                ? "red"
                : user.role === "seller"
                ? "green"
                : "blue"
            }
          >
            {user.role.toUpperCase()}
          </Tag>
        </div>

        <Descriptions
          column={1}
          bordered
          size="middle"
          className="mt-6"
          labelStyle={{ fontWeight: "bold" }}
        >
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {user.gender || "Không có thông tin"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {user.birthday
              ? new Date(user.birthday).toLocaleDateString("vi-VN")
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Email xác thực">
            {user.email_verified ? (
              <Tag color="green">Đã xác thực</Tag>
            ) : (
              <Tag color="red">Chưa xác thực</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(user.created_at).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserDetail;
