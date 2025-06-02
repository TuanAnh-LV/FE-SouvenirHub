/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input, Select, Button, message, Avatar, Upload, Card } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth.context";
import { AuthService } from "../../services/auth-service/auth.service";
import { AddressService } from "../../services/adress/address.service";
import CreateAddress from "../address/CreateAddress";
import UpdateAddress from "../address/UpdateAddress";

const { Option } = Select;

const BuyerProfilePage = () => {
  const { userInfo, setUserInfo } = useAuth();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [file, setFile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showCreateAddress, setShowCreateAddress] = useState(false);
  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setForm({
        name: userInfo.name || "",
        gender: userInfo.gender || "",
        birthday: userInfo.birthday?.slice(0, 10) || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
        avatar: userInfo.avatar || "",
      });
    }
  }, [userInfo]);

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setForm({ ...form, gender: value });
  };

  const handleUpload = ({ file }) => {
    setFile(file);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setShowUpdateAddress(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (file) formData.append("avatar", file);

      const res = await AuthService.updateProfile(formData);
      setUserInfo(res.data);
      message.success("Cập nhật hồ sơ thành công!");
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  if (showCreateAddress) {
    return (
      <CreateAddress onBack={() => setShowCreateAddress(false)} />
    );
  }

  if (showUpdateAddress && selectedAddress) {
    return (
      <UpdateAddress
        address={selectedAddress}
        onBack={() => setShowUpdateAddress(false)}
        onUpdated={fetchAddresses}
      />
    );
  }

  return (
    <div className="py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="md:col-span-3  bg-[#FFE1D6] rounded-xl shadow p-8 space-y-8">
          <h2 className="text-2xl font-bold">Hồ sơ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block font-medium">Ảnh đại diện</label>
                <div className="flex items-center gap-4">
                  <Avatar size={100} src={form.avatar || null} />
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUpload}
                  >
                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                  </Upload>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Tên hồ sơ *</label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Giới tính</label>
                <Select
                  value={form.gender}
                  onChange={handleSelectChange}
                  className="w-full"
                >
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Ngày sinh</label>
                <Input
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block font-medium">Số điện thoại *</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Email *</label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Mật khẩu *</label>
                <div className="flex gap-2">
                  <Input.Password value="************" disabled />
                  <Button>Thay đổi</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Button type="primary" onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </div>

          {/* Hiển thị địa chỉ */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Địa chỉ giao hàng</h3>
              <Button type="primary" onClick={() => setShowCreateAddress(true)}>
                Thêm địa chỉ
              </Button>
            </div>
            {addresses.length === 0 && (
              <div className="text-gray-500">Chưa có địa chỉ nào.</div>
            )}
            {addresses.map((address) => (
              <Card
                key={address._id}
                className="mb-4"
                style={{ background: "#fff", marginBottom: "16px" }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-medium">{address.recipient_name} - {address.phone}</div>
                    <div className="text-gray-700">{address.address_line}</div>
                    <div className="text-gray-500 text-sm">
                      {address.ward}, {address.district}, {address.city}
                    </div>
                  </div>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditAddress(address)}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
