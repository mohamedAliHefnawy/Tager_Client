"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TwitterPicker } from "react-color";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import Loading from "@/components/loading";

//nextUi
import { Avatar, Card, CardBody, Tab, Tabs } from "@nextui-org/react";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";

export default function Home() {
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imgUser, setImgUser] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [name, setName] = useState(user);
  const [nameCompany, setNameCompany] = useState("");
  const [phone1Company, setPhone1Company] = useState("");
  const [phone2Company, setPhone2Company] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [color, setColor] = useState("#FF6900");
  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };
  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const Icons = {
    ShoppingcartIcon: <ShoppingcartIcon />,
    DeleteIcon: <DeleteIcon />,
    PhotoIcon: <PhotoIcon />,
    EyeIcon: <EyeIcon />,
    EyeNotIcon: <EyeNotIcon />,
    PencilIcon: <PencilIcon />,
  };

  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };

  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    const image = (await imagebase64(file)) as string;
    setImgUser(image);
  };

  const handleUploadImageCompany = async (e: any) => {
    const file = e.target.files[0];
    const image = (await imagebase64(file)) as string;
    setImgCompany(image);
  };

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="المعلومات الشخصية">
              <Card>
                <CardBody>
                  <form className="lg:flex md:flex sm:block max-sm:block justify-center items-center">
                    <input
                      type="text"
                      className="input mr-2"
                      defaultValue={user}
                      placeholder="إسم المستخدم"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input"
                      value={phone}
                      placeholder="رقم الهاتف"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="2" title="تغيير كلمة المرور">
              <Card>
                <CardBody>
                  <form className="lg:flex md:flex sm:block max-sm:block justify-center items-center">
                    <div className="flex justify-between items-center w-[100%]">
                      <input
                        type={showPassword ? "password" : "text"}
                        className="input w-full"
                        placeholder="أدخل كلمة المرور الحالية"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="relative bg-red-400">
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute inset-y-0 right-0 flex items-center pr-4  pt-3 text-[var(--mainColor)] hover:cursor-pointer`}
                        >
                          {showPassword ? Icons.EyeIcon : Icons.EyeNotIcon}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center w-[100%]">
                      <input
                        type={showPasswordNew ? "password" : "text"}
                        className="input w-full ml-2"
                        placeholder="كلمة المرور الجديدة"
                        value={passwordNew}
                        onChange={(e) => setPasswordNew(e.target.value)}
                      />
                      <span className="relative bg-red-400">
                        <span
                          onClick={() => setShowPasswordNew(!showPasswordNew)}
                          className={`absolute inset-y-0 right-0 flex items-center pr-4  pt-3 text-[var(--mainColor)] hover:cursor-pointer`}
                        >
                          {showPasswordNew ? Icons.EyeIcon : Icons.EyeNotIcon}
                        </span>
                      </span>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="3" title="الشركة">
              <Card>
                <CardBody>
                  <div className="lg:flex md:flex sm:block max-sm:block items-start justify-between">
                    <div className="pt-2 h-auto">
                      <span className="w-[100%]">
                        <TwitterPicker
                          color={color}
                          onChangeComplete={handleChangeComplete}
                        />
                      </span>

                      <span
                        className={`flex justify-center  mx-3 py-2 rounded-3xl`}
                        style={{ backgroundColor: color }}
                      >
                        <label htmlFor="Photo" className="text-center ">
                          <p className="bg-white my-4 p-3 rounded-full hover:cursor-pointer">
                            {imgCompany ? (
                              <span className="flex justify-center">
                                <Avatar size="lg" src={imgCompany} />
                              </span>
                            ) : (
                              <p className="text-slate-400 h-auto bg-white rounded-3xl text-9xl flex justify-center items-center">
                                {Icons.PhotoIcon}
                              </p>
                            )}
                          </p>
                        </label>
                        <input
                          onChange={handleUploadImageCompany}
                          type="file"
                          name="Photo"
                          id="Photo"
                          className="hidden"
                        />
                      </span>
                    </div>
                    <div className=" lg:w-[70%] md:w-[70%] sm:w-[100%] max-sm:w-[100%]">
                      <input
                        type="text"
                        className="input"
                        placeholder="إسم الشركة"
                        value={nameCompany}
                        onChange={(e) => setNameCompany(e.target.value)}
                      />
                      <div className="lg:flex md:flex sm:block max-sm:block">
                        <input
                          type="text"
                          className="input mr-2"
                          placeholder="رقم هاتف 1"
                          value={phone1Company}
                          onChange={(e) => setPhone1Company(e.target.value)}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="رقم هاتف 2"
                          value={phone2Company}
                          onChange={(e) => setPhone2Company(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        setUsername(user);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : user ? (
          <>
            <div className="w-[100%] flex-col flex items-center">
              <NavBar
                user={user}
                lengthProductsInCart={0}
                lengthProductsInFavourite={0}
              />
              <div className=" w-[100%] lg:mb-96 md:mb-[500px] sm:mb-[800px] max-sm:mb-[800px] ">
                <div className="bg-[var(--mainColorRgba)] w-[100%] h-60 flex justify-center items-end">
                  <div className=" lg:flex md:block sm:block max-sm:block justify-between lg:w-[70%] md:w-[70%] sm:w-[90%] max-sm:w-[90%]  h-auto z-50  border-2 border-dashed bg-white border-[var(--mainColor)] rounded-3xl absolute top-40 ">
                    <div className="  lg:w-[70%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] p-4">
                      {tabs()}
                      <div className=" flex justify-end pr-4 py-5">
                        <p className="bg-[var(--mainColorRgba)] text-xl border-1 border-[var(--mainColor)] w-20 h-20 rounded-full flex justify-center items-center hover:cursor-pointer">
                          {Icons.PencilIcon}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 w-[30%] lg:w-[30%] md:w-[100%] sm:w-[100%] max-sm:w-[100%]">
                      <p className="bg-slate-200">
                        {imgUser ? (
                          <span className="flex justify-center">
                            <Image
                              alt="error"
                              width={300}
                              height={400}
                              src={imgUser}
                            />
                          </span>
                        ) : (
                          <p className="text-slate-400 h-36 bg-[var(--mainColorRgbaa)] rounded-3xl text-9xl flex justify-center items-center">
                            {Icons.PhotoIcon}
                          </p>
                        )}
                      </p>
                      <label htmlFor="Photo" className="text-center ">
                        <p className="bg-[var(--mainColorRgba)] my-4 p-3 rounded-full hover:cursor-pointer">
                          تغيير الصورة
                        </p>
                      </label>
                      <input
                        onChange={handleUploadImage}
                        type="file"
                        name="Photo"
                        id="Photo"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>
          </>
        ) : (
          <DivCheck link="/doctor" />
        )}
      </div>
    </>
  );
}
