import { useState } from "react";
import { Input, Button, message, Typography } from "antd";
import { AuthService } from "../services/auth-service/auth.service";
import { useAuth } from "../context/auth.context"; // 👈 Thêm dòng này nếu chưa có

const { Title, Text } = Typography;

const EmailVerificationPage = ({ setActiveKey }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { setUserInfo } = useAuth(); // 👈 Lấy context userInfo

  const handleVerify = async () => {
    if (!code.trim())
      return message.warning("Please enter the verification code.");
    setLoading(true);
    try {
      await AuthService.verifyEmailCode({ token: code });
      message.success("Email verified successfully!");
      setSuccess(true);

      // 👇 Refetch user info
      const refreshed = await AuthService.getUserRole();
      setUserInfo(refreshed.data);
      localStorage.setItem("userInfo", JSON.stringify(refreshed.data));

      // Quay lại trang hồ sơ
      setTimeout(() => {
        if (setActiveKey) setActiveKey("profile");
      }, 1500);
    } catch (err) {
      message.error(err?.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await AuthService.resendEmailCode();
      message.success("Verification code resent.");
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <Title level={3}>Verify Your Email</Title>
      {!success ? (
        <>
          <Text>Please enter the 6-digit code sent to your new email.</Text>
          <Input
            style={{ marginTop: 16 }}
            placeholder="Enter verification code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            type="primary"
            loading={loading}
            onClick={handleVerify}
            block
            style={{ marginTop: 16 }}
          >
            Verify Email
          </Button>
          <Button type="link" onClick={handleResend} loading={resendLoading}>
            Resend Code
          </Button>
        </>
      ) : (
        <Text type="success">
          ✅ Your email has been verified successfully!
        </Text>
      )}
    </div>
  );
};

export default EmailVerificationPage;
