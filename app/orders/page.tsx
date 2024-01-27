"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TwitterPicker } from "react-color";
import axios from "axios";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import ModaelRecoveryProduct from "@/components/users/models/modaelRecoveryProduct";
import ModaeEditOrderProduct from "@/components/users/models/modaeEditOrderProduct";
import Loading from "@/components/loading";

//nextUi
import {
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import { EllipsisverticalIcon } from "@/public/svg/ellipsisverticalIcon";
import { ChatbubbleleftrightIcon } from "@/public/svg/chatbubbleleftrightIcon";

interface Orders {
  _id: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  store: string;
  address: string;
  marketer: string;
  totalPriceProducts: number;
  gainMarketer: number;
  situation: string;
  date: string;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showDivCaht, setShowDivCaht] = useState(true);
  const [imgUser, setImgUser] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [showPropver, setShowPropver] = useState(true);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const currentItems = orders
    .filter((item) => item.marketer === username)
    .slice(indexOfFirstItem, indexOfLastItem);

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
              <th className="border-1 border-[var(--mainColor)] w-48 mx-2">
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

            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" color="warning" />
              </div>
            ) : orders.filter((item) => item.marketer === username).length >
              0 ? (
              currentItems.map((order, index) => (
                <tr
                  key={index}
                  className="border-1 border-[var(--mainColor)] bg-[var(--mainColorRgbaa)]"
                >
                  <td className="border-1 border-[var(--mainColor)] w-48 mx-2">
                    <p className="flex justify-center p-5">
                      {order.nameClient}
                    </p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="p-4">{order.phone1Client}</p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">
                      <p className="mr-1">د.ل</p>
                      <p>{order.totalPriceProducts}</p>
                    </p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">
                      <p className="mr-1">د.ل</p>
                      <p>{order.gainMarketer}</p>
                    </p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)] p-3">
                    <p className="flex justify-center p-3">{order.address}</p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)] ">
                    <p className="flex justify-center p-3">{order.date}</p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">{order.situation}</p>
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
              ))
            ) : (
              <p className="p-4">لا يوجد طلبات</p>
            )}
          </table>
          <div className="pagination mt-3">
            <Pagination
              className=" mb-3"
              showShadow
              color="warning"
              variant="faded"
              total={Math.ceil(orders.length / itemsPerPage)}
              initialPage={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  };

  const GetOrders = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; orders: any } };
      response = await axios.get(
        "https://tager-server.vercel.app/orders/getOrders",
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetOrders();
  }, []);

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
          <DivCheck link="/auth/login" />
        )}
      </div>
    </>
  );
}
