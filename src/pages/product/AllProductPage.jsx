import { useCallback, useEffect, useState, lazy } from "react";
import { Checkbox, Radio, Input } from "antd";
import { ProductService } from "../../services/product-service/product.service";
const ProductGrid = lazy(() => import("../../components/product/AllProduct"));

const priceOptions = [
  { label: "Tất cả", value: "" },
  { label: "Từ 100k đến 400k", value: "100-400" },
  { label: "Từ 400k đến 1tr", value: "400-1000" },
  { label: "Trên 1tr", value: ">1000" },
];

const AllProductPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(""); // tên sản phẩm
  const [priceRange, setPriceRange] = useState(""); // giá trị radio

  // Xử lý giá trị min/max theo radio
  const getPriceFilter = () => {
    if (priceRange === "100-400") return { minPrice: 100000, maxPrice: 400000 };
    if (priceRange === "400-1000") return { minPrice: 400000, maxPrice: 1000000 };
    if (priceRange === ">1000") return { minPrice: 1000000, maxPrice: 0 };
    return { minPrice: 0, maxPrice: 0 };
  };

  const fetchProduct = useCallback(async (searchValue = search) => {
    const { minPrice, maxPrice } = getPriceFilter();
    try {
      const response = await ProductService.getAll({
        name: searchValue,
        minPrice,
        maxPrice,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [priceRange, search]); // chỉ cần priceRange, search để lấy giá trị hiện tại

  // Gọi fetchProduct lần đầu khi vào trang
  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, []);


  const handleSearch = () => {
    fetchProduct(search, priceRange);
  };

  // Xử lý khi đổi filter giá
  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
    // KHÔNG gọi fetchProduct ở đây
  };

  return (
    <div className="main mt-7 mx-auto p-4 bg-white flex" style={{ marginLeft: "5%", marginRight: "5%" }}>
      {/* Filter Panel */}
      <div className="w-[250px] pr-6 flex flex-col gap-6">
        <h3 className="text-lg font-semibold mb-1">BỘ LỌC</h3>
        <hr style={{ marginTop: 0, marginBottom: "3%" }} />
        <div>
          <h4 className="font-medium mb-2">Giá cả</h4>
          <Radio.Group
            className="flex flex-col gap-2"
            value={priceRange}
            onChange={handlePriceChange}
          >
            {priceOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
            ))}
          </Radio.Group>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Thanh search */}
        <div className="mb-4">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton="Tìm"
            size="large"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Không tìm thấy sản phẩm
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
};

export default AllProductPage;
