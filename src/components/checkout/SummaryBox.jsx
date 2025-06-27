// SummaryBox.jsx
import { Card, Button } from "antd";

export default function SummaryBox({
  totalPrice,
  // shippingFee,
  discount = 0,
  finalAmount,
  onConfirm,
}) {
  return (
    <Card
      className="rounded-xl shadow-sm border border-orange-300"
      bodyStyle={{ padding: 20 }}
    >
      <div className="flex justify-between mb-3 text-base">
        <span>Tạm tính:</span>
        <span>{totalPrice.toLocaleString()}₫</span>
      </div>
      {/* <div className="flex justify-between mb-3 text-base">
        <span>Phí vận chuyển:</span>
        <span>{shippingFee.toLocaleString()}₫</span>
      </div> */}
      {discount > 0 && (
        <div className="flex justify-between mb-3 text-base text-green-700">
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString()}₫</span>
        </div>
      )}
      <div className="flex justify-between mb-4 text-xl font-semibold text-red-600">
        <span>Tổng cộng:</span>
        <span>{finalAmount.toLocaleString()}₫</span>
      </div>

      <Button
        type="primary"
        className="w-full text-white text-base font-medium"
        size="large"
        onClick={onConfirm}
      >
        Đặt hàng
      </Button>
    </Card>
  );
}
