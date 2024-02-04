import { useState, useEffect } from "react";

export default function useCheckLogin() {
  const [nameDelivery, setNameDelivery] = useState("");
  const [valDelivery, setValNameDelivery] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("nameDelivery");
    const storedUserVal = localStorage.getItem("valDelivery");
    setNameDelivery(storedUsername ?? "");
    setValNameDelivery(storedUserVal ?? "");
    const timeoutMilliseconds = 24 * 60 * 60 * 1000;
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("nameDelivery");
      localStorage.removeItem("valDelivery");
      setNameDelivery("");
      setValNameDelivery("");
    }, timeoutMilliseconds);

    return () => clearTimeout(timeoutId);
  }, []);

  return [nameDelivery, valDelivery];
}
