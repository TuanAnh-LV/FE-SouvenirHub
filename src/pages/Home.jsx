import { useEffect, useState } from "react";
import { ProductService } from "../services/product/product.service";
import { BlogService } from "../services/blog/blog.service";
import assets from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";
import { message, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
import { motion } from "framer-motion";

const banners = [
  { src: assets.banner_1, alt: "banner 1" },
  { src: assets.banner_2, alt: "banner 2" },
  { src: assets.banner_3, alt: "banner 3" },
];

const Home = () => {
  const [personalGifts, setPersonalGifts] = useState([]);
  const [businessGifts, setBusinessGifts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
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

        const res3 = await BlogService.getBlogs({ page: 1, limit: 3 });

        setPersonalGifts(res1.data.items || []);
        setBusinessGifts(res2.data.items || []);
        setBlogs(res3.data.items || []);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);
  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  const renderProductCard = (product) => (
    <motion.div
      key={product._id}
      className="bg-white rounded-[10px] shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
      onClick={() => handleCardClick(product._id)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <img
        src={product.images?.[0] || "/default-product.png"}
        alt={product.name}
        className="w-full h-65 object-cover mb-3 rounded-t-[10px] transition-transform duration-500"
      />
      <h3 className="text-base font-semibold line-clamp-2 min-h-[48px] pl-4">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 pl-4">
        <Rate
          disabled
          allowHalf
          value={product.averageRating || 0}
          character={<StarFilled />}
          style={{ fontSize: 16 }}
        />
        ({product.reviewCount ?? 0} reviews)
      </p>
      <p className="text-[#d0011b] text-lg font-bold mt-1 pl-4">
        {parseInt(product.price.$numberDecimal).toLocaleString()}₫
      </p>
    </motion.div>
  );

  const renderSkeletonCard = (_, idx) => (
    <div key={idx} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
  );
  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-20 px-4 md:px-12 max-w-screen-xl mx-auto"
    >
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
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Category Highlights */}
      <motion.section
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#fff7ed] bg-opacity-90 text-black text-center py-2 z-10">
            Quà tặng cá nhân hóa
          </div>
          <img
            src={assets.privates}
            alt="Quà tặng cá nhân hóa"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#fff7ed] bg-opacity-90 text-black text-center py-2 z-10">
            Quà tặng doanh nghiệp
          </div>
          <img
            src={assets.business}
            alt="Quà tặng doanh nghiệp"
            className="w-full h-64 object-cover"
          />
        </div>
      </motion.section>

      {/* Personalized Products */}
      <motion.section
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Quà tặng cá nhân hóa
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill().map(renderSkeletonCard)
            : personalGifts.map(renderProductCard)}
        </div>
      </motion.section>

      {/* Business Products */}
      <motion.section
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Quà tặng doanh nghiệp
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill().map(renderSkeletonCard)
            : businessGifts.map(renderProductCard)}
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section
        className="mt-16 mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.length === 0 && !loading ? (
            <p className="text-center col-span-3">Không có dữ liệu</p>
          ) : (
            blogs.slice(0, 3).map((blog) => (
              <motion.div
                key={blog._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleBlogClick(blog._id)}
              >
                <img
                  src={blog.images?.[0]?.url || "/default-blog.jpg"}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
