// NoteAndShipping.jsx
import { Card, Input } from "antd";

export default function NoteAndShipping({ note, setNote, shippingFee }) {
  return (
    <Card
      title="Lưu ý & Vận chuyển"
      bordered={false}
      className="rounded-xl shadow-sm"
    >
      <Input.TextArea
        rows={3}
        placeholder="Lưu ý cho người bán (nếu có)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="mt-4 text-sm text-gray-600">
        Phí vận chuyển:{" "}
        <span className="font-semibold">{shippingFee.toLocaleString()}₫</span>{" "}
        (dự kiến)
      </div>
    </Card>
  );
}
