import { useCallback, useEffect, useState, lazy } from "react";
import { ProductService } from "../../services/shop-service/shop.service";
import { useParams } from "react-router-dom";

const ProductGrid = lazy(() => import("../../components/product/AllProduct"));
const ShopDescripton = lazy(() =>
  import("../../components/ShopProfile/ShopDescription")
);

const ShopProfile = () => {
  const [products, setProducts] = useState([]);
  const [shopProfile, setShopProfile] = useState();
  const { id } = useParams();

  const fetchProductByShopId = useCallback(async () => {
    try {
      const response = await ProductService.getShopById(id);
      setShopProfile(response.data.shop);
      console.log("Shop profile fetched:", response.data);
      // Ensure products is always an array
      const arr =
        Array.isArray(response.data.products) &&
        response.data.products.length > 0
          ? response.data.products
          : [];
      setProducts(arr);
      console.log("Products shop fetched:", arr);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProducts([]); // fallback to empty array on error
    }
  }, [id]);

  useEffect(() => {
    fetchProductByShopId();
  }, [fetchProductByShopId]);

  return (
    <div
      className="mx-auto p-4 flex"
      style={{ marginLeft: "10%", marginRight: "10%" }}
    >
      {/* Product Grid */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ marginTop: "5%", marginBottom: "10%" }}
      >
        <ShopDescripton shop={shopProfile} />
        <div style={{ height: 32 }} />{" "}
        {/* Gap between ShopDescripton and ProductGrid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ShopProfile;
