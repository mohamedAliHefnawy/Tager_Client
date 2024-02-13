//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import ModelAddStore from "../modals/store/modaelAddStore";
import ModelEditStore from "../modals/store/modaelEditStore";

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

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredCategories = stores.filter((store) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return store.name && store.name.toLowerCase().includes(lowerCaseSearchText);
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
      console.log(response.data);
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
          <ModelAddStore
            nameStoree={nameStore}
            setNameStoree={setNameStore}
            gbsStoree={nameStore}
            setGbsStoree={setNameStore}
            onAddStoree={handleAddCategory}
          />
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredCategories.length} Categories </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[25%]">
              <p>إسم المخزن</p>
            </div>
            <div className="w-[25%]">
              <p>المكان</p>
            </div>
            <div className="w-[25%]">
              <p>سعر التوصيل</p>
            </div>

            <div className="w-[33%] text-right"></div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((store, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[25%]">
                  <p> {store.name} </p>
                </div>
                <div className="w-[25%]">
                  <p> {store.gbs}</p>
                </div>
                <div className="w-[25%]">
                  <p> {store.priceDelivery}</p>
                </div>

                <div className="w-[33%] text-right">
                  <div className="flex justify-center">
                    <ModelEditStore
                      idStoree={store._id}
                      nameStoree={store.name}
                      gbsStoree={store.gbs}
                      priceDeliveryy={store.priceDelivery}
                    />
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
            total={Math.ceil(filteredCategories.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
