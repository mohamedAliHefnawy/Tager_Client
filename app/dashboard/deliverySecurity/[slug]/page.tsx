"use client";

//react
import axios from "axios";
import Image from "next/image";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";

//components
import NavBar from "../../../../components/dashboard/navbar";
import SideBar from "../../../../components/dashboard/sidebar";
import useCheckLogin from "../../../../components/dashboard/checkLogin/checkLogin";
import ModaelDeliverySecurity from "@/components/dashboard/modals/deliverySecurity/modaelDeliverySecurity";
import DivCheck from "../../../../components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

// react
import { useEffect, useState } from "react";

//imgaes
import error from "../../../../public/img/notfound.png";

//nextUi
import { Avatar, Button, Spinner } from "@nextui-org/react";

interface MoneyItem {
  value: string;
  notes: string;
  date: string;
  time: string;
  person: string;
}

interface MoneySafeDetails {
  _id: string;
  name: string;
  money: MoneyItem[];
  active: boolean;
  notes: string;
}

interface Data {
  _id: string;
  name: string;
  phone: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  address: string;
  marketer: string;
  products: [
    {
      idProduct: string;
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
  idProduct: string;
  nameProduct: string;
  imageProduct: string;
  amount: number;
  price: number;
  size: string;
  store: string;
}

interface ReturnOrders {
  idProduct: string;
  amount: number;
  size: string;
  store: string;
}

interface InputValues {
  [productId: string]: {
    amount: number;
    size: string;
    store: string;
  };
}

export default function Home({ params }: { params: { slug: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataDelivery, setDataDelivery] = useState<Data[]>([]);
  const [dataDeliveryInStore, setDataDeliveryInStore] = useState<Data[]>([]);
  const [returnOrders, setReturnOrders] = useState<ReturnOrders[]>([]);
  const [inputValues, setInputValues] = useState<InputValues>({});

  const ReturnProductswithStore = (
    idProduct: string,
    sizeProduct: string,
    amountProduct: number,
    storeProduct: string
  ) => {
    const AmountAll = dataDeliveryInStore.reduce(
      (calc, alt) =>
        calc +
        (alt.idProduct === idProduct &&
        alt.size === sizeProduct &&
        alt.store === storeProduct
          ? alt.amount
          : 0),
      0
    );

    if (idProduct && sizeProduct) {
      const isProductInReturnOrders = returnOrders.some(
        (item) =>
          item.idProduct === idProduct &&
          item.size === sizeProduct &&
          item.store === storeProduct
      );

      if (!isProductInReturnOrders) {
        const currentInputValues = (inputValues as InputValues)[idProduct] || {
          store: "",
          size: "",
          amount: 0,
        };

        const storeValue = storeProduct || currentInputValues.store;
        const amountValue = AmountAll;

        const updatedReturnOrders = [
          ...returnOrders,
          {
            idProduct: idProduct,
            amount: amountValue,
            size: sizeProduct,
            store: storeValue,
          },
        ];

        setReturnOrders(updatedReturnOrders);
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [idProduct]: {
            ...currentInputValues,
            store: storeValue,
            size: sizeProduct,
            amount: amountValue,
          },
        }));
      }
    }
  };

  const details = () => {
    return (
      <>
        {/* {AmountAll} */}
        <div className="flex justify-between">
          {loading ? (
            <p>
              <Spinner color="warning" size="lg" />
            </p>
          ) : dataDelivery ? (
            <div className="w-[100%] flex justify-between">
              <div className="border-1 border-warning-200 rounded-2xl p-6 w-[49%] flex flex-col items-center">
                <p className="text-lg">في إنتظار التوصيل ...</p>
                <div className="grid gab-1 grid-cols-1 w-[100%] my-3">
                  {dataDelivery.map((item, indexItem) =>
                    item.nameClient ? (
                      <div
                        key={indexItem}
                        className="border-1 border-slate-400 rounded-2xl mr-1 p-4 text-right text-lg mb-1"
                      >
                        <span className="block mb-2">
                          <span>{item.nameClient}</span>
                          <span> | إسم العميل </span>
                        </span>
                        <span className="block mb-2">
                          <span>{item.phone1Client}</span>
                          <span> | رقم الهاتف1 </span>
                        </span>
                        <span className="block mb-2">
                          <span>{item.phone2Client}</span>
                          <span> | رقم الهاتف2 </span>
                        </span>
                        <span className="block mb-2">
                          <span>{item.address}</span>
                          <span> | العنوان </span>
                        </span>
                        <span className="block mb-2">
                          <span> المسوق |</span>
                          <span>{item.marketer}</span>
                        </span>
                        <ModaelDeliverySecurity products={item.products} />
                      </div>
                    ) : (
                      <p
                        key={`${indexItem}-${item}`}
                        className="w-[100%] text-center p-6"
                      ></p>
                    )
                  )}
                </div>
              </div>
              <div className="border-1 border-warning-200 rounded-2xl p-6 w-[49%] flex flex-col items-center">
                <p className="text-lg">راجع</p>
                <div className="my-2 p-2 pt-0  px-3 w-[100%]">
                  <div className="w-[100%] h-auto border-1 border-slate-400 text-center rounded-2xl p-3 gap-2 grid grid-cols-2">
                    {dataDeliveryInStore.map((product, indexProduct) =>
                      dataDeliveryInStore.length > 0 ? (
                        <div
                          key={indexProduct}
                          onClick={() =>
                            ReturnProductswithStore(
                              product.idProduct,
                              product.size,
                              product.amount,
                              product.store
                            )
                          }
                          className={`flex justify-evenly bg-warning-50 p-2 rounded-2xl text-lg hover:cursor-pointer ${
                            returnOrders.some(
                              (item) =>
                                item.idProduct === product.idProduct &&
                                item.size === product.size
                            )
                              ? "border-1 border-danger-600"
                              : ""
                          }`}
                        >
                          <p className="text-right text-[12px] mr-1">
                            <span className="">
                              {product.nameProduct} ({product.amount})
                            </span>
                            <p className="flex justify-between">
                              <span className="text-[12px] text-success-700 flex justify-end">
                                <span className="mr-1">د.ل</span>
                                <span>{product.price}</span>
                              </span>
                              <span className="text-[12px]">
                                {product.size}
                              </span>
                            </p>
                          </p>
                          <p>
                            <Avatar src={`${product.imageProduct}`} size="lg" />
                          </p>
                        </div>
                      ) : (
                        <p
                          key={`${indexProduct}-${product}`}
                          className="w-[200%] p-10 text-center"
                        >
                          لا يوجد منتجات
                        </p>
                      )
                    )}
                  </div>

                  <Button
                    color={closeBtn ? "default" : "warning"}
                    disabled={closeBtn}
                    className="opacity-90 rounded-full w-[100%] p-6 mt-6"
                    onClick={ReturnProductsToStore}
                  >
                    إسترجاع للمخزن
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="w-[100%] h-screen flex justify-center items-center">
              لم يتم العثور علي أي بيانات
            </p>
          )}
        </div>
      </>
    );
  };

  const ReturnProductsToStore = async () => {
    setCloseBtn(true);
    try {
      const data = {
        inputValues,
        idDelivery: params.slug,
      };
      const response = await axios.post(
        `${linkServer.link}products/returnProductsInStore`,
        data
      );
      if (response.data === "yes") {
        toast.success("تم الإسترجاع بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response: {
          data: { token: string; AllData: any; productsReturn: any };
        };
        response = await axios.get(
          `${linkServer.link}users/getDeliveryProductStore/${params.slug}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );
        setDataDelivery(response.data.AllData);
        setDataDeliveryInStore(response.data.productsReturn);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, secretKey]);

  useEffect(() => {
    if (returnOrders.length > 0) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [returnOrders]);

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
                  <div className="w-[100%]">{details()}</div>
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
