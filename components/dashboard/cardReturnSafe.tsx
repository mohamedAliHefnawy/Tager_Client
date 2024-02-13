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
import ModaelShowReturn from "@/components/dashboard/modals/returns/modaelShowReturn";

interface ReturnOrders {
  _id: string;
  nameClient: string;
  phone1Client: number;
  phone2Client: number;
  address: string;
  person: string;
  date: string;
  time: string;
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
}

export default function CardReturnSafe() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [returnOrders, setReturnOrders] = useState<ReturnOrders[]>([]);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = returnOrders
    .slice(indexOfFirstItem, indexOfLastItem)
    .reverse();

  const GetReturnOrders = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; returns: any } };
      response = await axios.get(`${linkServer.link}returns/getReturns`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setReturnOrders(response.data.returns);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetReturnOrders();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        {/* <div className="w-[70%]">
          <input
            type="text"
            placeholder="بحث ..."
            className="input"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>

        <ModaelConvertMoney /> */}
      </div>
      <div className="my-3 ml-2 text-slate-600 text-xs">
        <p>Total {returnOrders.length} OrderReturns </p>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : returnOrders.length === 0 ? (
          <p className="text-default-500">لا توجد نتائج موجودة</p>
        ) : (
          currentItems.map((order, indexOrder) => (
            <Card shadow="sm" key={indexOrder}>
              <CardBody className="overflow-visible p-5 text-lg">
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.nameClient}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    إسم العميل :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.phone1Client}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    رقم الهاتف 1 :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.phone2Client}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    رقم الهاتف 2 :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.address}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    العنوان :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.date}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    التاريخ :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.time}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    الوقت :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{order.person}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    مندوب التوصيل :
                  </span>
                </p>
              </CardBody>
              <CardFooter className="text-small justify-between">
                <ModaelShowReturn products={order.products} />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
