import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { ProductService } from "../../services/shop-service/shop.service";
import RegisterShopInfoStep from "../../components/stepRegisterShop/RegisterShopInfoStep";
import RegisterShopApplicationStep from "../../components/stepRegisterShop/RegisterShopApplicationStep";

export default function RegisterShop() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({ name: "", description: "" });
  const [application, setApplication] = useState({
    business_name: "",
    business_category: "",
    representative_name: "",
    email: "",
    phone: "",
    address: "",
    tax_id: "",
    id_card_number: "",
    logo_file: null,
    license_file: null,
    id_card_front: null,
    id_card_back: null,
    shop_id: null,
  });
  const shownRef = useRef(false);
  useEffect(() => {
    const checkExistingShop = async () => {
      try {
        const res = await ProductService.getCurrentShop();
        if (res?.data?._id) {
          if (!shownRef.current) {
            message.info("Bạn đã đăng ký cửa hàng, chuyển sang bước 2.");
            shownRef.current = true;
          }
          setApplication((prev) => ({ ...prev, shop_id: res.data._id }));
          setStep(2);
        }
      } catch {
        if (!shownRef.current) {
          message.warning("Không tìm thấy cửa hàng. Vui lòng đăng ký mới.");
          shownRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    };

    checkExistingShop();
  }, []);
  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1
            ? "🛍️ Bước 1: Đăng ký cửa hàng"
            : "📄 Bước 2: Gửi hồ sơ doanh nghiệp"}
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {["1. Thông tin cửa hàng", "2. Hồ sơ doanh nghiệp"].map(
            (label, index) => (
              <div
                key={label}
                className={`px-4 py-2 rounded-full font-semibold ${
                  step === index + 1
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>

        {step === 1 ? (
          <RegisterShopInfoStep
            shopInfo={shopInfo}
            setShopInfo={setShopInfo}
            setStep={setStep}
            setApplication={setApplication}
          />
        ) : (
          <RegisterShopApplicationStep
            application={application}
            setApplication={setApplication}
          />
        )}
      </div>
    </div>
  );
}
