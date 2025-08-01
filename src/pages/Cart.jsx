import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, InputNumber, Button, message, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../context/cart.context";
import { AddressService } from "../services/adress/address.service";
import { CartService } from "../services/cart/cart.service";
const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function CartPage() {
  const { cart, updateQuantity, removeItem, updateCartItems } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const groupedItems = cart?.groupedItems || [];
  const allItems = groupedItems.flatMap((group) => group.items);

  const selectedCartItems = allItems.filter((item) =>
    selectedItems.some(
      (s) =>
        s.productId === item.product._id &&
        (s.variantId || null) === (item.variant?._id || null)
    )
  );

  const selectedTotalPrice = selectedCartItems.reduce(
    (sum, item) =>
      sum +
      parsePrice(item.variant?.price || item.product?.price) * item.quantity,
    0
  );

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      setAddresses(res.data || []);
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      const saved = localStorage.getItem("defaultAddressId");
      const valid = addresses.find((a) => a._id === saved);
      setSelectedAddressId(valid ? valid._id : addresses[0]._id);
    }
  }, [addresses]);

  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem("defaultAddressId", selectedAddressId);
    }
  }, [selectedAddressId]);

  const handleQuantityChange = (productId, quantity, variantId = null) => {
    if (quantity > 0) updateQuantity(productId, quantity, variantId);
  };

  const handleRemove = (productId, variantId = null) => {
    if (productId) removeItem(productId, variantId);
  };

  const toggleProductSelection = (productId, variantId) => {
    const key = `${productId}-${variantId || "none"}`;
    const exists = selectedItems.some(
      (item) => `${item.productId}-${item.variantId || "none"}` === key
    );

    if (exists) {
      setSelectedItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.productId === productId &&
              (item.variantId || null) === (variantId || null)
            )
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { productId, variantId: variantId || null },
      ]);
    }
  };

  const toggleSelectAll = () => {
    const all = allItems.map((item) => ({
      productId: item.product._id,
      variantId: item.variant?._id || null,
    }));

    const isAllSelected =
      selectedItems.length === all.length &&
      selectedItems.every(
        (item, i) =>
          item.productId === all[i].productId &&
          (item.variantId || null) === (all[i].variantId || null)
      );

    setSelectedItems(isAllSelected ? [] : all);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      return message.warning("Vui lòng chọn sản phẩm để thanh toán");
    }

    if (!selectedAddressId) {
      return message.warning("Vui lòng chọn địa chỉ giao hàng");
    }

    try {
      await CartService.checkout({
        shipping_address_id: selectedAddressId,
        selectedItems: selectedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
        })),
      });

      message.success(
        "Tạo đơn hàng thành công, vui lòng vào dashboard -> đơn hàng -> thanh toán!"
      );
      await updateCartItems("pending");
      navigate("/buyer/dashboard");
    } catch (err) {
      console.error(err);
      message.error("Đặt hàng thất bại");
    }
  };

  return (
    <div className="px-6 py-6 mt-10 md:px-12 min-h-screen max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold border-b pb-3 mb-6">🛒 Giỏ Hàng</h2>

      {allItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-12 text-lg">
          Không có sản phẩm nào trong giỏ hàng.
        </div>
      ) : (
        <>
          <div className="hidden lg:grid grid-cols-12 text-sm text-[#999] border-b py-2 font-semibold bg-white px-4">
            <div className="col-span-6">Sản Phẩm</div>
            <div className="col-span-2 text-center">Đơn Giá</div>
            <div className="col-span-2 text-center">Số Lượng</div>
            <div className="col-span-1 text-center">Số Tiền</div>
            <div className="col-span-1 text-center">Thao Tác</div>
          </div>

          {groupedItems.map((group) => (
            <div key={group.shop_id} className="mt-4 bg-white shadow-sm">
              <div className="px-4 py-2 font-semibold text-orange-600 border-b">
                🏪 {group.shop_name}
              </div>

              {group.items.map((item) => {
                const price = parsePrice(
                  item.variant?.price || item.product?.price
                );
                return (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 items-center px-4 py-4 border-b"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <Checkbox
                        checked={selectedItems.some(
                          (s) =>
                            s.productId === item.product._id &&
                            (s.variantId || null) ===
                              (item.variant?._id || null)
                        )}
                        onChange={() =>
                          toggleProductSelection(
                            item.product._id,
                            item.variant?._id
                          )
                        }
                      />
                      <img
                        src={
                          item.product.image || "https://via.placeholder.com/80"
                        }
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex flex-col max-w-[180px]">
                        <Tooltip title={item.product.name}>
                          <span className="font-semibold truncate">
                            {item.product.name}
                          </span>
                        </Tooltip>
                        {item.variant?.name && (
                          <span className="text-xs text-gray-500">
                            Mẫu: {item.variant.name}
                          </span>
                        )}

                        <span className="text-xs text-gray-500 truncate">
                          {item.product.category_id?.name}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-[#d0011b] font-medium">
                      {price.toLocaleString()}₫
                    </div>

                    <div className="col-span-2 text-center">
                      <InputNumber
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(
                            item.product._id,
                            value,
                            item.variant?._id
                          )
                        }
                      />
                    </div>

                    <div className="col-span-1 text-center font-semibold">
                      {(price * item.quantity).toLocaleString()}₫
                    </div>

                    <div className="col-span-1 text-center">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() =>
                          handleRemove(item.product._id, item.variant?._id)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex flex-col lg:flex-row justify-between items-center bg-white px-4 py-4 mt-4 rounded shadow-sm border">
            <div className="flex items-center gap-2 mb-2 lg:mb-0">
              <Checkbox
                checked={
                  selectedItems.length === allItems.length &&
                  selectedItems.every((s) =>
                    allItems.some(
                      (item) =>
                        s.productId === item.product._id &&
                        (s.variantId || null) === (item.variant?._id || null)
                    )
                  )
                }
                onChange={() => toggleSelectAll()}
              />
              <span className="text-sm">Chọn Tất Cả ({allItems.length})</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">Tổng cộng:</div>
              <div className="text-2xl text-[#d0011b] font-bold">
                {selectedTotalPrice.toLocaleString()}₫
              </div>
              <Button
                type="primary"
                className="bg-[#d0011b] hover:bg-red-600 text-white px-6 py-2 rounded"
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
              >
                Mua Hàng
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
