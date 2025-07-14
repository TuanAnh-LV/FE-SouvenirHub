import { useState } from "react";
import { NotificationService } from "../services/notification/notification.service";
import { Input, Button, Form, message } from "antd";

const SendNotificationTest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSend = async (values) => {
    setLoading(true);
    try {
      const { user_id, message: msg } = values;
      await NotificationService.create(user_id, msg);
      message.success("🚀 Đã gửi thông báo thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Lỗi gửi notification:", error);
      message.error("❌ Gửi thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">🔔 Gửi thông báo test</h2>
      <Form layout="vertical" form={form} onFinish={handleSend}>
        <Form.Item
          label="User ID"
          name="user_id"
          rules={[{ required: true, message: "Nhập ID người nhận" }]}
        >
          <Input placeholder="Nhập user_id cần gửi thông báo" />
        </Form.Item>
        <Form.Item
          label="Nội dung thông báo"
          name="message"
          rules={[{ required: true, message: "Nhập nội dung thông báo" }]}
        >
          <Input.TextArea placeholder="Nội dung thông báo" rows={3} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" loading={loading}>
            Gửi thông báo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SendNotificationTest;
