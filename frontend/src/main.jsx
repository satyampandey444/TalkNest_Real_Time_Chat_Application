import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "../redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <Provider store={store}>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
