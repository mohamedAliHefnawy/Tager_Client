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
  Spinner,
  Avatar,
} from "@nextui-org/react";

interface Data {
  _id: string;
  name: string;
  phone: string;
  image: string;
  orders: [];
  money: [
    {
      money: number;
      notes: string;
      date: string;
      time: string;
      acceptMoney: boolean;
    }
  ];
}

export default function CardDeliverySecurity({
  nameAdmin,
}: {
  nameAdmin: string;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dataDeliveries, setDataDeliveries] = useState<Data[]>([]);
  const itemsPerPage = 1000000;
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredDeliveries = dataDeliveries.filter((delivery) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      delivery.name && delivery.name.toLowerCase().includes(lowerCaseSearchText)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries
    .slice(indexOfFirstItem, indexOfLastItem)
    .reverse();

  const GetDataDeliveries = async () => {
    try {
      let response: { data: { token: string; users: any } };
      response = await axios.get(`${linkServer.link}users/getDelivery`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setDataDeliveries(response.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDataDeliveries();
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
        <p>Total {dataDeliveries.length} Deliveries </p>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : dataDeliveries.length === 0 ? (
          <p className="text-default-500">لا توجد نتائج موجودة</p>
        ) : (
          currentItems.map((delivery, indexDelivery) => (
            <Card shadow="sm" key={indexDelivery}>
              <CardBody className="overflow-visible p-5 text-lg">
                <p className="w-[100%] flex justify-center">
                  <Avatar
                    src={`${delivery.image}`}
                    size="lg"
                    alt="لا يوجد صورة"
                  />
                </p>

                <p className="flex justify-end my-2">
                  <span className="mr-2">{delivery.name}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    إسم المندوب :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{delivery.phone}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    رقم الهاتف :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2">{delivery.orders.length}</span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    عدد الطلبات :
                  </span>
                </p>
                <p className="flex justify-end mb-2">
                  <span className="mr-2 flex">
                    <span className="mr-1">د.ل</span>
                    <span>
                      {delivery.money
                        .filter((item) => item.acceptMoney === true)
                        .reduce((calc, alt) => calc + alt.money, 0)}
                    </span>
                  </span>
                  <span style={{ direction: "rtl" }} className="opacity-75">
                    الأموال :
                  </span>
                </p>
              </CardBody>
              <CardFooter className="text-small justify-between">
                <Button
                  onPress={() =>
                    router.push(`/dashboard/deliverySecurity/${delivery._id}`)
                  }
                  color="warning"
                  className="opacity-90 rounded-full w-[100%]"
                >
                  المخزن
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
