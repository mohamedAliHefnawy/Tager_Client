"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TwitterPicker } from "react-color";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import ModaelPullMoney from "@/components/users/models/modaelPullMoney";
import Loading from "@/components/loading";

//nextUi
import { Avatar, Card, CardBody, Tab, Tabs } from "@nextui-org/react";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import axios from "axios";

interface Data {
  _id: string;
  name: string;
  money: [
    {
      money: number;
      notes: string;
      date: string;
      time: string;
      acceptMoney: boolean;
    }
  ];
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imgUser, setImgUser] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [dataUser, setDataUser] = useState<Data>();

  const [color, setColor] = useState("#FF6900");

  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const TotalMoney = dataUser?.money
    .filter((money) => money.acceptMoney === false)
    .reduce((calc, alt) => calc + alt.money, 0);

  const GetDataUser = async () => {
    try {
      let response: { data: { token: string; user: any } };
      response = await axios.get(`${linkServer.link}users/getUser/${user}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setDataUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      GetDataUser();
    }
  }, [user]);

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="المحفظه">
              <Card>
                <CardBody>
                  <div className=" h-auto flex flex-col items-center">
                    <div className="bg-slate-100 lg:w-[35%] md:w-[50%] sm:w-[100%] max-sm:w-[100%] flex flex-col items-center p-4 text-2xl rounded-full">
                      <p>أرباح جاهزة للسحب</p>
                    </div>
                    <div className="bg-slate-100 w-[35%] flex flex-col items-center p-4 mt-1 rounded-3xl">
                      <p className="flex text-xl">
                        <p className="mr-1">د.ل</p>
                        <p>{TotalMoney}</p>
                      </p>
                      <div className="mt-4">
                        <ModaelPullMoney />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="2" title="السحوبات السابقة">
              <Card>
                <CardBody>
                  <div className="lg:block md:block sm:hidden max-sm:hidden">
                    <div className="bg-slate-200 rounded-3xl py-3 flex justify-evenly">
                      <p className="w-[15%]">الحاله</p>
                      <p className="w-[15%]">رقم الهاتف</p>
                      <p className="w-[15%]">طريقة الدفع</p>
                      <p className="w-[15%]">المبلغ</p>
                    </div>
                    <div className="bg-slate-100 rounded-3xl py-3 mt-4">
                      <div className="flex justify-evenly ">
                        <p className="text-success-500 w-[15%]">
                          تم التحويل بنجاح
                        </p>
                        <p className="w-[15%]">01022595631</p>
                        <p className="w-[15%]">فوادفون كاش</p>
                        <p className="flex w-[15%]">
                          <p className="mr-1">د.ل</p>
                          <p>100</p>
                        </p>
                      </div>
                      <div className="flex justify-evenly mt-3">
                        <p className="text-warning-500 w-[15%]">في الإنتظار</p>
                        <p className="w-[15%]">01022595631</p>
                        <p className="w-[15%]">فوادفون كاش</p>
                        <p className="flex w-[15%]">
                          <p className="mr-1">د.ل</p>
                          <p>122</p>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:hidden md:hidden sm:block max-sm:block">
                    <div className="  rounded-3xl bg-slate-100 p-6">
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p>د.ل</p>
                          <p>100</p>
                        </p>
                        <p style={{ direction: "rtl" }}>المبلغ |</p>
                      </p>
                      <p className="flex justify-end my-3">
                        <p className="flex mr-2">
                          <p>01022595631</p>
                        </p>
                        <p style={{ direction: "rtl" }}>رقم الهاتف |</p>
                      </p>
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p className="text-success-500">تم التحويل بنجاح</p>
                        </p>
                        <p style={{ direction: "rtl" }}>الحالة |</p>
                      </p>
                    </div>
                    <div className=" rounded-3xl bg-slate-100 p-6">
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p>د.ل</p>
                          <p>100</p>
                        </p>
                        <p style={{ direction: "rtl" }}>المبلغ |</p>
                      </p>
                      <p className="flex justify-end my-3">
                        <p className="flex mr-2">
                          <p>01022595631</p>
                        </p>
                        <p style={{ direction: "rtl" }}>رقم الهاتف |</p>
                      </p>
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p className="text-warning-500">في الإنتظار</p>
                        </p>
                        <p style={{ direction: "rtl" }}>الحالة |</p>
                      </p>
                    </div>
                    <div className=" rounded-3xl bg-slate-100 p-6">
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p>د.ل</p>
                          <p>100</p>
                        </p>
                        <p style={{ direction: "rtl" }}>المبلغ |</p>
                      </p>
                      <p className="flex justify-end my-3">
                        <p className="flex mr-2">
                          <p>01022595631</p>
                        </p>
                        <p style={{ direction: "rtl" }}>رقم الهاتف |</p>
                      </p>
                      <p className="flex justify-end">
                        <p className="flex mr-2">
                          <p className="text-warning-500">في الإنتظار</p>
                        </p>
                        <p style={{ direction: "rtl" }}>الحالة |</p>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        setUsername(user);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : user ? (
          <>
            <div className="w-[100%] flex-col flex items-center">
              <NavBar
                user={user}
                lengthProductsInCart={0}
                lengthProductsInFavourite={0}
              />
              <div className=" w-[100%] lg:mb-96 md:mb-[500px] sm:mb-[500px] max-sm:mb-[500px] ">
                <div className="bg-[var(--mainColorRgba)] w-[100%] h-60 flex justify-center items-end">
                  <div className=" lg:flex md:block sm:block max-sm:block justify-between lg:w-[70%] md:w-[70%] sm:w-[90%] max-sm:w-[90%]  h-auto z-50  border-2 border-dashed bg-white border-[var(--mainColor)] rounded-3xl absolute top-40 ">
                    <div className="  w-[100%] p-4">{tabs()}</div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>
          </>
        ) : (
          <DivCheck link="/doctor" />
        )}
      </div>
    </>
  );
}
