import { useEffect, useState } from "react";
import { ProductService } from "../services/product/product.service";
import { message } from "antd";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await ProductService.getAllProducts();
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        message.error("Không thể tải sản phẩm.");
      }
    })();
  }, []);

  return (
    <div className="mt-20 px-4 md:px-12">
      {/* Hero Section */}
      <section className="bg-orange-100 p-10 rounded-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Souvenir Hub</h1>
        <p className="text-lg text-gray-700 mb-6">
          Nơi hội tụ những món quà ý nghĩa từ khắp mọi miền
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-lg transition">
          Mua ngay
        </button>
      </section>

      {/* Featured Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
            >
              <img
                src={product.images?.[0] || "/default-product.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-orange-600 font-bold">
                {product.price?.$numberDecimal ?? "0"}₫
              </p>
              <button className="mt-2 w-full bg-orange-400 text-white rounded px-3 py-1 hover:bg-orange-500 transition">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-gradient-to-r from-pink-400 to-orange-400 p-10 rounded-xl text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Khám phá ngay</h2>
        <p className="text-lg mb-6">Còn nhiều sản phẩm độc đáo đang chờ bạn!</p>
        <button className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition">
          Khám phá thêm
        </button>
      </section>
    </div>
  );
};

export default Home;
