import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminService } from "../../services/admin/admin.service";
import { Button, Modal, Input, Image, message } from "antd";

const ProductApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await AdminService.getProductById(id);
      setProduct(res.data);
    } catch {
      message.error("Không thể tải thông tin sản phẩm.");
    }
  };

  const handleApprove = async () => {
    try {
      await AdminService.productApproved(id);
      message.success("Phê duyệt sản phẩm thành công.");
      navigate("/admin/products/pending");
    } catch {
      message.error("Phê duyệt sản phẩm thất bại.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối.");
      return;
    }
    try {
      await AdminService.rejectProduct(id, rejectReason);
      message.success("Từ chối sản phẩm thành công.");
      navigate("/admin/products/pending");
    } catch {
      message.error("Từ chối sản phẩm thất bại.");
    } finally {
      setRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Image
            width="100%"
            height={300}
            src={product.images?.[0] || "/no-image.png"}
            alt="main"
            style={{ objectFit: "contain", borderRadius: 8 }}
          />
          <div className="grid grid-cols-3 gap-2">
            {(product.images || []).map((img, idx) => (
              <Image key={idx} src={img} height={80} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <b>Tên sản phẩm:</b>
            <p>{product.name}</p>
          </div>
          <div>
            <b>Nhà cung cấp:</b>
            <p>{product.shop_id?.name || "Không rõ"}</p>
          </div>
          <div>
            <b>Giá:</b>
            <p>{product.price.toLocaleString()} ₫</p>
          </div>
          <div>
            <b>Số lượng còn lại:</b>
            <p>{product.stock}</p>
          </div>
          <div>
            <b>Mô tả:</b>
            <p>{product.description || "(Không có mô tả)"}</p>
          </div>
          <div>
            <b>Thông số kỹ thuật:</b>
            <p>{product.specifications || "(Không có thông số)"}</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="primary" onClick={handleApprove}>
              Duyệt sản phẩm
            </Button>
            <Button danger onClick={() => setRejectModalVisible(true)}>
              Từ chối
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Từ chối sản phẩm"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Xác nhận từ chối"
        cancelText="Huỷ"
      >
        <p>Vui lòng nhập lý do từ chối sản phẩm:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ProductApprovalDetail;
