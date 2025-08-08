import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F3]">
      <Header />
      <main className="flex-grow pt-[88px] pb-[10px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
