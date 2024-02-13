"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TwitterPicker } from "react-color";
import { getUnixTime } from "date-fns";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import Loading from "@/components/loading";
import { analytics } from "@/fireBase/fireBaseConfig";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents

//nextUi
import { Avatar, Card, CardBody, Tab, Tabs } from "@nextui-org/react";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import axios from "axios";

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user] = useCheckLogin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(user);
  const [newName, setNewName] = useState(user);
  const [nameCompany, setNameCompany] = useState("");
  const [phoneMarketer, setPhoneMarketer] = useState("");
  const [phoneCompany, setPhoneCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [dataUser, setDataUser] = useState("");
  const [color, setColor] = useState("#FF6900");
  const [imgMarketr, setImgMarketr] = useState("");
  const [imageURLMarketr, setImageURLMarketr] = useState("");
  const [imgCompany, setImgCompany] = useState("");
  const [imageURLCompany, setImageURLCompany] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);

  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadImage = async (selectedFiles?: FileList | null) => {
    const file = selectedFiles?.[0];
    if (file) {
      const image = await imagebase64(file);
      setImgCompany(image);
    }
  };
  const handleUploadImageMarketr = async (selectedFiles?: FileList | null) => {
    const file = selectedFiles?.[0];
    if (file) {
      const image = await imagebase64(file);
      setImgMarketr(image);
    }
  };

  const generateUniqueFileName = (file: File) => {
    const timestamp = getUnixTime(new Date());
    const randomChars = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}_${randomChars}_${file.name}`;
    return fileName;
  };

  const Upload = async (selectedFiles: FileList | null) => {
    handleUploadImage(selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileName = generateUniqueFileName(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      setImageURLCompany(url);
    } else {
      alert("Please select a file");
    }
  };
  const UploadMarketr = async (selectedFiles: FileList | null) => {
    handleUploadImageMarketr(selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileName = generateUniqueFileName(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      setImageURLMarketr(url);
    } else {
      alert("Please select a file");
    }
  };

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
                      className="input mr-2 opacity-60"
                      // defaultValue={user}
                      placeholder="إسم المستخدم"
                      value={user}
                      disabled
                      onChange={(e) => setNewName(e.target.value)}
                    />

                    <input
                      type="number"
                      className="input"
                      value={phoneMarketer}
                      placeholder="رقم الهاتف"
                      onChange={(e) => setPhoneMarketer(e.target.value)}
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
                            {imageURLCompany ? (
                              <span className="flex justify-center">
                                <Avatar size="lg" src={imageURLCompany} />
                              </span>
                            ) : (
                              <p className="text-slate-400 h-auto bg-white rounded-3xl text-9xl flex justify-center items-center">
                                {Icons.PhotoIcon}
                              </p>
                            )}
                          </p>
                        </label>
                        <input
                          onChange={(e) => Upload(e.target.files)}
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
                          placeholder="رقم هاتف الشركة "
                          value={phoneCompany}
                          onChange={(e) => setPhoneCompany(e.target.value)}
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

  const EditDataUser = async () => {
    try {
      const data = {
        imageURLMarketr,
        name: username,
        newName,
        phoneMarketer,
        password,
        passwordNew,
        nameCompany,
        phoneCompany,
        color,
        imageURLCompany,
      };
      const response = await axios.post(
        `${linkServer.link}users/editUser`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم التعديل بنجاح",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        localStorage.removeItem("user");
        router.push("/auth/login");
      }
      if (response.data === "no") {
        Swal.fire({
          icon: "warning",
          title: "هذا الإسم مستخدم من قبل ",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
      if (response.data === "noPaswordCom") {
        Swal.fire({
          icon: "error",
          title: "كلمة المرور غير صحيحة",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetDataUser = async () => {
    try {
      let response: { data: { token: string; user: any } };
      response = await axios.get(`${linkServer.link}users/getUser/${user}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setDataUser(response.data.user);
      // setNewName(response.data.user.name);
      setPhoneMarketer(response.data.user.phone);
      setImageURLMarketr(response.data.user.image);
      setPhoneCompany(response.data.user.phoneCompany);
      setNameCompany(response.data.user.nameCompany);
      setImageURLCompany(response.data.user.imageCompany);
      setColor(response.data.user.colorCompany);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetDataUser();
  }, []);

  // useEffect(() => {
  //   if (newName === "") {
  //     setCloseBtn(true);
  //   } else {
  //     setCloseBtn(false);
  //   }
  // }, [newName]);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        setUsername(user);
        // setNewName(user);
        setIsLoading(false);
      }, 2000);
      GetDataUser();

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
                        <p
                          onClick={EditDataUser}
                          className="bg-[var(--mainColorRgba)] text-xl border-1 border-[var(--mainColor)] w-20 h-20 rounded-full rounded-es-none flex justify-center items-center hover:cursor-pointer hover:opacity-80 hover:rotate-45"
                        >
                          {Icons.PencilIcon}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 w-[30%] lg:w-[30%] md:w-[100%] sm:w-[100%] max-sm:w-[100%]">
                      <p className="bg-slate-200">
                        {imageURLMarketr ? (
                          <span className="flex justify-center">
                            <Image
                              alt="error"
                              width={200}
                              height={300}
                              src={imageURLMarketr}
                            />
                          </span>
                        ) : (
                          <p className="text-slate-400 h-36 bg-[var(--mainColorRgbaa)] rounded-3xl text-9xl flex justify-center items-center">
                            {Icons.PhotoIcon}
                          </p>
                        )}
                      </p>

                      <label htmlFor="Photo1" className="text-center ">
                        <p className="bg-[var(--mainColorRgba)] my-4 p-3 rounded-full hover:cursor-pointer">
                          تغيير الصورة
                        </p>
                      </label>
                      <input
                        onChange={(e) => UploadMarketr(e.target.files)}
                        type="file"
                        name="Photo1"
                        id="Photo1"
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
          <DivCheck link="/auth/login" />
        )}
      </div>
    </>
  );
}
