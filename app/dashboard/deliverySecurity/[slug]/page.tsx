"use client";

//react
import axios from "axios";
import Image from "next/image";

import { format, isValid, parse } from "date-fns";

//components
import NavBar from "../../../../components/dashboard/navbar";
import SideBar from "../../../../components/dashboard/sidebar";
import useCheckLogin from "../../../../components/dashboard/checkLogin/checkLogin";
import ModaelDeliverySecurity from "@/components/dashboard/modals/deliverySecurity/modaelDeliverySecurity";
import DivCheck from "../../../../components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

// react
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//imgaes
import error from "../../../../public/img/notfound.png";

//nextUi
import {
  Button,
  Input,
  Pagination,
  Spinner,
  Textarea,
} from "@nextui-org/react";

interface MoneyItem {
  value: string;
  notes: string;
  date: string;
  time: string;
  person: string;
}

interface MoneySafeDetails {
  _id: string;
  name: string;
  money: MoneyItem[];
  active: boolean;
  notes: string;
}

interface Data {
  _id: string;
  name: string;
  phone: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  address: string;
  marketer: string;
  situationSteps: [{ situation: string }];
  orders: [];
  money: [
    {
      money: number;
      notes: string;
      date: string;
      time: string;
      acceptMoney: boolean;
    }
  ];
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

export default function Home({ params }: { params: { slug: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [num, setNum] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [moneySafe, setMoneySafe] = useState<MoneySafeDetails>();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataDelivery, setDataDelivery] = useState<Data[]>([]);

  const ItemsPerPage = 3;

  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;

  const details = () => {
    return (
      <>
        <div className="flex justify-between">
          {loading ? (
            <p>
              <Spinner color="warning" size="lg" />
            </p>
          ) : dataDelivery ? (
            <div className="w-[100%] flex justify-between">
              <div className="border-1 border-warning-200 rounded-2xl p-10 w-[49%] flex flex-col items-center">
                <p className="text-lg">في إنتظار التوصيل ...</p>
                <div className="grid gab-1 grid-cols-2 w-[100%] my-3">
                  {dataDelivery && dataDelivery.length > 0 ? (
                    dataDelivery
                      .filter((item0) =>
                        item0.situationSteps.some(
                          (step) => step.situation === "مع الشحن"
                        )
                      )
                      .map((item, indexItem) => (
                        <p
                          key={indexItem}
                          className="border-1 border-slate-200 rounded-lg mr-1 p-4 text-right text-lg"
                        >
                          <span className="block mb-2">
                            <span>{item.nameClient}</span>
                            <span> | إسم العميل </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.phone1Client}</span>
                            <span> | رقم الهاتف1 </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.phone2Client}</span>
                            <span> | رقم الهاتف2 </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.address}</span>
                            <span> | العنوان </span>
                          </span>
                          <span className="block mb-2">
                            <span> المسوق |</span>
                            <span>{item.marketer}</span>
                          </span>
                          <ModaelDeliverySecurity products={item.products} />
                        </p>
                      ))
                  ) : (
                    <p>لا</p>
                  )}
                </div>
              </div>
              <div className="border-1 border-warning-200 rounded-2xl p-10 w-[49%] flex flex-col items-center">
                <p className="text-lg">راجع</p>
                <div className="grid gab-1 grid-cols-2 w-[100%] my-3">
                  {dataDelivery && dataDelivery.length > 0 ? (
                    dataDelivery
                      .filter((item0) =>
                        item0.situationSteps.some(
                          (step) =>
                            step.situation === "تم الإسترجاع" || "إسترجاع جزئي"
                        )
                      )
                      .map((item, indexItem) => (
                        <p
                          key={indexItem}
                          className="border-1 border-slate-200 rounded-lg mr-1 p-4 text-right text-lg"
                        >
                          <span className="block mb-2">
                            <span>{item.nameClient}</span>
                            <span> | إسم العميل </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.phone1Client}</span>
                            <span> | رقم الهاتف1 </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.phone2Client}</span>
                            <span> | رقم الهاتف2 </span>
                          </span>
                          <span className="block mb-2">
                            <span>{item.address}</span>
                            <span> | العنوان </span>
                          </span>
                          <span className="block mb-2">
                            <span> المسوق |</span>
                            <span>{item.marketer}</span>
                          </span>
                          <ModaelDeliverySecurity products={item.products} />
                        </p>
                      ))
                  ) : (
                    <p>لا</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="w-[100%] h-screen flex justify-center items-center">
              لم يتم العثور علي أي بيانات
            </p>
          )}
        </div>
      </>
    );
  };

  // const AddMoney = async () => {
  //   try {
  //     const currentDate = new Date();
  //     const currentTime = currentDate.toLocaleTimeString();
  //     const currentDateStr = currentDate.toLocaleDateString();

  //     const response = await axios.post(
  //       `https://tager-server.vercel.app/payment/addpayment/${params.slug}`,
  //       {
  //         num: num,
  //         notes: notes,
  //         person: nameAdmin,
  //         date: currentDateStr,
  //         time: currentTime,
  //       }
  //     );

  //     if (response.data === "yes") {
  //       window.location.reload();
  //     }
  //     if (response.data === "no") {
  //       alert("توجد مشكلة ما. حاول مرة أخرى 😓");
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const GetDataDelivery = async () => {
    try {
      let response: { data: { token: string; orders: any } };
      response = await axios.get(
        `https://tager-server.vercel.app/users/getDeliveryProductStore/${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setDataDelivery(response.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDataDelivery();
  }, []);

  useEffect(() => {
    if (nameAdmin) {
      const timeoutId = setTimeout(() => {
        setUsername(nameAdmin);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [nameAdmin]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : nameAdmin ? (
          <>
            <div className="bg-zinc-200 lg:h-auto min-h-screen flex justify-between max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
              <div className="w-[20%] bg-white">
                <SideBar />
              </div>
              <div className="w-[100%] flex-col flex items-center ">
                <NavBar />
                <div className="w-[80%] h-5"></div>
                <div className="w-[90%]  bg-slate-100 rounded-r-3xl  rounded-2xl p-6 min-h-screen">
                  <div className="w-[100%]">{details()}</div>
                </div>
              </div>
            </div>

            <div className="flex max-2xl:hidden max-xl:hidden lg:hidden md:flex sm:flex max-sm:flex h-screen flex-col items-center justify-center">
              <Image src={error} alt={"error"} width={200} height={300} />
              <p> عفوا مقاس الشاشه الخاص بك غير مدعوم ☹ </p>
            </div>
          </>
        ) : (
          <DivCheck link="/dashboard" />
        )}
      </div>
    </>
  );
}
