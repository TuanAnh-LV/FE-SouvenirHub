import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogService } from "../../services/blog/blog.service";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BlogService.getBlogById(id)
      .then((res) => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center text-red-500">Không tìm thấy bài viết.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/blog")}
          className="text-gray-700 hover:text-black"
          type="link"
        >
          Quay lại Blog
        </Button>
      </div>

      {/* Blog Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-snug">
        {blog.title}
      </h1>

      {/* Blog Thumbnail */}
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
        />
      )}

      {/* Blog Content */}
      <div
        className="prose max-w-none prose-img:rounded-lg prose-img:shadow-md prose-headings:text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
