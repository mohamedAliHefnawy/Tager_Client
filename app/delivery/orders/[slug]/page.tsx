"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";

//images
import Logo from "@/public/img/hbaieb.png";

//components
import NavBar from "@/components/delivery/navBar";
import useCheckLogin from "@/components/delivery/checkLogin/checkLogin";
import DivCheck from "@/components/delivery/checkLogin/divCheck";
import Loading from "@/components/loading";
import ChatDiv from "@/components/delivery/chatDiv";

interface Orders {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  money: number;
  products: [
    {
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
  situationSteps: [
    {
      situation: string;
      date: string;
      time: string;
    }
  ];
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

export default function Home({ params }: { params: { slug: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameDelivery] = useCheckLogin();
  const [nameDeliveryy, setNameDeliveryy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Orders>();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedSituationOrder, setSelectedSituationOrder] = React.useState<
    string[]
  >(["تغيير حالة الطلبية"]);

  const Icons = {
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
  };

  const selectedValueSituationOrder = React.useMemo(
    () => Array.from(selectedSituationOrder).join(", ").replaceAll("_", " "),
    [selectedSituationOrder]
  );
  const handleSelectionOrder = (selectedItems: string[]) => {
    setSelectedSituationOrder(selectedItems);
  };

  const EditOrder = async () => {
    setCloseBtn(true);
    try {
      const data = {
        delivery: nameDelivery,
        idOrder: order?._id,
        situationOrder: selectedValueSituationOrder,
        orderMoney: order?.totalPriceProducts,

        message: `تم تحويل منتجات طلبيه من خلال مندوب التوصيل ${nameDelivery}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        notes: "",

        nameClient: order?.nameClient,
        phone1Client: order?.phone1Client,
        phone2Client: order?.phone2Client,
        address: order?.address,
        products: order?.products,
      };
      const response = await axios.post(
        "http://localhost:5000/orders/editOrderSituation2",
        data
      );
      if (response.data === "yes") {
        toast.success("تم عمل الشراء بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetOrder = async () => {
    setLoading(true);
    try {
      let response: {
        data: { token: string; order: any };
      };
      response = await axios.get(
        `https://tager-server.vercel.app/scanner/getOrder/${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setOrder(response.data.order);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedValueSituationOrder !== "تغيير حالة الطلبية") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [selectedValueSituationOrder]);

  useEffect(() => {
    if (nameDelivery) {
      GetOrder();
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
          <div className="mt-4">
            <div className="p-6 pb-1 pt-0 flex justify-between items-center">
              <ChatDiv
                idOrder={order?._id}
                delivery={nameDeliveryy}
                chatMessages={order?.chatMessages}
              />
              <p>
                <span className="flex justify-end text-[14px] mb-2">
                  <span className="mr-1">{order?.nameClient}</span>
                  <span className="opacity-80"> : الإسم </span>
                </span>
                <span className="flex justify-end text-[14px] mb-2">
                  <span className="mr-1">{order?.phone1Client}</span>
                  <span className="opacity-80"> : الهاتف 1 </span>
                </span>
                <span className="flex justify-end text-[14px] mb-2">
                  <span className="mr-1">{order?.phone2Client}</span>
                  <span className="opacity-80"> : الهاتف 2 </span>
                </span>
                <span className="flex justify-end text-[14px] mb-2">
                  <span className="mr-1">{order?.address}</span>
                  <span className="opacity-80"> : العنوان </span>
                </span>
                <span className="flex justify-end text-[14px] mb-2">
                  <span className="mr-1">
                    {
                      order?.situationSteps[order?.situationSteps.length - 1]
                        ?.situation
                    }
                  </span>
                  <span className="opacity-80"> : الحالة </span>
                </span>
              </p>
            </div>
            <div className="mb-2 p-6 pt-0 px-3 w-[100%]">
              <div className="w-[100%] h-auto border-1 border-slate-400 text-center rounded-2xl p-4 gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4  sm:grid-cols-2">
                {order?.products.map((product, indexProduct) => (
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
                        <span className="text-[12px]"> {product.size} </span>
                      </p>
                    </p>
                    <p>
                      <Avatar src={`${product.imageProduct}`} size="sm" />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3">
              {order?.situationSteps.some(
                (step) =>
                  step.situation === "تم التوصيل" ||
                  step.situation === "تم الاسترجاع" ||
                  step.situation === "إسترجاع جزئي"
              ) ? (
                <Button variant="bordered" color="warning" className="w-[100%]">
                  {
                    order?.situationSteps[order?.situationSteps.length - 1]
                      ?.situation
                  }
                </Button>
              ) : (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      color="warning"
                      startContent={Icons.ArrowUturnDownIcon}
                      className="w-[100%]"
                    >
                      {selectedValueSituationOrder}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="warning"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedSituationOrder}
                    onSelectionChange={(keys: string[] | any) =>
                      handleSelectionOrder(keys)
                    }
                  >
                    <DropdownItem key="تم التوصيل">
                      <p className="text-center">تم التوصيل</p>
                    </DropdownItem>
                    <DropdownItem key="تم الإسترجاع">
                      <p className="text-center">تم الإسترجاع</p>
                    </DropdownItem>
                    <DropdownItem key="إسترجاع جزئي">
                      <p className="text-center">إسترجاع جزئي</p>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
              {selectedValueSituationOrder === "تم الإسترجاع" && (
                <p className="w-[100%] text-center text-sm text-danger-600 my-2">
                  سيتم إرسال منتجات الطلبيه للمخزن الخاص بك
                </p>
              )}

              <div className="flex justify-end">
                {!closeBtn ? (
                  <p
                    onClick={EditOrder}
                    className="bg-warning-300 focus:bg-warning-400 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center"
                  >
                    تغيير الحالة
                  </p>
                ) : (
                  <p className="bg-warning-100 focus:bg-warning-400 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center">
                    تغيير الحالة
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <DivCheck link="/delivery" />
      )}
    </>
  );
}
