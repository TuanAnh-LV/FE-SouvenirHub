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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

import { SellerService } from "../../services/seller/seller.service";

const { Title, Text } = Typography;

const SellerDashboard = () => {
  const [shop, setShop] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDecimal = (val) => {
    const raw =
      typeof val === "object" && val?.$numberDecimal
        ? parseFloat(val.$numberDecimal)
        : typeof val === "string"
        ? parseFloat(val)
        : val;

    return !isNaN(raw) && isFinite(raw) && raw < 1e12 ? raw : 0;
  };

  const fetchSellerStats = async () => {
    try {
      const res = await SellerService.getSellerStats();
      const data = res.data;

      const cleanStats = {
        ...data,
        totalRevenue: formatDecimal(data.totalRevenue),
        totalCommission: formatDecimal(data.totalCommission),
        netRevenue: formatDecimal(data.netRevenue),
      };

      setShop(cleanStats);
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
        revenue: formatDecimal(value),
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
  const safeFormat = (num) => {
    if (!isFinite(num) || num > 1e12) return "999,999+ ₫";
    return `${num.toLocaleString("vi-VN")} ₫`;
  };

  return (
    <div className="p-2 min-h-screen">
      {shop && (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={5}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Tổng doanh thu"
                  value={shop.totalRevenue}
                  formatter={(value) =>
                    `${Number(value).toLocaleString("vi-VN")} ₫`
                  }
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={5}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Hoa hồng hệ thống"
                  value={shop.totalCommission}
                  formatter={safeFormat}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={5}>
              <Card className="shadow-sm rounded-xl">
                <Statistic
                  title="Thực nhận"
                  value={shop.netRevenue}
                  formatter={safeFormat}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={5}>
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
                  <Line
                    data={{
                      labels: revenueData.map((d) => d.month),
                      datasets: [
                        {
                          label: "Doanh thu (VNĐ)",
                          data: revenueData.map((d) => d.revenue),
                          fill: true,
                          borderColor: "#1890ff",
                          backgroundColor: "rgba(24, 144, 255, 0.1)",
                          tension: 0.4,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (ctx) =>
                              `Doanh thu: ${Number(
                                ctx.raw
                              ).toLocaleString()} ₫`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          ticks: {
                            callback: (value) =>
                              `${Number(value).toLocaleString()} ₫`,
                          },
                        },
                      },
                    }}
                  />
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
