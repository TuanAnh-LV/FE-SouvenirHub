import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductService } from "../../services/shop-service/shop.service";

export default function RegisterShop() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [previewLicense, setPreviewLicense] = useState(null);

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

  useEffect(() => {
    const checkExistingShop = async () => {
      try {
        const res = await ProductService.getCurrentShop();
        if (res?.data?._id) {
          toast.info("Bạn đã đăng ký shop. Chuyển sang bước 2.");
          setApplication((prev) => ({ ...prev, shop_id: res.data._id }));
          setStep(2);
        }
      } catch {
        toast.error("Chưa có shop, cần đăng ký mới.");
      } finally {
        setLoading(false);
      }
    };

    checkExistingShop();
  }, []);

  const handleShopSubmit = async () => {
    try {
      const res = await ProductService.createShop(shopInfo);
      toast.success("Đăng ký shop thành công!");
      setApplication((prev) => ({ ...prev, shop_id: res.data.shop._id }));
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi đăng ký shop");
    }
  };

  const handleApplicationSubmit = async () => {
    try {
      const formData = new FormData();

      // Append string fields
      const stringFields = [
        "shop_id",
        "business_name",
        "business_category",
        "representative_name",
        "email",
        "phone",
        "address",
        "tax_id",
        "id_card_number",
      ];

      stringFields.forEach((field) => {
        if (application[field]) {
          formData.append(field, application[field]);
        }
      });

      // Append files if valid
      if (application.logo_file instanceof File) {
        formData.append("logo_file", application.logo_file);
      }
      if (application.license_file instanceof File) {
        formData.append("license_file", application.license_file);
      }
      if (application.id_card_front instanceof File) {
        formData.append("id_card_front", application.id_card_front);
      }
      if (application.id_card_back instanceof File) {
        formData.append("id_card_back", application.id_card_back);
      }

      await ProductService.createShopApplication(formData);
      toast.success("Nộp hồ sơ doanh nghiệp thành công!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi nộp hồ sơ");
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1
            ? "🛍️ Bước 1: Đăng ký Shop"
            : "📄 Bước 2: Nộp hồ sơ doanh nghiệp"}
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {["1. Đăng ký shop", "2. Hồ sơ doanh nghiệp"].map((label, index) => (
            <div
              key={label}
              className={`px-4 py-2 rounded-full font-semibold ${
                step === index + 1 ? "bg-orange-400 text-white" : "bg-gray-200"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <label className="block">
              <span className="font-medium">Tên shop *</span>
              <input
                type="text"
                required
                placeholder="Nhập tên shop của bạn"
                value={shopInfo.name}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, name: e.target.value })
                }
                className="input input-bordered w-full mt-1"
              />
            </label>

            <label className="block">
              <span className="font-medium">Mô tả shop</span>
              <textarea
                placeholder="Mô tả ngắn về shop"
                value={shopInfo.description}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, description: e.target.value })
                }
                className="textarea textarea-bordered w-full mt-1"
              />
            </label>

            <button
              onClick={handleShopSubmit}
              className="btn btn-primary w-full text-lg"
              disabled={!shopInfo.name}
            >
              Tiếp tục
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Supplier Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Thông tin nhà cung cấp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="font-medium">Logo *</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setApplication({ ...application, logo_file: file });
                        setPreviewLogo(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {previewLogo && (
                    <img
                      src={previewLogo}
                      alt="Logo"
                      className="mt-2 max-h-20 rounded border"
                    />
                  )}
                </label>

                <label className="block">
                  <span className="font-medium">Tên nhà cung cấp *</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        business_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Danh mục kinh doanh *</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        business_category: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="font-medium">Người đại diện *</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        representative_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Email Doanh Nghiệp *</span>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({ ...application, email: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Số điện thoại *</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({ ...application, phone: e.target.value })
                    }
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="font-medium">
                    Địa chỉ của Kho hoặc Trụ sở *
                  </span>
                  <textarea
                    className="textarea textarea-bordered w-full mt-1"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        address: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
            </div>

            {/* Legal Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin pháp lý</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="font-medium">Mã số thuế (MST) *</span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({ ...application, tax_id: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">
                    CMND/CCCD của người đại diện *
                  </span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        id_card_number: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Ảnh mặt trước CCCD</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setApplication({ ...application, id_card_front: file });
                        setPreviewFront(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {previewFront && (
                    <img
                      src={previewFront}
                      alt="CCCD trước"
                      className="mt-2 max-h-20 rounded border"
                    />
                  )}
                </label>

                <label className="block">
                  <span className="font-medium">Ảnh mặt sau CCCD</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setApplication({ ...application, id_card_back: file });
                        setPreviewBack(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {previewBack && (
                    <img
                      src={previewBack}
                      alt="CCCD sau"
                      className="mt-2 max-h-20 rounded border"
                    />
                  )}
                </label>

                <label className="block md:col-span-2">
                  <span className="font-medium">
                    Giấy phép kinh doanh (PDF/Ảnh) *
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setApplication({ ...application, license_file: file });
                        setPreviewLicense(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {previewLicense && (
                    <span className="mt-2 block text-sm text-gray-600">
                      Đã chọn: {application.license_file?.name}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div>
              <button
                onClick={handleApplicationSubmit}
                className="btn btn-success w-full text-lg"
              >
                Nộp hồ sơ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
