"use client";

// react
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/dashboard/navbar";
import SideBar from "@/components/dashboard/sidebar";
import Stores from "@/components/dashboard/tables/store";
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import Loading from "@/components/loading";

//imges
import error from "@/public/img/notfound.png";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Pagination,
  Spinner,
} from "@nextui-org/react";

interface Employee {
  _id: string;
  name: string;
  phone1: string;
  phone2: string;
  password: string;
  image: string;
  validity: string;
}

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

interface Products {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

export default function ProductsInStore({
  params,
}: {
  params: { slug: string };
}) {
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [stores, setStores] = useState<Stores[]>([]);
  const [searchText, setSearchText] = useState("");
  const [nameStore, setNameStore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const [products, setProducts] = useState<Products[]>([]);

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProductsInStore = products.filter((store) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (store.name && store.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (store.gbs && store.gbs.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredProductsInStore.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const GetProductsInStore = async () => {
    setLoading(true);
    try {
      let response: {
        data: { token: string; final: any; Store: string };
      };
      response = await axios.get(
        `${linkServer.link}stores/getProductsInStore/${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setProducts(response.data.final);
      setNameStore(response.data.Store);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetProductsInStore();
  }, []);

  const Details = () => {
    return (
      <>
        <div className=" w-[100%]">
          <div className="flex justify-between items-center">
            <div className="w-[100%]">
              <input
                type="text"
                placeholder=" بحث ..."
                className="w-[100%] input"
                onChange={handleSearchChange}
                value={searchText}
              />
            </div>
          </div>
          <div className="mt-3 ml-2 text-black opacity-60 text-sm">
            <p>Total {filteredProductsInStore.length} Products </p>
          </div>

          <div>
            <div className="gap-2 grid grid-cols-4 mt-6">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Spinner size="lg" />
                </div>
              ) : filteredProductsInStore.length === 0 ? (
                <p className="text-default-500">لا توجد نتائج للبحث</p>
              ) : (
                currentItems.map((product, indexProduct) => {
                  return product.size.map((sizeItem, indexSize) => {
                    const storeInfo = sizeItem.store.find(
                      (store) => store.nameStore === nameStore
                    );

                    const availableAmount = storeInfo ? storeInfo.amount : 0;

                    return (
                      <div
                        key={`${indexProduct}-${indexSize}`}
                        className="flex justify-evenly items-center text-lg bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl h-20 py-5"
                      >
                        <p className="text-right text-lg mr-1 ">
                          <span>
                            {product.name} ({sizeItem.size}, {availableAmount})
                          </span>
                          <p className="flex justify-between">
                            <span className="text-lg text-success-700 flex justify-end">
                              <span className="mr-1">د.ل</span>
                              <span>{product.price1}</span>
                            </span>
                          </p>
                        </p>
                        <p>
                          <Avatar src={`${product.image[0]}`} size="lg" />
                        </p>
                      </div>
                    );
                  });
                })
              )}
            </div>
          </div>
          <div className="pagination mt-4">
            <Pagination
              className=" mb-3"
              showShadow
              color="warning"
              variant="faded"
              total={Math.ceil(filteredProductsInStore.length / itemsPerPage)}
              initialPage={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  };

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
                  <div className="w-[100%] flex justify-end">
                    <Details />
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
