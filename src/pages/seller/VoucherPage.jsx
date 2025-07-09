import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { VoucherService } from "../../services/voucher/voucher.service";

const VoucherPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

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
  ];

  const handleAddVoucher = async (values) => {
    try {
      await VoucherService.createVoucher({
        code: values.code,
        discount: values.discount,
        type: values.type,
        quantity: values.quantity,
        expires_at: values.expiry.toISOString(),
        description: values.description || "",
        min_order_value: values.min_order_value || 0,
      });
      message.success("Tạo mã giảm giá thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchVouchers();
    } catch (err) {
      message.error("Tạo thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý mã giảm giá</h2>
        <Button
          type="primary"
          onClick={handleAddVoucher}
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

      <Modal
        title="Tạo mã giảm giá"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} onFinish={handleAddVoucher}>
          <Form.Item
            label="Mã giảm giá"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
          >
            <Input placeholder="Ví dụ: SALE10" />
          </Form.Item>

          <Form.Item
            label="Loại giảm giá"
            name="type"
            rules={[{ required: true, message: "Chọn loại giảm giá!" }]}
          >
            <Select>
              <Select.Option value="percent">Phần trăm (%)</Select.Option>
              <Select.Option value="amount">Giá trị cố định (₫)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá trị giảm"
            name="discount"
            rules={[{ required: true, message: "Nhập giá trị giảm!" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Số lượng mã"
            name="quantity"
            rules={[{ required: true, message: "Nhập số lượng!" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item label="Giá trị đơn tối thiểu" name="min_order_value">
            <InputNumber min={0} addonAfter="₫" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Ngày hết hạn"
            name="expiry"
            rules={[{ required: true, message: "Chọn hạn sử dụng!" }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Thông tin chi tiết" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherPage;
