import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Typography,
  Card,
  message,
  Spin,
  Button,
} from "antd";
import dayjs from "dayjs";
import { VoucherService } from "../../services/voucher/voucher.service";

const { Title } = Typography;

const VoucherFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      VoucherService.getById(id)
        .then((res) => {
          form.setFieldsValue({
            ...res.data,
            expiry: dayjs(res.data.expires_at),
          });
        })
        .catch(() => {
          message.error("Không tìm thấy voucher.");
          navigate("/seller/vouchers");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    const payload = {
      code: values.code,
      discount: values.discount,
      type: values.type,
      quantity: values.quantity,
      expires_at: values.expiry.toISOString(),
      description: values.description || "",
      min_order_value: values.min_order_value || 0,
      max_discount: values.max_discount || 0,
    };

    try {
      if (isEdit) {
        await VoucherService.updateVoucher(id, payload);
        message.success("Cập nhật thành công!");
      } else {
        await VoucherService.createVoucher(payload);
        message.success("Tạo mới thành công!");
      }
      navigate("/seller/vouchers");
    } catch {
      message.error("Lưu thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <Card>
      <Title level={4}>{isEdit ? "Cập nhật voucher" : "Tạo mới voucher"}</Title>
      {loading ? (
        <Spin />
      ) : (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Mã giảm giá"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
          >
            <Input placeholder="SALE10" />
          </Form.Item>

          <Form.Item
            label="Loại giảm giá"
            name="type"
            rules={[{ required: true, message: "Chọn loại!" }]}
          >
            <Select>
              <Select.Option value="percent">Phần trăm (%)</Select.Option>
              <Select.Option value="amount">Số tiền cố định (₫)</Select.Option>
              <Select.Option value="freeship">
                Miễn phí vận chuyển
              </Select.Option>
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

          <Form.Item label="Đơn tối thiểu" name="min_order_value">
            <InputNumber min={0} addonAfter="₫" className="w-full" />
          </Form.Item>

          <Form.Item label="Giảm tối đa" name="max_discount">
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
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button onClick={() => navigate("/seller/vouchers")}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default VoucherFormPage;
