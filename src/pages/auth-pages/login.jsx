import { Form, Input, Button, Typography, Card, message } from "antd";
import { AuthService } from "../../services/auth-service/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTER_URL } from "../../const/router.const";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AuthService.login({
        email: values.username,
        password: values.password,
      });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        message.success("Login successful!");
        navigate(ROUTER_URL.COMMON.HOME);
      } else {
        message.error("Invalid login response.");
      }
    } catch (error) {
        console.error("Login error:", error);
        message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center" }}>Login</Title>
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;