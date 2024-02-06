"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

//nextUi
import { useDisclosure } from "@nextui-org/react";

export default function QRScanner({ name }: { name: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();
  let scanner: Html5QrcodeScanner | null = null;
  let isScanning = true;

  const ScannerOrder = async () => {
    try {
      const data = {
        deliveryName: name,
        idOrder: scanResult,
      };
      const response = await axios.post(
        "https://tager-server.vercel.app/scanner/addOrderWithDelivery",
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
      true
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
  }, []);

  useEffect(() => {
    if (scanResult) {
      ScannerOrder();
    }
  }, [scanResult]);

  return (
    <>
      {scanResult ? (
        <p className="text-center">يرجي الإنتظار</p>
      ) : (
        <div id="reader"></div>
      )}
      {/* <p
        onClick={onOpen}
        className=" w-[50px] h-[50px] text-center hover:cursor-pointer hover:opacity-75 bg-danger-200 p-3 mt-1 rounded-full border-1 border-white"
      >
        1
      </p>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" rounded-e-none max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">َ</ModalHeader>
              <ModalBody>
                <div>
                  {scanResult ? <p>{scanResult}</p> : <div id="reader"></div>}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </>
  );
}
