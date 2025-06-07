import { Card, Checkbox, Tooltip, Button, Input } from "antd";
import { MessageOutlined, HeartFilled } from "@ant-design/icons";

const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function ProductList({ items, shopName }) {
  const shippingFee = 16500;
  const insuranceFee = 289;

  const total = items.reduce((acc, item) => {
    const price = parsePrice(item.product.price);
    return acc + price * item.quantity;
  }, 0);

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
      {items.map((item) => (
        <Card
          key={item._id}
          style={{ marginBottom: 16 }}
          bodyStyle={{ padding: 12 }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />
              <div className="flex-1">
                <Tooltip title={item.product.name}>
                  <div className="font-semibold truncate max-w-[300px]">
                    {item.product.name}
                  </div>
                </Tooltip>
                <div className="text-sm text-gray-600">Loại: 1 Cái Màu Xám</div>
              </div>
              <div className="text-right text-sm min-w-[100px]">
                <div className="text-black">
                  {parsePrice(item.product.price).toLocaleString()}₫
                </div>
                <div className="text-gray-500">x {item.quantity}</div>
                <div className="font-semibold text-orange-600">
                  {(
                    parsePrice(item.product.price) * item.quantity
                  ).toLocaleString()}
                  ₫
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-gray-50 p-2 rounded border border-dashed">
              <Checkbox />
              <div className="text-xs text-gray-600">
                <strong>Bảo hiểm Thiệt hại sản phẩm</strong>
                <div>
                  Bảo vệ sản phẩm khỏi thiệt hại do sự cố bất ngờ, tiếp xúc với
                  chất lỏng hoặc hư hỏng trong quá trình sử dụng.{" "}
                  <a href="#" className="text-blue-500">
                    Tìm hiểu thêm
                  </a>
                </div>
              </div>
              <div className="ml-auto text-sm font-medium text-gray-700">
                {insuranceFee.toLocaleString()}₫
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Giao hàng & tổng */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700">Phương thức vận chuyển:</span>
          <span className="text-blue-600 cursor-pointer">Thay đổi</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Đảm bảo nhận hàng từ 7 Tháng 6 - 9 Tháng 6
        </div>

        <Input placeholder="Lưu ý cho Người bán..." className="mb-4" />

        <div className="flex justify-end items-center text-base font-semibold">
          <span className="mr-2">Tổng số tiền:</span>
          <span className="text-orange-600">
            {(total + shippingFee).toLocaleString()}₫
          </span>
        </div>
      </div>
    </Card>
  );
}
