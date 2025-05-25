import { Layout, Input, Button } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';

const { Footer } = Layout;

export default function Foter() {
  return (
    
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: 'black',
          color: 'white',
          marginTop: '10px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: "30px 30px 0px 0px",
          width: "100%",
        }}
      >
        <div  style={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '20px' }}>
          SOUVENIR HUB
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Enter your email"
            style={{ width: 200, marginRight: '10px' }}
          />
          <Button type="primary">Subscribe</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px' }}>
          <div>
            OneHub Saigon, D. D1, Phường Tân Phú,<br />
            Thành Phố Thủ Đức, Hồ Chí Minh<br />
            70000, Việt Nam
          </div>

          <div>
            <a href="mailto:flearning@fpt.edu.vn" style={{ color: 'white' }}>
              souvenirhub@fpt.edu.vn
            </a>
          </div>

          <div>
            <div>About us</div>
            <div>Contact us</div>
            <div>Blog</div>
          </div>

          <div>
            <div>Social</div>
            <FacebookOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
            <TwitterOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
            <InstagramOutlined style={{ fontSize: '20px' }} />
          </div>

          <div>
            <div>Personal AI Manager</div>
            <div>AI Business Writer</div>
          </div>
        </div>
      </Footer>
  );
}