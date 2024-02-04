"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface QrcodeSuccessCallback {
  (decodedText: string, result: any, instance: any): void;
}

interface QrcodeErrorCallback {
  (errorMessage: string, errorObject: any, instance: any): void;
}

export default function QRScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();
  let scanner: Html5QrcodeScanner | null = null;
  let isScanning = true;

  const ScannerOrder = async () => {
    try {
      const data = {
        deliveryName: "محمد",
      };
      const response = await axios.post(
        "http://localhost:5000/scanner/addOrderWithDelivery",
        data
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      (result: string, _decodedText: string, _instance: any) => {
        if (isScanning) {
          alert("12");
          setScanResult(result);
          isScanning = false;
        }
        setScanResult(null);
      },
      (error: string, _decodedText: string, _instance: any) => {
        alert("34");
        console.warn(error);
      }
    );

    scanner.render(
      (result: string) => {
        if (isScanning) {
          setScanResult(result);
          isScanning = false;
        }
      },
      (error: string) => {
        console.warn(error);
      }
    );

    // return () => {
    //   if (scanner) {
    //     isScanning = false;
    //     scanner.clear();
    //   }
    // };
  }, []);

  useEffect(() => {
    if (scanResult) {
      alert("56");
      ScannerOrder()
    }
  }, [scanResult]);

  return (
    <div>{scanResult ? <p>{scanResult}</p> : <div id="reader"></div>}</div>
  );
}
