import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-[88px] pb-[10px] bg-[#FFF8F3]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
