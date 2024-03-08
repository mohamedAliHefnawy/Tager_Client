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
  const [isScannerEnabled, setScannerEnabled] = useState(false);

  const router = useRouter();

  const toggleScanner = () => {
    setScannerEnabled((prev) => !prev);
  };

  const ScannerOrder = useCallback(async () => {
    try {
      const data = {
        deliveryName: name,
        idOrder: scanResult,
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
          title: "هذة الطلبية موجوده بالفعل",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }, [name, scanResult, router]);

  useEffect(() => {
    if (scanResult) {
      ScannerOrder();
    }
  }, [scanResult, ScannerOrder]);

  return (
    <>
      {scanResult ? (
        <p className="text-center">يرجي الإنتظار</p>
      ) : (
        <>
          <Switch
            className="rotate-90"
            onClick={toggleScanner}
            defaultSelected
            color="warning"
          ></Switch>

          {isScannerEnabled && (
            <QrScanner
              audio
              tracker
              onResult={(result: any) => {
                setScanResult(result);
                ScannerOrder();
              }}
              onError={(error) => console.log(error?.message)}
            />
          )}
        </>
      )}
    </>
  );
}
