//react
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import linkServer from "@/linkServer";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//svgIcons
import { SearchIcon } from "../../../public/svg/searchIcon";
import { EllipsisverticalIcon } from "../../../public/svg/ellipsisverticalIcon";

//components
import ModaelEditMarketingClients from "../modals/marketingClients/modaelEditMarketingClients";

interface Employees {
  _id: string;
  name: string;
  phone: string;
  password: string;
  passwordMoneyStore: string;
  validity: string;
  image: string;
}

export default function MarketingClients() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  const GetEmployees = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; users: any } };
      response = await axios.get(`${linkServer.link}users/getUsers`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setEmployees(response.data.users);
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
  const filteredEmployees = employees
    .filter((item) => item.validity === "مندوب تسويق")
    .filter((employees) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return (
        (employees.name &&
          employees.name.toLowerCase().includes(lowerCaseSearchText)) ||
        (employees.password &&
          employees.password.toLowerCase().includes(lowerCaseSearchText)) ||
        (employees.phone &&
          employees.phone.toLowerCase().includes(lowerCaseSearchText))
      );
    });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    GetEmployees();
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
          {/* <ModelAddEmplyee titleButton="إضافة موظف" inputName="إسم الموظف" /> */}
        </div>
        <div className="mt-3 ml-2 text-slate-300 text-xs">
          <p>Total {filteredEmployees.length} Employees</p>
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
              <p>password</p>
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
            currentItems
              .filter((item) => item.validity === "مندوب تسويق")
              .map((employees, index) => (
                <div
                  key={index}
                  className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
                >
                  <div className="w-[10%] flex justify-center">
                    <Avatar src={employees.image} />
                  </div>
                  <div className="w-[33%] flex justify-center">
                    <p
                      className="text-warning-500"
                      // href={`/dashboard/account/${employees.name}`}
                    >
                      {employees.name}
                    </p>
                  </div>
                  <div className="w-[33%] flex justify-center">
                    <p> {employees.phone} </p>
                  </div>
                  <div className="w-[44%] flex justify-center">
                    <p> ************** </p>
                  </div>
                  <div className="w-[44%] flex justify-center">
                    <p>مندوب تسويق</p>
                  </div>
                  <div className="w-[10%] flex justify-center">
                    <div className="flex flex-wrap gap-4">
                      <ModaelEditMarketingClients
                        idEmployee={employees._id}
                        nameEmployee={employees.name}
                        imageEmployee={employees.image}
                        phoneEmployee={employees.phone}
                        passwordEmployee={employees.password}
                        validitiyEmployee={employees.validity}
                        passwordMoneyStoree={employees.passwordMoneyStore}
                      />
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
          total={Math.ceil(filteredEmployees.length / itemsPerPage)}
          initialPage={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}
