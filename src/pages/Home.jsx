import { useEffect, useState } from "react";
import { ProductService } from "../services/product/product.service";
import { toast } from "react-toastify";
import assets from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
const banners = [
  { src: assets.banner_1, alt: "banner 1" },
  { src: assets.banner_2, alt: "banner 2" },
  { src: assets.banner_3, alt: "banner 3" },
];
const Home = () => {
  const [personalGifts, setPersonalGifts] = useState([]);
  const [businessGifts, setBusinessGifts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          ProductService.getFilteredProducts({
            category: "Quà tặng cá nhân hóa",
            status: "onSale",
            page: 1,
            limit: 4,
            sortBy: "price",
            sortOrder: "asc",
          }),
          ProductService.getFilteredProducts({
            category: "Quà tặng doanh nghiệp",
            status: "onSale",
            page: 1,
            limit: 4,
            sortBy: "price",
            sortOrder: "asc",
          }),
        ]);
        setPersonalGifts(res1.data.items || []);
        setBusinessGifts(res2.data.items || []);
      } catch (error) {
        toast.error("Không thể tải sản phẩm");
      }
    };

    fetchData();
  }, []);

  const renderProductCard = (product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
    >
      <img
        src={product.images?.[0] || "/default-product.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h3 className="text-base font-semibold line-clamp-2 min-h-[48px]">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600">
        ⭐ {product.averageRating?.toFixed(1) ?? 0} ({product.reviewCount ?? 0}{" "}
        đánh giá)
      </p>
      <p className="text-orange-600 font-bold">
        {product.price?.$numberDecimal ?? "0"}₫
      </p>
      <button className="mt-2 w-full bg-orange-400 text-white rounded px-3 py-1 hover:bg-orange-500 transition">
        Xem chi tiết
      </button>
    </div>
  );

  return (
    <div className="mt-20 px-4 md:px-12 max-w-screen-xl mx-auto">
      {/* Banner */}
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        loop={true}
        className="w-full h-100 rounded-xl overflow-hidden"
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Category Highlights */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quà Cá Nhân */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-black bg-opacity-90 text-white text-center py-2 z-10">
            Quà Cá Nhân
          </div>
          <img
            src={assets.privates}
            alt="Quà Cá Nhân"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Quà Doanh Nghiệp */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-black bg-opacity-90 text-white text-center py-2 z-10">
            Quà Doanh Nghiệp
          </div>
          <img
            src={assets.business}
            alt="Quà Doanh Nghiệp"
            className="w-full h-64 object-cover"
          />
        </div>
      </section>

      {/* Sản phẩm bán chạy */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Sản phẩm cá nhân hóa</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {personalGifts.map(renderProductCard)}
        </div>
        <div className="text-center mt-4">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
            Khám phá thêm
          </button>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Quà doanh nghiệp</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {businessGifts.map(renderProductCard)}
        </div>
        <div className="text-center mt-4">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
            Khám phá thêm
          </button>
        </div>
      </section>

      {/* Blog Section */}
      <section className="mt-16 mb-16">
        <h2 className="text-2xl font-semibold mb-4">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <img
                src={`/blog-${i}.jpg`}
                alt="blog"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-bold mb-1">Tiêu đề blog {i}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                Mô tả ngắn gọn nội dung blog liên quan đến sản phẩm, xu hướng,
                hoặc mẹo tặng quà...
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
