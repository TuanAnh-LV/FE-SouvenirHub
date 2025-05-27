import { lazy } from "react";
import { ROUTER_URL } from "../const/router.const";
import ProtectedRoute from "../routes/protected/protectedRoute";
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
const BuyerDashboard = lazy(() => import("../pages/buyer/BuyerDashboard"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));
const AllProductPage = lazy(() => import("../pages/product/AllProductPage"));


const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: ROUTER_URL.COMMON.HOME, element: <Home /> },
      { path: ROUTER_URL.COMMON.ABOUT, element: <About /> },
      { path: ROUTER_URL.COMMON.CONTACT, element: <Contact /> },
      { path: ROUTER_URL.LOGIN, element: <Login /> },
      { path: ROUTER_URL.SIGNUP, element: <Signup /> },
      { path: ROUTER_URL.PRODUCT.DETAIL, element: <ProductDetail /> },
      { path: ROUTER_URL.PRODUCT.ALL, element: <AllProductPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTER_URL.ADMIN.DASHBOARD, element: <AdminDashboard /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTER_URL.SELLER.DASHBOARD, element: <SellerDashboard /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTER_URL.BUYER.DASHBOARD, element: <BuyerDashboard /> },
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
