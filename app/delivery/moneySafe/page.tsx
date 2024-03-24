"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/delivery/navBar";
import useCheckLogin from "@/components/delivery/checkLogin/checkLogin";
import DivCheck from "@/components/delivery/checkLogin/divCheck";
import Loading from "@/components/loading";

interface Data {
  _id: string;
  name: string;
  money: [
    {
      idOrder: string;
      _id: string;
      money: number;
      moneyMarketer: number;
      moneyAdmin: number;
      marketer: string;
      notes: string;
      date: string;
      time: string;
      acceptMoney: boolean;
    }
  ];
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameDelivery, valDelivery] = useCheckLogin();
  const [nameDeliveryy, setNameDeliveryy] = useState("");
  const [notesSend, setNotesSend] = useState("لا يوجد ملاحظة");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [dataUser, setDataUser] = useState<Data>();

  const TotalMoney = dataUser?.money
    .filter((money) => money.acceptMoney === true)
    .reduce((calc, alt) => calc + alt.money, 0);

  const SendMoney = async () => {
    setCloseBtn(true);
    try {
      const data = {
        nameTransfer: nameDelivery,
        validityTransfer: valDelivery,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        money: dataUser?.money
          .filter((itemFilter) => itemFilter.acceptMoney === true)
          .map((item) => ({
            idOrder: item.idOrder,
            idMoney: item._id,
            marketer: item.marketer,
            money: item.money,
            moneyMarketer: item.moneyMarketer,
            moneyAdmin: item.moneyAdmin,
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
        TotalMoney === 0;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response: { data: { token: string; user: any } };
        response = await axios.get(
          `${linkServer.link}users/getUser/${nameDelivery}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );
        setDataUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (nameDelivery) {
      fetchData();
    }
  }, [nameDelivery, secretKey]);

  useEffect(() => {
    const moneyArray = dataUser?.money || [];
    const totalMoney = moneyArray
      .filter((money) => money.acceptMoney === true)
      .reduce((calc, alt) => calc + alt.money, 0);

    if (totalMoney > 0) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [dataUser]);

  useEffect(() => {
    if (nameDelivery) {
      const timeoutId = setTimeout(() => {
        setNameDeliveryy(nameDelivery);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [nameDelivery]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : nameDelivery ? (
        <>
          <NavBar />
          <div className="my-6 p-6">
            <div className="w-[100%] h-24 border-1 border-slate-600 border-dashed rounded-2xl flex flex-col justify-center items-center ">
              <p>أموال الخزينة</p>
              <p className="flex text-sm my-2 text-success-700">
                <span className="mr-1">د.ل</span>
                <span>{TotalMoney}</span>
              </p>
            </div>
          </div>
          <div className="p-3 text-end">
            <div className="flex justify-end">
              <p className="bg-warning-100 opacity-65 p-3 px-6 rounded-3xl rounded-es-none w-[100%] text-center">
                تحويل أموال
              </p>
            </div>
            <div className="w-[100%]">
              <textarea
                className="input p-3"
                placeholder="لا يوجد ملاحظة"
                style={{ direction: "rtl" }}
                value={notesSend}
                onChange={(e) => setNotesSend(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              {!closeBtn ? (
                <p
                  onClick={SendMoney}
                  className="bg-warning-300 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center"
                >
                  تأكيد العملية
                </p>
              ) : (
                <p className="bg-warning-200 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center">
                  لا يمكنك التحويل
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <DivCheck link="/delivery" />
      )}
    </>
  );
}
