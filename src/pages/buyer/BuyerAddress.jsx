import { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { AddressService } from "../../services/adress/address.service";
import CreateAddress from "../address/CreateAddress";
import UpdateAddress from "../address/UpdateAddress";

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [showCreateAddress, setShowCreateAddress] = useState(false);
  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      message.error("Không thể tải địa chỉ");
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setShowUpdateAddress(true);
  };

  if (showCreateAddress) {
    return <CreateAddress onBack={() => setShowCreateAddress(false)} />;
  }

  if (showUpdateAddress && selectedAddress) {
    return (
      <UpdateAddress
        address={selectedAddress}
        onBack={() => setShowUpdateAddress(false)}
        onUpdated={fetchAddresses}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Địa chỉ giao hàng</h3>
        <Button type="primary" onClick={() => setShowCreateAddress(true)}>
          Thêm địa chỉ
        </Button>
      </div>
      {addresses.length === 0 && (
        <div className="text-gray-500">Chưa có địa chỉ nào.</div>
      )}
      {addresses.map((address) => (
        <Card
          key={address._id}
          className="mb-4"
          style={{ background: "#fff", marginBottom: "16px" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-medium">
                {address.recipient_name} - {address.phone}
              </div>
              <div className="text-gray-700">{address.address_line}</div>
              <div className="text-gray-500 text-sm">
                {address.ward}, {address.district}, {address.city}
              </div>
            </div>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditAddress(address)}
            >
              Chỉnh sửa
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
