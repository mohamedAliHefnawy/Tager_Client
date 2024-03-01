//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//nextUi
import {
  Avatar,
  Spinner,
  Pagination,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";

//components
import PrintInvoice from "../modals/orders/printInvoice";
import ModelwithdrawalRequests from "../modals/withdrawalRequests/modelwithdrawalRequests";
import QrCode from "../modals/orders/qrCode";
import ChatDiv from "@/components/chatDiv";
import Scanner from "@/components/delivery/scanner";
import QRCode from "qrcode.react";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

//svg
import { ChatbubbleleftrightIcon } from "@/public/svg/chatbubbleleftrightIcon";
import { PaperAirplaneIcon } from "@/public/svg/paperAirplaneIcon";

interface Messages {
  message: string;
  person: string;
  valid: string;
  seeMessage: boolean;

  date: string;
  time: string;
}

interface WithdrawalRequests {
  _id: string;
  sumMoney: number;
  pymentMethod: string;
  phoneNumber: string;
  situation: string;
}

export default function WithdrawalRequests() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();

  const nameAdmin = localStorage.getItem("nameAdmin");
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequests[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = React.useState([
    // "مع الشحن",
    "بإنتظار الموافقة",
  ]);
  const itemsPerPage = 6;
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const Icons = {
    ChatbubbleleftrightIcon: <ChatbubbleleftrightIcon />,
    PaperAirplaneIcon: <PaperAirplaneIcon />,
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredOrders = withdrawalRequests.filter((withdrawalRequest) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      // (withdrawalRequest.sumMoney &&
      //   withdrawalRequest.sumMoney.includes(lowerCaseSearchText)) ||
      (withdrawalRequest.pymentMethod &&
        withdrawalRequest.pymentMethod
          .toString()
          .includes(lowerCaseSearchText)) ||
      (withdrawalRequest.phoneNumber &&
        withdrawalRequest.phoneNumber.toString().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const GetwithdrawalRequests = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; withdrawalRequests: any } };
      response = await axios.get(
        `${linkServer.link}withdrawalRequests/getwithdrawalRequests`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setWithdrawalRequests(response.data.withdrawalRequests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetwithdrawalRequests();
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
            currentItems.map((withdrawalRequest, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[25%] text-center">
                  <p
                    className="hover:cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/orders/${withdrawalRequest._id}`)
                    }
                  >
                    {withdrawalRequest.sumMoney}
                  </p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{withdrawalRequest.sumMoney}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{withdrawalRequest.sumMoney}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{withdrawalRequest.sumMoney}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>12</p>
                </div>

                <div className="w-[33%] text-right">
                  <div className="flex justify-center items-center">
                    <div>
                      <ModelwithdrawalRequests
                        idOrder={withdrawalRequest._id}
                        // situationSteps={withdrawalRequest._id}
                        delivery={withdrawalRequest._id}
                        // sendDataToParent={receiveDataFromChild}
                      />
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
