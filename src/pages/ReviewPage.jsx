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
  Progress,
  Select,
  Tag,
} from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { ReviewService } from "../services/review/review.service";
import { useAuth } from "../context/auth.context";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReviewPage = () => {
  const { id: productId } = useParams();
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await ReviewService.getReviewsByProductId(productId);
      setReviews(res?.data || []);
    } catch (err) {
      console.error("Error loading reviews", err);
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
    } catch (err) {
      message.error(err?.response?.data?.error || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

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

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <Title level={3}>Review</Title>

      <div className="flex flex-wrap gap-8">
        {/* Tổng quan đánh giá */}
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

        {/* Bộ lọc */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Button
              type="default"
              className="rounded-full px-4 py-1 font-medium border-black"
            >
              All review
            </Button>
            {[5, 4, 3, 2, 1].map((star) => (
              <Button key={star} className="rounded-full px-4 py-1">
                <span className="mr-1">★</span> {star}
              </Button>
            ))}
            <Button className="rounded-full px-4 py-1">With photo</Button>
            <Select
              defaultValue="newest"
              style={{ marginLeft: "auto", width: 120 }}
            >
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
            </Select>
          </div>

          {/* Form viết đánh giá */}
          <div className="mb-8 border rounded p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <Avatar src={userInfo?.avatar_url}>{userInfo?.name?.[0]}</Avatar>
              <Text>{userInfo?.name || "Bạn"}</Text>
            </div>
            <Rate value={rating} onChange={setRating} />
            <TextArea
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
            />
            <Button
              type="primary"
              onClick={submitReview}
              className="mt-3"
              loading={loading}
            >
              Gửi đánh giá
            </Button>
          </div>

          {/* Danh sách đánh giá */}
          <List
            dataSource={reviews}
            locale={{ emptyText: "Chưa có đánh giá nào." }}
            renderItem={(item) => (
              <List.Item className="px-0">
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
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      0 <LikeOutlined />
                    </span>
                    <span>
                      0 <DislikeOutlined />
                    </span>
                  </div>
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
