/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, message, Spin } from 'antd';
import BlogForm from '../../../components/blog-mng/BlogForm';
import { BlogService } from '../../../services/blog/blog.service';

const UpdateBlog = ({ blogId, onBack }) => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;
    setLoading(true);
    BlogService.getBlogById(blogId)
      .then(res => {
        setBlogData(res.data || res); // Tùy API trả về .data hay object trực tiếp
      })
      .catch(() => message.error('Không thể tải dữ liệu blog'))
      .finally(() => setLoading(false));
  }, [blogId]);

  const handleUpdate = async (values) => {
    try {
      await BlogService.updateBlog(blogId, values);
      message.success('Cập nhật blog thành công!');
      if (onBack) onBack();
    } catch (error) {
      message.error('Lỗi khi cập nhật blog');
    }
  };

  return (
    <Modal
      open={true}
      title="Cập nhật blog"
      footer={null}
      onCancel={onBack}
      destroyOnHidden
    >
      {loading ? (
        <Spin />
      ) : (
        <BlogForm
          initialValues={blogData}
          onSubmit={handleUpdate}
          isUpdating={true}
        />
      )}
    </Modal>
  );
};

export default UpdateBlog;
