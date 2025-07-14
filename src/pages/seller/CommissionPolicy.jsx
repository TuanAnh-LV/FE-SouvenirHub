import { Table, Typography } from "antd";

const { Title, Paragraph } = Typography;

const data = [
  {
    key: "1",
    range: "Dưới 100.000₫",
    commission: "3%",
    note: "Khuyến khích sản phẩm giá rẻ, dễ tiếp cận",
  },
  {
    key: "2",
    range: "100.000₫ – 400.000₫",
    commission: "7%",
    note: "Nhóm sản phẩm phổ biến, mức phí ưu đãi",
  },
  {
    key: "3",
    range: "400.000₫ – 1.000.000₫",
    commission: "12%",
    note: "Nhóm quà tặng cao cấp, cần tối ưu lợi nhuận",
  },
  {
    key: "4",
    range: "Trên 1.000.000₫",
    commission: "7%",
    note: "Phí giảm để tăng khả năng bán hàng giá cao",
  },
];

const columns = [
  {
    title: "Khoảng giá sản phẩm (VNĐ)",
    dataIndex: "range",
    key: "range",
  },
  {
    title: "Tỉ lệ hoa hồng",
    dataIndex: "commission",
    key: "commission",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
  },
];

const CommissionPolicy = () => {
  return (
    <div className="p-6">
      <Title level={4}> Chính sách hoa hồng theo giá sản phẩm</Title>
      <Paragraph>
        Chính sách này giúp bạn tối ưu chi phí và lợi nhuận khi bán hàng.
      </Paragraph>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
      />
    </div>
  );
};

export default CommissionPolicy;
