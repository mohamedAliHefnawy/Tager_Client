"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Switch } from "@nextui-org/react";

export default function QRScanner({ name }: { name: string }) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleScanner = () => {
    setScannerActive((prev) => !prev);
  };

  const handleScannerResult = async (result: any) => {
    const scannedResult = result?.toString();
    setScanResult(scannedResult);
    try {
      setIsLoading(true);
      const data = {
        deliveryName: name,
        idOrder: scannedResult,
      };
      const response = await axios.post(
        `${linkServer.link}scanner/addOrderWithDelivery`,
        data
      );

      if (response.data === "yes") {
        router.push("/delivery/orders");
      } else {
        Swal.fire({
          icon: "warning",
          title: "هذه الطلبية موجودة بالفعل",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scanResult) {
      handleScannerResult(scanResult);
    }
  }, [scanResult]);

  return (
    <>
      {isLoading ? (
        <p className="text-center">يرجى الانتظار</p>
      ) : (
        <>
          <Switch
            className="rotate-90"
            onClick={toggleScanner}
            defaultSelected
            color="warning"
          />
          {isScannerActive && (
            <QrScanner
              audio
              tracker
              onResult={handleScannerResult}
              onError={(error) => console.log(error?.message)}
            />
          )}
        </>
      )}
    </>
  );
}
