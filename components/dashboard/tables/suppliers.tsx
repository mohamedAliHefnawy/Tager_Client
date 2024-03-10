//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import ModelAddSupplier from "../modals/suppliers/modaelAddSupplier";
import ModelEditSupplier from "../modals/suppliers/modaelEditSupplier";
import Link from "next/link";

interface Suppliers {
  _id: string;
  name: string;
  phone: string;
  image: string;
  date: string;
}

export default function Suppliers() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  const GetSuppliers = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; suppliers: any } };
      response = await axios.get(`${linkServer.link}suppliers/getSuppliers`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredSuppliers = suppliers.filter((supplier) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (supplier.name &&
        supplier.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (supplier.phone &&
        supplier.phone.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    GetSuppliers();
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
          <ModelAddSupplier />
        </div>
        <div className="mt-3 ml-2 text-slate-400 text-xs">
          <p>Total {filteredSuppliers.length} Suppliers</p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[10%]">
              <p>الصورة</p>
            </div>
            <div className="w-[33%] flex justify-center">
              <p>الإسم</p>
            </div>
            <div className="w-[33%] flex justify-center">
              <p>رقم الهاتف</p>
            </div>

            <div className="w-[44%] flex justify-center">
              <p>تاريخ الإضافة</p>
            </div>
            <div className="w-[10%] flex justify-center"></div>
            <div className="w-[10%] flex justify-center"></div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" />
            </div>
          ) : (
            currentItems.map((supplier, indexSupplier) => (
              <div
                key={indexSupplier}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[10%] flex justify-center">
                  <Avatar src={supplier.image} />
                </div>
                <div className="w-[33%] flex justify-center">
                  <p
                  // className="text-warning-500"
                  >
                    {supplier.name}
                  </p>
                </div>
                <div className="w-[33%] flex justify-center">
                  <p> {supplier.phone} </p>
                </div>

                <div className="w-[44%] flex justify-center">
                  <p>{supplier.date}</p>
                </div>
                <div className="w-[10%] flex justify-center">
                  <div className="flex flex-wrap gap-4">
                    <ModelEditSupplier
                      idSupplier={supplier._id}
                      nameSupplier={supplier.name}
                      imageSupplier={supplier.image}
                      phoneSupplier={supplier.phone}
                    />
                  </div>
                </div>
                <div className="w-[10%] flex justify-center">
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/dashboard/purchases/${supplier.name}`}
                      className="bg-primary-200 p-2 rounded-full border-1 border-primary-500 text-primary-700 hover:cursor-pointer"
                    >
                      {Icons.ArrowUturnDownIcon}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        <Pagination
          className="fixed bottom-0 mb-3"
          showShadow
          color="primary"
          total={Math.ceil(filteredSuppliers.length / itemsPerPage)}
          initialPage={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}
