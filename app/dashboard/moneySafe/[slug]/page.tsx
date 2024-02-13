"use client";

//react
import axios from "axios";
import Image from "next/image";
import { format, isValid, parse } from "date-fns";
import linkServer from "@/linkServer";

//components
import NavBar from "../../../../components/dashboard/navbar";
import SideBar from "../../../../components/dashboard/sidebar";
import useCheckLogin from "../../../../components/dashboard/checkLogin/checkLogin";
import DivCheck from "../../../../components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

// react
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//imgaes
import error from "../../../../public/img/notfound.png";

//nextUi
import {
  Button,
  Input,
  Pagination,
  Spinner,
  Textarea,
} from "@nextui-org/react";

interface MoneyItem {
  value: string;
  notes: string;
  date: string;
  time: string;
  person: string;
}

interface MoneySafeDetails {
  _id: string;
  name: string;
  money: MoneyItem[];
  active: boolean;
  notes: string;
}

export default function Home({ params }: { params: { slug: string } }) {
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [num, setNum] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [moneySafe, setMoneySafe] = useState<MoneySafeDetails>();
  const [currentPage, setCurrentPage] = useState(1);
  const ItemsPerPage = 3;

  const totalPages = Math.ceil((moneySafe?.money?.length || 0) / ItemsPerPage);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = moneySafe?.money.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredMoney = moneySafe?.money.filter((item) => {
    return parseInt(item.value) >= 0;
  });

  const table = () => {
    return (
      <>
        <div>
          <div>
            <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
              <div className="w-[20%]">
                <p> تاريخ الإضافة </p>
              </div>
              <div className="w-[20%]">
                <p> وقت الإضافة </p>
              </div>
              <div className="w-[20%] text-center">
                <p> المبلغ </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الموظف </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الملاحظات </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : moneySafe ? (
              <div>
                {currentItems &&
                  currentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
                    >
                      <div className="w-[20%]">
                        {item.date && (
                          <p>{format(new Date(item.date), "dd/MM/yyyy")}</p>
                        )}
                      </div>

                      <div className="w-[20%]">
                        {item.time &&
                          isValid(
                            parse(item.time, "hh:mm:ss a", new Date())
                          ) && (
                            <p>
                              {format(
                                parse(item.time, "hh:mm:ss a", new Date()),
                                "hh:mm:ss a"
                              )}
                            </p>
                          )}
                      </div>

                      <div className="w-[20%] text-center">
                        <div className="flex justify-center">
                          <p className="mr-1"> د.ل </p>
                          <p>{item.value}</p>
                        </div>
                      </div>

                      <div className="w-[20%] text-center">
                        <div className="flex justify-center">
                          <p>{item.person}</p>
                        </div>
                      </div>

                      <div className="w-[20%] text-center">{item.notes}</div>
                    </div>
                  ))}{" "}
              </div>
            ) : (
              <p>لم يتم العثور على بيانات الكارت</p>
            )}
            <Pagination
              showShadow
              color="primary"
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  };

  const handleInputChange = (e: { target: { value: string | number } }) => {
    const newValue = +e.target.value;

    if (newValue >= 0 && newValue <= 100000000000000000) {
      setNum(newValue.toString());
    }
  };

  const latestDate =
    moneySafe?.money && moneySafe.money.length > 0
      ? moneySafe.money.reduce((latest, item) =>
          item.date > latest.date ? item : latest
        )
      : null;

  const latestTime =
    moneySafe?.money && moneySafe.money.length > 0
      ? moneySafe.money.reduce((latest, item) =>
          item.time > latest.time ? item : latest
        )
      : null;

  const details = () => {
    return (
      <>
        <div className="flex justify-between">
          {loading ? (
            <p>Loading...</p>
          ) : moneySafe ? (
            <div>
              <div className="flex">
                <p className="mr-2 text-black opacity-70"> id الخزينة : </p>
                <p className="text-warning-700"> {params.slug} </p>
              </div>
              <div className="flex mt-6">
                <p className="mr-2 text-black opacity-70"> إسم الخزينة : </p>
                <p className="text-warning-700"> {moneySafe.name} </p>
              </div>
              <div className="flex mt-6">
                <p className="mr-2 text-black opacity-70"> الأموال : </p>
                <p className="text-warning-700">
                  {moneySafe.money.reduce(
                    (total, item) => total + +item.value,
                    0
                  ) + +num}
                  <span className=""> د.ل </span>
                </p>
              </div>

              <div className="flex mt-6">
                <div className="flex">
                  <p className="mr-2 text-black opacity-70">
                    {" "}
                    أخر إضافة أموال بتاريخ :{" "}
                  </p>
                  <p className="text-warning-700">
                    {latestDate ? `${latestDate.date}` : "لا يوجد تاريخ"}
                  </p>
                </div>
              </div>
              <div className="flex mt-6">
                <div className="flex">
                  <p className="mr-2 text-black opacity-70">
                    {" "}
                    أخر إضافة أموال الساعة :{" "}
                  </p>
                  <p className="text-warning-700">
                    {latestDate ? `${latestTime?.time}` : "لا يوجد وقت"}
                  </p>
                </div>
              </div>

              {warning && <p className="text-red-500">{warning}</p>}
            </div>
          ) : (
            <p>لم يتم العثور على بيانات الكارت</p>
          )}

          <div className="w-[40%]">
            <p className=" text-center  text-black bg-warning-400 opacity-60 p-5 rounded-full rounded-ee-none ">
              إضافة أموال
            </p>

            <input
              color="default"
              type="number"
              className="input"
              placeholder="أدخل المبلغ المراد إضافته إلى المحفظة"
              value={num}
              onChange={handleInputChange}
            />
            <Textarea
              style={{ direction: "rtl" }}
              placeholder=" ملاحظات"
              color="default"
              disableAnimation
              disableAutosize
              className="border-1 border-[var(--mainColor)] rounded-lg my-4"
              classNames={{
                input: "resize-y min-h-[60px] max-h-[70px]",
              }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Button
              className="h-14 w-[100%] my-3 opacity-70 rounded-full rounded-se-none"
              color="warning"
              style={{ opacity: closeBtn ? 0.3 : 1 }}
              disabled={closeBtn}
              onClick={AddMoney}
            >
              إضافة
            </Button>
          </div>
        </div>

        {table()}
      </>
    );
  };

  const AddMoney = async () => {
    try {
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString();
      const currentDateStr = currentDate.toLocaleDateString();

      const response = await axios.post(
        `${linkServer.link}payment/addpayment/${params.slug}`,
        {
          num: num,
          notes: notes,
          person: nameAdmin,
          date: currentDateStr,
          time: currentTime,
        }
      );

      if (response.data === "yes") {
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetMoneySafeOne = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${linkServer.link}payment/getpayment/${params.slug}`
      );
      setMoneySafe(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetMoneySafeOne();
  }, []);

  useEffect(() => {
    if (num.trim() !== "" && num.trim() !== "0") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [num]);

  useEffect(() => {
    if (nameAdmin) {
      const timeoutId = setTimeout(() => {
        setUsername(nameAdmin);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [nameAdmin]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : nameAdmin ? (
          <>
            <div className="bg-zinc-200 lg:h-auto min-h-screen flex justify-between max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
              <div className="w-[20%] bg-white">
                <SideBar />
              </div>
              <div className="w-[100%] flex-col flex items-center ">
                <NavBar />
                <div className="w-[80%] h-5"></div>
                <div className="w-[90%]  bg-slate-100 rounded-r-3xl  rounded-2xl p-6 min-h-screen">
                  <div className="w-[100%]">{details()}</div>
                </div>
              </div>
            </div>

            <div className="flex max-2xl:hidden max-xl:hidden lg:hidden md:flex sm:flex max-sm:flex h-screen flex-col items-center justify-center">
              <Image src={error} alt={"error"} width={200} height={300} />
              <p> عفوا مقاس الشاشه الخاص بك غير مدعوم ☹ </p>
            </div>
          </>
        ) : (
          <DivCheck link="/dashboard" />
        )}
      </div>
    </>
  );
}
