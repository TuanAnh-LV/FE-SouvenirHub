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
      message.error("Không thể tải thông tin cửa hàng.");
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
      title: "Sản phẩm",
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        typeof price === "object" && price.$numberDecimal
          ? `${Number(price.$numberDecimal).toLocaleString()}₫`
          : `${price.toLocaleString()}₫`,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
    },
  ];

  return (
    <div className="p-6 bg-[#fffaf7] min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        ← Quay lại
      </Button>

      {shop && (
        <>
          <Title level={2} className="mb-4">
            Thông tin cửa hàng
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
                    <Text>{shop.address || "Không có địa chỉ"}</Text>
                    <div className="mt-2 text-gray-500">
                      {products.length} sản phẩm
                    </div>
                  </div>
                </div>
              </Card>

              <Row gutter={16} className="mt-6">
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Doanh thu"
                      value={Number(shop.totalRevenue) || 0}
                      precision={0}
                      valueStyle={{ color: "#1890ff" }}
                      suffix="₫"
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Đơn hàng"
                      value={shop.totalOrders || 0}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Đơn huỷ"
                      value={shop.totalCancelled || 0}
                      valueStyle={{ color: "#cf1322" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Đánh giá"
                      value={shop.rating || 0}
                      suffix="/ 5"
                    />
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={8}>
              <Card className="rounded-2xl shadow-sm" title="Tổng quan">
                <p>
                  <strong>Địa chỉ:</strong>
                  <br />
                  {shop.address || "—"}
                </p>
                <p>
                  <strong>Email:</strong>
                  <br />
                  {shop.user_id?.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>
                  <br />
                  +84 345678912 {/* placeholder */}
                </p>
              </Card>
            </Col>
          </Row>

          <Row gutter={24} className="mt-10 mb-10">
            <Col xs={24} md={16}>
              <Card
                title="Doanh thu theo tháng"
                className="rounded-2xl shadow-sm"
              >
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `${Number(value).toLocaleString()} ₫`
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p>Không có dữ liệu</p>
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="Sản phẩm bán chạy" className="rounded-2xl shadow-sm">
                {topProducts.length > 0 ? (
                  <ul className="space-y-2">
                    {topProducts.map((item, idx) => (
                      <li key={item.product_id}>
                        <strong>
                          {idx + 1}. {item.name}
                        </strong>{" "}
                        — {item.quantity_sold} đã bán
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có dữ liệu</p>
                )}
              </Card>
            </Col>
          </Row>

          <Card
            className="rounded-2xl shadow-sm mt-10"
            title="Danh sách sản phẩm"
          >
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
