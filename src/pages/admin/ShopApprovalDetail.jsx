import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Typography, Modal, Input, Tag, Spin } from "antd";
import { AdminService } from "../../services/admin/admin.service";

const { Title } = Typography;

const ShopApprovalDetail = () => {
  const { id } = useParams(); // shopId
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [application, setApplication] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    try {
      const [shopRes, appRes] = await Promise.all([
        AdminService.getShopById(id),
        AdminService.getShopApplications(id),
      ]);
      setShop(shopRes.data);
      setApplication(appRes.data);
    } catch (err) {
      message.error("Failed to load shop or application data.");
    }
  };

  const approveShop = async () => {
    try {
      await AdminService.approveShop(id, { status: "approved" });
      message.success("Shop approved");
      navigate("/admin/manage-shop");
    } catch (err) {
      message.error("Failed to approve shop");
    }
  };

  const rejectShop = async () => {
    try {
      await AdminService.approveShop(id, {
        status: "rejected",
        reason: rejectReason,
      });
      message.success("Shop rejected");
      setRejectModalOpen(false);
      navigate("/admin/manage-shop");
    } catch (err) {
      message.error("Failed to reject shop");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <Button onClick={() => navigate(-1)} className="mb-6">
        ← Quay lại
      </Button>

      <Spin
        spinning={!shop || !application}
        tip="Đang tải dữ liệu..."
        size="large"
      >
        {shop && application && (
          <div className="space-y-8">
            {/* Thông tin nhà cung cấp */}
            <div>
              <Title level={4} className="text-orange-500 mb-4">
                🏪 Thông tin nhà cung cấp
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-[180px_auto] gap-6">
                <div className="flex flex-col items-center">
                  {application.logo_file ? (
                    <img
                      src={application.logo_file}
                      alt="Logo"
                      className="w-40 h-40 object-contain border border-gray-200 rounded-lg shadow-sm mb-2"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center border border-gray-300 rounded-lg text-sm text-gray-500">
                      No logo uploaded
                    </div>
                  )}
                  <span className="text-xs text-gray-500">Logo cửa hàng</span>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Tên nhà cung cấp:</strong> {shop.name}
                  </p>
                  <p>
                    <strong>Danh mục kinh doanh:</strong>{" "}
                    {application.business_category}
                  </p>
                  <p>
                    <strong>Trạng thái phê duyệt:</strong>{" "}
                    <Tag
                      color={
                        shop.status === "approved"
                          ? "green"
                          : shop.status === "pending"
                          ? "orange"
                          : "red"
                      }
                    >
                      {shop.status === "pending" ? "Chờ duyệt" : shop.status}
                    </Tag>
                  </p>
                  <p>
                    <strong>Ngày đăng ký:</strong>{" "}
                    {application.submitted_at
                      ? new Date(application.submitted_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div>
              <Title level={4} className="text-orange-500 mb-2">
                📞 Thông tin liên hệ
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <p>
                  <strong>Người đại diện:</strong>{" "}
                  {application.representative_name}
                </p>
                <p>
                  <strong>Email doanh nghiệp:</strong> {application.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {application.phone}
                </p>
              </div>
              <p className="text-sm mt-2">
                <strong>Địa chỉ:</strong> {application.address}
              </p>
            </div>

            {/* Thông tin pháp lý */}
            <div>
              <Title level={4} className="text-orange-500 mb-2">
                📄 Thông tin pháp lý
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Mã số thuế (MST):</strong> {application.tax_id}
                </p>
                <p>
                  <strong>CMND/CCCD đại diện:</strong>{" "}
                  {application.id_card_number}
                </p>
              </div>
            </div>

            {/* Hình ảnh giấy tờ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-semibold mb-1">CMND mặt trước</p>
                {application.id_card_front ? (
                  <img
                    src={application.id_card_front}
                    alt="ID Front"
                    className="w-full h-40 object-contain border rounded shadow-sm"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border rounded text-gray-400 text-sm">
                    Chưa upload
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="font-semibold mb-1">CMND mặt sau</p>
                {application.id_card_back ? (
                  <img
                    src={application.id_card_back}
                    alt="ID Back"
                    className="w-full h-40 object-contain border rounded shadow-sm"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border rounded text-gray-400 text-sm">
                    Chưa upload
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="font-semibold mb-1">Giấy phép kinh doanh</p>
                {application.license_file ? (
                  <>
                    <p className="text-xs mb-1 text-gray-500">
                      File PDF giấy phép
                    </p>
                    <a
                      href={application.license_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Xem file PDF
                    </a>
                  </>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border rounded text-gray-400 text-sm">
                    Chưa upload
                  </div>
                )}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-center gap-6 mt-8">
              <Button
                type="primary"
                size="large"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={approveShop}
              >
                ✔️ Duyệt & Kích hoạt
              </Button>
              <Button
                danger
                size="large"
                onClick={() => setRejectModalOpen(true)}
              >
                ❌ Từ chối & Ghi lý do
              </Button>
            </div>
          </div>
        )}
      </Spin>

      {/* Modal từ chối */}
      <Modal
        title="Nhập lý do từ chối"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={rejectShop}
        okText="Xác nhận từ chối"
        cancelText="Huỷ"
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ShopApprovalDetail;
