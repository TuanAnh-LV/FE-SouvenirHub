import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OrderService } from "../services/order/order.service";

export default function PaymentSuccess() {
  const location = useLocation();

  // Lấy orderId từ query hoặc state (tùy bạn truyền thế nào)
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    // Gọi API cập nhật status
    if (orderId) {
        OrderService.updateOrderStatus(orderId, "processing");
    }
  }, [orderId]);


  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2 style={{ color: "green" }}>Thanh toán thành công!</h2>
    </div>
  );
}