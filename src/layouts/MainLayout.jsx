import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-[72px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
