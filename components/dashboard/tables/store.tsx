//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";

//nextUi
import {
  Spinner,
  Pagination,
  CardBody,
  Card,
  CardFooter,
} from "@nextui-org/react";

//components
import ModelAddStore from "../modals/store/modaelAddStore";

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

export default function Stores() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [stores, setStores] = useState<Stores[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [nameStore, setNameStore] = useState("");
  const router = useRouter();

  const message = (storeId: string) => {
    toast.success(
      "ألَلَهّـمً صّـلَِّ وٌسِـلَمً وٌبًأّرکْ عٌلَى نِبًيِّنِأّ مًحًمًدٍ وعلى آله وصحبه أجمعينﷺ."
    );
    router.push(`/dashboard/store/${storeId}`);
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredCategories = stores.filter((store) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (store.name && store.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (store.gbs && store.gbs.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddCategory = (newStore: Stores) => {
    setStores((prevStores) => [...prevStores, newStore]);
  };

  const GetStores = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; stores: any } };
      response = await axios.get(`${linkServer.link}stores/getStores`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setStores(response.data.stores);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetStores();
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
          <div className="flex justify-between w-[25%]">
            <ModelAddStore
              nameStoree={nameStore}
              setNameStoree={setNameStore}
              gbsStoree={nameStore}
              setGbsStoree={setNameStore}
              onAddStoree={handleAddCategory}
            />
          </div>
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredCategories.length} Store </p>
        </div>

        <div>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <p className="text-default-500">لا توجد نتائج للبحث</p>
            ) : (
              currentItems.map((store, indexStore) => (
                <Card
                  shadow="sm"
                  key={indexStore}
                  className="hover:cursor-pointer hover:translate-x-[-5px] transition-transform"
                >
                  <CardBody className="overflow-visible  p-6 flex flex-col items-end">
                    <p className="flex mb-4">
                      <span className="mr-2">{store.name}</span>
                      <span className="opacity-65"> :- الإسم </span>
                    </p>
                    <p className="flex mb-4">
                      <span className="mr-2">{store.gbs}</span>
                      <span className="opacity-65"> :- المكان </span>
                    </p>
                    <p className="flex mb-4">
                      <span className="mr-2">{store.priceDelivery}</span>
                      <span className="opacity-65"> :- سعر التوصيل </span>
                    </p>
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    <p
                      className="w-[100%] text-center p-3 bg-warning-300 rounded-full"
                      onClick={() => message(store._id)}
                    >
                      فتح المخزن
                    </p>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
        <div className="pagination">
          <Pagination
            className=" mb-3"
            showShadow
            color="primary"
            variant="faded"
            total={Math.ceil(filteredCategories.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
