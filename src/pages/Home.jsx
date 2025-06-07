import { useEffect, useState } from "react";
import { ProductService } from "../services/product/product.service";
import assets from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";
import { message, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
const banners = [
  { src: assets.banner_1, alt: "banner 1" },
  { src: assets.banner_2, alt: "banner 2" },
  { src: assets.banner_3, alt: "banner 3" },
];

const Home = () => {
  const [personalGifts, setPersonalGifts] = useState([]);
  const [businessGifts, setBusinessGifts] = useState([]);
  const navigate = useNavigate();
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
        message.error("Failed to load products");
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };
  const renderProductCard = (product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
      onClick={() => handleCardClick(product._id)}
    >
      <img
        src={product.images?.[0] || "/default-product.png"}
        alt={product.name}
        className="w-full h-65 object-cover rounded-md mb-3"
      />
      <h3 className="text-base font-semibold line-clamp-2 min-h-[48px]">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600">
        <Rate
          disabled
          allowHalf
          value={product.averageRating || 0}
          character={<StarFilled />}
          style={{ fontSize: 16 }}
        />
        ({product.reviewCount ?? 0} reviews)
      </p>
      <p className="text-[#d0011b] text-lg font-bold mt-1">
        {parseInt(product.price.$numberDecimal).toLocaleString()}₫
      </p>
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
        {/* Personal Gifts */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#fff7ed] bg-opacity-90 text-black text-center py-2 z-10">
            Personal Gifts
          </div>
          <img
            src={assets.privates}
            alt="Personal Gifts"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Business Gifts */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#fff7ed] bg-opacity-90 text-black text-center py-2 z-10">
            Business Gifts
          </div>
          <img
            src={assets.business}
            alt="Business Gifts"
            className="w-full h-64 object-cover"
          />
        </div>
      </section>

      {/* Personalized Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Personalized Gifts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {personalGifts.map(renderProductCard)}
        </div>
        <div className="text-center mt-4">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
            Explore More
          </button>
        </div>
      </section>

      {/* Business Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Business Gifts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {businessGifts.map(renderProductCard)}
        </div>
        <div className="text-center mt-4">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
            Explore More
          </button>
        </div>
      </section>

      {/* Blog Section */}
      <section className="mt-16 mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-center">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <img
                src={`/blog-${i}.jpg`}
                alt="Blog"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-bold mb-1">Blog Title {i}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                A brief description of blog content related to products, trends,
                or gift tips...
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
