/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Button, Card, Typography } from 'antd';
import { BlogService } from '../../../services/blog/blog.service';
import BlogList from '../../../components/blog-mng/BlogList';
import CreateBlog from './CreateBlog';
import UpdateBlog from './UpdateBlog';

const { Title } = Typography;

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const response = await BlogService.getMyBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setIsUpdating(false);
  };

  const handleEdit = (blogId) => {
  setCurrentBlog(blogId);
  setIsUpdating(true);
  setIsCreating(false);
};


  const handleBack = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setCurrentBlog(null);
    fetchBlogs();
  };

  return (
    <div className="p-4">
      <Card>
        <Title level={2}>Quản lý bài viết</Title>
        <Button type="primary" onClick={handleCreate}>
          Tạo bài biết
        </Button>
        {isCreating && <CreateBlog onBack={handleBack} />}
        {isUpdating && currentBlog && (
          <UpdateBlog blogId={currentBlog} onBack={handleBack} />
        )}
        <BlogList onEdit={handleEdit} onDelete={fetchBlogs} />
      </Card>
    </div>
  );
};

export default BlogManager;