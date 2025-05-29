import { Button } from "antd";
import { useNavigate } from "react-router-dom";

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
      <Button type="primary" onClick={handleAddProduct}>
        Thêm sản phẩm
      </Button>
    </div>
  );
};

export default SellerProduct;
