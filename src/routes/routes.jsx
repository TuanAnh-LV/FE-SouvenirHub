import { lazy } from "react";
import { ROUTER_URL } from "../const/router.const";
import ProtectedRoute from "./protected/protectedRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/about"));
const Contact = lazy(() => import("../pages/contact"));
const Login = lazy(() => import("../pages/auth-pages/login"));
const Signup = lazy(() => import("../pages/auth-pages/signup"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const SellerDashboard = lazy(() => import("../pages/seller/SellerDashboard"));
const SellerProducts = lazy(() =>
  import("../pages/seller/seller-product/SellerProduct")
);
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("../pages/PaymentCancel"));
const BuyerDashboard = lazy(() => import("../pages/buyer/BuyerDashboard"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));
const AllProductPage = lazy(() => import("../pages/product/AllProductPage"));
const ShopProfile = lazy(() => import("../pages/shop-profile/ShopProfile"));
const RegisterShop = lazy(() => import("../pages/buyer/RegisterShop"));
const Profile = lazy(() => import("../pages/Profile"));
const ManageShop = lazy(() => import("../pages/admin/ManageShop"));
const ShopDetail = lazy(() => import("../pages/admin/ShopDetail"));
const BlogManager = lazy(() =>
  import("../pages/seller/blogManager/BlogManager")
);
const BlogUpdate = lazy(() => import("../pages/seller/blogManager/UpdateBlog"));
const ShopApprovalDetail = lazy(() =>
  import("../pages/admin/ShopApprovalDetail")
);
const ManagePendingProducts = lazy(() =>
  import("../pages/admin/ManagePendingProducts")
);
const ProductApprovalDetail = lazy(() =>
  import("../pages/admin/ProductApprovalDetail")
);

const CreateProduct = lazy(() =>
  import("../pages/seller/seller-product/CreateProduct")
);
const BuyerCart = lazy(() => import("../pages/buyer/BuyerCart"));
const BuyerProfilePage = lazy(() => import("../pages/buyer/BuyerProfile"));
const Cart = lazy(() => import("../pages/Cart"));
const EmailVerificationPage = lazy(() =>
  import("../pages/EmailVerificationPage")
);
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const ReviewPage = lazy(() => import("../pages/ReviewPage"));
const BlogPage = lazy(() => import("../pages/blog/BlogPage"));
const BlogDetailPage = lazy(() => import("../pages/blog/BlogDetailPage"));
const AdminBlogManager = lazy(() => import("../pages/admin/Blog"));
const OrderManage = lazy(() =>
  import("../pages/seller/seller-order/OrderManage")
);
const SellerProductEditPage = lazy(() =>
  import("../pages/seller/seller-product/SellerProductEditPage")
);
const OrderDetailPage = lazy(() =>
  import("../pages/seller/seller-order/OrderDetailPage")
);
const CreateBlogPage = lazy(() =>
  import("../pages/seller/blogManager/CreateBlog")
);
const UpdateBlogPage = lazy(() =>
  import("../pages/seller/blogManager/UpdateBlog")
);
const VoucherPage = lazy(() => import("../pages/seller/VoucherPage"));
const CommissionPolicy = lazy(() => import("../pages/seller/CommissionPolicy"));
const NotificationBellPage = lazy(() =>
  import("../components/SendNotificationTest")
);
const ManageUser = lazy(() => import("../pages/admin/ManageUser"));
const UserDetail = lazy(() => import("../pages/admin/UserDetail"));
const UserEdit = lazy(() => import("../pages/admin/UserEdit"));
const VoucherFormPage = lazy(() => import("../pages/seller/VoucherFormPage"));
const routes = [
  // Public routes
  {
    element: <MainLayout />,
    children: [
      { path: ROUTER_URL.COMMON.HOME, element: <Home /> },
      { path: ROUTER_URL.COMMON.ABOUT, element: <About /> },
      { path: ROUTER_URL.COMMON.CONTACT, element: <Contact /> },
      { path: ROUTER_URL.LOGIN, element: <Login /> },
      { path: ROUTER_URL.SIGNUP, element: <Signup /> },
      { path: ROUTER_URL.PRODUCTS.DETAIL, element: <ProductDetail /> },
      { path: ROUTER_URL.PRODUCTS.ALL, element: <AllProductPage /> },
      { path: ROUTER_URL.COMMON.SHOP_PROFILE, element: <ShopProfile /> },
      { path: ROUTER_URL.COMMON.PROFILE, element: <Profile /> },
      { path: ROUTER_URL.COMMON.GET_CART, element: <Cart /> },
      { path: "/verify-email", element: <EmailVerificationPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/products/:id/reviews", element: <ReviewPage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/blog/:id", element: <BlogDetailPage /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/payment-cancel", element: <PaymentCancel /> },
      { path: "notifi", element: <NotificationBellPage /> },
    ],
  },

  // Admin route with DashboardLayout

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "manage-shop", element: <ManageShop /> },
      { path: "shops/:id", element: <ShopDetail /> },
      { path: "shop-applications/:id", element: <ShopApprovalDetail /> },
      {
        path: "products/pending",
        element: <ManagePendingProducts />,
      },
      {
        path: "products/:id",
        element: <ProductApprovalDetail />,
      },
      { path: "blogs", element: <AdminBlogManager /> },
      { path: "vouchers", element: <VoucherPage /> },
      { path: "users", element: <ManageUser /> },
      {
        path: "users/:id",
        element: <UserDetail />,
      },
      {
        path: "users/:id/edit",
        element: <UserEdit />,
      },
    ],
  },

  // Seller route with DashboardLayout
  {
    path: "/seller",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <SellerDashboard /> },
      { path: "products", element: <SellerProducts /> },
      { path: "create-product", element: <CreateProduct /> },
      { path: "blogs", element: <BlogManager /> },
      // { path: "blogs/update/:id", element: <BlogManager /> },
      { path: "orders", element: <OrderManage /> },
      { path: "products/:id/edit", element: <SellerProductEditPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> },
      { path: "blogs/create", element: <CreateBlogPage /> },
      { path: "blogs/update/:id", element: <UpdateBlogPage /> },
      { path: "vouchers", element: <VoucherPage /> },
      { path: "commission-policy", element: <CommissionPolicy /> },
      {
        path: "vouchers/add",
        element: <VoucherFormPage />,
      },
      {
        path: "vouchers/edit/:id",
        element: <VoucherFormPage />,
      },
    ],
  },

  {
    path: "/buyer",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <BuyerDashboard /> },
      // { path: "register-shop", element: <RegisterShop /> },
      { path: "profile", element: <BuyerProfilePage /> },
      { path: "orders", element: <BuyerCart /> },
    ],
  },

  {
    path: "/unauthorize",
    element: (
      <div className="text-center text-red-500 text-xl mt-20">
        403 – Không có quyền truy cập
      </div>
    ),
  },
];

export default routes;
