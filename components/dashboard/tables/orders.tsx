//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import PrintInvoice from "../modals/orders/printInvoice";
import ModaelEditOrder from "../modals/orders/modaelEditOrder";
import QrCode from "../modals/orders/qrCode";

interface Orders {
  _id: string;
  nameClient: string;
  phone1Client: string;
  phone2Client: string;
  store: string;
  address: string;
  marketer: string;
  situation: string;
  situationSteps: [{ situation: string; date: string; time: string }];
}

export default function Orders() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [receivedData, setReceivedData] = useState("");

  const itemsPerPage = 6;
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  // const receiveDataFromChild = (data) => {
  //   const { orderId, data: situationData } = data;
  //   setReceivedData((prevData) => ({
  //     ...prevData,
  //     [orderId]: situationData,
  //   }));
  // };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredOrders = orders.filter((order) => {
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

  useEffect(() => {}, []);

  useEffect(() => {
    GetOrders();
    // setReceivedData(orders.map((item) => item.situationSteps[0].situation));
  }, []);

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
          {/* <ModelAddStore
            nameStoree={nameStore}
            setNameStoree={setNameStore}
            gbsStoree={nameStore}
            setGbsStoree={setNameStore}
            onAddStoree={handleAddCategory}
          /> */}
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
                        // sendDataToParent={receiveDataFromChild}
                      />
                    </div>
                    <div className="mx-2">
                      <PrintInvoice
                        day={""}
                        time={""}
                        doctor={""}
                        patient={""}
                      />
                    </div>
                    <div className="">
                      <QrCode day={""} time={""} doctor={""} patient={""} />
                    </div>
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
