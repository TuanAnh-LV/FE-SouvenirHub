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
  Upload,
  Spin,
} from "antd";
import { ProductService as ProductApi } from "../../../services/product-service/product.service";
import { CategoryService } from "../../../services/category/category.service";
import { Editor } from "@tinymce/tinymce-react";
import { PlusOutlined } from "@ant-design/icons";
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
  const [specialNotes, setSpecialNotes] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 9)); // giới hạn tối đa 9 ảnh
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          ProductApi.getByid(id),
          CategoryService.getAllCategories(),
        ]);
        const product = productRes.data;

        if (product.images && Array.isArray(product.images)) {
          setFileList(
            product.images.map((url, index) => ({
              uid: `-${index}`,
              name: `Ảnh ${index + 1}`,
              status: "done",
              url,
            }))
          );
        }
        setCategories(categoryRes.data || []);
        setSpecialNotes(product.specialNotes || "");
        setSpecifications(product.specifications || "");
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
      } catch {
        message.error("Không thể tải thông tin sản phẩm");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form, navigate]);

  useEffect(() => {
    form.setFieldsValue({ specialNotes });
  }, [specialNotes, form]);

  const handleSubmit = async (values) => {
    try {
      values.specialNotes = specialNotes;
      values.specifications = specifications;

      // Update product info
      await ProductApi.updateProduct(id, values);

      // Upload images (nếu có ảnh mới)
      const images = fileList.map((file) => file.originFileObj).filter(Boolean);

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        // 👉 Gọi API giống trang create
        await ProductApi.createProductImage(id, formData);
      }

      message.success("Cập nhật sản phẩm thành công");
      navigate("/seller/products");
    } catch (err) {
      console.error("❌ Update product failed:", err);
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
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <Editor
              apiKey="r317wer69jgeks8pv43lmnj19b5oodhdcv7jt86gwuyilw5c"
              value={specifications}
              init={{
                height: 180,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
              }}
              onEditorChange={setSpecifications}
            />
          </div>
        </Form.Item>

        <Form.Item label="Ghi chú đặc biệt" name="specialNotes">
          <Editor
            apiKey="r317wer69jgeks8pv43lmnj19b5oodhdcv7jt86gwuyilw5c"
            value={specialNotes}
            init={{
              height: 180,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
            }}
            onEditorChange={setSpecialNotes}
          />
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
      <Card title="Ảnh sản phẩm" className="mb-6">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
          multiple
          maxCount={9}
        >
          {fileList.length >= 9 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Thêm ảnh</div>
            </div>
          )}
        </Upload>
      </Card>
    </Card>
  );
}
