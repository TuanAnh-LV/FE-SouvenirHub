import { useEffect, useState } from "react";
import { BlogService } from "../../services/blog/blog.service";
import { useNavigate } from "react-router-dom";
import { Card, Spin, Pagination } from "antd";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    BlogService.getBlogs({ page, limit: 6 })
      .then((res) => {
        setBlogs(res.data.items || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

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
              <img
                src={
                  blog.images?.[0]?.url || blog.thumbnail || "/default-blog.jpg"
                }
                alt={blog.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            }
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            <Card.Meta
              title={blog.title}
              description={blog.summary || "Không có tóm tắt"}
            />
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={6}
          total={total}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
