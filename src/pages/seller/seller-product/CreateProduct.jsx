import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Card,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import { CategoryService } from "../../../services/category/category.service";
import { ProductService } from "../../../services/product-service/product.service";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
const { TextArea } = Input;

const CreateProduct = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [specifications, setSpecifications] = useState("");
  const navigate = useNavigate();
  const handleFinish = async () => {
    try {
      const values = await form.validateFields();

      // Gộp thêm các trường không thuộc form
      const payload = {
        ...values,
        specialNotes,
        specifications,
      };

      const response = await ProductService.createProduct(payload);

      if (response?.data?._id) {
        const newProductId = response.data._id;
        await handleUpload(newProductId); // Upload ảnh sau khi tạo thành công
        message.success("Tạo sản phẩm thành công!");
        navigate("/seller/products"); // hoặc trang chi tiết sản phẩm nếu cần
      } else {
        message.error("Không nhận được dữ liệu sản phẩm từ server.");
      }
    } catch (error) {
      console.error("❌ Lỗi tạo sản phẩm:", error);
      message.error("Tạo sản phẩm hoặc tải ảnh thất bại!");
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await CategoryService.getAllCategories();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    form.setFieldsValue({ specialNotes });
  }, [specialNotes, form]);

  // Upload change handler
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 9));
  };

  // Custom upload button
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </div>
  );

  // Handle upload to server
  const handleUpload = async (productId) => {
    if (!productId) {
      message.warning("Vui lòng tạo sản phẩm trước khi tải ảnh!");
      return;
    }
    const images = fileList.map((file) => file.originFileObj).filter(Boolean);
    if (images.length === 0) {
      message.warning("Vui lòng chọn ít nhất một ảnh!");
      return;
    }
    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      await ProductService.createProductImage(productId, images);
      message.success("Tải ảnh thành công!");
      setFileList([]);
      navigate("/seller/products");
    } catch (error) {
      message.error("Tải ảnh thất bại!", error);
    }
  };

  return (
    <>
      <Card title="Tạo sản phẩm mới" style={{ maxWidth: "100%" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            name: "",
            description: "",
            category_id: "",
            price: 0,
            stock: 0,
            specialNotes: "",
            specifications: "",
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6} lg={6}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6} lg={6}>
              <Form.Item
                label="Số lượng"
                name="stock"
                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={16} lg={16}>
              <Form.Item
                label="Thông tin chi tiết"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="thêm thông tin chi tiết liên quan đến sản phẩm"
                />
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
              <Form.Item label="Thông số kỹ thuật" name="specifications">
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
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title="Tải ảnh sản phẩm"
        style={{ maxWidth: "90%", margin: "0 auto", marginTop: "1%" }}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false}
          multiple
          maxCount={9}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
      </Card>

      {/* Action buttons below both cards */}
      <div
        style={{
          maxWidth: "90%",
          margin: "24px auto 0 auto",
          display: "flex",
          gap: 12,
          justifyContent: "flex-end", // Move buttons to the right
        }}
      >
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
          onClick={() => {
            form.resetFields();
            setFileList([]);
          }}
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
          onClick={handleFinish}
        >
          Lưu
        </Button>
      </div>
    </>
  );
};

export default CreateProduct;
