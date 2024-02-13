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
import { Card, CardBody, CardFooter, Pagination, Spinner } from "@nextui-org/react";

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

export default function Home() {
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [stores, setStores] = useState<Stores[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(true);
  const itemsPerPage = 6;
  const [nameStore, setNameStore] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredCategories = stores.filter((store) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (store.name && store.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (store.gbs && store.gbs.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddCategory = (newStore: Stores) => {
    setStores((prevStores) => [...prevStores, newStore]);
  };

  const GetStores = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; stores: any } };
      response = await axios.get(`${linkServer.link}stores/getStores`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setStores(response.data.stores);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetStores();
  }, []);

  const Details = () => {
    return (
      <>
        <div className=" w-[100%]">
          <div className="flex justify-between items-center">
            <div className="w-[50%]">
              <input
                type="text"
                placeholder=" بحث ..."
                className="w-[30%] input"
                onChange={handleSearchChange}
                value={searchText}
              />
            </div>
          </div>
          <div className="mt-3 ml-2 text-black opacity-60 text-sm">
            <p>Total {filteredCategories.length} Store </p>
          </div>

          <div>
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-6">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Spinner size="lg" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <p className="text-default-500">لا توجد نتائج للبحث</p>
              ) : (
                currentItems.map((store, indexStore) => (
                  <Card
                    shadow="sm"
                    key={indexStore}
                    className="hover:cursor-pointer hover:translate-x-[-5px] transition-transform"
                    // onFocus={message}
                    // style={{ opacity: moneySafe.active === true ? 1 : 0.5 }}
                    // isPressable={moneySafe.active === true}
                    // onClick={() =>
                    //   router.push(`/dashboard/moneySafe/${moneySafe._id}`)
                    // }
                  >
                    <CardBody className="overflow-visible  p-6 flex flex-col items-end">
                      <p className="flex mb-4">
                        <span className="mr-2">{store.name}</span>
                        <span className="opacity-65"> :- الإسم </span>
                      </p>
                      <p className="flex mb-4">
                        <span className="mr-2">{store.gbs}</span>
                        <span className="opacity-65"> :- المكان </span>
                      </p>
                      <p className="flex mb-4">
                        <span className="mr-2">{store.priceDelivery}</span>
                        <span className="opacity-65"> :- سعر التوصيل </span>
                      </p>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>

           
          </div>
          <div className="pagination">
            <Pagination
              className=" mb-3"
              showShadow
              color="primary"
              variant="faded"
              total={Math.ceil(filteredCategories.length / itemsPerPage)}
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
                    <Stores />
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
