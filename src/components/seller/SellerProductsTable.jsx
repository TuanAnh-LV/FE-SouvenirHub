import { useEffect, useState, useCallback } from "react";
import { Tooltip, Table, Image, message, Tag, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../services/shop-service/shop.service";
import {
  ProductStatusLabel,
  ProductStatusColor,
} from "../../const/enum/ProductStatusEnum";

const DEFAULT_IMG = "https://via.placeholder.com/60x60?text=No+Image";

const truncate = (str, n) =>
  str && str.length > n ? str.slice(0, n) + "..." : str;

const SellerProductsTable = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
      message.error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    }
  }, []);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        const shopRes = await ProductService.getCurrentShop();
        const shopId = shopRes.data._id;
        if (shopId) {
          fetchProductByShopId(shopId);
        }
      } catch (error) {
        message.error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      }
    };
    fetchShopAndProducts();
  }, [fetchProductByShopId]);

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
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa sản phẩm">
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => navigate(`/seller/products/${record._id}/edit`)}
          />
        </Tooltip>
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
          .ant-table-cell.product-name-cell {
            max-width: 180px;
            min-width: 120px;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        `}
      </style>
    </div>
  );
};

export default SellerProductsTable;
