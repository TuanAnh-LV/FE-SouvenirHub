import { Form, Input, InputNumber, Button, Select, Card } from "antd";

const { TextArea } = Input;

const CreateProduct = ({ categories = [], onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (onSubmit) onSubmit(values);
  };

  return (
    <Card title="Tạo sản phẩm mới" style={{ maxWidth: 500, margin: "0 auto" }}>
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
        }}
      >
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
          <TextArea rows={3} />
        </Form.Item>

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

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="stock"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateProduct;