import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  message,
  Spin,
} from "antd";
import { ProductService as ProductApi } from "../../../services/product-service/product.service";
import { CategoryService } from "../../../services/category/category.service";

const STATUS_OPTIONS = [
  { value: "onSale", label: "Đang bán" },
  { value: "outOfStock", label: "Hết hàng" },
  { value: "offSale", label: "Ngừng bán" },
];

export default function SellerProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          ProductApi.getByid(id),
          CategoryService.getAllCategories(),
        ]);
        const product = productRes.data;
        setCategories(categoryRes.data || []);
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: Number(product.price?.$numberDecimal || product.price || 0),
          stock: product.stock,
          category_id: product.category_id?._id,
          status: product.status,
          specifications: product.specifications,
          specialNotes: product.specialNotes,
        });
      } catch (err) {
        message.error("Không thể tải thông tin sản phẩm");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      await ProductApi.updateProduct(id, values);
      message.success("Cập nhật sản phẩm thành công");
      navigate("/seller/products");
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      title="Chỉnh sửa sản phẩm"
      bordered
      className="shadow max-w-full mx-auto"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select
            options={categories.map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))}
            placeholder="Chọn danh mục"
          />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 0, message: "Giá phải >= 0" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item
          label="Kho"
          name="stock"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng kho" },
            { type: "number", min: 0, message: "Kho phải >= 0" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select options={STATUS_OPTIONS} placeholder="Chọn trạng thái" />
        </Form.Item>
        <Form.Item label="Thông số kỹ thuật" name="specifications">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Ghi chú đặc biệt" name="specialNotes">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              style={{
                background: "#fff",
                color: "#F99600",
                border: "1px solid #F99600",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#D93B14";
                e.target.style.color = "#fff";
                e.target.style.border = "1px solid #D93B14";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.color = "#F99600";
                e.target.style.border = "1px solid #F99600";
              }}
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              style={{
                background: "#F99600",
                color: "#fff",
                border: "1px solid #F99600",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#00FB71";
                e.target.style.color = "#fff";
                e.target.style.border = "1px solid #00FB71";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#F99600";
                e.target.style.color = "#fff";
                e.target.style.border = "1px solid #F99600";
              }}
              htmlType="submit"
            >
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
