//react
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import linkServer from "@/linkServer";

//nextUi
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Spinner,
} from "@nextui-org/react";

//svgIcons
import { SearchIcon } from "../../public/svg/searchIcon";
import { EllipsisverticalIcon } from "../../public/svg/ellipsisverticalIcon";
import { ConvertIcon } from "../../public/svg/convertIcon";

//components
import ModaelConvertMoney from "../../components/dashboard/modals/convertMoney/modaelConvertMoney";

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function CardMoneySafe() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pressable, setPressable] = useState(true);
  const itemsPerPage = 1000000;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const icons = {
    SearchIcon: <SearchIcon />,
    EllipsisverticalIcon: <EllipsisverticalIcon />,
    ConvertIcon: <ConvertIcon />,
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredMoneySafe = moneySafe.filter((moneySafe) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (moneySafe.name &&
        moneySafe.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (moneySafe.money &&
        moneySafe.money.some(
          (item) =>
            item.value.toLowerCase().includes(lowerCaseSearchText) ||
            item.notes.toLowerCase().includes(lowerCaseSearchText)
        )) ||
      (moneySafe.active &&
        moneySafe.active.toString().toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMoneySafe.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const GetMoneySafe = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get(`${linkServer.link}payment/getpayment`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMoneySafe(response.data.payment);
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
        <div className="w-[70%]">
          <input
            type="text"
            placeholder="بحث ..."
            className="input"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>

        <ModaelConvertMoney />
      </div>
      <div className="my-3 ml-2 text-slate-300 text-xs">
        <p>Total {filteredMoneySafe.length} MoneySafes </p>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : filteredMoneySafe.length === 0 ? (
          <p className="text-default-500">لا توجد نتائج للبحث</p>
        ) : (
          currentItems.map((moneySafe, index) => (
            <Card
              shadow="sm"
              key={index}
              style={{ opacity: moneySafe.active === true ? 1 : 0.5 }}
              isPressable={moneySafe.active === true}
              onPress={() => console.log("item pressed")}
              onClick={() =>
                router.push(`/dashboard/moneySafe/${moneySafe._id}`)
              }
            >
              <CardBody className="overflow-visible  p-0">
                <Image
                  alt={moneySafe.name}
                  className="w-full object-cover h-[140px]"
                  src={moneySafe.image}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                {moneySafe.money.reduce(
                  (total, item) => total + +item.value,
                  0
                )}
                د.ل
                <div className="flex items-center">
                  <b>{moneySafe.name}</b>

                  {moneySafe.active === true ? (
                    <p
                      className=" w-4 h-4 z-50 rounded-full ml-2  "
                      style={{
                        boxShadow: "0 0 10px 2px rgba(0, 255, 0, 1)",
                        backgroundColor: "green",
                      }}
                    ></p>
                  ) : (
                    <p
                      className=" w-4 h-4 z-50 rounded-full ml-2  "
                      style={{
                        boxShadow: "0 0 10px 2px rgba(255, 0, 0, 1)",
                        backgroundColor: "red",
                      }}
                    ></p>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
