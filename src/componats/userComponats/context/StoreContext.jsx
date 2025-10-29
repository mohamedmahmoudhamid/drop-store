import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0); // عداد الطلبات

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    setCartCount(cart.length);
    setFavCount(fav.length);
    setOrdersCount(orders.length);
  };

  useEffect(() => {
    updateCounts();

    const onStorageChange = () => updateCounts();
    window.addEventListener("storage", onStorageChange);

    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <StoreContext.Provider
      value={{ cartCount, favCount, ordersCount, updateCounts }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
