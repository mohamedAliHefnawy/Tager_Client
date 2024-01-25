"use client";

//react
import { format, isValid, parse } from "date-fns";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

//components
import NavBar from "../../../../components/dashboard/navbar";
import SideBar from "../../../../components/dashboard/sidebar";
import Store from "../../../../components/dashboard/tables/store";
import useCheckLogin from "../../../../components/dashboard/checkLogin/checkLogin";
import DivCheck from "../../../../components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

//nextUi
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";

//imgaes
import error from "../../../../public/img/notfound.png";
import arrow from "../../../../public/img/right-arrow.png";

//icons
import { MinuscircleIcon } from "../../../../public/svg/minuscircleIcon";

interface Catogry {
  _id: string;
  name: string;
  price: string;
  amount: string;
  details: [
    {
      price: Number;
      amount: Number;
      time: string;
      date: string;
      expirydate: String;
    }
  ];
}

export default function Home({ params }: { params: { slug: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [num, setNum] = useState("");
  const [num2, setNum2] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [warning, setWarning] = useState("");
  const [catogry, setCatogry] = useState<Catogry>();
  const [loading, setLoading] = useState(true);

  const icons = {
    MinuscircleIcon: <MinuscircleIcon />,
  };

  const formattedExpiryDate = (expirydate: any) => {
    const dateObject = new Date(expirydate);
    const formattedDate = `${
      dateObject.getMonth() + 1
    }/${dateObject.getDate()}/${dateObject.getFullYear()}`;
    return formattedDate;
  };

  const amount = catogry?.details
    .filter(
      (item) =>
        formattedExpiryDate(item.expirydate) === new Date().toLocaleDateString()
    )
    .reduce((sum, { amount }) => +sum + +amount, 0);

  const MinusProducts = async () => {
    try {
      const amount = catogry?.details
        .filter(
          (item) =>
            formattedExpiryDate(item.expirydate) ===
            new Date().toLocaleDateString()
        )
        .reduce((sum, { amount }) => +sum + +amount, 0);

      const response = await axios.post(
        "https://server-clinic.vercel.app/store/editstoreOne",
        {
          id: params.slug,
          amount: amount,
        }
      );

      if (response.data === "yes") {
        alert("تمت العملية بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة حاول مره أخري ☹");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = () => {
    if (amount !== 0) {
      onOpen();
    }
  };

  const ModelMinus1 = () => {
    return (
      <>
        <p
          onClick={handleOpenModal}
          className=" w-[50px] h-[50px] text-center hover:cursor-pointer hover:opacity-75 bg-danger-200 p-3 mt-1 rounded-full border-1 border-white"
        >
          {catogry &&
            catogry.details &&
            catogry.details.length > 0 &&
            catogry.details
              .filter(
                (item) =>
                  formattedExpiryDate(item.expirydate) ===
                  new Date().toLocaleDateString()
              )
              .reduce((sum, { amount }) => +sum + +amount, 0)}
        </p>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          className=" rounded-e-none max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  تأكيد !
                </ModalHeader>
                <ModalBody>هل أنت متاكد من خصم هذه الكمية ؟</ModalBody>
                <ModalFooter>
                  <Button color="success" variant="light" onPress={onClose}>
                    إلغاء
                  </Button>
                  <Button
                    disabled={amount === 0 ? true : false}
                    color={amount === 0 ? "default" : "danger"}
                    onClick={MinusProducts}
                  >
                    نعم
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };

  const GetCatogry = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-clinic.vercel.app/store/getstore/${params.slug}`
      );
      setCatogry(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const price =
    catogry &&
    catogry.details &&
    catogry.details.length > 0 &&
    catogry.details[catogry.details.length - 1].price;

  const MinusAmount = async () => {
    try {
      const data = { id: params.slug, amount: num, price: price };
      const response = await axios.post(
        "https://server-clinic.vercel.app/store/editstoreOne",
        data
      );
      if (response.data === "yes") {
        alert("تم تعديل الكمية بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wewe =
    catogry &&
    catogry.details &&
    catogry.details.length > 0 &&
    catogry.details.reduce((sum, { amount }) => +sum + +amount, 0);

  const wewe2 =
    catogry &&
    catogry.details &&
    catogry.details.length > 0 &&
    catogry.details
      .filter(
        (item) =>
          formattedExpiryDate(item.expirydate) ===
          new Date().toLocaleDateString()
      )
      .reduce((sum, { amount }) => +sum + +amount, 0);

  const handleInputChange = (e: { target: { value: string | number } }) => {
    const newValue = +e.target.value;

    if (wewe !== undefined && newValue >= 0 && newValue <= +wewe) {
      setNum(newValue.toString());
    }
  };

  const handleInputChange2 = (e: { target: { value: string | number } }) => {
    const newValue = +e.target.value;

    if (wewe2 !== undefined && newValue === +wewe2) {
      setNum2(newValue.toString());
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ItemsPerPage = 3;
  const totalPages = Math.ceil((catogry?.details?.length || 0) / ItemsPerPage);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = catogry?.details.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const table = () => {
    return (
      <>
        <div>
          <div>
            <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-slate-600 shadow-lg shadow-slate-800 rounded-2xl text-slate-300">
              <div className="w-[20%]">
                <p> تاريخ العملية </p>
              </div>
              <div className="w-[20%]">
                <p> وقت العملية </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الكمية </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الصلاحية </p>
              </div>
              <div className="w-[20%] text-center">
                <p> سعر المنتج </p>
              </div>
              <div className="w-[20%] text-center">
                <p> الإجمالي </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : catogry ? (
              <div>
                {currentItems &&
                  currentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 pr-10 pl-10 bg-slate-600 shadow-lg rounded-2xl border-1 mb-1 border-b-white text-slate-300"
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
                          <p>{+item.amount}</p>
                          <p></p>
                        </div>
                      </div>
                      <div className="w-[20%] text-center">
                        <div className="flex justify-center">
                          <p>{item.expirydate}</p>
                        </div>
                      </div>

                      <div className="w-[20%] text-center">
                        <div className="flex justify-center">
                          <p className="mr-1"> د.ل </p>
                          <p>{+item.price}</p>
                        </div>
                      </div>
                      <div className="w-[20%] text-center">
                        <div className="flex justify-center">
                          {+item.amount >= 0 ? (
                            <>
                              <p className="mr-1"> د.ل </p>
                              <p> {+item.amount * +item.price}</p>
                            </>
                          ) : (
                            <p className="text-danger-400">-</p>
                          )}
                        </div>
                      </div>
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

  const catogtyDiv = () => {
    return (
      <>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="flex">
              <p className="mr-2 text-black "> كود المنتج : </p>
              <p className="text-slate-300 font-thin"> {params.slug} </p>
            </div>
            <div className="flex mt-4">
              <p className="mr-2 text-black "> إسم المنتج : </p>
              <p className="text-slate-300 font-thin">
                {catogry && (
                  <p className="text-slate-300 font-thin"> {catogry.name} </p>
                )}
              </p>
            </div>
            <div className="flex mt-4">
              <p className="mr-2 text-black "> الكمية : </p>
              <p className="text-slate-300 font-thin">
                {catogry && catogry.details && catogry.details.length > 0 ? (
                  catogry.details.reduce((sum, { amount }) => +sum + +amount, 0)
                ) : (
                  <p> لا يوجد أي عدد </p>
                )}
              </p>
            </div>
            <div className="flex mt-4">
              <p className="mr-2 text-black"> أخر جرد بتاريخ : </p>
              {catogry?.details && catogry.details.length > 0 ? (
                <p className="text-slate-300 font-thin">
                  {catogry.details[catogry.details.length - 1].date}
                </p>
              ) : (
                <p className="text-slate-300 font-thin">لا يوجد</p>
              )}
            </div>
            <div className="flex mt-4">
              <p className="mr-2 text-black"> أخر جرد بتاريخ : </p>
              {catogry?.details && catogry.details.length > 0 ? (
                <p className="text-slate-300 font-thin">
                  {catogry.details[catogry.details.length - 1].time}
                </p>
              ) : (
                <p className="text-slate-300 font-thin">لا يوجد</p>
              )}
            </div>

            {warning && <p className="text-red-500">{warning}</p>}

            <div className="flex items-center mt-4">
              <div className="flex">
                <p className="mr-2 text-black ">الكمية منتهية الصلاحية :</p>
              </div>
              <div className="flex items-center">{ModelMinus1()}</div>
            </div>

            <div className="flex items-center mt-4">
              <div className="flex justify-start w-[166px]">
                <p className="mr-2 text-black "> الكمية التي نفذت : </p>
              </div>
              <div className="flex items-center">
                <Image
                  src={arrow}
                  alt={"error"}
                  className="mr-1"
                  width={100}
                  height={100}
                />
                <Input
                  type="number"
                  className="w-32"
                  value={num}
                  onChange={handleInputChange}
                />

                <Button
                  className="h-14 ml-1"
                  variant="bordered"
                  color={closeBtn ? "default" : "danger"}
                  disabled={closeBtn}
                  onClick={MinusAmount}
                >
                  {icons.MinuscircleIcon}
                </Button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    GetCatogry();
  }, []);

  useEffect(() => {
    if (num !== "" && Number(num) !== 0) {
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
            <div className="bg-slate-800 lg:h-auto min-h-screen flex justify-between max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
              <div className="w-[20%] h-auto bg-slate-700 rounded-r-3xl">
                <SideBar />
              </div>
              <div className="w-[100%] flex-col flex items-center ">
                <NavBar />
                <div className="w-[80%] h-9"></div>
                {/* <CardsAnalysis /> */}
                <div className="w-[80%] h-9"></div>
                <div className="w-[80%] h-[100%] bg-slate-700 rounded-r-3xl  rounded-2xl p-6">
                  {catogtyDiv()}
                  {table()}
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
