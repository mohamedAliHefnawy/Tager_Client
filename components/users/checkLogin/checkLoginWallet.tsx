import { useState, useEffect } from "react";

export default function useCheckLoginWallet() {
  const [userWallet, setUserWallet] = useState("");
  const [userValidityWallet, setUserValidityWallet] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("userWallet");
    const storedUserValidity = localStorage.getItem("userValidityWallet");
    setUserWallet(storedUsername ?? "");
    setUserValidityWallet(storedUserValidity ?? "");
    const timeoutMilliseconds = 24 * 60 * 30 * 1024;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("userWallet");
      localStorage.removeItem("userValidityWallet");
      setUserWallet("");
      setUserValidityWallet("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [userWallet, userValidityWallet];
}
