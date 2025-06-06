/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminService } from "../../services/admin/admin.service";
import {
  Descriptions,
  Button,
  Card,
  Col,
  Row,
  Typography,
  Image,
  Statistic,
  Table,
  Tag,
  message,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Title, Text } = Typography;

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchShop = async () => {
    try {
      const res = await AdminService.getShopById(id);
      setShop(res.data);
      setProducts(res.data.products || []);
    } catch (err) {
      message.error("Failed to load shop details.");
    }
  };

  useEffect(() => {
    fetchShop();
  }, [id]);

  const revenueData = shop?.revenueByMonth
    ? Object.entries(shop.revenueByMonth).map(([month, value]) => ({
        month,
        revenue: value,
      }))
    : [];

  const topProducts = shop?.topProducts || [];

  const productColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.images?.[0]}
            width={40}
            height={40}
            alt={text}
            fallback="/no-image.png"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        typeof price === "object" && price.$numberDecimal
          ? `${Number(price.$numberDecimal).toLocaleString()}₫`
          : `${price.toLocaleString()}₫`,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "In Stock",
      dataIndex: "stock",
      key: "stock",
    },
  ];

  return (
    <div className="p-6 bg-[#fffaf7] min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        ← Back
      </Button>

      {shop && (
        <>
          <Title level={2} className="mb-4">
            Shop Information
          </Title>

          <Row gutter={24} className="mb-6">
            <Col xs={24} md={16}>
              <Card className="rounded-2xl shadow-sm">
                <div className="flex items-center gap-6">
                  <Image
                    src={shop.logo_url}
                    width={100}
                    height={100}
                    className="rounded-xl"
                  />
                  <div>
                    <Title level={4}>{shop.name}</Title>
                    <Text>{shop.address || "No address provided"}</Text>
                    <div className="mt-2 text-gray-500">
                      {products.length} products
                    </div>
                  </div>
                </div>
              </Card>

              <Row gutter={16} className="mt-6">
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Revenue"
                      value={shop.totalRevenue || 0}
                      precision={0}
                      valueStyle={{ color: "#1890ff" }}
                      suffix="₫"
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Orders"
                      value={shop.totalOrders || 0}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Cancelled Orders"
                      value={shop.totalCancelled || 0}
                      valueStyle={{ color: "#cf1322" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Rating"
                      value={shop.rating || 0}
                      suffix="/ 5"
                    />
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={8}>
              <Card className="rounded-2xl shadow-sm" title="Overview">
                <p>
                  <strong>Address:</strong>
                  <br />
                  {shop.address || "—"}
                </p>
                <p>
                  <strong>Email:</strong>
                  <br />
                  {shop.user_id?.email}
                </p>
                <p>
                  <strong>Phone:</strong>
                  <br />
                  +84 345678912 {/* placeholder */}
                </p>
              </Card>
            </Col>
          </Row>

          <Row gutter={24} className="mt-10 mb-10">
            <Col xs={24} md={16}>
              <Card title="Revenue by Month" className="rounded-2xl shadow-sm">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1890ff"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No data available</p>
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                title="Top Selling Products"
                className="rounded-2xl shadow-sm"
              >
                {topProducts.length > 0 ? (
                  <ul className="space-y-2">
                    {topProducts.map((item, idx) => (
                      <li key={item.product_id}>
                        <strong>
                          {idx + 1}. {item.name}
                        </strong>{" "}
                        — {item.quantity_sold} sold
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No data available</p>
                )}
              </Card>
            </Col>
          </Row>

          <Card className="rounded-2xl shadow-sm mt-10" title="Products">
            <Table
              columns={productColumns}
              dataSource={shop.products?.filter((p) => p.status === "onSale")}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default ShopDetail;
