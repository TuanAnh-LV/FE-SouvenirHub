import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  InputNumber,
  Tooltip,
  Checkbox,
  message,
  Select,
  Modal,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../context/cart.context";
import { AddressService } from "../services/adress/address.service";
import { CartService } from "../services/cart/cart.service";
import { VoucherService } from "../services/voucher/voucher.service";
import { OrderService } from "../services/order/order.service";
import CreateAddress from "../pages/address/CreateAddress";
import UpdateAddress from "../pages/address/UpdateAddress";

const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Voucher state
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const groupedItems = cart?.groupedItems || [];

  const selectedItems = groupedItems
    .flatMap((group) => group.items)
    .filter((item) => selectedProductIds.includes(item.product._id));

  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + parsePrice(item.product?.price) * item.quantity,
    0
  );

  const selectedTotalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Tính giảm giá dựa trên voucher đã chọn
  const selectedVoucher = vouchers.find((v) => v._id === selectedVoucherId);
  let discountAmount = 0;
  if (selectedVoucher && selectedTotalPrice >= (selectedVoucher.min_order_value || 0)) {
    if (selectedVoucher.type === "amount") {
      discountAmount = Math.min(selectedVoucher.discount, selectedTotalPrice);
    } else if (selectedVoucher.type === "percent") {
      let percentDiscount = (selectedTotalPrice * selectedVoucher.discount) / 100;
      if (selectedVoucher.max_discount && selectedVoucher.max_discount > 0) {
        percentDiscount = Math.min(percentDiscount, selectedVoucher.max_discount);
      }
      discountAmount = Math.min(percentDiscount, selectedTotalPrice);
    }
  }

  const finalTotalPrice = selectedTotalPrice - discountAmount;

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      setAddresses(res.data || []);
    } catch {
      setAddresses([]);
    }
  };

  // Lấy danh sách voucher
  const fetchVouchers = async () => {
    try {
      const res = await VoucherService.getAllVouchers();
      setVouchers(res.data || []);
    } catch {
      setVouchers([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchVouchers();
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

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) updateQuantity(productId, quantity);
  };

  const handleRemove = (productId) => {
    if (productId) removeItem(productId);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Lọc voucher có thể sử dụng
  const availableVouchers = vouchers.filter(
    (v) =>
      v.quantity > 0 &&
      new Date(v.expires_at) > new Date() &&
      selectedTotalPrice >= (v.min_order_value || 0)
  );

  const handleCheckout = async () => {
    if (!selectedAddressId)
      return message.warning("Please select a shipping address");
    if (selectedProductIds.length === 0)
      return message.warning("Please select items to checkout");

    // Kiểm tra điều kiện voucher
    if (selectedVoucherId) {
      if (!selectedVoucher) {
        return message.error("Voucher không hợp lệ.");
      }
      if (selectedTotalPrice < (selectedVoucher.min_order_value || 0)) {
        return message.error(
          `Đơn hàng phải từ ${selectedVoucher.min_order_value.toLocaleString()}₫ để dùng voucher này`
        );
      }
      if (selectedVoucher.quantity <= 0) {
        return message.error("Voucher đã hết lượt sử dụng.");
      }
      if (new Date(selectedVoucher.expires_at) < new Date()) {
        return message.error("Voucher đã hết hạn.");
      }
    }

    // Chuẩn bị data cho API createOrder
    const items = selectedItems.map((item) => ({
      product_id: item.product._id,
      quantity: item.quantity,
    }));

    try {
      await OrderService.createOrder({
        items,
        shipping_address_id: selectedAddressId,
        voucher_id: selectedVoucherId,
      });

      // Xoá các sản phẩm đã đặt khỏi cart
      for (const item of selectedItems) {
        await removeItem(item.product._id);
      }

      // Cập nhật lại cart và số lượng
      if (typeof cart?.refreshCart === "function") {
        await cart.refreshCart();
      }
      if (typeof cart?.getCartCount === "function") {
        await cart.getCartCount();
      }

      message.success("Checkout successful!");
      navigate("/buyer/orders");
    } catch (err) {
      message.error("Checkout failed.");
      console.error(err);
    }
  };

  return (
    <div className="px-8 py-4 min-h-[60vh] mt-12">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Cart items */}
        <div className="flex-1">
          <div
            style={{
              background: "#fff7ed",
              borderRadius: 12,
              marginBottom: 16,
              fontWeight: 600,
              fontSize: 16,
              padding: "16px 20px",
            }}
          >
            Selected items: {selectedTotalQuantity}
          </div>

          {groupedItems.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", marginTop: 48 }}>
              No products in cart.
            </div>
          ) : (
            groupedItems.map((group) => (
              <div key={group.shop_id} className="mb-10">
                <h3 className="text-lg font-semibold mb-4 text-orange-600">
                  Shop: {group.shop_name}
                </h3>
                {group.items.map((item) => {
                  const price = parsePrice(item.product?.price);
                  return (
                    <Card
                      key={item._id}
                      style={{
                        background: "#fff7ed",
                        borderRadius: 12,
                        marginBottom: 24,
                        boxShadow: "0 2px 8px #0001",
                        border: "none",
                        padding: 0,
                      }}
                      bodyStyle={{
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                        minHeight: 142,
                      }}
                    >
                      <div style={{ padding: "0 12px" }}>
                        <Checkbox
                          checked={selectedProductIds.includes(
                            item.product._id
                          )}
                          onChange={() =>
                            toggleProductSelection(item.product._id)
                          }
                        />
                      </div>

                      <div style={{ width: 142, textAlign: "center" }}>
                        <img
                          src={
                            item.product?.image ||
                            "https://via.placeholder.com/110"
                          }
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://via.placeholder.com/110")
                          }
                          alt={item.product.name}
                          style={{
                            width: 110,
                            height: 110,
                            objectFit: "cover",
                            borderRadius: 12,
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <Tooltip title={item.product.name}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 16,
                              marginBottom: 4,
                              maxWidth: 260,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.product?.name?.slice(0, 20) ||
                              "Name not found"}
                          </div>
                        </Tooltip>
                        <div style={{ color: "#666", fontSize: 13 }}>
                          {item.product.category_id?.name || ""}
                        </div>
                      </div>

                      <div style={{ flex: 3, display: "flex" }}>
                        <div
                          style={{
                            flex: 1,
                            textAlign: "right",
                            paddingRight: 10,
                          }}
                        >
                          {price.toLocaleString()}₫
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <InputNumber
                            min={1}
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(value) =>
                              handleQuantityChange(item.product._id, value)
                            }
                            style={{ width: 80 }}
                          />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontWeight: 600,
                          }}
                        >
                          {(price * item.quantity).toLocaleString()}₫
                        </div>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleRemove(item.product._id)}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Summary & Address */}
        <div className="w-full lg:w-80 bg-orange-100 p-4 rounded-xl h-fit self-start">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="mb-4">
            <label className="font-medium mb-1 block">Shipping Address</label>
            <Select
              placeholder="Choose shipping address"
              value={selectedAddressId}
              onChange={setSelectedAddressId}
              style={{ width: "100%" }}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="p-2 border-t text-center">
                    <Button
                      type="link"
                      onClick={() => setShowCreateModal(true)}
                    >
                      + Add new address
                    </Button>
                  </div>
                </>
              )}
            >
              {addresses.map((addr) => (
                <Select.Option key={addr._id} value={addr._id}>
                  {addr.recipient_name} - {addr.address_line}, {addr.ward},{" "}
                  {addr.city}
                  <Button
                    type="link"
                    size="small"
                    style={{ float: "right" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(addr);
                    }}
                  >
                    Edit
                  </Button>
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Voucher select */}
          <div className="mb-2">
            <label className="font-medium mb-1 block">Discount code</label>
            <Select
              placeholder="Select voucher"
              value={selectedVoucherId}
              onChange={setSelectedVoucherId}
              style={{ width: "100%" }}
              allowClear
              showSearch
              optionFilterProp="label"
              options={availableVouchers.map((v) => ({
                value: v._id,
                label: (
                  <div>
                    <span style={{ fontWeight: 600 }}>{v.code}</span>
                    <span style={{ color: "#888", marginLeft: 8 }}>
                      {v.type === "amount"
                        ? `Giảm ${v.discount.toLocaleString()}₫`
                        : `Giảm ${v.discount}%`}
                      {v.max_discount > 0
                        ? ` (tối đa ${v.max_discount.toLocaleString()}₫)`
                        : ""}
                      {v.min_order_value > 0
                        ? ` | Đơn từ ${v.min_order_value.toLocaleString()}₫`
                        : ""}
                    </span>
                  </div>
                ),
                description: v.description,
              }))}
            />
          </div>

          {/* Hiển thị giảm giá nếu có */}
          {discountAmount > 0 && (
            <div className="mb-2" style={{ color: "#16a34a", fontWeight: 500 }}>
              Đã giảm: -{discountAmount.toLocaleString()}₫
            </div>
          )}

          <p className="mb-2">Total price:</p>
          <p className="text-xl font-bold mb-4">
            {finalTotalPrice.toLocaleString()}₫
          </p>
          <Button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            disabled={selectedProductIds.length === 0}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Create Address Modal */}
      <Modal
        title="Add Address"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        destroyOnClose
        width={1100}
      >
        <CreateAddress
          onBack={() => {
            setShowCreateModal(false);
            fetchAddresses();
          }}
        />
      </Modal>

      {/* Update Address Modal */}
      <Modal
        title="Update Address"
        open={!!editingAddress}
        onCancel={() => setEditingAddress(null)}
        footer={null}
        destroyOnClose
        width={1100}
      >
        {editingAddress && (
          <UpdateAddress
            address={editingAddress}
            onBack={() => {
              setEditingAddress(null);
              fetchAddresses();
            }}
            onUpdated={fetchAddresses}
          />
        )}
      </Modal>
    </div>
  );
}
