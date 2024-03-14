"use client";

import React, { useCallback, useEffect, useState, Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Switch } from "@nextui-org/react";
import QrReader from "react-qr-reader";

export default function QRScanner({ name }: { name: string }) {
  const nameDelivery = localStorage.getItem("nameDelivery");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState("No result");

  const router = useRouter();

  const toggleScanner = () => {
    setScannerActive((prev) => !prev);
  };

  const handleScannerResult = async (result: any) => {
    setScannerActive(false);
    const scannedResult = result?.toString();
    setScanResult(scannedResult);
    try {
      setIsLoading(true);
      const data = {
        deliveryName: nameDelivery,
        idOrder: scannedResult,
      };
      const response = await axios.post(
        `${linkServer.link}scanner/addOrderWithDelivery`,
        data
      );
      if (response.data === "yes") {
        router.push("/delivery/orders");
      }
      if (response.data === "idOrder already exists") {
        
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

  const handleScannerError = (error: any) => {
    console.log(error?.message);
  };

  const handleScannerScan = (result: any) => {
    if (result) {
      handleScannerResult(result);
    }
  };

  useEffect(() => {
    if (scanResult) {
      handleScannerResult(scanResult);
    }
  }, [scanResult]);

  return (
    <>
      {/* {isLoading ? (
        <p className="text-center">يرجى الانتظار</p>
      ) : (
        <> */}
      <Switch
        className="rotate-90"
        onClick={toggleScanner}
        defaultSelected
        color="warning"
      />
      {isScannerActive && (
        <QrReader
          delay={10000}
          onError={handleScannerError}
          onScan={handleScannerScan}
        />
        // <QrScanner
        //   audio
        //   tracker
        //   scanDelay={500}
        //   onResult={handleScannerResult}
        //   onError={(error) => console.log(error?.message)}
        // />
      )}
      {/* </>
      )} */}
    </>
  );
}
