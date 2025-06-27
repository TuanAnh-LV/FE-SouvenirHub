import { message } from "antd";
import BlogForm from "../../../components/blog-mng/BlogForm";
import { BlogService } from "../../../services/blog/blog.service";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    try {
      const response = await BlogService.createBlog(values);
      const blogId = response.data?._id;
      if (blogId) {
        message.success("Blog created successfully!");
        navigate("/seller/blogs");
      } else {
        message.error("Failed to create blog!");
      }
    } catch {
      message.error("Failed to create blog!");
    }
  };

  return (
    <div className="p-4">
      <h2>Tạo Blog Mới</h2>
      <BlogForm onSubmit={handleCreate} initialValues={{}} />
    </div>
  );
};

export default CreateBlog;
