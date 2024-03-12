//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import ModelAddEmplyee from "@/components/pos/models/kasheer/modaelAddkasheer";
import ModelEditkasheer from "@/components/pos/models/kasheer/modaelEditkasheer";

interface kasheer {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  store: string;
  moneysafe: string;
}

export default function Kasheer() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [kasheer, setkasheer] = useState<kasheer[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredkasheer = kasheer
    .filter((item) => item.validity !== "marketer")
    .filter((kasheer) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return (
        (kasheer.name &&
          kasheer.name.toLowerCase().includes(lowerCaseSearchText)) ||
        (kasheer.password &&
          kasheer.password.toLowerCase().includes(lowerCaseSearchText)) ||
        (kasheer.validity &&
          kasheer.validity.toLowerCase().includes(lowerCaseSearchText)) ||
        (kasheer.phone &&
          kasheer.phone.toLowerCase().includes(lowerCaseSearchText))
      );
    });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredkasheer.slice(indexOfFirstItem, indexOfLastItem);

  const Getkasheer = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; kasheer: any } };
      response = await axios.get(`${linkServer.link}Kasheer/getkasheer`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setkasheer(response.data.kasheer);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Getkasheer();
  }, []);

  return (
    <>
      <div className="">
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
          <ModelAddEmplyee titleButton="إضافة موظف" inputName="إسم الموظف" />
        </div>
        <div className="mt-3 ml-2 text-slate-600 text-xs">
          <p>Total {filteredkasheer.length} kasheer</p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[10%] text-center">
              <p>الصورة</p>
            </div>
            <div className="w-[33%] flex justify-center">
              <p>الإسم</p>
            </div>
            <div className="w-[33%] flex justify-center">
              <p>رقم الهاتف</p>
            </div>
            <div className="w-[44%] flex justify-center">
              <p>المخزن</p>
            </div>
            <div className="w-[44%] flex justify-center">
              <p>الدفع</p>
            </div>
            <div className="w-[44%] flex justify-center">
              <p>الرتبة</p>
            </div>
            <div className="w-[10%] flex justify-center"></div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" />
            </div>
          ) : (
            currentItems.map((kasheer, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[10%] flex justify-center">
                  <Avatar src={kasheer.image} />
                </div>
                <div className="w-[33%] flex justify-center">
                  <p className="text-warning-500">{kasheer.name}</p>
                </div>
                <div className="w-[33%] flex justify-center">
                  <p> {kasheer.phone} </p>
                </div>
                <div className="w-[44%] flex justify-center">
                  <p> {kasheer.store} </p>
                </div>
                <div className="w-[44%] flex justify-center">
                  <p> {kasheer.moneysafe} </p>
                </div>
                <div className="w-[44%] flex justify-center">
                  <p> {kasheer.validity} </p>
                </div>
                <div className="w-[10%] flex justify-center">
                  <ModelEditkasheer
                    idkasheer={kasheer._id}
                    namekasheer={kasheer.name}
                    imagekasheer={kasheer.image}
                    phonekasheer={kasheer.phone}
                    passwordkasheer={kasheer.password}
                    storekasheer={kasheer.store}
                    moneyStorekasheer={kasheer.moneysafe}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        <Pagination
          className="my-3"
          showShadow
          color="warning"
          total={Math.ceil(filteredkasheer.length / itemsPerPage)}
          initialPage={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}
