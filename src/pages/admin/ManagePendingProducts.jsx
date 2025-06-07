import React, { useEffect, useState } from "react";
import { AdminService } from "../../services/admin/admin.service";
import { Button, Input, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";

const ManagePendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [rejectingProductId, setRejectingProductId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      const res = await AdminService.getAllProductsPending();
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      message.error("Failed to load products");
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filteredData = products.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    setFiltered(filteredData);
  };

  const handleApprove = async (id) => {
    try {
      await AdminService.productApproved(id);
      message.success("Product approved successfully");
      setFiltered((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      message.error("Failed to approve product");
    }
  };

  const openRejectModal = (id) => {
    setRejectingProductId(id);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning("Please provide a rejection reason");
      return;
    }

    try {
      await AdminService.rejectProduct(rejectingProductId, rejectReason);
      message.success("Product rejected successfully");
      setFiltered((prev) => prev.filter((p) => p._id !== rejectingProductId));
    } catch (err) {
      message.error("Failed to reject product");
    } finally {
      setRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Manage Pending Products</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="w-1/3"
        />
      </div>

      <table className="min-w-full table-auto border rounded-lg overflow-hidden">
        <thead className="bg-[#FFF1E6] text-left">
          <tr>
            <th className="p-3">Product Name</th>
            <th className="p-3">Supplier</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.shop_id?.name || "Unknown"}</td>
              <td className="p-3">{product.price.toLocaleString()} ₫</td>
              <td className="p-3">
                <span className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  {product.status === "pendingApproval" && "Pending Approval"}
                </span>
              </td>
              <td className="p-3 text-center space-x-2">
                <Button
                  type="primary"
                  onClick={() => handleApprove(product._id)}
                >
                  Approve
                </Button>
                <Button danger onClick={() => openRejectModal(product._id)}>
                  Reject
                </Button>
                <Button
                  type="default"
                  onClick={() => navigate(`/admin/products/${product._id}`)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-400">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Reject Modal */}
      <Modal
        title="Reject Product"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Confirm Rejection"
        cancelText="Cancel"
      >
        <p>Please provide a reason for rejecting this product:</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="E.g., Invalid image, missing details..."
        />
      </Modal>
    </div>
  );
};

export default ManagePendingProducts;
