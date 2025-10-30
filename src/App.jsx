import "swiper/css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./componats/userComponats/Footer/footer";
import About from "./componats/userComponats/AboutUs/about";
import Header from "./componats/userComponats/Header/header";
import NotFound from "./componats/userComponats/NotFound/NotFound";
import Home from "./componats/userComponats/Home/Home";
import ProductDetails from "./componats/userComponats/CardProduct/productDetails";
import Favorites from "./componats/userComponats/favorites/favorites";
import Cart from "./componats/userComponats/cart/cart";
import Checkout from "./componats/userComponats/Checkout/checkout";
import { StoreProvider } from "./componats/userComponats/context/StoreContext";
import Contact from "./componats/userComponats/Contact/Contact";
import SignUpForAdmin from "./componats/ordersAdmin/login/signin";
import OrderTable from "./componats/ordersAdmin/orders/orderTable";
import { useEffect } from "react";

function App() {
   useEffect(() => {
    // منع right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // منع اختصارات DevTools
    const handleKeyDown = (e) => {
      // F12
      if (e.key === "F12") e.preventDefault();
      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") e.preventDefault();
      // Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") e.preventDefault();
      // Ctrl+U / Cmd+U (عرض source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
  <BrowserRouter>
  <StoreProvider>
    <Header />
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/" element={<Home />} />
      <Route path="/login/to/dashboard" element={<SignUpForAdmin />} />
    
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/orderTable" element={<OrderTable />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <Footer />
  </StoreProvider>
</BrowserRouter>

  );
}

export default App;
