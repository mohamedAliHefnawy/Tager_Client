"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";import linkServer from "@/linkServer";


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

interface Products {
  nameProduct: string;
  address: string;
  amount: number;
  price: number;
  imageProduct: string;
  size: string;
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
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameDelivery] = useCheckLogin();
  const [nameDeliveryy, setNameDeliveryy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [productsOrders, setProductsOrders] = useState<Products[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response: {
          data: { token: string; AllData: any };
        };
        response = await axios.get(
          `${linkServer.link}scanner/getOrdersInStore/${nameDelivery}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );
  
        setProductsOrders(response.data.AllData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (nameDelivery) {
      fetchData();
    }
  }, [nameDelivery, secretKey]);

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

          <div className="w-[93%] mx-2 my-4  bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl">
            {productsOrders.length > 0 ? (
              productsOrders
                .slice()
                .reverse()
                .map((item, indexItem) => (
                  <div
                    key={indexItem}
                    className=" p-1 my-3 w-[100%] flex flex-col justify-center items-center  border-1 border-warning-200 rounded-xl mr-1"
                  >
                    {item.nameProduct &&
                      <div className="flex justify-end w-[100%] mb-3 p-1">
                        <p className="text-right text-[12px] mr-1">
                          <span>
                            {item.nameProduct} ({item.amount})
                          </span>
                          <p className="flex justify-between">
                            <span className="text-[12px] text-success-700 flex justify-end">
                              <span className="mr-1">د.ل</span>
                              <span>{item.price}</span>
                            </span>
                            <span className="text-[12px]">{item.size}</span>
                          </p>
                        </p>
                        <p>
                          <Avatar src={`${item.imageProduct}`} size="sm" />
                        </p>
                      </div>
                    } 
                    {
                      item.products &&
                      item.products.map((product, indexProduct) => (
                        <div key={indexProduct} className="flex justify-end w-[100%] mb-3 p-1">
                          <p className="text-right text-[12px] mr-1">
                            <span>
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
                            <Avatar src={`${product.imageProduct}`} size="sm" />
                          </p>
                        </div>
                      ))
                    }


                  </div>
                ))
            ) : (
              <p className="w-[100%] text-center p-6">لا يوجد منتجات</p>
            )}
          </div>
        </>
      ) : (
        <DivCheck link="/delivery" />
      )}
    </>
  );
}
