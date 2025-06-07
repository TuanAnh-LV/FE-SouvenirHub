import { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { AuthService } from "../services/auth-service/auth.service";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    if (values.newPassword.length < 6) {
      return message.warning("New password must be at least 6 characters.");
    }

    if (values.newPassword !== values.confirmPassword) {
      return message.warning("Passwords do not match.");
    }

    setLoading(true);
    try {
      await AuthService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully!");
      form.resetFields();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Form layout="vertical" form={form} onFinish={handleChangePassword}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            { required: true, message: "Please enter current password." },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter new password." }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password." }]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="mt-2"
        >
          Change Password
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;
