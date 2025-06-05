import { useCallback, useEffect, useState, lazy } from "react";
import { Checkbox, Radio, Input, Pagination } from "antd";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [total, setTotal] = useState(0); // tổng số sản phẩm từ backend

  // Xử lý giá trị min/max theo radio
  const getPriceFilter = (price = priceRange) => {
    if (price === "100-400") return { minPrice: 100000, maxPrice: 400000 };
    if (price === "400-1000") return { minPrice: 400000, maxPrice: 1000000 };
    if (price === ">1000") return { minPrice: 1000000, maxPrice: 0 }; // hoặc null
    return { minPrice: 0, maxPrice: 0 };
  };
  const fetchProduct = useCallback(
    async (searchValue = search, price = priceRange, page = currentPage) => {
      try {
        const { minPrice, maxPrice } = getPriceFilter(price);

        const response = await ProductService.getAll({
          name: searchValue,
          status: "onSale",
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice > 0 ? maxPrice : undefined,
          page,
          limit: pageSize,
        });

        setProducts(response.data.items || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    },
    [search, priceRange, currentPage, pageSize]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Gọi fetchProduct lần đầu khi vào trang
  useEffect(() => {
    fetchProduct(search, priceRange, currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    fetchProduct(search, priceRange);
  };

  // Xử lý khi đổi filter giá
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    fetchProduct(search, value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-12 px-6 max-w-[1400px] mx-auto ">
      {/* Bộ lọc bên trái */}
      <aside className="w-full md:w-[280px] bg-gray-50 border border-gray-200 p-5 rounded-2xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Bộ lọc</h3>

        <div className="mb-6">
          <h4 className="font-medium text-gray-600 mb-2">Khoảng giá</h4>
          <Radio.Group
            className="flex flex-col gap-2 text-gray-700"
            value={priceRange}
            onChange={handlePriceChange}
          >
            {priceOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </aside>

      {/* Khu vực sản phẩm */}
      <main className="flex-1">
        {/* Thanh tìm kiếm */}
        <div className="mb-6 flex justify-between items-center">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton="Tìm"
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            className="max-w-[400px]"
          />
        </div>

        {/* Lưới sản phẩm */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            Không tìm thấy sản phẩm
          </div>
        ) : (
          <>
            <ProductGrid products={products} />

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllProductPage;
