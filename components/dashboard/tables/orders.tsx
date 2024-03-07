//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//nextUi
import {
  Spinner,
  Pagination,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";

//components
import PrintInvoice from "../modals/orders/printInvoice";
import ModaelEditOrder from "../modals/orders/modaelEditOrder";
import QrCode from "../modals/orders/qrCode";
import ChatDiv from "@/components/chatDiv";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

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
  PhoneCompany: string;
  store: string;
  address: string;
  marketer: string;
  situation: string;
  totalPriceProducts: number;
  ImageURLCompany: string;
  NameCompany: string;
  ColorCompany: string;
  DeliveryName: string;
  date: string;
  time: string;
  situationSteps: [{ situation: string; date: string; time: string }];
  chatMessages: Messages[];
  products: [
    {
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
}

export default function Orders() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const nameAdmin = localStorage.getItem("nameAdmin");
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = React.useState(["بإنتظار الموافقة"]);
  const itemsPerPage = 6;
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredOrders = orders
    .filter((item) =>
      selected.includes(
        item.situationSteps[item.situationSteps.length - 1].situation
      )
    )
    .filter((order) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return (
        (order.nameClient &&
          order.nameClient.toLowerCase().includes(lowerCaseSearchText)) ||
        (order.phone1Client &&
          order.phone1Client.toString().includes(lowerCaseSearchText)) ||
        (order.phone2Client &&
          order.phone2Client.toString().includes(lowerCaseSearchText)) ||
        (order.store &&
          typeof order.store === "string" &&
          order.store.toLowerCase().includes(lowerCaseSearchText)) ||
        (order.address &&
          typeof order.address === "string" &&
          order.address.toLowerCase().includes(lowerCaseSearchText)) ||
        (order.marketer &&
          typeof order.marketer === "string" &&
          order.marketer.toLowerCase().includes(lowerCaseSearchText)) ||
        (order.situation &&
          typeof order.situation === "string" &&
          order.situation.toLowerCase().includes(lowerCaseSearchText))
      );
    });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const GetOrders = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; orders: any } };
      response = await axios.get(`${linkServer.link}orders/getOrders`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
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

  return (
    <>
      <div className=" w-[100%]">
        <div className="flex justify-between items-center">
          <div className="w-[100%]">
            <input
              type="text"
              placeholder=" بحث ..."
              className="w-[90%] input"
              onChange={handleSearchChange}
              value={searchText}
            />
            <div className="flex flex-col gap-3 mt-6 items-center">
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
                <Checkbox
                  className="mr-6 sm:mr-1 max-sm:mr-1"
                  value="تم القبول"
                >
                  تم القبول
                </Checkbox>
                <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="تم الرفض">
                  تم الرفض
                </Checkbox>
                <Checkbox className="mr-6 sm:mr-1 max-sm:mr-1" value="مع الشحن">
                  مع الشحن
                </Checkbox>
                <Checkbox
                  className="mr-6 sm:mr-1 max-sm:mr-1"
                  value="تم التوصيل"
                >
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
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredOrders.length} Orders </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[25%] text-center">
              <p>إسم العميل</p>
            </div>
            <div className="w-[25%] text-center">
              <p>رقم الهاتف</p>
            </div>
            <div className="w-[25%] text-center">
              <p>العنوان</p>
            </div>
            <div className="w-[25%] text-center">
              <p>مندوب التسويق</p>
            </div>
            <div className="w-[25%] text-center">
              <p>الحالة</p>
            </div>
            <div className="w-[33%] text-right"></div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((order, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[25%] text-center">
                  <p
                    className="hover:cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/orders/${order._id}`)
                    }
                  >
                    {order.nameClient}
                  </p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{order.phone1Client}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{order.address}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{order.marketer}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>
                    {order.situationSteps[order.situationSteps.length - 1]
                      .situation === "تم القبول" ? (
                      <p className="text-success-600">تم قبول الطلبية</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "تم الرفض" ? (
                      <p className="text-danger-600">تم رفض الطلبية</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "مع الشحن" ? (
                      <p className="text-success-700"> مع الشحن</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "تم التوصيل" ? (
                      <p className="text-success-700"> تم التوصيل</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "تم الإسترجاع" ? (
                      <p className="text-success-700"> تم الإسترجاع</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "إسترجاع جزئي" ? (
                      <p className="text-success-700"> إسترجاع جزئي</p>
                    ) : order.situationSteps[order.situationSteps.length - 1]
                        .situation === "تم إستلام الكاش" ? (
                      <p className="text-success-700"> تم إستلام الكاش</p>
                    ) : (
                      <p className="text-warning-700">
                        {
                          order.situationSteps[order.situationSteps.length - 1]
                            .situation
                        }
                      </p>
                    )}
                  </p>
                </div>

                <div className="w-[33%] text-right">
                  <div className="flex justify-center items-center">
                    <div>
                      <ModaelEditOrder
                        idOrder={order._id}
                        situationSteps={order.situationSteps}
                        delivery={order.DeliveryName}
                        // sendDataToParent={receiveDataFromChild}
                      />
                    </div>
                    <div className="mx-2">
                      <PrintInvoice
                        idOrder={order._id}
                        imageCom={order.ImageURLCompany}
                        nameCom={order.NameCompany}
                        colorCom={order.ColorCompany}
                        dateOrd={order.date}
                        timeOrd={order.time}
                        nameCli={order.nameClient}
                        addressCli={order.address}
                        phone1Cli={order.phone1Client}
                        phone2Cli={order.phone2Client}
                        totalPriceOrder={order.totalPriceProducts}
                        allProducts={order.products}
                        phoneMarketer={order.PhoneCompany}
                      />
                    </div>
                    <div className="">
                      <QrCode idOrder={order._id} />
                    </div>
                    <ChatDiv
                      user={nameAdmin || ""}
                      userValidity={userValidity}
                      idOrder={order._id}
                      chatMessages={order.chatMessages}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          <Pagination
            className=" mb-3"
            showShadow
            color="primary"
            variant="faded"
            total={Math.ceil(filteredOrders.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
