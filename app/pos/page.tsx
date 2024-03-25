"use client";

// react
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

//components
import NavBarPos from "@/components/pos/navbar";
import SideBarPos from "@/components/pos/sideBar";
import BodyPos from "@/components/pos/body";
import useCheckLogin from "@/components/pos/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import Loading from "@/components/loading";
import linkServer from "@/linkServer";

//imges
import error from "@/public/img/notfound.png";

interface Product {
  _id: string;
  name: string;
  size: [{ size: string; store: [{ amount: number; nameStore: string }] }];
  color: string;
  price3: number;
  image: string[];
  products: [
    {
      _id: string;
      name: string;
      image: string[];

      size: [{ size: string; store: [{ amount: number; nameStore: string }] }];
      color: string;
      price1: string;
      price2: string;
      price3: number;
      catogry: string;
    }
  ];
  catogry: string;
}

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameKasheer, valKasheer] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [catFilter, setCatFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [moneyData, setMoneyData] = useState({
    idInvoice: "",
    deduct: 0,
    money: 0,
    notes: "",
    date: "",
    time: "",
    acceptMoney: true,
    _id: "",
  });
  const selectedCatogry = (val: string) => {
    setCatFilter(val);
  };
  const searchTextFilter = (val: string) => {
    setTextFilter(val);
  };

  const upadteParent3 = (dataMoney: {
    idInvoice: string;
    deduct: number;
    money: number;
    notes: string;
    date: string;
    time: string;
    acceptMoney: boolean;
    _id: string;
  }) => {
    setMoneyData(dataMoney);
  };

  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get(
        `${linkServer.link}categories/getCategories`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      const productsResponse = await axios.get(
        `${linkServer.link}products/getProducts`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      setCategories(categoriesResponse.data.categories);
      setProducts(productsResponse.data.products);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (nameKasheer) {
      const timeoutId = setTimeout(() => {
        setUsername(nameKasheer);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [nameKasheer]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : nameKasheer ? (
          <>
            <div className="bg-zinc-200 flex justify-center items-center lg:h-auto min-h-screen lg:block md:hidden sm:hidden max-sm:hidden">
              <div className="bg-white h-screen p-6">
                <div className="flex ">
                  <div className="">
                    <SideBarPos moneyData={moneyData} />
                  </div>
                  <div className="w-[100%]">
                    <NavBarPos
                      selectedCatogryParent={selectedCatogry}
                      searchTextFilt={searchTextFilter}
                      categories={categories}
                    />
                    <BodyPos
                      products={products}
                      catogryFilter={catFilter}
                      searchTextFilt={textFilter}
                      upadteParent3={upadteParent3}
                    />
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
          <DivCheck link="/pos/login" />
        )}
      </div>
    </>
  );
}
