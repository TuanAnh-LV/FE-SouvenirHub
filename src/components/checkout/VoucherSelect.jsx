// VoucherSelect.jsx
import { Card, Select, Tag, Tooltip } from "antd";

export default function VoucherSelect({
  vouchers,
  selectedVoucherId,
  setSelectedVoucherId,
  orderTotal,
}) {
  const isValidVoucher = (voucher) => {
    const now = new Date();
    return (
      voucher.quantity > 0 &&
      new Date(voucher.expires_at) > now &&
      orderTotal >= (voucher.min_order_value || 0)
    );
  };

  return (
    <Card
      title="Chọn mã giảm giá"
      bordered={false}
      className="rounded-xl shadow-sm"
    >
      <Select
        value={selectedVoucherId}
        onChange={setSelectedVoucherId}
        style={{ width: "100%" }}
        placeholder="Chọn voucher áp dụng"
        allowClear
      >
        {vouchers.map((voucher) => (
          <Select.Option
            key={voucher._id}
            value={voucher._id}
            disabled={!isValidVoucher(voucher)}
          >
            <Tooltip
              title={`Giảm ${
                voucher.type === "percent"
                  ? `${voucher.discount}%`
                  : `${voucher.discount.toLocaleString()}₫`
              } - Đơn từ ${voucher.min_order_value?.toLocaleString() || 0}₫`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate max-w-[220px]">{voucher.code}</span>
                {!isValidVoucher(voucher) && (
                  <Tag color="red" className="ml-2">
                    Không đủ điều kiện
                  </Tag>
                )}
              </div>
            </Tooltip>
          </Select.Option>
        ))}
      </Select>
    </Card>
  );
}
