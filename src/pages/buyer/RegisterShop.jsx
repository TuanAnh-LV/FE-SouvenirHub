import { useEffect, useState } from "react";
import { ProductService } from "../../services/shop-service/shop.service";
import { message } from "antd";

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
          message.info("You already registered a shop. Proceeding to step 2.");
          setApplication((prev) => ({ ...prev, shop_id: res.data._id }));
          setStep(2);
        }
      } catch {
        message.warning("No shop found. Please register a new one.");
      } finally {
        setLoading(false);
      }
    };

    checkExistingShop();
  }, []);

  const handleShopSubmit = async () => {
    try {
      const res = await ProductService.createShop(shopInfo);
      message.success("Shop registered successfully!");
      setApplication((prev) => ({ ...prev, shop_id: res.data.shop._id }));
      setStep(2);
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to register shop.");
    }
  };

  const handleApplicationSubmit = async () => {
    try {
      const formData = new FormData();
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
      message.success("Business application submitted successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Application submission failed."
      );
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1
            ? "🛍️ Step 1: Register Your Shop"
            : "📄 Step 2: Submit Business Application"}
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {["1. Shop Info", "2. Business Application"].map((label, index) => (
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
              <span className="font-medium">Shop Name *</span>
              <input
                type="text"
                required
                placeholder="Enter your shop name"
                value={shopInfo.name}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, name: e.target.value })
                }
                className="input input-bordered w-full mt-1"
              />
            </label>

            <label className="block">
              <span className="font-medium">Shop Description</span>
              <textarea
                placeholder="Brief description of your shop"
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
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Supplier Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Supplier Info</h3>
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
                  <span className="font-medium">Business Name *</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        business_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Business Category *</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
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
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="font-medium">Representative *</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        representative_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Business Email *</span>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({ ...application, email: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Phone Number *</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({ ...application, phone: e.target.value })
                    }
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="font-medium">
                    Warehouse or Office Address *
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
              <h3 className="text-xl font-semibold mb-4">Legal Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="font-medium">Tax ID *</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({ ...application, tax_id: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">
                    Representative's ID/Passport *
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        id_card_number: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="font-medium">Front of ID card</span>
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
                      alt="Front ID"
                      className="mt-2 max-h-20 rounded border"
                    />
                  )}
                </label>

                <label className="block">
                  <span className="font-medium">Back of ID card</span>
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
                      alt="Back ID"
                      className="mt-2 max-h-20 rounded border"
                    />
                  )}
                </label>

                <label className="block md:col-span-2">
                  <span className="font-medium">
                    Business License (PDF/Image) *
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
                      Selected: {application.license_file?.name}
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
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
