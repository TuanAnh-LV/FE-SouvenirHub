import { useState } from "react";
import { message } from "antd";
import { ProductService } from "../../services/shop-service/shop.service";
import { useNavigate } from "react-router-dom";
function FileUploadBox({ id, label, onFileSelect, preview }) {
  return (
    <label
      htmlFor={id}
      className="h-[200px] w-full relative cursor-pointer border-2 border-dashed border-gray-300 p-4 rounded-xl shadow-[0_48px_35px_-48px_rgba(232,232,232,0.3)] overflow-hidden flex items-center justify-center"
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="object-contain w-full h-full"
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 fill-gray-300"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 1C9.73 1 9.48 1.11 9.29 1.29L3.29 7.29C3.11 7.48 3 7.73 3 8V20C3 21.66 4.34 23 6 23H7C7.55 23 8 22.55 8 22C8 21.45 7.55 21 7 21H6C5.45 21 5 20.55 5 20V9H10C10.55 9 11 8.55 11 8V3H18C18.55 3 19 3.45 19 4V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 2.34 19.66 1 18 1H10ZM9 7H6.41L9 4.41V7ZM14 15.5C14 14.12 15.12 13 16.5 13C17.88 13 19 14.12 19 15.5V16V17H20C21.1 17 22 17.9 22 19C22 20.1 21.1 21 20 21H13C11.9 21 11 20.1 11 19C11 17.9 11.9 17 13 17H14V16V15.5ZM16.5 11C14.14 11 12.21 12.81 12.02 15.12C10.28 15.56 9 17.13 9 19C9 21.21 10.79 23 13 23H20C22.21 23 24 21.21 24 19C24 17.13 22.72 15.56 20.98 15.12C20.79 12.81 18.86 11 16.5 11Z"
            />
          </svg>
          <span className="font-normal text-gray-300 text-sm text-center">
            {label}
          </span>
        </div>
      )}
      <input id={id} type="file" className="hidden" onChange={onFileSelect} />
    </label>
  );
}

export default function RegisterShopApplicationStep({
  application,
  setApplication,
}) {
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [previewLicense, setPreviewLicense] = useState(null);
  const navigate = useNavigate();
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
      message.success("Gửi hồ sơ thành công! Vui lòng chờ admin xác nhận");
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.error || "Gửi hồ sơ thất bại.");
    }
  };

  const inputClass =
    "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition";

  return (
    <div className="space-y-10">
      <h3 className="text-xl font-semibold mb-4">Thông tin nhà cung cấp</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="font-medium">Logo *</span>
          <FileUploadBox
            id="logoUpload"
            label="Tải lên logo doanh nghiệp"
            preview={previewLogo}
            onFileSelect={(e) => {
              const file = e.target.files[0];
              if (file) {
                setApplication({ ...application, logo_file: file });
                setPreviewLogo(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        <label className="block">
          <span className="font-medium">Tên doanh nghiệp *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, business_name: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="font-medium">Lĩnh vực kinh doanh *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({
                ...application,
                business_category: e.target.value,
              })
            }
          />
        </label>
      </div>

      <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="font-medium">Người đại diện *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({
                ...application,
                representative_name: e.target.value,
              })
            }
          />
        </label>

        <label className="block">
          <span className="font-medium">Email doanh nghiệp *</span>
          <input
            type="email"
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, email: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="font-medium">Số điện thoại *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, phone: e.target.value })
            }
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-medium">Địa chỉ kho hoặc văn phòng *</span>
          <textarea
            rows={4}
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, address: e.target.value })
            }
          />
        </label>
      </div>

      <h3 className="text-xl font-semibold mb-4">Thông tin pháp lý</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="font-medium">Mã số thuế *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, tax_id: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="font-medium">CMND/CCCD/Hộ chiếu *</span>
          <input
            type="text"
            className={inputClass}
            onChange={(e) =>
              setApplication({ ...application, id_card_number: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="font-medium">Ảnh mặt trước CCCD</span>
          <FileUploadBox
            id="cccdFront"
            label="Ảnh mặt trước CCCD"
            preview={previewFront}
            onFileSelect={(e) => {
              const file = e.target.files[0];
              if (file) {
                setApplication({ ...application, id_card_front: file });
                setPreviewFront(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        <label className="block">
          <span className="font-medium">Ảnh mặt sau CCCD</span>
          <FileUploadBox
            id="cccdBack"
            label="Ảnh mặt sau CCCD"
            preview={previewBack}
            onFileSelect={(e) => {
              const file = e.target.files[0];
              if (file) {
                setApplication({ ...application, id_card_back: file });
                setPreviewBack(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-medium">Giấy phép kinh doanh *</span>
          <FileUploadBox
            id="licenseUpload"
            label="Tải lên giấy phép kinh doanh (ảnh hoặc PDF)"
            preview={previewLicense}
            onFileSelect={(e) => {
              const file = e.target.files[0];
              if (file) {
                setApplication({ ...application, license_file: file });
                setPreviewLicense(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>

      <div>
        <button
          onClick={handleApplicationSubmit}
          className="w-full py-3 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          Gửi hồ sơ
        </button>
      </div>
    </div>
  );
}
