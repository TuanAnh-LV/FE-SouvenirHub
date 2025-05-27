// import DashboardHeader from "../components/DashboardHeader";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="pt-16 px-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
