import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  // تحديث العدادات عند التغير في localStorage
  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setCartCount(cart.length);
    setFavCount(fav.length);
  };

  useEffect(() => {
    updateCounts();

    // مراقبة تغييرات localStorage (بين الصفحات)
    const onStorageChange = () => updateCounts();
    window.addEventListener("storage", onStorageChange);

    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <StoreContext.Provider value={{ cartCount, favCount, updateCounts }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
