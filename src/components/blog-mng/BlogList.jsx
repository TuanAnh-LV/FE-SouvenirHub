/* eslint-disable no-unused-vars */
import { Table, Button, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { BlogService }  from '../../services/blog/blog.service';

const BlogList = ({ onEdit }) => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await BlogService.getMyBlogs();
      setBlogs(response.data);
    } catch (error) {
      message.error('Failed to fetch blogs');
    }
  };

  const handleDelete = async (id) => {
  try {
    alert("Deleting: " + id);
    console.log("Before API call, id:", id);
    const res = await BlogService.deleteBlog(id);
    console.log("API response:", res);
    message.success('Blog deleted successfully');
    fetchBlogs();
  } catch (error) {
    message.error('Failed to delete blog');
    console.error(error); // log lỗi để biết vấn đề gì
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => onEdit(record._id)}>Edit</Button>
          <Popconfirm
            title="Bạn có muốn xóa bài viết??"
            onConfirm={() => {
              handleDelete(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={blogs}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default BlogList;
