import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
const SellerProductsTable = lazy(() => import("../../../components/seller/SellerProductsTable"));

const SellerProduct = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/seller/create-product");
  };

  return (
    <div className="p-10 text-center">
      <div className="text-2xl font-semibold text-green-600 mb-6">
        🛍️ Đây là trang Seller Products
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <Button
          type="primary"
          onClick={handleAddProduct}
          style={{
            background: "#F99600",
            color: "#fff",
            border: "none",
            fontSize: "1rem",
            padding: "1rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            transition: "all 0.2s",
          }}
          icon={<PlusOutlined style={{ color: "#fff", fontSize: "1rem" }} />}
          onMouseEnter={e => {
            e.target.style.background = "#d17c00";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.background = "#F99600";
            e.target.style.color = "#fff";
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <SellerProductsTable />
    </div>
  );
};

export default SellerProduct;
