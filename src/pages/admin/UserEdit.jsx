import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Select,
  DatePicker,
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { AdminService } from "../../services/admin/admin.service";
import dayjs from "dayjs";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await AdminService.getUserById(id);
      const user = res.data;
      form.setFieldsValue({
        ...user,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });
      setAvatarPreview(user.avatar || null);
    } catch {
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone || "");
      formData.append("role", values.role);
      formData.append("gender", values.gender || "");
      if (values.birthday) {
        formData.append("birthday", values.birthday.format("YYYY-MM-DD"));
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await AdminService.updateUser(id, formData);
      message.success("Cập nhật thành công");
      navigate("/admin/users");
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const handleAvatarChange = ({ file }) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </div>

      <Card title="Chỉnh sửa người dùng">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Avatar">
            <div className="flex items-center space-x-4">
              <Avatar src={avatarPreview} size={64} />
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>

          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="seller">Seller</Select.Option>
              <Select.Option value="buyer">Buyer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select allowClear>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="birthday" label="Ngày sinh">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserEdit;
