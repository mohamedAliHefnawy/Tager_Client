import { useState, useEffect } from "react";

export default function useCheckLogin() {
  const [nameKasheer, setNameKasheer] = useState("");
  const [valKasheer, setValKasheer] = useState("");
  const [storeKasheer, setStoreKasheer] = useState("");
  const [moneySafeKasheer, setMoneySafeKasheer] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("nameKasheer");
    const storedUserVal = localStorage.getItem("valKasheer");
    const storedUserStore = localStorage.getItem("storeKasheer");
    const storedUserMoneyStore = localStorage.getItem("moneySafeKasheer");
    setNameKasheer(storedUsername ?? "");
    setValKasheer(storedUserVal ?? "");
    setStoreKasheer(storedUserVal ?? "");
    setMoneySafeKasheer(storedUserVal ?? "");
    const timeoutMilliseconds = 24 * 60 * 60 * 1000;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("nameKasheer");
      localStorage.removeItem("valKasheer");
      localStorage.removeItem("storeKasheer");
      localStorage.removeItem("moneySafeKasheer");
      setNameKasheer("");
      setValKasheer("");
      setStoreKasheer("");
      setMoneySafeKasheer("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [nameKasheer, valKasheer, storeKasheer, moneySafeKasheer];
}
