"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

//components
import NavBar from "@/components/delivery/navBar";
import useCheckLogin from "@/components/delivery/checkLogin/checkLogin";
import DivCheck from "@/components/delivery/checkLogin/divCheck";
import Loading from "@/components/loading";

interface Orders {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  products: [
    {
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameDelivery] = useCheckLogin();
  const [nameDeliveryy, setNameDeliveryy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Orders[]>([]);
  const router = useRouter();

  const GetProductsInCart = async () => {
    setLoading(true);
    try {
      let response: {
        data: { token: string; ordersData: any };
      };
      response = await axios.get(
        `http://localhost:5000/scanner/getOrders/${nameDelivery}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setOrders(response.data.ordersData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nameDelivery) {
      GetProductsInCart();
    }
  }, [nameDelivery]);

  useEffect(() => {
    if (nameDelivery) {
      const timeoutId = setTimeout(() => {
        setNameDeliveryy(nameDelivery);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [nameDelivery]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : nameDelivery ? (
        <>
          <NavBar />
          <div className="my-6 p-6">
            <div className="w-[100%] h-24 border-1 border-slate-600 border-dashed rounded-2xl flex flex-col justify-center items-center ">
              <p>أموال الخزينة</p>
              <p className="flex text-sm my-2 text-success-700">
                <span className="mr-1">د.ل</span>
                <span> 1000</span>
              </p>
            </div>
          </div>
          <div className="p-3 text-end">
            <div className="flex justify-end">
              <p className="bg-warning-100 opacity-65 p-3 px-6 rounded-3xl rounded-es-none w-[100%] text-center">
                تحويل أموال
              </p>
            </div>
            <div className="w-[100%]">
              <textarea
                className="input p-3"
                placeholder="أكتب ملاحظه"
                style={{ direction: "rtl" }}
              />
            </div>
            <div className="flex justify-end">
              <p className="bg-warning-200 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center">
                تأكيد العملية
              </p>
            </div>
          </div>
        </>
        
      ) : (
        <DivCheck link="/delivery" />
      )}
    </>
  );
}
