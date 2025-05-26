import { lazy } from "react";
// import ProtectedRoute from './protected/protectedRoute'
import { ROUTER_URL } from "../const/router.const";
// Lazy load components
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/about"));
const Contact = lazy(() => import("../pages/contact"));
const Login = lazy(() => import("../pages/auth-pages/login"));
const Signup = lazy(() => import("../pages/auth-pages/signup"));
// Example userRole, replace with actual user role from your auth context or state
// const userRole = "admin" // or get from context/store

const routes = [
  { path: ROUTER_URL.COMMON.HOME, element: <Home /> },
  {
    path: ROUTER_URL.COMMON.ABOUT,
    element: <About />,
  },
  {
    path: ROUTER_URL.COMMON.CONTACT,
    element: <Contact />,
  },
  {
    path: ROUTER_URL.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTER_URL.SIGNUP,
    element: <Signup />,
  },
];

export default routes;
