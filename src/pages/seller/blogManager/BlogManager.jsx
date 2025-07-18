// BlogManager.jsx
import { useEffect, useState } from "react";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { BlogService } from "../../../services/blog/blog.service";
import BlogList from "../../../components/blog-mng/BlogList";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await BlogService.getMyBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Quản lý bài viết
          </Title>
          <Button
            type="primary"
            onClick={() => navigate("/seller/blogs/create")}
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
            Tạo bài viết
          </Button>
        </div>
        <BlogList
          onEdit={(id) => navigate(`/seller/blogs/update/${id}`)}
          onDelete={fetchBlogs}
        />
      </Card>
    </>
  );
};

export default BlogManager;
