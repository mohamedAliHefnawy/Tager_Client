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
import ModaelRecoveryProduct from "@/components/users/models/modaelRecoveryProduct";
import ModaeEditOrderProduct from "@/components/users/models/modaeEditOrderProduct";
import Loading from "@/components/loading";

//nextUi
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import { EllipsisverticalIcon } from "@/public/svg/ellipsisverticalIcon";
import { ChatbubbleleftrightIcon } from "@/public/svg/chatbubbleleftrightIcon";

export default function Home() {
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDivCaht, setShowDivCaht] = useState(true);
  const [imgUser, setImgUser] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [showPropver, setShowPropver] = useState(true);

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
    EllipsisverticalIcon: <EllipsisverticalIcon />,
    ChatbubbleleftrightIcon: <ChatbubbleleftrightIcon />,
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

  const Body = () => {
    return (
      <>
        <div className=" w-[100%] flex justify-center py-6">
          <p className="text-4xl">الطلبات</p>
        </div>
        <div className="lg:p-20 md:p-20 lg:pt-0 md:pt-0 sm:p-0 max-sm:p-0 sm:pt-0 max-sm:pt-0 w-[100%] overflow-x-scroll">
          <table className="border-1 border-[var(--mainColor)] w-[100%] text-center p-4">
            <tr className="border-1 border-[var(--mainColor)] text-sm">
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                إسم العميل
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                رقم الهاتف
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                الإجمالي
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                <p className="p-4">الربح</p>
              </th>
              <th className="border-1 border-[var(--mainColor)] w-60 mx-2">
                المكان
              </th>
              <th className="border-1 border-[var(--mainColor)] w-60 mx-2">
                تاريخ الطلب
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                الحالة
              </th>
              <th className="border-1 border-[var(--mainColor)]">-</th>
            </tr>

            <tr className="border-1 border-[var(--mainColor)] bg-[var(--mainColorRgba)]">
              <td className="border-1 border-[var(--mainColor)] w-24 mx-2">
                <p className="flex justify-center p-5">محمد علي</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="p-4">01022595631</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <p className="mr-1">د.ل</p>
                  <p>300</p>
                </p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <p className="mr-1">د.ل</p>
                  <p>100</p>
                </p>
              </td>
              <td className="border-1 border-[var(--mainColor)] p-3">
                <p className="flex justify-center p-3">الاسكندرية-المعمورة</p>
              </td>
              <td className="border-1 border-[var(--mainColor)] ">
                <p className="flex justify-center p-3">21-12-2223</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">تم التوصيل</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <Popover>
                    <PopoverTrigger>
                      <span className="hover:cursor-pointer">
                        {Icons.EllipsisverticalIcon}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className=" border-1 border-[var(--mainColor)]">
                      <div className="px-1 py-2 ">
                        <ModaeEditOrderProduct />

                        <ModaelRecoveryProduct />

                        <p
                          onClick={() => setShowDivCaht(!showDivCaht)}
                          className="bg-primary-200 border-1 border-primary-300 p-4 rounded-full text-primary-800 hover:cursor-pointer mt-1"
                        >
                          {Icons.ChatbubbleleftrightIcon}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </p>
              </td>
            </tr>
            <tr className="border-1 border-[var(--mainColor)] bg-[var(--mainColorRgba)]">
              <td className="border-1 border-[var(--mainColor)] w-24 mx-2">
                <p className="flex justify-center p-5">محمد علي</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="p-4">01022595631</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <p className="mr-1">د.ل</p>
                  <p>300</p>
                </p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <p className="mr-1">د.ل</p>
                  <p>100</p>
                </p>
              </td>
              <td className="border-1 border-[var(--mainColor)] p-3">
                <p className="flex justify-center p-3">الاسكندرية-المعمورة</p>
              </td>
              <td className="border-1 border-[var(--mainColor)] ">
                <p className="flex justify-center p-3">21-12-2223</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">تم التوصيل</p>
              </td>
              <td className="border-1 border-[var(--mainColor)]">
                <p className="flex justify-center p-3">
                  <Popover>
                    <PopoverTrigger>
                      <span className="hover:cursor-pointer">
                        {Icons.EllipsisverticalIcon}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className=" border-1 border-[var(--mainColor)]">
                      <div className="px-1 py-2 ">
                        <ModaeEditOrderProduct />

                        <ModaelRecoveryProduct />

                        <p
                          onClick={() => setShowDivCaht(!showDivCaht)}
                          className="bg-primary-200 border-1 border-primary-300 p-4 rounded-full text-primary-800 hover:cursor-pointer mt-1"
                        >
                          {Icons.ChatbubbleleftrightIcon}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </p>
              </td>
            </tr>
          </table>
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

              {Body()}
              <div
                className={`fixed right-0 bottom-0 lg:w-[30%] md:w-[30%] sm:w-[90%] max-sm:w-[90%] h-auto max-h-48 overflow-y-auto z-50 border-1 border-[var(--mainColor)] bg-warning-100 rounded-3xl p-10 pt-2 mr-2 ${
                  showDivCaht && "hidden"
                }`}
              >
                <div className="w-[100%] flex justify-end ">
                  <span
                    onClick={() => setShowDivCaht(!showDivCaht)}
                    className="p-4 hover:cursor-pointer text-danger-600"
                  >
                    ⌧
                  </span>
                </div>
                <div className="text-center">لا يوجد رسائل</div>
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
