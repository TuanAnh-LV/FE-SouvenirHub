import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const CategoryService = {
    getAllCategories: () => {
        return BaseService.get({
            url: API.CATEGORY.GET_ALL_CATEGORIES,
            isLoading: true,
        });
    },
    createCategories: (data) => {
        return BaseService.post({
            url: API.CATEGORY.CREATE_CATEGORY,
            payload: data,
            isLoading: true,
        });
    },
    updateCategory: (id, data) => {
        return BaseService.put({
            url: API.CATEGORY.UPDATE_CATEGORY.replace(":id", id),
            payload: data,
            isLoading: true,
        });
    },
    deleteCategory: (id) => {
        return BaseService.delete({
            url: API.CATEGORY.DELETE_CATEGORY.replace(":id", id),
            isLoading: true,
        });
    },
};