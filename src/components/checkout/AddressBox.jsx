// AddressBox.jsx
import { Card, Select, Button } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

export default function AddressBox({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onEdit,
  onAdd,
}) {
  const selected = addresses.find((a) => a._id === selectedAddressId);

  return (
    <Card
      title="Địa chỉ giao hàng"
      bordered={false}
      className="rounded-xl shadow-sm "
    >
      <div className="flex items-center gap-3">
        <Select
          value={selectedAddressId}
          onChange={setSelectedAddressId}
          style={{ flex: 1 }}
          placeholder="Chọn địa chỉ giao hàng"
        >
          {addresses.map((addr) => (
            <Select.Option key={addr._id} value={addr._id}>
              {addr.recipient_name} - {addr.address_line}, {addr.ward},{" "}
              {addr.city}
            </Select.Option>
          ))}
        </Select>

        {onEdit && selected && (
          <Button icon={<EditOutlined />} onClick={() => onEdit(selected)}>
            Chỉnh sửa
          </Button>
        )}

        {onAdd && (
          <Button icon={<PlusOutlined />} onClick={onAdd} type="dashed">
            Thêm mới
          </Button>
        )}
      </div>
    </Card>
  );
}
