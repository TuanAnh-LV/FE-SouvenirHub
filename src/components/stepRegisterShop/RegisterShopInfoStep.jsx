import { ProductService } from "../../services/shop-service/shop.service";
import { message } from "antd";

export default function RegisterShopInfoStep({
  shopInfo,
  setShopInfo,
  setStep,
  setApplication,
}) {
  const handleShopSubmit = async () => {
    try {
      const res = await ProductService.createShop(shopInfo);
      message.success("Đăng ký cửa hàng thành công!");
      setApplication((prev) => ({ ...prev, shop_id: res.data.shop._id }));
      setStep(2);
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.error || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="text-base font-medium text-gray-700">
          Tên cửa hàng *
        </span>
        <input
          type="text"
          required
          placeholder="Nhập tên cửa hàng"
          value={shopInfo.name}
          onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </label>

      <label className="block">
        <span className="text-base font-medium text-gray-700">
          Mô tả cửa hàng
        </span>
        <textarea
          placeholder="Mô tả ngắn gọn về cửa hàng"
          value={shopInfo.description}
          onChange={(e) =>
            setShopInfo({ ...shopInfo, description: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </label>

      <button
        onClick={handleShopSubmit}
        className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
          shopInfo.name
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!shopInfo.name}
      >
        Tiếp tục
      </button>
    </div>
  );
}
