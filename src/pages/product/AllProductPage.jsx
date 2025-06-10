import { useCallback, useEffect, useState, lazy } from "react";
import { Radio, Pagination } from "antd";
import { ProductService } from "../../services/product-service/product.service";
import { CategoryService } from "../../services/category/category.service";
const ProductGrid = lazy(() => import("../../components/product/AllProduct"));
import { useSearchParams } from "react-router-dom";

const priceOptions = [
  { label: "Tất cả", value: "" },
  { label: "Từ 100k đến 400k", value: "100-400" },
  { label: "Từ 400k đến 1tr", value: "400-1000" },
  { label: "Trên 1tr", value: ">1000" },
];

const AllProductPage = () => {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Xử lý giá trị min/max theo radio
  const getPriceFilter = (price = priceRange) => {
    if (price === "100-400") return { minPrice: 100000, maxPrice: 400000 };
    if (price === "400-1000") return { minPrice: 400000, maxPrice: 1000000 };
    if (price === ">1000") return { minPrice: 1000000, maxPrice: 0 };
    return { minPrice: 0, maxPrice: 0 };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      const { minPrice, maxPrice } = getPriceFilter();

      const response = await ProductService.getAll({
        status: "onSale",
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice > 0 ? maxPrice : undefined,
        category: selectedCategory || undefined,
        name: searchTerm || undefined,
        page: currentPage,
        limit: pageSize,
      });

      setProducts(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [priceRange, currentPage, pageSize, selectedCategory, searchTerm]);

  useEffect(() => {
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  // Gọi fetchProduct khi page/filter/searchTerm đổi
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="md:px-12 max-w-screen-xl mx-auto flex gap-6 mt-15">
      {/* Bộ lọc bên trái */}
      <aside className="w-[260px] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Search Filter
        </h3>

        <div className="mb-6 text-sm">
          <h4 className="font-semibold text-black-700 mb-2">Price</h4>
          <Radio.Group
            value={priceRange}
            onChange={handlePriceChange}
            className="flex flex-col gap-10"
          >
            {priceOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <h3 className="font-semibold text-black-700 mb-2">Category</h3>
        <Radio.Group
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="flex flex-col gap-2"
        >
          <Radio value="">Tất cả</Radio>
          {categories.map((cat) => (
            <Radio key={cat._id} value={cat.name}>
              {cat.name}
            </Radio>
          ))}
        </Radio.Group>
      </aside>

      {/* Khu vực sản phẩm bên phải */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 text-sm">
            <span className="font-medium text-gray-600">Sort by:</span>
            <button className="bg-orange-500 text-white px-3 py-1 rounded">
              Relevant
            </button>
            <button className="px-3 py-1 rounded border">New</button>
            <button className="px-3 py-1 rounded border">Best Seller</button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            No product found
          </div>
        ) : (
          <>
            <ProductGrid products={products} />

            <div className="mt-6 flex justify-center">
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
