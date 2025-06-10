/* eslint-disable no-unused-vars */
import { Modal, message, Upload, Form, Input, Button, Select } from "antd";
import { BlogService } from "../../../services/blog/blog.service";
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { PlusOutlined } from '@ant-design/icons';
const CreateBlog = ({ onBack }) => {
  const [fileList, setFileList] = useState([]);
  const [form] = useForm();
  const [content, setContent] = useState('');

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleUpload = async (blogId) => {
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

  const handleFinish = async () => {
  try {
    const values = await form.validateFields();
    values.content = content; // Set the content from the editor

    const response = await BlogService.createBlog(values);
    const blogId = response.data?._id;
    if (blogId) {
      await handleUpload(blogId); // Upload images after creating the blog
      message.success('Blog created successfully!');
      // Clear form
      form.resetFields();
      setFileList([]);
      setContent('');
      // Ẩn modal & update danh sách
      if (onBack) onBack();
    } else {
      message.error('Failed to create blog!');
    }
  } catch (error) {
    message.error('Failed to submit the blog!');
  }
};

  return (
      <Modal
        open={true}
        title={"Tạo Blog Mới"}
        footer={null}
        onCancel={onBack}
        destroyOnHidden
      >
        <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          title: '',
          thumbnail: '',
          tags: [],
          status: 'draft',
        }}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thumbnail URL"
          name="thumbnail"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tags"
          name="tags"
        >
          <Select mode="tags" placeholder="Add tags" style={{ width: '100%' }} >
            <Option value="technology">Technology</Option>
            <Option value="health">Health</Option>
            <Option value="lifestyle">Lifestyle</Option>
            <Option value="education">Education</Option>
            <Option value="business">Business</Option>
            <Option value="travel">Travel</Option>
          </Select>  

        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select>
            <Option value="draft">Draft</Option>
            <Option value="published">Published</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Content" name="content">
          <Editor
            apiKey='r317wer69jgeks8pv43lmnj19b5oodhdcv7jt86gwuyilw5c'
            initialValue={content}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
            onEditorChange={(newContent) => setContent(newContent)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {'Tạo bài viết'}
          </Button>
        </Form.Item>
      </Form>
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
        hidden
      >
        Upload
      </Button>
    </>
    </Modal>
  );
};

export default CreateBlog;
