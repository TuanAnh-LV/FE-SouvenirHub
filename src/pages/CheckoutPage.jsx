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
import VoucherSelect from "../components/checkout/VoucherSelect";
import PaymentOptions from "../components/checkout/PaymentOptions";
import SummaryBox from "../components/checkout/SummaryBox";

const parsePrice = (priceObj) =>
  parseFloat(priceObj?.$numberDecimal || priceObj || 0);

export default function CheckoutPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const navigate = useNavigate();

  const [editingAddress, setEditingAddress] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [selectedGroups, setSelectedGroups] = useState([]); // group = { shop_name, items[] }
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucherList, setVoucherList] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  // const shippingFee = 16500;

  function groupItemsByShop(items) {
    const groupMap = {};

    for (const item of items) {
      const product = item.product || item.product_id;
      const shop = product.shop_id;
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
        product,
        quantity: item.quantity,
        variant: item.variant,
        price: item.price || item.variant?.price || product?.price,
      });
    }

    return Object.values(groupMap);
  }

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
        console.error(err);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const totalProductPrice = selectedGroups.reduce((sum, group) => {
    return (
      sum +
      group.items.reduce((groupSum, item) => {
        const price = parsePrice(item.price);
        return groupSum + price * item.quantity;
      }, 0)
    );
  }, 0);

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
      const updateOrder = await OrderService.updateOrder(orderId, {
        shipping_address_id: selectedAddressId,
        voucher_id: selectedVoucherId,
      });

      if (paymentMethod === "momo") {
        const payRes = await PaymentService.createMomo({ order_id: orderId });
        window.location.href = payRes.data.payUrl;
      } else if (paymentMethod === "payos") {
        // Gọi API tạo thanh toán PayOS
        const payosRes = await PaymentService.createPayOS({
          amount: finalTotal,
          orderCode: updateOrder.data.order.order_code,
          description: `Thanh toán ${updateOrder.data.order.order_code}`,
          returnUrl: window.location.origin + "/payment-success",
          cancelUrl: window.location.origin + "/payment-cancel",
        });
        console.log(updateOrder.data.order.order_code);
        window.location.href = payosRes.data.data.checkoutUrl; // chuyển hướng sang PayOS
        console.log(payosRes.data.data.checkoutUrl);
      } else {
        await PaymentService.mockPay({ order_id: orderId });
        message.success("Đặt hàng thành công!");
        navigate("/buyer/dashboard");
      }
    } catch (err) {
      console.error(err);
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
  const finalTotal = totalProductPrice - discountAmount;

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
        <VoucherSelect
          vouchers={voucherList.filter(
            (voucher) =>
              !voucher.shop_id ||
              selectedGroups.some((group) => group.shop_id === voucher.shop_id)
          )}
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
          // shippingFee={shippingFee}
          discount={discountAmount}
          finalAmount={finalTotal}
          onConfirm={handleSubmit}
        />
      </div>
    </div>
  );
}
