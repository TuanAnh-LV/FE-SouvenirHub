/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { AddressService } from "../../services/adress/address.service";
import { Form, Input, Button, message, Checkbox, Row, Col } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";

// Fix icon marker cho leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const center = { lat: 10.762622, lng: 106.660172 }; // Mặc định TP.HCM

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function UpdateAddress({ address, onBack, onUpdated }) {
  const [form] = Form.useForm();
  const [marker, setMarker] = useState(
    address?.lat && address?.lng ? { lat: address.lat, lng: address.lng } : null
  );
  const [loading, setLoading] = useState(false);
  const [isMe, setIsMe] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    if (address) {
      form.setFieldsValue({
        recipient_name: address.recipient_name || "",
        phone: address.phone || "",
        address_line: address.address_line || "",
        city: address.city || "",
        district: address.district || "",
        ward: address.ward || "",
        lat: address.lat || null,
        lng: address.lng || null,
      });

      setMarker(
        address.lat && address.lng
          ? { lat: address.lat, lng: address.lng }
          : null
      );

      if (
        userInfo &&
        address.recipient_name === userInfo.name &&
        address.phone === userInfo.phone
      ) {
        setIsMe(true);
      } else {
        setIsMe(false);
      }
    }
  }, [address, form, userInfo]);

  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      const data = await response.json();
      if (data?.address) {
        form.setFieldsValue({
          address_line: data.display_name || "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
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
      console.error("Lỗi khi lấy địa chỉ:", err);
    }
  };

  const handleMapClick = async (latlng) => {
    setMarker(latlng);
    form.setFieldsValue({ lat: latlng.lat, lng: latlng.lng });
    await fetchAddressFromLatLng(latlng.lat, latlng.lng);
  };

  const handleFinish = async (values) => {
    const { lat, lng, ...addressData } = values;

    if (!addressData.address_line || !addressData.city || !addressData.ward) {
      message.error("Vui lòng nhập đầy đủ địa chỉ hoặc chọn trên bản đồ.");
      return;
    }

    setLoading(true);
    try {
      await AddressService.updateAddress(address._id, addressData);
      message.success("Cập nhật địa chỉ thành công!");
      if (onUpdated) onUpdated();
      if (onBack) onBack();
    } catch (err) {
      message.error("Cập nhật địa chỉ thất bại.");
      console.error("Lỗi cập nhật địa chỉ:", err);
    }
    setLoading(false);
  };

  const handleCheckMe = (e) => {
    setIsMe(e.target.checked);
    if (e.target.checked && userInfo.name && userInfo.phone) {
      form.setFieldsValue({
        recipient_name: userInfo.name,
        phone: userInfo.phone,
      });
    } else {
      form.setFieldsValue({
        recipient_name: "",
        phone: "",
      });
    }
  };

  return (
    <div className="py-8 px-4 md:px-10">
      <div className="bg-white rounded-xl shadow-md border p-6 space-y-6">
        {onBack && (
          <Button
            onClick={onBack}
            icon={<LeftOutlined />}
            type="default"
            size="small"
            style={{ marginBottom: 8 }}
          >
            Trở lại
          </Button>
        )}

        <h2 className="text-xl font-bold">Cập nhật địa chỉ</h2>

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
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ và tên người nhận"
                name="recipient_name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ tên đầy đủ" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ cụ thể"
                name="address_line"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
                ]}
              >
                <Input placeholder="VD: 123 đường Lê Lợi, phường 7, quận 3" />
              </Form.Item>

              <Form.Item
                label="Thành phố / Tỉnh"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng nhập thành phố / tỉnh" },
                ]}
              >
                <Input placeholder="VD: TP. Hồ Chí Minh" />
              </Form.Item>

              <Form.Item label="Quận / Huyện" name="district" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                label="Phường / Xã"
                name="ward"
                rules={[
                  { required: true, message: "Vui lòng nhập phường / xã" },
                ]}
              >
                <Input placeholder="VD: Phường 1" />
              </Form.Item>

              <Form.Item>
                <Checkbox checked={isMe} onChange={handleCheckMe}>
                  Người nhận là tôi
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Cập nhật địa chỉ
                </Button>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Chọn vị trí trên bản đồ">
                <div
                  style={{
                    marginBottom: 8,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <MapContainer
                    center={marker || center}
                    zoom={14}
                    style={{ width: "100%", height: 300 }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker onSelect={handleMapClick} />
                    {marker && <Marker position={marker} />}
                  </MapContainer>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {marker
                    ? `Đã chọn: (${marker.lat.toFixed(5)}, ${marker.lng.toFixed(
                        5
                      )})`
                    : "Bấm vào bản đồ để chọn vị trí giao hàng"}
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
