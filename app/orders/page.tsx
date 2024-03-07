"use client";

// react
import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import ModaelRecoveryProduct from "@/components/users/models/modaelRecoveryProduct";
import ModelDataDelivery from "@/components/users/models/modelDataDelivery";
import ModaelShowProductsOrder from "@/components/users/models/modaelShowProductsOrder";
import Loading from "@/components/loading";
import ChatDiv from "@/components/chatDiv";

//nextUi
import {
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";


interface Messages {
  message: string;
  person: string;
  valid: string;
  seeMessage: boolean;
  date: string;
  time: string;
}

interface Orders {
  _id: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  store: string;
  address: string;
  marketer: string;
  DeliveryName: string;
  DeliveryPhone: string;
  totalPriceProducts: number;
  gainMarketer: number;
  situation: string;
  situationSteps: [
    {
      situation: string;
      date: string;
      time: string;
    }
  ];
  date: string;
  chatMessages: Messages[];
  products: [
    {
      idProduct: string;
      _id: string;
      name: string;
      price2: string;
      price3: string;
      catogry: string;
      nameProduct: string;
      imageProduct: string;
      products: [{ image: string }];
      amount: number;
      price: number;
      gainMarketer: number;
      size: string;
      image: string;
    }
  ];
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showDivCaht, setShowDivCaht] = useState(true);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = React.useState([
    "مع الشحن",
    "بإنتظار الموافقة",
  ]);
  const itemsPerPage = 6;
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const currentItems = orders
    .filter((item) =>
      selected.includes(
        item.situationSteps[item.situationSteps.length - 1].situation
      )
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const Body = () => {
    return (
      <>
        <div className=" w-[100%] flex justify-center py-6">
          <p className="text-4xl">الطلبات</p>
        </div>
        <div className="w-[100%] flex justify-center">
          <div className="flex flex-col gap-3">
            <CheckboxGroup
              color="warning"
              value={selected}
              onValueChange={setSelected}
              orientation="horizontal"
              className="mb-4"
            >
              <Checkbox
                className="mr-6 sm:mr-1 max-sm:mr-1"
                value="بإنتظار الموافقة"
              >
                بإنتظار الموافقة
              </Checkbox>
              <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="تم القبول">
                تم القبول
              </Checkbox>
              <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="تم الرفض">
                تم الرفض
              </Checkbox>
              <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="مع الشحن">
                مع الشحن
              </Checkbox>
              <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="تم التوصيل">
                تم التوصيل
              </Checkbox>
              <Checkbox
                className="mr-6 sm:mr-1 max-sm:mr-1"
                value="تم الإسترجاع"
              >
                تم الإسترجاع
              </Checkbox>
              <Checkbox
                className="mr-6 sm:mr-1 max-sm:mr-1"
                value="إسترجاع جزئي"
              >
                إسترجاع جزئي
              </Checkbox>
              <Checkbox
                className="mr-6 sm:mr-1 max-sm:mr-1"
                value="تم إستلام الكاش"
              >
                تم إستلام الكاش
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div className="lg:p-20 md:p-20 lg:pt-0 md:pt-0 sm:p-0 max-sm:p-0 sm:pt-0 max-sm:pt-0 w-[100%] overflow-x-scroll">
          <table className="border-1 border-[var(--mainColor)] w-[100%] text-center p-4">
            <tr className="border-1 border-[var(--mainColor)] text-sm">
              <th className="border-1 border-[var(--mainColor)] w-48 mx-2 p-4">
                إسم العميل
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                رقم الهاتف
              </th>
              <th className="border-1 border-[var(--mainColor)] w-36 mx-2">
                الإجمالي
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
              <th className="border-1 border-[var(--mainColor)]">
                مندوب التوصيل
              </th>
              <th className="border-1 border-[var(--mainColor)]">chatRoom</th>
              <th className="border-1 border-[var(--mainColor)]">-</th>
            </tr>

            {orders.length > 0 ? (
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

                  <td className="border-1 border-[var(--mainColor)] p-3">
                    <p className="flex justify-center p-3">{order.address}</p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)] ">
                    <p className="flex justify-center p-3">{order.date}</p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">
                      {
                        order.situationSteps[order.situationSteps.length - 1]
                          .situation
                      }
                    </p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">
                      <ModelDataDelivery
                        nameDelivery={order.DeliveryName}
                        phoneDelivery={order.DeliveryPhone}
                      />
                    </p>
                  </td>
                  <td className="border-1 border-[var(--mainColor)]">
                    <p className="flex justify-center p-3">
                      <ChatDiv
                        user={username}
                        userValidity={userValidity}
                        idOrder={order._id}
                        chatMessages={order.chatMessages}
                      />
                    </p>
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
                            <ModaelRecoveryProduct />
                            <ModaelShowProductsOrder produts={order.products} />
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response: {
          data: { token: string; ordersData: any };
        };
        response = await axios.get(
          `${linkServer.link}scanner/getOrders/${user}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );
        setOrders(response.data.ordersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, secretKey]);

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
                userr={user}
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
