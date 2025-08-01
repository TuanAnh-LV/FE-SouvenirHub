import React, { useEffect, useState } from "react";
import { AdminService } from "../../services/admin/admin.service";
import { Tooltip, Button, Input, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

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
      message.error("Không thể tải danh sách sản phẩm.");
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
      message.success("Phê duyệt sản phẩm thành công.");
      setFiltered((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      message.error("Phê duyệt sản phẩm thất bại.");
    }
  };

  const openRejectModal = (id) => {
    setRejectingProductId(id);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      await AdminService.rejectProduct(rejectingProductId, rejectReason);
      message.success("Từ chối sản phẩm thành công.");
      setFiltered((prev) => prev.filter((p) => p._id !== rejectingProductId));
    } catch (err) {
      message.error("Từ chối sản phẩm thất bại.");
    } finally {
      setRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Quản lý sản phẩm chờ duyệt
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
            <th className="p-3">Giá</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.shop_id?.name || "Không rõ"}</td>
              <td className="p-3">{product.price.toLocaleString()} ₫</td>
              <td className="p-3">
                <span className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  {product.status === "pendingApproval" && "Chờ duyệt"}
                </span>
              </td>
              <td className="p-3 text-center space-x-2">
                <Tooltip title="Duyệt sản phẩm này">
                  <Button
                    type="text"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApprove(product._id)}
                  />
                </Tooltip>

                <Tooltip title="Từ chối sản phẩm này">
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    onClick={() => openRejectModal(product._id)}
                  />
                </Tooltip>

                <Tooltip title="Xem chi tiết sản phẩm">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/admin/products/${product._id}`)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-400">
                Không tìm thấy sản phẩm.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        title="Từ chối sản phẩm"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Huỷ"
      >
        <p>Vui lòng nhập lý do từ chối sản phẩm:</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="Ví dụ: Hình ảnh không hợp lệ, thiếu thông tin..."
        />
      </Modal>
    </div>
  );
};

export default ManagePendingProducts;
