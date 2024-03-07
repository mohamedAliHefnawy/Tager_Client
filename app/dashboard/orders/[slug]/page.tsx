"use client";

//react
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/dashboard/navbar";
import SideBar from "@/components/dashboard/sidebar";
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import Loading from "@/components/loading";

//nextUi
import { Avatar, Pagination, Spinner } from "@nextui-org/react";

//imgaes
import error from "@/public/img/notfound.png";

interface Order {
  _id: string;
  name: string;
  price: string;
  amount: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  address: string;
  date: string;
  time: string;
  deliveryPrice: string;
  marketer: string;
  gainMarketer: string;
  situation: string;
  details: [
    {
      price: number;
      amount: number;
      time: string;
      date: string;
      expirydate: String;
    }
  ];
  products: [
    {
      imageProduct: string;
      nameProduct: string;
      expirydate: string;
      price: number;
      amount: number;
      time: string;
      date: string;
      size: string;
    }
  ];
}

export default function Home({ params }: { params: { slug: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ItemsPerPage = 3;
  const totalPages = Math.ceil((order?.products?.length || 0) / ItemsPerPage);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = order?.products.slice(indexOfFirstItem, indexOfLastItem);

  const table = () => {
    return (
      <>
        <div>
          <div>
            <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
              <div className="w-[20%] text-center">
                <p> الصورة </p>
              </div>
              <div className="w-[20%] text-center">
                <p> إسم المنتج </p>
              </div>
              <div className="w-[20%] text-center">
                <p> المقاس </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الكمية </p>
              </div>
              <div className="w-[20%] text-center">
                <p> سعر المنتج </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الإجمالي </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : order ? (
              <div>
                {currentItems &&
                  currentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
                    >
                      <div className="w-[20%] flex justify-center">
                        <Avatar src={item.imageProduct} />
                      </div>
                      <div className="w-[20%] text-center">
                        <p> {item.nameProduct} </p>
                      </div>
                      <div className="w-[20%] text-center">
                        <p> {item.size} </p>
                      </div>
                      <div className="w-[20%] text-center">
                        <p> {item.amount} </p>
                      </div>
                      <div className="w-[20%] text-center">
                        <p> {item.price} </p>
                      </div>
                      <div className="w-[20%] text-center">
                        <p> {item.amount * item.price} </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p>لم يتم العثور على بيانات الكارت</p>
            )}
            <Pagination
              showShadow
              color="warning"
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  };

  const orderDiv = () => {
    return (
      <>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="flex ">
              <div className="w-[50%]">
                <div className="flex">
                  <p className="mr-2 text-black opacity-70"> كود الطلبية : </p>
                  <p className="text-warning-700"> {params.slug} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> اسم العميل : </p>
                  <p className="text-warning-700"> {order?.nameClient} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> رقم هاتف 1 : </p>
                  <p className="text-warning-700"> {order?.phone1Client} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> رقم هاتف 2 : </p>
                  <p className="text-warning-700"> {order?.phone2Client} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> العنوان : </p>
                  <p className="text-warning-700"> {order?.address} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> التاريخ : </p>
                  <p className="text-warning-700"> {order?.date} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> الوقت : </p>
                  <p className="text-warning-700"> {order?.time} </p>
                </div>
              </div>
              <div>
                <div className="flex">
                  <p className="mr-2 text-black opacity-70">مندوب التسويق :</p>
                  <p className="text-warning-700"> {order?.marketer} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> ربح المسوق : </p>
                  <p className="text-warning-700"> {order?.gainMarketer} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> سعر التوصيل : </p>
                  <p className="text-warning-700"> {order?.deliveryPrice} </p>
                </div>
                <div className="flex my-5">
                  <p className="mr-2 text-black opacity-70"> حالة الطلبية: </p>
                  <p className="text-warning-700"> {order?.situation} </p>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const fetchDataStore = useCallback(async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; order: any } };
      response = await axios.get(
        `${linkServer.link}orders/getOrder/${params.slug}`,
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
  }, [params.slug, secretKey]);

  useEffect(() => {
    fetchDataStore();
  }, [fetchDataStore]);

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
                  <div className="w-[100%]">
                    {orderDiv()}
                    {table()}
                  </div>
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
