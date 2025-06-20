import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes/routes";
// import Loading from "./app/Loading";
// import { useSelector } from "react-redux";

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  // const isLoading = useSelector((state) => state.loading);

  return (
    <Router>
      {/* {isLoading && <Loading />} */}
      <Suspense fallback={<div>Đang tải...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
