import React, { useEffect, useState } from "react";
import { AdminService } from "../../services/admin/admin.service";
import { toast } from "react-toastify";
import { Button, Input, Modal } from "antd";
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
      toast.error("Lỗi khi tải sản phẩm");
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
      toast.success("Duyệt thành công");
      setFiltered((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Lỗi duyệt sản phẩm");
    }
  };

  const openRejectModal = (id) => {
    setRejectingProductId(id);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await AdminService.rejectProduct(rejectingProductId, rejectReason);
      toast.success("Đã từ chối sản phẩm");
      setFiltered((prev) => prev.filter((p) => p._id !== rejectingProductId));
    } catch (err) {
      toast.error("Lỗi khi từ chối sản phẩm");
    } finally {
      setRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">
        Quản lý sản phẩm chờ phê duyệt
      </h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={handleSearch}
          className="w-1/3"
        />
      </div>

      <table className="min-w-full table-auto border rounded-lg overflow-hidden">
        <thead className="bg-[#FFF1E6] text-left">
          <tr>
            <th className="p-3">Tên sản phẩm</th>
            <th className="p-3">Nhà cung cấp</th>
            <th className="p-3">Giá bán</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3 text-center">Xét duyệt</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.shop_id?.name || "Không rõ"}</td>
              <td className="p-3">{product.price.toLocaleString()} đ</td>
              <td className="p-3">
                <span className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  {product.status === "pendingApproval" && "Chờ duyệt"}
                </span>
              </td>
              <td className="p-3 text-center space-x-2">
                <Button
                  type="primary"
                  onClick={() => handleApprove(product._id)}
                >
                  Duyệt
                </Button>
                <Button danger onClick={() => openRejectModal(product._id)}>
                  Từ chối
                </Button>
                <Button
                  type="default"
                  onClick={() => navigate(`/admin/products/${product._id}`)}
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-400">
                Không có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal từ chối */}
      <Modal
        title="Từ chối sản phẩm"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
      >
        <p>Vui lòng nhập lý do từ chối sản phẩm:</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="Ví dụ: Hình ảnh không hợp lệ, thông tin chưa đầy đủ..."
        />
      </Modal>
    </div>
  );
};

export default ManagePendingProducts;
