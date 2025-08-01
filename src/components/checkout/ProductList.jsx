import { Card, Checkbox, Tooltip, Button, Input } from "antd";
import { MessageOutlined, HeartFilled } from "@ant-design/icons";

const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function ProductList({ items, shopName }) {
  // const shippingFee = 16500;

  const total = items.reduce((acc, item) => {
    const price = parsePrice(
      item.price || item.variant?.price || item.product?.price
    );
    return acc + price * item.quantity;
  }, 0);
  const formatDateVN = (date) => {
    const d = new Date(date);
    return `${d.getDate()} Tháng ${d.getMonth() + 1}`;
  };
  const today = new Date();
  const earliestDate = new Date(today);
  earliestDate.setDate(today.getDate() + 2);

  const latestDate = new Date(today);
  latestDate.setDate(today.getDate() + 5);

  const deliveryEstimate = `Đảm bảo nhận hàng từ ${formatDateVN(
    earliestDate
  )} - ${formatDateVN(latestDate)}`;

  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-sm"
      title={
        <div className="flex items-center gap-2">
          <HeartFilled className="text-red-500" />
          <span className="font-semibold text-gray-800">{shopName}</span>
          <Button
            type="link"
            icon={<MessageOutlined />}
            className="p-0 text-green-600"
          >
            Chat ngay
          </Button>
        </div>
      }
    >
      {items.map((item) => {
        const price = parsePrice(
          item.price || item.variant?.price || item.product?.price
        );
        const variantName = item.variant?.name;
        const image =
          item.variant?.images?.[0] ||
          item.product?.image ||
          "https://via.placeholder.com/80";

        return (
          <Card
            key={item._id}
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 12 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt={item.product?.name}
                  className="w-[80px] h-[80px] object-cover rounded"
                />
                <div className="flex-1">
                  <Tooltip title={item.product?.name}>
                    <div className="font-semibold truncate max-w-[300px]">
                      {item.product?.name}
                    </div>
                  </Tooltip>
                  {variantName && (
                    <div className="text-sm text-gray-600">
                      Mẫu: {variantName}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm min-w-[100px]">
                  <div className="text-black">{price.toLocaleString()}₫</div>
                  <div className="text-gray-500">x {item.quantity}</div>
                  <div className="font-semibold text-orange-600">
                    {(price * item.quantity).toLocaleString()}₫
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Giao hàng & tổng */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700">Phương thức vận chuyển:</span>
          <span className="text-blue-600 cursor-pointer">Thay đổi</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">{deliveryEstimate}</div>

        <Input placeholder="Lưu ý cho Người bán..." className="mb-4" />

        <div className="flex justify-end items-center text-base font-semibold">
          <span className="mr-2">Tổng số tiền:</span>
          <span className="text-orange-600">{total.toLocaleString()}₫</span>
        </div>
      </div>
    </Card>
  );
}
