/* eslint-disable no-unused-vars */
import { Form, Input, Button, Select, message, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { BlogService } from '../../services/blog/blog.service';


const { Option } = Select;

const BlogForm = ({ initialValues, onSubmit, isUpdating }) => {
  const [fileList, setFileList] = useState([]);
  const [form] = useForm();
  const [content, setContent] = useState(initialValues.content || '');
  const history = useNavigate();

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

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      values.content = content; // Set the content from the editor
      console.log('Form Values:', content);
      if (isUpdating) {
        await BlogService.updateBlog(initialValues._id, values);
        message.success('Blog updated successfully!');
      } else {
        const response = await BlogService.createBlog(values);
        const blogId = response.data?._id;
        console.log('Created Blog ID:', blogId);
        if (blogId) {
          await handleUpload(blogId); // Upload images after creating the blog
          message.success('Blog created successfully!');
          history('/seller/blog'); // Redirect to blog manager
        } else {
          message.error('Failed to create blog!');
        }
      }

      if (onSubmit) onSubmit(values); // Call the onSubmit callback if provided
      
    } catch (error) {
      message.error('Failed to submit the blog!');
    }
  };

  return (
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
          ...initialValues,
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
            {isUpdating ? 'Update Blog' : 'Create Blog'}
          </Button>
        </Form.Item>
      </Form>
      {!isUpdating && (
        <>
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
      )}
    </>
  );
};

export default BlogForm;