import { useState, useEffect } from "react";

export default function useProducts() {
  const [products, setProducts] = useState("");
  const [arrProductsInCart, setArrProductsInCart] = useState([]);

  useEffect(() => {
    const storedData1 = localStorage.getItem("productsCart");
    if (storedData1 !== null) {
      setArrProductsInCart(JSON.parse(storedData1));
    }
    setProducts(storedData1 ?? "");

    const timeoutMilliseconds = 24 * 60 * 30 * 1024;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("productsCart");
      setProducts("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [products];
}
