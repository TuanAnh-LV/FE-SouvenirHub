import { useEffect, useState } from "react";
import { Table, Button, message, Tooltip, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { VoucherService } from "../../services/voucher/voucher.service";
import { useNavigate } from "react-router-dom";
const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await VoucherService.getAll();
      setVouchers(
        res.data.map((v) => ({
          ...v,
          key: v._id || v.id,
        }))
      );
    } catch (err) {
      message.error("Lỗi khi tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);
  const handleDelete = async (id) => {
    try {
      await VoucherService.deleteVoucher(id);
      message.success("Xóa voucher thành công!");
      fetchVouchers(); // load lại danh sách
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm",
      render: (_, record) =>
        record.type === "percent"
          ? `${record.discount}%`
          : `${record.discount.toLocaleString()}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_order_value",
      render: (v) => `${v?.toLocaleString()}₫`,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expires_at",
      key: "expires_at",
      render: (val) => dayjs(val).format("YYYY-MM-DD"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Chỉnh sửa sản phẩm">
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => navigate(`/seller/vouchers/edit/${record._id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có muốn xóa voucher này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xoá người voucher">
              <Button icon={<DeleteOutlined />} type="text" danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý mã giảm giá</h2>
        <Button
          type="primary"
          onClick={() => navigate("/seller/vouchers/add")}
          style={{
            background: "#F99600",
            color: "#fff",
            border: "none",
            fontSize: "1rem",
            padding: "1rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s",
          }}
          icon={<PlusOutlined style={{ color: "#fff", fontSize: "1rem" }} />}
          onMouseEnter={(e) => {
            e.target.style.background = "#d17c00";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#F99600";
            e.target.style.color = "#fff";
          }}
        >
          Tạo mã mới
        </Button>
      </div>

      <Table columns={columns} dataSource={vouchers} loading={loading} />
    </div>
  );
};

export default VoucherPage;
