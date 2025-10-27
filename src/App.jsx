import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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

function App() {
  return (
  <BrowserRouter>
  <StoreProvider>
    <Header />
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<SignUpForAdmin />} />
      {/* <Route path="/register" element={<Register />} /> */}
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
