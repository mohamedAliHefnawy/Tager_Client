"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TwitterPicker } from "react-color";

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

export default function Home() {
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imgUser, setImgUser] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [name, setName] = useState(user);
  const [nameCompany, setNameCompany] = useState("");
  const [phone1Company, setPhone1Company] = useState("");
  const [phone2Company, setPhone2Company] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [color, setColor] = useState("#FF6900");
  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };
  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const Icons = {
    ShoppingcartIcon: <ShoppingcartIcon />,
    DeleteIcon: <DeleteIcon />,
    PhotoIcon: <PhotoIcon />,
    EyeIcon: <EyeIcon />,
    EyeNotIcon: <EyeNotIcon />,
    PencilIcon: <PencilIcon />,
  };

  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };

  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    const image = (await imagebase64(file)) as string;
    setImgUser(image);
  };

  const handleUploadImageCompany = async (e: any) => {
    const file = e.target.files[0];
    const image = (await imagebase64(file)) as string;
    setImgCompany(image);
  };

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
                        <p>1000</p>
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
