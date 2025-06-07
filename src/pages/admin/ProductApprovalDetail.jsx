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
      message.error("Failed to load product information");
    }
  };

  const handleApprove = async () => {
    try {
      await AdminService.productApproved(id);
      message.success("Product approved successfully");
      navigate("/admin/products/pending");
    } catch {
      message.error("Product approval failed");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning("Please enter a rejection reason");
      return;
    }
    try {
      await AdminService.rejectProduct(id, rejectReason);
      message.success("Product rejected successfully");
      navigate("/admin/products/pending");
    } catch {
      message.error("Product rejection failed");
    } finally {
      setRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading product data...</div>;

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Image
            width={"100%"}
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
            <b>Product Name:</b>
            <p>{product.name}</p>
          </div>
          <div>
            <b>Supplier:</b>
            <p>{product.shop_id?.name || "Unknown"}</p>
          </div>
          <div>
            <b>Price:</b>
            <p>{product.price.toLocaleString()} ₫</p>
          </div>
          <div>
            <b>Stock:</b>
            <p>{product.stock}</p>
          </div>
          <div>
            <b>Description:</b>
            <p>{product.description || "(No description)"}</p>
          </div>
          <div>
            <b>Specifications:</b>
            <p>{product.specifications || "(No specifications)"}</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="primary" onClick={handleApprove}>
              Approve Product
            </Button>
            <Button danger onClick={() => setRejectModalVisible(true)}>
              Reject
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Reject Product"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Confirm Rejection"
        cancelText="Cancel"
      >
        <p>Please enter the reason for rejection:</p>
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
