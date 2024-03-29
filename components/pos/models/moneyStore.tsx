//react
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

//compenents
import Swal from "sweetalert2";

interface MoneySafe {
  _id: string;
  idInvoice: string;
  deduct: number;
  money: number;
  notes: string;
  date: string;
  time: string;
  acceptMoney: boolean;
}

export default function MoneyStoreModel({
  moneyData,
}: {
  moneyData: {
    idInvoice: string;
    deduct: number;
    money: number;
    notes: string;
    date: string;
    time: string;
    acceptMoney: boolean;
    _id: string;
  };
}) {
  const AdminPos = localStorage.getItem("nameKasheer");
  const ValPos = localStorage.getItem("valKasheer");
  const colorCompanyPos = localStorage.getItem("colorCompanyKasheer");

  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const [closeBtn, setCloseBtn] = useState(true);
  const [moneyPosTotal, setMoneyPosTotal] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${linkServer.link}Kasheer/getMoneykasheer/${AdminPos}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      setMoneySafe(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (moneyData) {
      setMoneySafe((prevMoneySafe) => [...prevMoneySafe, moneyData]);
      setMoneyPosTotal(
        (prevMoneyPosTotal) =>
          prevMoneyPosTotal +
          moneyData.money -
          (moneyData.money * moneyData.deduct) / 100
      );
    }
  }, [moneyData]);

  useEffect(() => {
    const totalMoney = moneySafe
      .filter((item) => item.acceptMoney === true)
      .reduce(
        (total, currentItem) =>
          total +
          (currentItem.money - (currentItem.money * currentItem.deduct) / 100),
        0
      );
    setMoneyPosTotal(totalMoney);
  }, [moneySafe]);

  const Table = () => {
    return (
      <>
        <div>
          <div
            className="flex justify-evenly items-center p-4  rounded-2xl opacity-80"
            style={{
              backgroundColor: `${colorCompanyPos}`,
              border: "1px solid white",
              outline: `2px double ${colorCompanyPos}`,
            }}
          >
            <p className="w-[20%] text-center">الوقت</p>
            <p className="w-[20%] text-center">التاريخ </p>
            <p className="w-[20%] text-center">خصم</p>
            <p className="w-[20%] text-center">ملاحظة</p>
            <p className="w-[20%] text-center">المبلغ</p>
            <p className="w-[20%] text-center" style={{ direction: "rtl" }}>
              id الفاتورة
            </p>
          </div>

          {moneySafe
            .filter((item2) => item2.acceptMoney === true)
            .map(
              (item, indexItem) =>
                item.idInvoice && (
                  <div
                    key={indexItem}
                    className="flex justify-evenly items-center p-4 py-8  rounded-2xl mt-4 "
                    style={{
                      backgroundColor: `${colorCompanyPos}`,
                      border: "1px solid white",
                      outline: `2px double ${colorCompanyPos}`,
                    }}
                  >
                    <p className="w-[20%] text-center">{item.time}</p>
                    <p className="w-[20%] text-center">{item.date}</p>
                    <p className="w-[20%] flex justify-center">
                      <p className="mr-1">%</p>
                      <p>{item.deduct}</p>
                    </p>
                    <p className="w-[20%] text-center">{item.notes}</p>
                    <p className="w-[20%] flex justify-center">
                      <p className="mr-1">د.ل</p>
                      <p>{item.money - (item.money * item.deduct) / 100}</p>
                    </p>
                    <p
                      className="w-[20%] text-center"
                      style={{ direction: "rtl" }}
                    >
                      {item.idInvoice}
                    </p>
                  </div>
                )
            )}
        </div>
      </>
    );
  };

  const SendMoney = async () => {
    // setCloseBtn(true);
    try {
      const data = {
        nameTransfer: AdminPos,
        validityTransfer: ValPos,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        money: moneySafe
          .filter((itemFilter) => itemFilter.acceptMoney === true)
          .map((item) => ({
            idInvoice: item.idInvoice,
            idMoney: item._id,
            money: item.money - (item.money * item.deduct) / 100,
            acceptMoney: false,
          })),
      };

      const response = await axios.post(
        `${linkServer.link}moneyTransfers/addMoneyTransfer`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم التحويل بنجاح",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        setMoneySafe([]);
        setMoneyPosTotal(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <p
        className="p-4 opacity-90 text-black flex flex-col items-center hover:font-bold hover:cursor-pointer transform transition-transform hover:scale-90 hover:animate-pulse text-lg"
        onClick={onOpen}
      >
        <p className="text-lg">{Icons.BanknotesIcon}</p>
        <p className="block hover:font-bold">الخزينة</p>
      </p>
      <Modal
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
        className="max-h-screen overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center w-[100%] ">
                <p className="flex items-center">
                  <p className="mr-2">أموال الكاشير</p>
                  <p>{Icons.BanknotesIcon}</p>
                </p>
              </ModalHeader>
              <ModalBody>{Table()}</ModalBody>
              <ModalFooter>
                <Button
                  disabled={moneyPosTotal > 0 ? false : true}
                  color={moneyPosTotal > 0 ? "warning" : "default"}
                  onClick={SendMoney}
                  className="flex items-center"
                >
                  <p className="flex font-bold">
                    <p className="mr-1">د.ل</p>
                    <p>{moneyPosTotal}</p>
                  </p>
                  <p>تحويل للأدمن</p>
                </Button>
                <Button onPress={onClose}>شـــــكراَ</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
