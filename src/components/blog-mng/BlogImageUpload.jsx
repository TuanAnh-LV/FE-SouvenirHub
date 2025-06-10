/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BlogService } from '../../services/blog/blog.service';

const BlogImageUpload = ({ blogId, onSuccess }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleUpload = async () => {
    if (!blogId) {
      message.warning('Please create a blog before uploading images!');
      return;
    }
    const images = fileList.map(file => file.originFileObj).filter(Boolean);
    if (images.length === 0) {
      message.warning('Please select at least one image!');
      return;
    }
    const formData = new FormData();
    images.forEach(img => formData.append('images', img));

    try {
      await BlogService.createBlogImage(blogId, formData);
      message.success('Images uploaded successfully!');
      setFileList([]);
      if (onSuccess) onSuccess(); // callback về CreateBlog
    } catch (error) {
      message.error('Failed to upload images!');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Images</div>
    </div>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        multiple
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        style={{ marginTop: 16 }}
      >
        Upload
      </Button>
    </div>
  );
};

export default BlogImageUpload;