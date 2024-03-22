import { useState, useEffect } from "react";

export default function useCheckLogin() {
  const [nameKasheer, setNameKasheer] = useState("");
  const [valKasheer, setValKasheer] = useState("");
  const [storeKasheer, setStoreKasheer] = useState("");
  const [moneySafeKasheer, setMoneySafeKasheer] = useState("");
  const [phoneCompanyKasheer, setPhoneCompanyKasheer] = useState("");
  const [colorCompanyKasheer, setColorCompanyKasheer] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("nameKasheer");
    const storedUserVal = localStorage.getItem("valKasheer");
    const storedUserStore = localStorage.getItem("storeKasheer");
    const storedUserMoneyStore = localStorage.getItem("moneySafeKasheer");
    const storedUserPhoneCompany = localStorage.getItem("phoneCompanyKasheer");
    const storedUserColorCompany = localStorage.getItem("colorCompanyKasheer");
    setNameKasheer(storedUsername ?? "");
    setValKasheer(storedUserVal ?? "");
    setStoreKasheer(storedUserStore ?? "");
    setMoneySafeKasheer(storedUserMoneyStore ?? "");
    setPhoneCompanyKasheer(storedUserPhoneCompany ?? "");
    setColorCompanyKasheer(storedUserColorCompany ?? "");
    const timeoutMilliseconds = 24 * 60 * 60 * 1000;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("nameKasheer");
      localStorage.removeItem("valKasheer");
      localStorage.removeItem("storeKasheer");
      localStorage.removeItem("moneySafeKasheer");
      localStorage.removeItem("phoneCompanyKasheer");
      localStorage.removeItem("colorCompanyKasheer");
      setNameKasheer("");
      setValKasheer("");
      setStoreKasheer("");
      setMoneySafeKasheer("");
      setPhoneCompanyKasheer("");
      setColorCompanyKasheer("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [nameKasheer, valKasheer, storeKasheer, moneySafeKasheer , phoneCompanyKasheer , colorCompanyKasheer];
}
