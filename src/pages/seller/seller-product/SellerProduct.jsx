import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
const { Title } = Typography;

const SellerProductsTable = lazy(() =>
  import("../../../components/seller/SellerProductsTable")
);

const SellerProduct = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/seller/create-product");
  };

  return (
    <div className="p-2 text-center">
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title level={2} style={{ margin: 0, textAlign: "left" }}>
            Quản lý sản phẩm
          </Title>
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
              transition: "all 0.2s",
            }}
            icon={<PlusOutlined style={{ color: "#fff", fontSize: "1rem" }} />}
            onMouseEnter={(e) => {
              e.target.style.background = "#d17c00";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#F99600";
              e.target.style.color = "#fff";
            }}
          >
            Thêm sản phẩm
          </Button>
        </div>
        <SellerProductsTable />
      </Card>
    </div>
  );
};

export default SellerProduct;
