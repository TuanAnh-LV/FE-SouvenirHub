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
const SellerProducts = lazy(() => import("../pages/seller/seller-product/SellerProduct"));
const BuyerDashboard = lazy(() => import("../pages/buyer/BuyerDashboard"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));
const AllProductPage = lazy(() => import("../pages/product/AllProductPage"));
const ShopProfile = lazy(() => import("../pages/shop-profile/ShopProfile"));
const RegisterShop = lazy(() => import("../pages/buyer/RegisterShop"));
const Profile = lazy(() => import("../pages/Profile"));
const CreateProduct = lazy(() => import("../pages/seller/seller-product/CreateProduct"));
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
      { path: "", element: <AdminDashboard /> }, // /admin
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
    children: [{ path: "dashboard", element: <SellerDashboard /> },
               { path: "products", element: <SellerProducts /> },      
               { path: "create-product", element: <CreateProduct /> }      
    ],
  },

  {
    path: "/buyer",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <BuyerDashboard /> },
      { path: "register-shop", element: <RegisterShop /> },
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
