"use client";

// react
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { analytics } from "@/fireBase/fireBaseConfig";
import { getUnixTime } from "date-fns";

//components
import NavBar from "../../../components/dashboard/navbar";
import SideBar from "@/components/dashboard/sidebar";
import useCheckLogin from "../../../components/dashboard/checkLogin/checkLogin";
import DivCheck from "../../../components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

//nextUi
import { Avatar, Button, Input } from "@nextui-org/react";

//imgaes
import error from "@/public/img/notfound.png";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";

interface Payment {
  _id: string;
  name: string;
  image: string;
  active: Number;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [img, setImg] = useState("");
  const [methodPayment, setMethodPayment] = useState<Payment[]>([]);

  // const imgUr = methodPayment.map((item) => item.image)
  const [imageURL, setImageURL] = useState("");

  const [images, setImages] = useState<string[]>(
    Array(methodPayment.length).fill("")
  );
  const [namePayment, setNamePayment] = useState("");
  const [runOrStopActive, setRunOrStopActive] = useState(true);
  const [runOrStopActiveArray, setRunOrStopActiveArray] = useState<boolean[]>(
    []
  );
  const [closeBtn, setCloseBtn] = useState(true);
  const [msg, setMsg] = useState("");

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    PencilIcon: <PencilIcon />,
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedMethodPayments = [...methodPayment];
    updatedMethodPayments[index].name = value;
    setMethodPayment(updatedMethodPayments);
  };

  const AddPayment = async () => {
    try {
      const response = await axios.post(
        "https://tager-server.vercel.app/payment/addpayment",
        {
          name: namePayment,
        }
      );

      if (response.data === "yes") {
        alert("تم إضافة طريقة الدفع بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setMsg("حدث خطأ أثناء إضافة الدفع");
    }
  };

  const GetMethodPayment = async () => {
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get("https://tager-server.vercel.app/payment/getpayment", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMethodPayment(response.data.payment);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateMethodPayment = async (index: number) => {
    try {
      const updatedPayment = methodPayment[index];
      const response = await axios.post(
        "https://tager-server.vercel.app/payment/editpayment",
        {
          id: updatedPayment._id,
          name: updatedPayment.name,
          image: imageURL,
          active: runOrStopActive,
        }
      );

      if (response.data === "yes") {
        alert("تم تعديل الدفع بنجاح ✓");
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

  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // const handleUploadImage = async (selectedFiles?: FileList | null) => {
  //   const file = selectedFiles?.[0];
  //   if (file) {
  //     const image = await imagebase64(file);
  //     setImg(image);
  //   }
  // };

  const generateUniqueFileName = (file: File) => {
    const timestamp = getUnixTime(new Date());
    const randomChars = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}_${randomChars}_${file.name}`;
    return fileName;
  };

  const handleUploadImage = async (
    index: number,
    selectedFiles?: FileList | null
  ) => {
    const file = selectedFiles?.[0];
    if (file) {
      const image = await imagebase64(file);
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = image;
        return newImages;
      });
    }
  };

  const Upload = async (selectedFiles: FileList | null, index: number) => {
    handleUploadImage(index, selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileName = generateUniqueFileName(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      setImageURL(url);
      console.log(url);
    } else {
      alert("Please select a file");
    }
  };

  const divPayment = () => {
    return (
      <>
        <div className="flex flex-col items-center">
          <div className="bg-white w-[50%] rounded-lg">
            <div className="flex items-center p-3 pb-4">
              <input
                type="text"
                className="input"
                placeholder="بحث ..."
                value={namePayment}
                onChange={(e) => setNamePayment(e.target.value)}
              />
              <Button
                color={closeBtn ? "default" : "warning"}
                className="h-14 ml-1 mt-4"
                onClick={AddPayment}
                disabled={closeBtn}
              >
                إضافة
              </Button>
            </div>
            {msg && <p className="text-center mb-4 text-danger-500"> {msg} </p>}
          </div>
          <div className="bg-white w-[50%] rounded-lg mt-2 h-auto max-h-[550px] overflow-y-auto overflow-x-hidden pr-4 scrollbar-thumb-gray-500 scrollbar-track-gray-300">
            {methodPayment.map((payment, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4"
              >
                <div className="flex justify-between items-center p-4 ">
                  <div className="flex justify-center mr-2">
                    {!images[index] ? (
                      payment.image === "" ? (
                        <label
                          htmlFor={`img-${index}`}
                          className="p-4 mt-5 rounded-xl text-slate-500 hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
                        >
                          {Icons.PhotoIcon}
                        </label>
                      ) : (
                        <label
                          htmlFor={`img-${index}`}
                          className="p-2 mt-5 rounded-xl text-slate-500 hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
                        >
                          <Avatar src={payment.image} />
                        </label>
                      )
                    ) : (
                      <label
                        htmlFor={`img-${index}`}
                        className="p-2 mt-5 rounded-xl text-slate-500 hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
                      >
                        <Avatar src={images[index]} />
                      </label>
                    )}
                    <input
                      type="file"
                      id={`img-${index}`}
                      className="hidden"
                      onChange={(e) => Upload(e.target.files, index)}
                    />
                  </div>
                  <input
                    type="text"
                    className="input"
                    value={payment.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />
                </div>
                <div className="flex items-center mt-4 pr-4">
                  {payment &&
                  payment.active &&
                  payment.active.toString() !== "false" ? (
                    <p
                      key={index}
                      onClick={() =>
                        setRunOrStopActiveArray((prevState) => {
                          const newState = [...prevState];
                          newState[index] = !newState[index];
                          const activeValueToSend = !newState[index];
                          setRunOrStopActive(false);
                          return newState;
                        })
                      }
                      className="relative w-4 h-4 left-5 z-50 rounded-full hover:cursor-pointer"
                      style={{
                        boxShadow: runOrStopActiveArray[index]
                          ? "0 0 10px 2px rgba(0, 255, 0, 1)"
                          : "0 0 10px 2px rgba(255, 0, 0, 1)",
                        backgroundColor: runOrStopActiveArray[index]
                          ? "green"
                          : "red",
                      }}
                    ></p>
                  ) : (
                    <p
                      key={index}
                      onClick={() =>
                        setRunOrStopActiveArray((prevState) => {
                          const newState = [...prevState];
                          newState[index] = !newState[index];
                          const activeValueToSend = !newState[index];
                          setRunOrStopActive(true);
                          return newState;
                        })
                      }
                      className="relative w-4 h-4 left-5 z-50 rounded-full hover:cursor-pointer"
                      style={{
                        boxShadow: runOrStopActiveArray[index]
                          ? "0 0 10px 2px rgba(255, 0, 0, 1)"
                          : "0 0 10px 2px rgba(0, 255, 0, 1)",
                        backgroundColor: runOrStopActiveArray[index]
                          ? "red"
                          : "green",
                      }}
                    ></p>
                  )}

                  <p
                    onClick={() => updateMethodPayment(index)}
                    className={`relative left-7 z-50 rounded-full hover:cursor-pointer text-warning-600 ml-4 `}
                  >
                    {Icons.PencilIcon}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    setRunOrStopActiveArray(
      methodPayment.map((payment) => payment.active !== 0)
    );
  }, [methodPayment]);

  useEffect(() => {
    GetMethodPayment();
  }, []);

  useEffect(() => {
    if (namePayment.trim() !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [namePayment]);

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
                  <div className="w-[100%]">{divPayment()}</div>
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
