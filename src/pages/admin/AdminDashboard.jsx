import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, message, Typography } from "antd";
import { Bar } from "react-chartjs-2";
import { AdminService } from "../../services/admin/admin.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await AdminService.getDashboardStats();
        setStats(res.data);
        console.log(res.data.totalRevenue);
      } catch {
        message.error("Không thể tải thống kê");
      }
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  // 📊 Bar chart: Doanh thu theo tháng
  const revenueData = {
    labels: Object.keys(stats.revenueByMonth || {}),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: Object.values(stats.revenueByMonth || {}),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // 📊 Bar chart: Người dùng mới theo tháng
  const usersData = {
    labels: Object.keys(stats.usersByMonth || {}),
    datasets: [
      {
        label: "Người dùng mới",
        data: Object.values(stats.usersByMonth || {}),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const statusMap = {
    pending: { label: "Đang chờ", color: "#FFF8D5" },        
    processing: { label: "Đang xử lý", color: "#B2C9E2" },  
    shipped: { label: "Đã giao", color: "#9DD6AD" },        
    completed: { label: "Đã hoàn thành", color: "#9DD6AD" }, 
    cancelled: { label: "Đã hủy", color: "#C54F4F" },        
  };

  return (
    <div className="p-8">
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Người dùng" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={stats.totalOrders} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue.toLocaleString("vi-VN")}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      <AntTitle level={4} className="mt-10">
        Trạng thái đơn hàng
      </AntTitle>
      <Row gutter={16}>
        {stats.ordersByStatus.map((s) => {
          const status = statusMap[s._id] || { label: s._id, color: "#e5e7eb" };
          return (
            <Col key={s._id} span={6}>
              <Card
                style={{
                  background: status.color,
                  color: "#222",
                  border: "none",
                  borderRadius: 10,
                  minHeight: 110,
                }}
              >
                <Statistic
                  title={<span style={{ fontWeight: "bold" }}>{status.label}</span>}
                  value={s.count}
                  valueStyle={{ color: "#222" }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row gutter={24} className="mt-12">
        <Col span={12}>
          <Card title="Doanh thu theo tháng">
            <Bar data={revenueData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Người dùng mới theo tháng">
            <Bar data={usersData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
