// PaymentOptions.jsx
import { Card, Radio } from "antd";
import { WalletOutlined, DollarCircleOutlined } from "@ant-design/icons";

export default function PaymentOptions({ value, onChange }) {
  return (
    <Card
      title="Phương thức thanh toán"
      bordered={false}
      className="rounded-xl shadow-sm"
    >
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        <Radio value="cod">
          <DollarCircleOutlined className="mr-1" /> Thanh toán khi nhận hàng
        </Radio>
        <Radio value="momo">
          <WalletOutlined className="mr-1 text-pink-500" /> Ví MoMo
        </Radio>
        <Radio value="payos">
          <WalletOutlined className="mr-1 text-pink-500" /> Mã QR
        </Radio>
      </Radio.Group>
    </Card>
  );
}
