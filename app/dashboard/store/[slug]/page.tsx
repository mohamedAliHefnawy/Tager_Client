"use client";

// react
import { useCallback, useEffect, useState } from "react";
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
import ModaelConvertStore from "@/components/dashboard/modals/store/modaelConvertStore";

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
  image: string[];
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
  image: string[];
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

interface ReturnOrders {
  idProduct: string;
  imageProduct: string;
  nameProduct: string;
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
}

export default function ProductsInStore({
  params,
}: {
  params: { slug: string };
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Stores[]>([]);
  const [searchText, setSearchText] = useState("");
  const [nameStore, setNameStore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const [products, setProducts] = useState<Products[]>([]);
  const [returnOrders, setReturnOrders] = useState<ReturnOrders[]>([]);

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

  const ReturnProductswithStore = (idProduct: string) => {
    const productOrderId = products.find((item) => item._id === idProduct);

    if (productOrderId) {
      const isProductInReturnOrders = returnOrders.some(
        (item) => item.idProduct === productOrderId._id
      );

      if (!isProductInReturnOrders) {
        const updatedReturnOrders = [
          ...returnOrders,
          {
            idProduct: productOrderId._id,
            nameProduct: productOrderId.name,
            imageProduct: productOrderId.image[0],
            amount: productOrderId.amount || 0,
            size: productOrderId.size || [],
            store: nameStore || "",
          },
        ];

        setReturnOrders(updatedReturnOrders);
      } else {
        const updatedReturnOrders = returnOrders.filter(
          (item) => item.idProduct !== productOrderId._id
        );
        setReturnOrders(updatedReturnOrders);
      }
    }
  };

  const fetchDataProductsInStore = useCallback(async () => {
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
  }, [params.slug, secretKey]);
  useEffect(() => {
    fetchDataProductsInStore();
  }, [fetchDataProductsInStore]);

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
                currentItems.map((product, indexProduct) => (
                  <div
                    key={indexProduct}
                    onClick={() => ReturnProductswithStore(product._id)}
                    className={`flex justify-between bg-warning-50 border-1 p-6 rounded-2xl hover:cursor-pointer ${
                      returnOrders.some(
                        (item) => item.idProduct === product._id
                      )
                        ? "border-danger-600"
                        : ""
                    }`}
                  >
                    <p className="text-right text-lg mr-1 w-[100%]">
                      <span>
                        <p className="flex items-center justify-evenly mb-4">
                          <p>{product.name}</p>
                          <p>
                            <Avatar src={`${product.image[0]}`} size="lg" />
                          </p>
                        </p>
                        <p>
                          {product.size.map((item, index) => {
                            const storeInfo = item.store.find(
                              (filteStore) => filteStore.nameStore === nameStore
                            );
                            const availableAmount = storeInfo
                              ? storeInfo.amount
                              : 0;

                            return (
                              <p
                                key={index}
                                className="flex items-center justify-evenly"
                              >
                                <p className="flex">({availableAmount})</p>
                                <p className="flex">
                                  <p className="mr-1">{item.size}</p>
                                  <p> المقاس </p>
                                </p>
                              </p>
                            );
                          })}
                        </p>
                      </span>
                    </p>
                  </div>
                ))
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
        <div className="ml-3">
          <ModaelConvertStore
            productsConvert={returnOrders}
            storeWith={nameStore}
          />
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
                  <div className="w-[100%] flex justify-end">{Details()}</div>
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
