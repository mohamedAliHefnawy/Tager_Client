import { useState, useEffect } from "react";

export default function useCheckLogin() {
  const [user, setUser] = useState("");
  const [userValidity, setUserValidity] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("user");
    const storedUserValidity = localStorage.getItem("userValidity");
    setUser(storedUsername ?? "");
    setUserValidity(storedUserValidity ?? "");
    const timeoutMilliseconds = 24 * 60 * 30 * 1024;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("userValidity");
      setUser("");
      setUserValidity("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [user, userValidity];
}
