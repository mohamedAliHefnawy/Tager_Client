import { useState, useEffect } from "react";

export default function useCheckLogin() {
  const [nameAdmin, setNameAdmin] = useState("");
  const [valAdmin, setValNameAdmin] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("nameAdmin");
    const storedUserVal = localStorage.getItem("valAdmin");
    setNameAdmin(storedUsername ?? "");
    setValNameAdmin(storedUserVal ?? "");
    const timeoutMilliseconds = 24 * 60 * 60 * 1000;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("nameAdmin");
      localStorage.removeItem("valAdmin");
      setNameAdmin("");
      setValNameAdmin("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [nameAdmin, valAdmin];
}
