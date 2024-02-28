"use client";

//react
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import linkServer from "@/linkServer";


//components
import NavBar from "@/components/dashboard/navbar";
import SideBar from "@/components/dashboard/sidebar";
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import ModelPaymentpurchases from "@/components/dashboard/modals/purchases/modaelPaymentpurchases";
import ModaelStepsPaymentpurchases from "@/components/dashboard/modals/purchases/modaelStepsPaymentpurchases";
import Loading from "../loading";

// react
import { useEffect, useState } from "react";

//imgaes
import error from "@/public/img/notfound.png";

//nextUi
import { Card, CardBody, CardFooter, Pagination } from "@nextui-org/react";

interface Purchasess {
  _id: string;
  name: string;
  Products: [
    {
      _id: string;
      name: string;
      image: string;
      price: string;
      amount: string;
      details: [
        { size: string; store: [{ nameStore: string; amount: number }] }
      ];
    }
  ];
  stepsPayment: [
    { _id: string; price: string; employee: string; date: string; time: string }
  ];
  active: Boolean;
  supplier: string;
  totalProducts: number;
  payment: string;
  indebt: number;
  date: string;
  time: string;
  moneySafe: string;
  totalPrice: number;
}
export default function Home({ params }: { params: { slug: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [purchasess, setPurchasess] = useState<Purchasess[]>([]);
  const router = useRouter();
  const itemsPerPage = 6;
  const decodedSlug = decodeURIComponent(params.slug);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasess
    .filter((item) => item.supplier === decodedSlug)
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(purchasess.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const Cards = () => {
    return (
      <>
        <div className="flex justify-between">{/* <ModaelBills /> */}</div>
        <div className="my-3 ml-2 text-slate-300 text-xs"></div>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 w-[100%]">
          {currentItems
            .filter((item) => item.supplier === decodedSlug)
            .map((item, index) => (
              <Card
                shadow="sm"
                key={index}
                onClick={() => router.push(`/dashboard/moneySafe/${item._id}`)}
                className="p-4 w-[100%]"
              >
                <CardBody className="overflow-visible p-0">
                  <p className="text-right w-[100%]">
                    <div className="flex w-[100%] justify-end mt-4">
                      <p className="text-slate-800 font-bold mr-2">
                        {item.totalProducts}
                      </p>
                      <p> : عدد المنتجات </p>
                    </div>
                    <div className="flex">
                      <div className="flex w-[100%] justify-end mt-4">
                        <p className="text-slate-800 font-bold mr-2">
                          {item.date}
                        </p>
                        <p> : التاريخ </p>
                      </div>
                      <div className="flex w-[100%] justify-end mt-4">
                        <p className="text-slate-800 font-bold mr-2">
                          {item.time}
                        </p>
                        <p> : الوقت </p>
                      </div>
                    </div>
                    <div className="flex w-[100%] justify-end mt-4">
                      <p className="text-slate-800 font-bold mr-2">
                        {item.supplier}
                      </p>
                      <p> : المورد </p>
                    </div>
                    <div className="flex w-[100%] justify-between items-center mt-4">
                      <div className=" justify-end">
                        {/* {+item.totalPrice !== 0 && ( */}
                        <ModelPaymentpurchases
                          idPurchase={item._id}
                          namePatient={""}
                          totalPrice={item.totalPrice}
                          indept={item.indebt}
                          moneySafee={item.moneySafe}
                          supplierr={item.supplier}
                          discount={""}
                        />
                        {/* )} */}
                      </div>
                      <div className="flex justify-end items-center">
                        <p className="text-slate-800 font-bold mr-2">
                          {item.moneySafe}
                        </p>
                        <p> : طريقة الدفع </p>
                      </div>
                    </div>
                    <ModaelStepsPaymentpurchases
                      paymentSteps={item.stepsPayment}
                      products={item.Products}
                    />
                  </p>
                </CardBody>
                <CardFooter className="text-small justify-between"></CardFooter>
              </Card>
            ))}
        </div>
      </>
    );
  };

  const GetPurchasess = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; purchases: any } };
      response = await axios.get(
        `${linkServer.link}purchases/getpurchases`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setPurchasess(response.data.purchases);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPurchasess();
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
                  <div className="w-[100%]">
                    <Cards />
                    <div className=" mt-4">
                      <Pagination
                        showShadow
                        color="warning"
                        total={totalPages}
                        initialPage={currentPage}
                        onChange={handlePageChange}
                      />
                    </div>
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
