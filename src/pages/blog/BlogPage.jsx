import { useEffect, useState } from "react";
import { BlogService } from "../../services/blog/blog.service";
import { useNavigate } from "react-router-dom";
import { Card, Spin } from "antd";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    BlogService.getBlogs()
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 mt-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Bài viết mới</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            hoverable
            cover={
              blog.thumbnail && (
                <img
                  alt="thumbnail"
                  src={blog.thumbnail}
                  className="h-48 object-cover"
                />
              )
            }
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            <Card.Meta title={blog.title} description={blog.excerpt} />
          </Card>
        ))}
      </div>
    </div>
  );
}
