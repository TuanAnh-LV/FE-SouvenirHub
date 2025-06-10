import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const BlogService = {
    createBlog: (data) => {
        return BaseService.post({
            url: API.BLOG.CREATE_BLOG,
            payload: data,
            isLoading: true,
        });
    },

    getMyBlogs: () => {
        return BaseService.get({
            url: API.BLOG.GET_MY_BLOGS,
            isLoading: true,
        });
    },
    getBlogs: () => {
        return BaseService.get({
            url: API.BLOG.GET_BLOGS,
            isLoading: true,
        });
    },

    getBlogById: (id) => {
        return BaseService.get({
            url: API.BLOG.GET_BLOG_BY_ID.replace(":id", id),
            isLoading: true,
        });
    },
    updateBlog: (id, data) => {
        return BaseService.put({
            url: API.BLOG.UPDATE_BLOG.replace(":id", id),
            payload: data,
            isLoading: true,
        });
    }, 
    deleteBlog: (id) => {
        return BaseService.remove({
            url: API.BLOG.DELETE_BLOG.replace(":id", id),
            isLoading: true,
        });
    },

    createBlogImage: (id, files) => {
        const formData = new FormData();
        // files: array of File objects
        files.forEach((file) => {
        formData.append("images", file);
        });
        return BaseService.post({
            url: API.BLOG_IMAGE.CREATE_BLOG_IMAGE.replace(":id", id),
            payload: formData,
            isLoading: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    deleteBlogImage: (imageId) => {
        return BaseService.delete({
            url: API.BLOG_IMAGE.DELETE_BLOG_IMAGE.replace(":id", imageId),
            isLoading: true,
        });
    },
    deleteAllBlogImages: (blogId) => {
        return BaseService.delete({
            url: API.BLOG_IMAGE.DELETE_BLOG_IMAGES.replace(":id", blogId),
            isLoading: true,
        });
    },
};