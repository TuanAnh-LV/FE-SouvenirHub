/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Image,
  message,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ProductService } from "../../services/shop-service/shop.service";
import {
  ProductStatusLabel,
  ProductStatusColor,
} from "../../const/enum/ProductStatusEnum";
import { ProductService as ProductApi } from "../../services/product-service/product.service";
import { CategoryService } from "../../services/category/category.service";

const DEFAULT_IMG = "https://via.placeholder.com/60x60?text=No+Image";

const truncate = (str, n) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

const STATUS_OPTIONS = [
  { value: "onSale", label: "Đang bán" },
  { value: "outOfStock", label: "Hết hàng" },
  { value: "offSale", label: "Ngừng bán" },
];

const SellerProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Fetch products by shopId
  const fetchProductByShopId = useCallback(async (id) => {
    try {
      const response = await ProductService.getShopById(id);
      const arr =
        Array.isArray(response.data.products) &&
        response.data.products.length > 0
          ? response.data.products
          : [];
      setProducts(arr);
    } catch (error) {
      message.error("Không thể tải sản phẩm. Vui lòng thử lại sau.", error);
    }
  }, []);

  // Get all categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await CategoryService.getAllCategories();
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  // Get current shop, then fetch products
  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        const shopRes = await ProductService.getCurrentShop();
        const shopId = shopRes.data._id;
        if (shopId) {
          fetchProductByShopId(shopId);
        }
      } catch (error) {
        message.error("Không thể tải sản phẩm. Vui lòng thử lại sau.", error);
      }
    };
    fetchShopAndProducts();
    fetchCategories();
  }, [fetchProductByShopId, fetchCategories]);

  // Xử lý mở modal chỉnh sửa
  const handleEdit = async (record) => {
    setLoadingProduct(true);
    try {
      // Lấy chi tiết sản phẩm mới nhất
      const res = await ProductApi.getByid(record._id);
      const product = res.data;
      setEditingProduct(product);
      setEditModalVisible(true);
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
      message.error("Không thể lấy thông tin sản phẩm.");
    }
    setLoadingProduct(false);
  };

  // Xử lý lưu chỉnh sửa
  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      // Chỉ gửi các trường cần thiết (có thêm description, bỏ status)
      const updateData = {
        category_id: values.category_id,
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        specifications: values.specifications,
        specialNotes: values.specialNotes,
      };
      await ProductApi.updateProduct(editingProduct._id, updateData);
      message.success("Cập nhật sản phẩm thành công!");
      setEditModalVisible(false);
      setEditingProduct(null);
      // Reload lại danh sách sản phẩm
      const shopRes = await ProductService.getCurrentShop();
      const shopId = shopRes.data._id;
      if (shopId) fetchProductByShopId(shopId);
    } catch (err) {
      message.error("Cập nhật thất bại!");
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <Image
          src={
            images && images.length > 0 && images[0] !== "string"
              ? images[0]
              : DEFAULT_IMG
          }
          alt="product"
          width={48}
          height={48}
          style={{ objectFit: "cover", borderRadius: 8, background: "#fff" }}
          preview={false}
        />
      ),
      width: 70,
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{truncate(text, 40)}</span>
      ),
      align: "left",
      className: "product-name-cell",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{truncate(text, 20)}</span>,
      align: "left",
    },
    {
      title: "Giá",
      dataIndex: ["price", "$numberDecimal"],
      key: "price",
      render: (price) => <span>{parseInt(price, 10).toLocaleString()}đ</span>,
      align: "left",
    },
    {
      title: "Kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => <span>{stock} trong Kho</span>,
      align: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={ProductStatusColor[status] || "default"}>
          {ProductStatusLabel[status] || status}
        </Tag>
      ),
      width: 110,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 90,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          type="link"
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        margin: "24px 0",
      }}
    >
      <Table
        columns={columns}
        dataSource={products.map((item) => ({ ...item, key: item._id }))}
        pagination={false}
        bordered={false}
        rowClassName={() => "seller-product-row"}
        style={{ background: "#fff" }}
      />
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={editModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
        confirmLoading={loadingProduct}
      >
        <Form form={form} layout="vertical">
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
              placeholder="Chọn danh mục"
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              {
                type: "number",
                min: 0,
                message: "Giá phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            label="Kho"
            name="stock"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng kho" },
              { type: "number", min: 0, message: "Số lượng kho phải >= 0" },
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
        </Form>
      </Modal>
      <style>
        {`
          .seller-product-row {
            background: #fff !important;
          }
          .ant-table-thead > tr > th {
            background: #f6f6f6 !important;
            font-weight: 600;
            font-size: 15px;
            color: #666;
            border-bottom: 2.5px solid #e0e0e0 !important;
          }
          .ant-table-tbody > tr.seller-product-row > td {
            border-bottom: 1px solid #f0f0f0 !important;
          }
          .ant-table-cell {
            font-size: 15px;
            vertical-align: middle !important;
          }
          .ant-table-tbody > tr > td {
            background: #fff !important;
          }
          .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }
          /* Thu nhỏ tên sản phẩm */
          .ant-table-cell.product-name-cell {
            max-width: 180px;
            min-width: 120px;
            white-space: nowrap;
            // overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>
    </div>
  );
};

export default SellerProductsTable;
