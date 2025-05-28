import { useCallback, useEffect, useState, lazy } from "react";
import { Checkbox, Radio } from "antd";
import { ProductService } from "../../services/product-service/product.service";
const ProductGrid = lazy(() => import("../../components/product/AllProduct"));

const AllProductPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await ProductService.getAll();
      setProducts(response.data); 
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div className="main mt-7 mx-auto p-4 bg-white flex" style={{ marginLeft: "10%", marginRight: "10%" }}>
      {/* Filter Panel */}
      <div className="w-[250px] pr-6 flex flex-col gap-6">
        <h3 className="text-lg font-semibold mb-4">BỘ LỌC</h3>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Địa điểm</h4>
          <Checkbox.Group
            options={["Hồ Chí Minh", "Hà Nội", "Huế", "Đà Nẵng", "Khác"]}
            className="flex flex-col gap-2"
          />
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Quà Tặng</h4>
          <Checkbox.Group
            options={["Cho cá nhân", "Cho doanh nghiệp"]}
            className="flex flex-col gap-2"
          />
        </div>

        <div>
          <h4 className="font-medium mb-2">Giá cả</h4>
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="100-400">Từ 100k đến 400k</Radio>
            <Radio value="400-1000">Từ 400k đến 1tr</Radio>
            <Radio value=">1000">Trên 1tr</Radio>
          </Radio.Group>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        
        <ProductGrid products={products} />
        
      </div>
    </div>
  );
};

export default AllProductPage;
