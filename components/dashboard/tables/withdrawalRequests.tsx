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
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";

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
  marketer: string;
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
  const [selected, setSelected] = React.useState(["في الإنتظار"]);
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
  const filteredWithdrawalRequests = withdrawalRequests
    .filter((item) => selected.includes(item.situation))
    .filter((withdrawalRequest) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return (
        (withdrawalRequest.pymentMethod &&
          withdrawalRequest.pymentMethod
            .toString()
            .includes(lowerCaseSearchText)) ||
        (withdrawalRequest.marketer &&
          withdrawalRequest.marketer
            .toString()
            .includes(lowerCaseSearchText)) ||
        (withdrawalRequest.phoneNumber &&
          withdrawalRequest.phoneNumber
            .toString()
            .includes(lowerCaseSearchText))
      );
    });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredWithdrawalRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
                  value="في الإنتظار"
                >
                  في الإنتظار
                </Checkbox>
                <Checkbox
                  className="mr-6 sm:mr-1 max-sm:mr-1"
                  value="تم التحويل"
                >
                  تم التحويل
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredWithdrawalRequests.length} withdrawalRequests </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[25%] text-center">
              <p>مندوب التسويق</p>
            </div>
            <div className="w-[25%] text-center">
              <p>طريقة الدفع</p>
            </div>
            <div className="w-[25%] text-center">
              <p>المبلغ</p>
            </div>
            <div className="w-[25%] text-center">
              <p>رقم الهاتف</p>
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
                  <p>{withdrawalRequest.marketer}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{withdrawalRequest.pymentMethod}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p className="flex justify-center">
                    <span className="mr-1">د.ل</span>
                    <span>{withdrawalRequest.sumMoney}</span>
                  </p>
                </div>
                <div className="w-[25%] text-center">
                  <p>{withdrawalRequest.phoneNumber}</p>
                </div>
                <div className="w-[25%] text-center">
                  <p>
                    {withdrawalRequest.situation === "في الإنتظار" ? (
                      <p className="text-warning-600">
                        {withdrawalRequest.situation}
                      </p>
                    ) : (
                      <p className="text-success-600">
                        {withdrawalRequest.situation}
                      </p>
                    )}
                  </p>
                </div>

                <div className="w-[33%] text-right">
                  <div className="flex justify-center items-center">
                    <div>
                      <ModelwithdrawalRequests
                        idWithdrawalRequests={withdrawalRequest._id}
                        PaymentWithdrawalRequests={
                          withdrawalRequest.pymentMethod
                        }
                        moneyWithdrawalRequests={
                          withdrawalRequest.sumMoney
                        }
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
            total={Math.ceil(filteredWithdrawalRequests.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
