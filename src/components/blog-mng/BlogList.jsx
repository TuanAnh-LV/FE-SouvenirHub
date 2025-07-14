// BlogList.jsx
import { Table, Button, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { BlogService } from "../../services/blog/blog.service";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const BlogList = ({ onEdit }) => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await BlogService.getMyBlogs();
      setBlogs(response.data || []);
    } catch (error) {
      message.error("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id) => {
    try {
      await BlogService.deleteBlog(id);
      message.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      message.error("Failed to delete blog");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => onEdit(record._id)}
          />
          <Popconfirm
            title="Bạn có muốn xóa bài viết?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
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
