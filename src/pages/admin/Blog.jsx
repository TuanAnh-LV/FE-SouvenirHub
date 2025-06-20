import React, { useState } from "react";
import BlogList from "../../components/blog-mng/BlogList";
import BlogForm from "../../components/blog-mng/BlogForm";
import BlogImageUpload from "../../components/blog-mng/BlogImageUpload";

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleCreate = () => {
    setSelectedBlog(null);
    setShowForm(true);
    setShowUpload(false);
  };

  const handleEdit = (blogId) => {
    setSelectedBlog(blogId);
    setShowForm(true);
    setShowUpload(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowUpload(false);
    setSelectedBlog(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Management (Admin)</h1>
      {!showForm && (
        <>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleCreate}
          >
            Create New Blog
          </button>
          <BlogList onEdit={handleEdit} />
        </>
      )}

      {showForm && (
        <>
          <BlogForm
            initialValues={selectedBlog ? { _id: selectedBlog } : {}}
            isUpdating={!!selectedBlog}
            onSubmit={handleCloseForm}
          />
          {showUpload && <BlogImageUpload blogId={selectedBlog} />}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleCloseForm}
          >
            Back to List
          </button>
        </>
      )}
    </div>
  );
};

export default Blog;
