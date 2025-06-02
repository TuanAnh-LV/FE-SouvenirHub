import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/auth.context.jsx";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./app/store.js";
import "antd/dist/reset.css";
import { CartProvider } from "./context/cart.context.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
        <ToastContainer />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
