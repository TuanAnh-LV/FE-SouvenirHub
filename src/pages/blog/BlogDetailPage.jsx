import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogService } from "../../services/blog/blog.service";
import { Spin } from "antd";

export default function BlogDetailPage() {
  const { id } = useParams();
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
    <div className="max-w-3xl mx-auto px-4 py-10 mt-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
