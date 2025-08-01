// BlogList.jsx
import { Tooltip, Table, Button, Popconfirm, message } from "antd";
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
      message.success("Xóa blog thành công!");
      fetchBlogs();
    } catch (error) {
      message.error("Xóa blog thất bại.");
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
          <Tooltip title="Chỉnh sửa bài viết">
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => onEdit(record._id)}
            />
          </Tooltip>

          <Popconfirm
            title="Bạn có muốn xóa bài viết?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa bài viết">
              <Button icon={<DeleteOutlined />} type="text" danger />
            </Tooltip>
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
