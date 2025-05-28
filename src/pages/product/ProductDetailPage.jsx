import { lazy } from "react";
// const AboutShop = lazy(() => import("../../components/product/AboutShop"));
const ProductDetail = lazy(() => import("../../components/product/ProductDetail"));

const ProductDetailPage = () => {
  
  
  return (
    <>
    <ProductDetail/>
    {/* <AboutShop/> */}
    </>
  );
};

export default ProductDetailPage;
