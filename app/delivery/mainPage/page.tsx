"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

//nextUi
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@nextui-org/react";

//svg
import { BarsarrowdownIcon } from "@/public/svg/barsarrowdownIcon";
import { UserIcon } from "@/public/svg/userIcon";
import { BanknotesIcon } from "@/public/svg/banknotesIcon";
import { TagIcon } from "@/public/svg/tagIcon";
import { LogoutIcon } from "@/public/svg/logoutIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { HomeIcon } from "@/public/svg/homeIcon";
import { ChevrondownIcon } from "@/public/svg/chevrondownIcon";
import { MapIcon } from "@/public/svg/mapIcon";
import { BuildingstorefrontIcon } from "@/public/svg/buildingstorefrontIcon";

//images
import Logo from "@/public/img/hbaieb.png";

//components
import NavBar from "@/components/delivery/navBar";
import QRScanner from "@/components/delivery/scanner";
import useCheckLogin from "@/components/delivery/checkLogin/checkLogin";
import Loading from "@/components/loading";
import DivCheck from "@/components/delivery/checkLogin/divCheck";

interface Orders {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
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
          <div className="my-6">
            <div>
              <QRScanner name={nameDeliveryy} />
            </div>
            <Image src={Logo} alt={"error"} className="w-[100%] h-36" />
          </div>
          <div className="p-3 text-end">
            <p className="opacity-80 text-xl">أحدث 3 طلبات</p>

            {orders.length > 0 ? (
              orders
                .slice(Math.max(orders.length - 3, 0))
                .reverse()
                .map((order, indexOrder) => (
                  <div
                    key={indexOrder}
                    className="mt-4 flex justify-between items-center"
                  >
                    <p className="text-success-600">
                      {
                        order.situationSteps[order.situationSteps.length - 1]
                          .situation
                      }
                    </p>
                    <div className="flex justify-end items-start">
                      <p className="text-right">
                        <p className="mr-2">{order.products[0].nameProduct}</p>
                        <p
                          className="mr-2 text-[12px]"
                          style={{ direction: "rtl" }}
                        >
                          + {order.products.length - 1} منتجات أخري
                        </p>
                      </p>
                      <Avatar
                        src={`${order.products[0].imageProduct}`}
                        size="md"
                      />
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center w-[100%] p-10 text-danger-600">لا يوجد طلبيات</p>
            )}
          </div>
        </>
      ) : (
        <DivCheck link="/delivery" />
      )}
    </>
  );
}
