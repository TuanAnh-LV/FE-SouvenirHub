import { Layout, Input, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

export default function Foter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        backgroundColor: "#F3B5A0",
        color: "white",
        padding: "60px 30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginTop: 0,
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
          letterSpacing: 1,
        }}
      >
        SOUVENIR HUB
      </div>

      {/* Subscription */}
      <div style={{ marginBottom: "40px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Email của bạn"
          style={{
            width: 280,
            borderRadius: "6px",
            padding: "6px 12px",
          }}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#d35400",
            borderColor: "#d35400",
            borderRadius: "6px",
            padding: "6px 20px",
          }}
        >
          Subscribe
        </Button>
      </div>

      {/* Grid layout with info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "30px",
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "40px",
          textAlign: "left",
        }}
      >
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>Địa chỉ</h4>
          <div>OneHub Saigon, D. D1, Phường Tân Phú</div>
          <div>TP. Thủ Đức, Hồ Chí Minh</div>
          <div>70000, Việt Nam</div>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>Liên hệ</h4>
          <a href="mailto:souvenirhub@fpt.edu.vn" style={{ color: "white" }}>
            souvenirhub@fpt.edu.vn
          </a>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>Thông tin</h4>
          <div>Về chúng tôi</div>
          <div>Liên hệ</div>
          <div>Blog</div>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>Mạng xã hội</h4>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <FacebookOutlined style={{ fontSize: "22px" }} />
            <TwitterOutlined style={{ fontSize: "22px" }} />
            <InstagramOutlined style={{ fontSize: "22px" }} />
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>
            AI & Công nghệ
          </h4>
          <div>Quản lý AI cá nhân</div>
          <div>AI hỗ trợ kinh doanh</div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ fontSize: "14px", opacity: 0.8 }}>
        © 2025 Souvenir Hub. All rights reserved.
      </div>
    </Footer>
  );
}
