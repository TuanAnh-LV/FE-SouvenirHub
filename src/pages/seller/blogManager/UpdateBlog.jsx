import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import BlogForm from "../../../components/blog-mng/BlogForm";
import { BlogService } from "../../../services/blog/blog.service";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    BlogService.getBlogById(id)
      .then((res) => setBlogData(res.data || res))
      .catch(() => message.error("Không thể tải dữ liệu blog"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (values) => {
    try {
      await BlogService.updateBlog(id, values);
      message.success("Cập nhật blog thành công!");
      navigate("/seller/blogs");
    } catch {
      message.error("Lỗi khi cập nhật blog");
    }
  };

  return (
    <div className="p-4">
      <h2>Cập nhật Blog</h2>
      {loading ? (
        <Spin />
      ) : blogData ? (
        <BlogForm initialValues={blogData} onSubmit={handleUpdate} isUpdating />
      ) : (
        <p>Không tìm thấy dữ liệu blog</p>
      )}
    </div>
  );
};

export default UpdateBlog;
