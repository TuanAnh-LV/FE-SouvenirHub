import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { AddressService } from "../../services/adress/address.service";
import { Form, Input, Button, message, Checkbox, Row, Col } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";

// Fix default marker icon for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const center = { lat: 10.762622, lng: 106.660172 }; // Default to HCM

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function CreateAddress({ onBack }) {
  const [form] = Form.useForm();
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMe, setIsMe] = useState(false);

  // Lấy userInfo từ localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Lấy địa chỉ từ lat/lng bằng Nominatim
  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      const data = await response.json();
      if (data && data.address) {
        form.setFieldsValue({
          address_line: data.display_name || "",
          city: data.address.city || data.address.town || data.address.village || "",
          district:
            data.address.district ||
            data.address.city_district ||
            data.address.county ||
            data.address.state_district ||
            data.address.region ||
            "",
          ward: data.address.suburb || data.address.neighbourhood || "",
        });
      }
    } catch (err) {
      message.error("Không thể lấy địa chỉ từ bản đồ.");
      console.error("Error fetching address:", err);
    }
  };

  const handleMapClick = async (latlng) => {
    setMarker(latlng);
    form.setFieldsValue({ lat: latlng.lat, lng: latlng.lng });
    await fetchAddressFromLatLng(latlng.lat, latlng.lng);
  };

  const handleFinish = async (values) => {
    // Loại bỏ lat và lng khỏi data gửi lên backend
    // eslint-disable-next-line no-unused-vars
    const { lat, lng, ...addressData } = values;

    // Kiểm tra dữ liệu gửi đi
    console.log("Data gửi lên backend:", addressData);

    if (
      (!addressData.address_line || !addressData.city || !addressData.ward)
    ) {
      message.error("Vui lòng nhập đầy đủ địa chỉ hoặc chọn trên bản đồ.");
      return;
    }

    setLoading(true);
    try {
      await AddressService.createAddress(addressData);
      message.success("Tạo địa chỉ thành công!");
      form.resetFields();
      setMarker(null);
      setIsMe(false); // Reset trạng thái checkbox "Người nhận là tôi"
    } catch (err) {
      message.error("Tạo địa chỉ thất bại.");
      console.error("Error creating address:", err);
    }
    setLoading(false);
  };

  // Khi check "Người nhận là tôi"
const handleCheckMe = (e) => {
  setIsMe(e.target.checked);
  if (e.target.checked && userInfo.name && userInfo.phone) {
    form.setFieldsValue({
      recipient_name: userInfo.name,
      phone: userInfo.phone,
    });
  } else if (!e.target.checked) {
    form.setFieldsValue({
      recipient_name: "",
      phone: "",
    });
  }
};

  return (
    <div className="py-10 px-6 md:px-20">
      <div className="md:col-span-1  bg-[#FFE1D6] rounded-xl shadow p-8 space-y-8">
        {/* Nút quay lại nằm bên trái, trên tiêu đề */}
        {onBack && (
          <div className="mb-2">
            <Button
              onClick={onBack}
              type="text"
              icon={<LeftOutlined />}
              style={{
                background: "#FFE1D6",
                border: "none",
                color: "#d46b08",
                boxShadow: "none",
                fontWeight: 500,
                paddingLeft: 0,
              }}
            >
              Quay lại
            </Button>
          </div>
        )}
        <h2 className="text-2xl font-bold">Địa chỉ</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            recipient_name: "",
            phone: "",
            address_line: "",
            city: "",
            district: "",
            ward: "",
            lat: null,
            lng: null,
          }}
        >
          <Row gutter={32}>
            {/* Form fields bên trái */}
            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Row align="middle" gutter={8}>
                        <Col>Tên người nhận</Col>
                        <Col>
                          <Checkbox checked={isMe} onChange={handleCheckMe}>
                            Người nhận là tôi
                          </Checkbox>
                        </Col>
                      </Row>
                    }
                    name="recipient_name"
                    rules={[{ required: true, message: "Please enter recipient name" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Please enter phone" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Điạ chỉ"
                name="address_line"
                rules={[{ required: true, message: "Please enter address line" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Thành phố"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="District"
                name="district"
                rules={[{ required: false, message: "Please enter district" }]}
                hidden      
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quân / Huyện"
                name="ward"
                rules={[{ required: true, message: "Please enter ward" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Thêm địa chỉ
                </Button>
              </Form.Item>
            </Col>
            {/* Map bên phải */}
            <Col span={12}>
              <Form.Item label="Location">
                <div style={{ marginBottom: 8 }}>
                  <MapContainer
                    center={marker || center}
                    zoom={14}
                    style={{ width: "100%", height: 350 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onSelect={handleMapClick} />
                    {marker && <Marker position={marker} />}
                  </MapContainer>
                </div>
                <div style={{ fontSize: 12 }}>
                  {marker
                    ? `Selected Location: (${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)})`
                    : "Click on the map to select a location"}
                </div>
                <Form.Item name="lat" noStyle>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="lng" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}