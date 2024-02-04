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
  Textarea,
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
      idProduct: string;
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
  const [productsOrders, setProductsOrders] = useState<Orders[]>([]);



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
          {orders.length > 0 ? (
            orders.map((order, indexOrder) => (
              <div key={indexOrder} className="mt-4">
                <div className="p-6 pb-1 pt-0 text-right">
                  <Link
                    href={`/delivery/orders/${order._id}`}
                    className="text-warning-600 underline flex items-end"
                    style={{ direction: "rtl" }}
                  >
                    <p className="flex">
                      <span className="ml-1">طلبيه</span>
                      <span>{order.nameClient}</span>
                    </p>

                    <span className="text-[13px] mr-1">({order.address})</span>
                  </Link>
                </div>
                <div className="mb-2 p-6 pt-0 px-3 w-[100%]">
                  <div className="w-[100%] h-auto border-1 border-slate-400 text-center rounded-2xl p-4 gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4  sm:grid-cols-2">
                    {order.products.map((product, indexProduct) => (
                      <div
                        key={indexProduct}
                        className="flex bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl  "
                      >
                        <p className="text-right text-[12px] mr-1">
                          <span className="">
                            {product.nameProduct} ({product.amount})
                          </span>
                          <p className="flex justify-between">
                            <span className="text-[12px] text-success-700 flex justify-end">
                              <span className="mr-1">د.ل</span>
                              <span>{product.price}</span>
                            </span>
                            <span className="text-[12px]">{product.size}</span>
                          </p>
                        </p>
                        <p>
                          {/* {product.idProduct} */}
                          <Avatar src={`${product.imageProduct}`} size="sm" />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[100%] h-[1px] bg-warning-200"></div>
              </div>
            ))
          ) : (
            <p>لا يوجد طلبيات</p>
          )}

          <div className="p-3 text-end">
            <div className="flex justify-end">
              <p className="bg-warning-100 opacity-65 p-3 px-6 rounded-3xl rounded-es-none w-[100%] text-center">
                إسترجاع منتجات
              </p>
            </div>
            <div className="mb-2 p-6 px-0 pt-0 mt-2 w-[100%]">
              <div className="w-[100%] h-auto border-1 border-slate-400 text-center rounded-2xl p-4 gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4  sm:grid-cols-2">
                <div className="flex bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl  ">
                  <p className="text-right text-[12px] mr-1">
                    <span className=""> ساعة سمارات (3) </span>
                    <p className="flex justify-between">
                      <span className="text-[12px] text-success-700 flex justify-end">
                        <span className="mr-1">د.ل</span>
                        <span>200</span>
                      </span>
                      <span className="text-[12px]"> 128GB </span>
                    </p>
                  </p>
                  <p>
                    <Avatar src={`${Logo}`} size="sm" />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <p className="bg-warning-200 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center">
                تأكيد عمليه الإسترجاع
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
