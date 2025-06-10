// 📁 src/pages/checkout/CheckoutPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { CartService } from "../services/cart/cart.service";
import { VoucherService } from "../services/voucher/voucher.service";
import { PaymentService } from "../services/payment/payment.service";
import { AddressService } from "../services/adress/address.service";
import { OrderService } from "../services/order/order.service";

import CreateAddress from "../pages/address/CreateAddress";
import UpdateAddress from "../pages/address/UpdateAddress";

import AddressBox from "../components/checkout/AddressBox";
import ProductList from "../components/checkout/ProductList";
import NoteAndShipping from "../components/checkout/NoteAndShipping";
import VoucherSelect from "../components/checkout/VoucherSelect";
import PaymentOptions from "../components/checkout/PaymentOptions";
import SummaryBox from "../components/checkout/SummaryBox";

const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function CheckoutPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const navigate = useNavigate();
  // const selectedProductIds = location.state?.selectedProductIds || [];

  const [editingAddress, setEditingAddress] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [selectedGroups, setSelectedGroups] = useState([]); // group = { shop_name, items[] }
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucherList, setVoucherList] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const shippingFee = 16500;
  function groupItemsByShop(items) {
    const groupMap = {};

    for (const item of items) {
      const shop = item.product_id.shop_id;
      const shopId = typeof shop === "object" ? shop._id : shop;
      const shopName = typeof shop === "object" ? shop.name : "Shop";

      if (!groupMap[shopId]) {
        groupMap[shopId] = {
          shop_id: shopId,
          shop_name: shopName,
          items: [],
        };
      }

      groupMap[shopId].items.push({
        product: item.product_id,
        quantity: item.quantity,
      });
    }

    return Object.values(groupMap);
  }

  // 📦 Lấy danh sách sản phẩm đã chọn theo từng shop
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await OrderService.getOrderById(orderId);
        const order = res.data;

        const grouped = groupItemsByShop(order.items);
        setSelectedGroups(grouped);

        setSelectedAddressId(order.shipping_address_id);
      } catch (err) {
        message.error("Không thể tải thông tin đơn hàng");
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // 🧾 Tính tổng tiền sản phẩm
  const totalProductPrice = selectedGroups.reduce((sum, group) => {
    return (
      sum +
      group.items.reduce((groupSum, item) => {
        const price = parsePrice(item.product?.price);
        return groupSum + price * item.quantity;
      }, 0)
    );
  }, 0);

  // 🏠 Lấy địa chỉ
  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      const list = res.data || [];
      setAddresses(list);
      if (list.length > 0) {
        setSelectedAddressId((prev) => prev || list[0]._id);
      }
    } catch {
      message.error("Không thể tải danh sách địa chỉ");
    }
  };

  useEffect(() => {
    async function fetchInitialData() {
      const [addressRes, voucherRes] = await Promise.all([
        AddressService.getAddresses(),
        VoucherService.getAll(),
      ]);
      const addressesData = addressRes.data || [];
      setAddresses(addressesData);

      if (addressesData.length > 0) {
        setSelectedAddressId((prev) => prev || addressesData[0]._id);
      }

      setVoucherList(voucherRes.data || []);
    }

    fetchInitialData();
  }, []);

  const handleSubmit = async () => {
    if (!orderId) {
      return message.warning("Không tìm thấy order_id để thanh toán");
    }

    try {
      if (paymentMethod === "momo") {
        const payRes = await PaymentService.createMomo({ order_id: orderId });
        window.location.href = payRes.data.payUrl;
      } else {
        await PaymentService.mockPay({ order_id: orderId });
        message.success("Đặt hàng thành công!");
        navigate("/orders");
      }
    } catch (err) {
      message.error("Thanh toán thất bại");
    }
  };

  const getVoucherDiscount = () => {
    const selectedVoucher = voucherList.find(
      (v) => v._id === selectedVoucherId
    );
    if (!selectedVoucher) return 0;

    if (selectedVoucher.type === "percent") {
      return (totalProductPrice * selectedVoucher.discount) / 100;
    }

    return selectedVoucher.discount || 0;
  };
  const discountAmount = getVoucherDiscount();
  const finalTotal = totalProductPrice + shippingFee - discountAmount;

  return (
    <div className="p-8 bg-[#fafafa]">
      <div className="mb-6 mt-3">
        <AddressBox
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          onEdit={(address) => setEditingAddress(address)}
          onAdd={() => setShowCreateModal(true)}
        />
      </div>

      <Modal
        open={!!editingAddress}
        title="Cập nhật địa chỉ"
        footer={null}
        onCancel={() => setEditingAddress(null)}
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

      {/* Modal tạo mới */}
      <Modal
        open={showCreateModal}
        title="Thêm địa chỉ mới"
        footer={null}
        onCancel={() => setShowCreateModal(false)}
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

      {selectedGroups.map((group) => (
        <div key={group.shop_id} className="mb-6">
          <ProductList items={group.items} shopName={group.shop_name} />
        </div>
      ))}

      <div className="mb-6">
        <NoteAndShipping
          note={note}
          setNote={setNote}
          shippingFee={shippingFee}
        />
      </div>

      <div className="mb-6">
        <VoucherSelect
          vouchers={voucherList}
          selectedVoucherId={selectedVoucherId}
          setSelectedVoucherId={setSelectedVoucherId}
          orderTotal={totalProductPrice}
        />
      </div>

      <div className="mb-6">
        <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <div>
        <SummaryBox
          totalPrice={totalProductPrice}
          shippingFee={shippingFee}
          discount={discountAmount}
          finalAmount={finalTotal}
          onConfirm={handleSubmit}
        />
      </div>
    </div>
  );
}
