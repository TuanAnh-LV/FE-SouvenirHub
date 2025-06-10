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
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginTop: 0,
      }}
    >
      <div
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        SOUVENIR HUB
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Email của bạn"
          style={{ width: 240, marginRight: "10px" }}
        />
        <Button type="primary">Subscribe</Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "1000px",
          gap: "20px",
          textAlign: "left",
        }}
      >
        <div>
          <div>OneHub Saigon, D. D1, Phường Tân Phú,</div>
          <div>Thành Phố Thủ Đức, Hồ Chí Minh</div>
          <div>70000, Việt Nam</div>
        </div>

        <div>
          <div>
            <a href="mailto:souvenirhub@fpt.edu.vn" style={{ color: "white" }}>
              souvenirhub@fpt.edu.vn
            </a>
          </div>
        </div>

        <div>
          <div>Về chúng tôi</div>
          <div>Liên hệ</div>
          <div>Blog</div>
        </div>

        <div>
          <div>Mạng xã hội</div>
          <FacebookOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
          <TwitterOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
          <InstagramOutlined style={{ fontSize: "20px" }} />
        </div>

        <div>
          <div>Quản lý AI cá nhân</div>
          <div>AI hỗ trợ kinh doanh</div>
        </div>
      </div>
    </Footer>
  );
}
