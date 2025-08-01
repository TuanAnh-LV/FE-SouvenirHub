import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminService } from "../../services/admin/admin.service";
import { Button, Modal, Input, Image, message, Tag } from "antd";

const ProductApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const price = Number(product.price?.$numberDecimal || 0);
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
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        🛍️ Chi tiết sản phẩm
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div>
          <Image
            width="100%"
            height={300}
            src={product.images?.[0] || "/no-image.png"}
            alt="main"
            style={{ objectFit: "contain", borderRadius: 8 }}
            preview
          />
          <div className="grid grid-cols-4 gap-2 mt-3">
            {(product.images || []).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                height={80}
                width={80}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
            ))}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-semibold">Tên sản phẩm:</span>{" "}
            <span className="text-base">{product.name}</span>
          </div>
          <div>
            <span className="font-semibold">Nhà cung cấp:</span>{" "}
            {product.shop_id?.name || <Tag color="red">Không rõ</Tag>}
          </div>
          <div>
            <span className="font-semibold">Giá:</span>{" "}
            {product.price ? (
              <span className="text-base text-green-600 font-medium">
                {price.toLocaleString()} ₫
              </span>
            ) : (
              "Chưa có"
            )}
          </div>

          <div>
            <span className="font-semibold">Số lượng còn lại:</span>{" "}
            {product.stock}
          </div>
          <div>
            <span className="font-semibold">Mô tả:</span>
            <div className="mt-1 text-gray-700 text-sm whitespace-pre-line">
              {product.description || "(Không có mô tả)"}
            </div>
          </div>
          <div>
            <span className="font-semibold">Thông số kỹ thuật:</span>
            <div
              className="prose prose-sm mt-1 max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: product.specifications || "<p>(Không có thông số)</p>",
              }}
            />
          </div>

          {/* Nút duyệt / từ chối */}
          <div className="flex gap-4 pt-4">
            <Button type="primary" size="large" onClick={handleApprove}>
              Duyệt sản phẩm
            </Button>
            <Button
              danger
              size="large"
              onClick={() => setRejectModalVisible(true)}
            >
              Từ chối
            </Button>
          </div>
        </div>
      </div>

      {/* Modal từ chối */}
      <Modal
        title="Từ chối sản phẩm"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Xác nhận từ chối"
        cancelText="Huỷ"
      >
        <p className="mb-2">Vui lòng nhập lý do từ chối sản phẩm:</p>
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
