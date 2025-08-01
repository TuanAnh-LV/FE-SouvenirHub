import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Image,
  Statistic,
  Table,
  message,
  Button,
  Modal,
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
import { SellerService } from "../../services/seller/seller.service";

const { Title, Text } = Typography;

const SellerDashboard = () => {
  const [shop, setShop] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSellerStats = async () => {
    try {
      const res = await SellerService.getSellerStats();
      setShop(res.data);
    } catch (err) {
      message.error("Không thể tải thông tin cửa hàng.");
    }
  };

  const openOrderDetails = async () => {
    try {
      const res = await SellerService.getShopOrders();
      const cleaned = (res.data.orders || []).map((item) => ({
        ...item,
        price:
          typeof item.price === "object" && item.price.$numberDecimal
            ? Number(item.price.$numberDecimal)
            : item.price,
        commission_amount:
          typeof item.commission_amount === "object" &&
          item.commission_amount.$numberDecimal
            ? Number(item.commission_amount.$numberDecimal)
            : item.commission_amount,
        net_amount:
          typeof item.net_amount === "object" && item.net_amount.$numberDecimal
            ? Number(item.net_amount.$numberDecimal)
            : item.net_amount,
      }));
      setOrderDetails(cleaned);
      setIsModalOpen(true);
    } catch (err) {
      message.error("Không thể tải đơn hàng.");
    }
  };

  useEffect(() => {
    fetchSellerStats();
  }, []);

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
    <div className="p-2 min-h-screen">
      {shop && (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Tổng doanh thu"
                  value={Number(shop.totalRevenue) || 0}
                  precision={0}
                  valueStyle={{ color: "#1890ff" }}
                  suffix="₫"
                />
              </Card>
            </Col>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Hoa hồng hệ thống"
                  value={Number(shop.totalCommission) || 0}
                  precision={0}
                  valueStyle={{ color: "#faad14" }}
                  suffix="₫"
                />
              </Card>
            </Col>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Thực nhận"
                  value={Number(shop.netRevenue) || 0}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="₫"
                />
              </Card>
            </Col>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Đơn hàng"
                  value={shop.totalOrders || 0}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Đơn huỷ"
                  value={shop.totalCancelled || 0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={4}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Đánh giá"
                  value={shop.rating || 0}
                  suffix="/ 5"
                />
              </Card>
            </Col>
          </Row>

          <div className="flex justify-end mt-2">
            <Button onClick={openOrderDetails} type="link">
              Xem chi tiết đơn hàng
            </Button>
          </div>

          <Row gutter={[24, 24]} className="mt-6 mb-6">
            <Col xs={24} md={16}>
              <Card
                title="Doanh thu theo tháng"
                className="shadow-sm rounded-xl"
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
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Text type="secondary">Không có dữ liệu doanh thu</Text>
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="Sản phẩm bán chạy" className="shadow-sm rounded-xl">
                {topProducts.length > 0 ? (
                  <ul className="space-y-2">
                    {topProducts.map((item, idx) => (
                      <li key={item.product_id}>
                        <Text strong>
                          {idx + 1}. {item.name}
                        </Text>{" "}
                        - {item.quantity_sold} đã bán
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text type="secondary">Không có dữ liệu</Text>
                )}
              </Card>
            </Col>
          </Row>

          <Card
            className="shadow-sm rounded-xl mt-10"
            title="Danh sách sản phẩm"
          >
            <Table
              columns={productColumns}
              dataSource={shop.products?.filter((p) => p.status === "onSale")}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </Card>

          <Modal
            open={isModalOpen}
            title="Chi tiết doanh thu theo đơn hàng"
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            width={800}
          >
            <Table
              dataSource={orderDetails}
              rowKey={(r, i) => i}
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: "Sản phẩm",
                  dataIndex: "product_name",
                },
                {
                  title: "Giá bán",
                  dataIndex: "price",
                  render: (val) => `${val.toLocaleString()}₫`,
                },
                {
                  title: "SL",
                  dataIndex: "quantity",
                },
                {
                  title: "Tỉ lệ hoa hồng",
                  dataIndex: "commission_rate",
                  render: (val) => `${(val * 100).toFixed(1)}%`,
                },
                {
                  title: "Hoa hồng",
                  dataIndex: "commission_amount",
                  render: (val) => `${val.toLocaleString()}₫`,
                },
                {
                  title: "Thực nhận",
                  dataIndex: "net_amount",
                  render: (val) => `${val.toLocaleString()}₫`,
                },
              ]}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default SellerDashboard;
