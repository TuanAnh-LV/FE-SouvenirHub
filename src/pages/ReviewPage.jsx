import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Rate,
  Input,
  Button,
  List,
  message,
  Avatar,
  Select,
} from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { ReviewService } from "../services/review/review.service";
import { useAuth } from "../context/auth.context";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReviewPage = ({ productIdOverride }) => {
  const { id: productIdFromParam } = useParams();
  const productId = productIdOverride || productIdFromParam;
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [filterStar, setFilterStar] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await ReviewService.getReviewsByProductId(productId);
      setReviews(res?.data || []);
    } catch (err) {
      console.error("Error loading reviews", err);
    }
  };

  const checkReviewPermission = async () => {
    try {
      const res = await ReviewService.checkUserCanReview(productId);
      setCanReview(res.data.canReview);
      setAlreadyReviewed(res.data.alreadyReviewed);
      setHasPurchased(res.data.hasPurchased);
    } catch (err) {
      console.error("Check can review failed", err);
    }
  };

  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      message.warning("Vui lòng nhập đánh giá và chọn số sao");
      return;
    }
    try {
      setLoading(true);
      await ReviewService.createReview({
        product_id: productId,
        rating,
        comment,
      });
      message.success("Đánh giá thành công");
      setRating(0);
      setComment("");
      fetchReviews();
      checkReviewPermission();
    } catch (err) {
      message.error(err?.response?.data?.error || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && userInfo) {
      fetchReviews();
      checkReviewPermission();
    }
  }, [productId, userInfo]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ratingPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      percent: reviews.length ? (count / reviews.length) * 100 : 0,
    };
  });

  const filteredReviews = filterStar
    ? reviews.filter((r) => r.rating === filterStar)
    : reviews;

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <div className="flex flex-wrap gap-8">
        <div className="w-[220px] bg-gray-100 rounded p-4 text-center">
          <Text className="text-6xl font-bold">{averageRating}</Text>
          <div className="mt-2 mb-4">
            <Rate
              disabled
              value={parseFloat(averageRating)}
              className="text-base"
            />
          </div>
          {ratingPercentages.map((item) => (
            <div
              key={item.star}
              className="flex items-center justify-between text-sm mb-1"
            >
              <span>
                {item.star} <Rate disabled defaultValue={1} count={1} />
              </span>
              <div className="flex-1 mx-2 bg-gray-300 h-1 rounded">
                <div
                  className="bg-black h-1 rounded"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span>{Math.round(item.percent)}%</span>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Button
              type={!filterStar ? "default" : "text"}
              className="rounded-full px-4 py-1 font-medium border-black"
              onClick={() => setFilterStar(null)}
            >
              All review
            </Button>
            {[5, 4, 3, 2, 1].map((star) => (
              <Button
                key={star}
                type={filterStar === star ? "primary" : "default"}
                className="rounded-full px-4 py-1"
                onClick={() => setFilterStar(star)}
              >
                <span className="mr-1">★</span> {star}
              </Button>
            ))}
            <Button className="rounded-full px-4 py-1" disabled>
              With photo
            </Button>
            <Select
              defaultValue="newest"
              style={{ marginLeft: "auto", width: 120 }}
              disabled
            >
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
            </Select>
          </div>

          {canReview ? (
            <div className="mb-8 border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={userInfo?.avatar_url} size="large">
                  {userInfo?.name?.[0]}
                </Avatar>
                <div className="flex flex-col">
                  <Text className="font-semibold">
                    {userInfo?.name || "Bạn"}
                  </Text>
                  <Rate value={rating} onChange={setRating} />
                </div>
              </div>
              <TextArea
                rows={4}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
              <Button
                type="primary"
                onClick={submitReview}
                className="mt-4 w-full"
                loading={loading}
                size="large"
                style={{ backgroundColor: "#000", borderColor: "#000" }}
              >
                Gửi đánh giá
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-4 border border-gray-200 rounded bg-white text-gray-600 shadow-sm text-center">
              {!hasPurchased ? (
                <>
                  <p className="font-medium text-gray-800 mb-1">
                    Bạn chưa đủ điều kiện đánh giá sản phẩm này
                  </p>
                  <p className="text-sm text-gray-500">
                    Vui lòng mua sản phẩm trước khi gửi đánh giá.
                  </p>
                </>
              ) : alreadyReviewed ? (
                <>
                  <p className="font-medium text-gray-800 mb-1">
                    Cảm ơn bạn đã đánh giá!
                  </p>
                  <p className="text-sm text-gray-500">
                    Bạn đã gửi đánh giá cho sản phẩm này rồi.
                  </p>
                </>
              ) : null}
            </div>
          )}

          <List
            dataSource={filteredReviews}
            locale={{ emptyText: "Chưa có đánh giá nào." }}
            renderItem={(item) => (
              <List.Item className="px-0 border-b border-gray-200 pb-4">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar>{item.user_id?.name?.[0]}</Avatar>
                    <div>
                      <Text strong>{item.user_id?.name}</Text>
                      <div className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <Rate value={item.rating} disabled />
                  <p className="text-sm text-gray-800">{item.comment}</p>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
