"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";

export default function Scanner() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      true
    );

    scanner.render(success, error);

    function success(result: any) {
      scanner.clear();
      setScanResult(result);
    }
    function error(err: any) {
      console.warn(err);
    }
  }, []);

  return <div>{scanResult ? <p>0</p> : <p>1</p>}</div>;
}
