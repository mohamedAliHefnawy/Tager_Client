//react
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import linkServer from "@/linkServer";

//nextUi
import { Card, CardBody, CardFooter, Image, Spinner } from "@nextui-org/react";

//components
import ModaelMoneyTransfers from "@/components/dashboard/modals/moneyTransfer/modaelMoneyTransfers";

interface MoneyTransfers {
  _id: string;
  nameTransfer: string;
  validityTransfer: string;
  date: string;
  time: string;
  money: [
    {
      _id: string;
      idOrder: string;
      idMoney: string;
      marketer: string;
      money: number;
      moneyMarketer: number;
      moneyAdmin: number;
    }
  ];
}

export default function MoneyTransfers() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [moneyTransfers, setMoneyTransfers] = useState<MoneyTransfers[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1000000;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredMoneyTransfers = moneyTransfers.filter((moneyTransfer) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (moneyTransfer.nameTransfer &&
        moneyTransfer.nameTransfer
          .toLowerCase()
          .includes(lowerCaseSearchText)) ||
      (moneyTransfer.validityTransfer &&
        moneyTransfer.validityTransfer
          .toLowerCase()
          .includes(lowerCaseSearchText))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMoneyTransfers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const GetMoneySafe = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; moneyTransfers: any } };
      response = await axios.get(
        `${linkServer.link}moneyTransfers/getMoneyTransfers`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setMoneyTransfers(response.data.moneyTransfers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetMoneySafe();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <div className="w-[100%]">
          <input
            type="text"
            placeholder="بحث ..."
            className="input"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>
      </div>
      <div className="my-3 ml-2 text-slate-600 text-xs">
        <p>Total {filteredMoneyTransfers.length} MoneyTransfers </p>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : filteredMoneyTransfers.length === 0 ? (
          <p className="text-default-500">لا توجد نتائج للبحث</p>
        ) : (
          currentItems.map((moneyTransfer, index) => (
            <Card
              shadow="sm"
              key={index}
              // style={{ opacity: moneySafe.active === true ? 1 : 0.5 }}
              // isPressable={moneySafe.active === true}
              // onPress={() => console.log("item pressed")}
              // onClick={() =>
              //   router.push(`/dashboard/moneySafe/${moneySafe._id}`)
              // }
            >
              <CardBody className="overflow-visible  p-5 ">
                <div className=" flex flex-col items-end text-md">
                  <p className="mb-3">
                    <span>إسم المرسل | </span>
                    <span className="font-bold">
                      {moneyTransfer.nameTransfer}
                    </span>
                  </p>
                  <p className="mb-3">
                    <span>رتبة المرسل | </span>
                    <span className="font-bold">
                      {moneyTransfer.validityTransfer}
                    </span>
                  </p>
                  <p className="mb-3">
                    <span>التاريخ | </span>
                    <span className="font-bold">{moneyTransfer.date}</span>
                  </p>
                  <p className="" style={{ direction: "rtl" }}>
                    <span>الوقت | </span>
                    <span className="font-bold">{moneyTransfer.time}</span>
                  </p>
                </div>
              </CardBody>
              <CardFooter className="text-small justify-between">
                <ModaelMoneyTransfers
                  money={moneyTransfer.money}
                  idMoneyTransfer={moneyTransfer._id}
                />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
