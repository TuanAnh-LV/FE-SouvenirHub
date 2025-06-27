import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/Header/DashboardHeader";
import SidebarMenu from "../components/sidebar/SidebarMenu";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen ">
      <SidebarMenu />
      <div className="flex-1 flex flex-col ">
        <DashboardHeader />
        <main className="flex-1 bg-[#FFF6F0] p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
