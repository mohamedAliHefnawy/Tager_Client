"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QRScanner({ name }: { name: string }) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();

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
        <Scanner
          enabled={false}
          components={{
            audio: true,
            torch: true,
            onOff: true,
            tracker: true,
          }}
          onResult={(result) => {
            setScanResult(result);
            ScannerOrder();
          }}
          onError={(error) => console.log(error?.message)}
        />
      )}
    </>
  );
}
