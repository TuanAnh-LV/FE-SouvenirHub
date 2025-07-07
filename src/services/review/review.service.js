import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ReviewService = {

  getReviewsByProductId: (productId) =>
    BaseService.get({
      url: API.REVIEW.GET_REVIEWS_BY_PRODUCT_ID.replace(":productId", productId),
      isLoading: true,
    }),


  createReview: (payload) =>
    BaseService.post({
      url: API.REVIEW.CREATE_REVIEW,
      payload,
      isLoading: true,
      isPrivate: true,
    }),
    checkUserCanReview: (productId) =>
      BaseService.get({
        url: `/reviews/${productId}/check`,
        isPrivate: true,
      }),
};
