// BlogManager.jsx
import { useEffect, useState } from "react";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { BlogService } from "../../../services/blog/blog.service";
import BlogList from "../../../components/blog-mng/BlogList";

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
    <div className="p-2">
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
          >
            Tạo bài viết
          </Button>
        </div>
        <BlogList
          onEdit={(id) => navigate(`/seller/blogs/update/${id}`)}
          onDelete={fetchBlogs}
        />
      </Card>
    </div>
  );
};

export default BlogManager;
