/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input, Radio, Button, message, Avatar, Upload } from "antd";
import { useAuth } from "../../context/auth.context";
import { AuthService } from "../../services/auth-service/auth.service";
const BuyerProfilePage = ({ setActiveKey }) => {
  const { userInfo, setUserInfo } = useAuth();
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [file, setFile] = useState(null);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = ({ file }) => {
    setFile(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (file) formData.append("avatar", file);

      const res = await AuthService.updateProfile(formData);
      const updated = res.data;

      // Nếu thay đổi email, KHÔNG cập nhật ngay email vào userInfo
      const emailChanged = form.email && form.email !== userInfo.email;

      if (emailChanged) {
        setUserInfo((prev) => ({
          ...prev,
          ...updated,
          email: userInfo.email, // giữ lại email cũ để tránh mất session
        }));
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...updated,
            email: userInfo.email,
          })
        );
        message.success("Profile updated! Please verify your new email.");
        if (setActiveKey) setActiveKey("verifyEmail");
      } else {
        setUserInfo(updated);
        localStorage.setItem("userInfo", JSON.stringify(updated));
        message.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Profile update failed!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 justify-center p-6 ">
      {/* Form */}
      <div className="flex-1 space-y-5 pr-10 border-r border-gray-300">
        <div className="flex items-center">
          {/* <div className="w-40 font-medium text-gray-600">Tên đăng nhập</div> */}
          <div className="text-black font-semibold">{userInfo?.username}</div>
        </div>

        <div className="flex items-center">
          <div className="w-40 font-medium text-gray-600 ">Tên</div>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="flex-1"
          />
        </div>

        <div className="flex items-center">
          <div className="w-40 font-medium text-gray-600">Email</div>
          <div className="flex-1 text-black font-semibold text-[14px]">
            {editingEmail ? (
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <>
                {form.email.replace(
                  /(.{2})(.*)(@.*)/,
                  (_, a, b, c) => `${a}${"*".repeat(b.length)}${c}`
                )}
                <span
                  className="text-[#d35400] cursor-pointer ml-2 text-[13px]"
                  onClick={() => setEditingEmail(true)}
                >
                  Thay Đổi
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-40 font-medium text-gray-600">Số điện thoại</div>
          <div className="flex-1 text-black font-semibold text-[14px]">
            {editingPhone ? (
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <>
                {form.phone.replace(/(\d{3})(\d{3})(\d{2})$/, "*******$3")}
                <span
                  className="text-[#d35400] cursor-pointer ml-2 text-[13px]"
                  onClick={() => setEditingPhone(true)}
                >
                  Thay Đổi
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-40 font-medium text-gray-600">Giới tính</div>
          <Radio.Group
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            value={form.gender}
          >
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
            <Radio value="Khác">Khác</Radio>
          </Radio.Group>
        </div>

        <div className="flex items-center">
          <div className="w-40 font-medium text-gray-600">Ngày sinh</div>
          <div className="flex-1 text-black font-semibold text-[14px]">
            {form.birthday
              ? form.birthday
                  .replace(/\d{2}$/, "**")
                  .replace(/\d{2}(?=-)/, "**")
              : "**/**/****"}
            <span className="text-[#d35400] cursor-pointer ml-2 text-[13px]">
              Thay Đổi
            </span>
          </div>
        </div>

        <div className="pl-40">
          <button
            className="bg-[#ee4d2d] hover:bg-[#d53a1a] px-10 h-10"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-52 flex flex-col items-center pl-10">
        <Avatar
          size={96}
          src={form.avatar || null}
          className="mb-4 border-4 rounded-full border-gradient-instagram"
        />
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleUpload}
        >
          <Button>Chọn Ảnh</Button>
        </Upload>
        <p className="text-sm text-gray-500 mt-2 text-center leading-tight">
          Dung lượng file tối đa 1 MB
          <br />
          Định dạng:.JPEG, .PNG
        </p>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
