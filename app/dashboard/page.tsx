"use client";

//React
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//nextUI
import { Button } from "@nextui-org/react";

//Images
import UserLogin from "@/public/img/userLogin.png";
import error from "@/public/img/notfound.png";
import admin1 from "@/public/img/admin1.png";
import admin2 from "@/public/img/admin2.png";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();

  const Login = async () => {
    try {
      const NameTrim = name.trim();
      const PasswordTrim = password.trim();
      const data = {
        name: NameTrim,
        password: PasswordTrim,
      };

      const response = await axios.post(`${linkServer.link}users/login`, data);

      const { validity, answer } = response.data;

      if (answer === "yes") {
        if (validity === "أدمن") {
          localStorage.setItem("nameAdmin", name);
          localStorage.setItem("valAdmin", validity);
          router.push("/dashboard/analysis");
        } else {
          Swal.fire({
            icon: "error",
            title: "انت ليس لك الصلاحية للدخول للوحة التحكم",
            text: "⤫",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "حسنًا",
          });
        }
      }
      if (response.data === "noPassword") {
        Swal.fire({
          icon: "warning",
          title: "كلمة المرور خاطئة",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
      if (response.data === "notFoundUser") {
        Swal.fire({
          icon: "error",
          title: "هذا المستخدم غير موجود",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
      if (response.data === "error") {
        Swal.fire({
          icon: "error",
          title: "توجد مشكلة ما. حاول مرة أخرى ",
          text: "😓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (name.trim() !== "" && password.trim() !== "") {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [name, password]);

  return (
    <>
      <div className=" max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden flex-col justify-center items-center h-auto pb-6">
        <div className="max-sm:w-[80%] sm:w-[80%] lg:w-[30%] max-lg:w-[40%] bg-white flex-col flex justify-center items-center">
          <div className="mt-6">
            <Image src={admin1} alt={"error"} width={150} height={150} />
          </div>

          <input
            type="text"
            className="input"
            placeholder="إسم الأدمن الخاص بك"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex justify-between items-center w-[100%]">
            <input
              type={showPassword ? "password" : "text"}
              className="input w-full"
              placeholder="أدخل الباسورد"
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

          <Button className="button" onClick={Login}>
            تسجيل دخول
          </Button>
        </div>
      </div>
      <div className="flex max-2xl:hidden max-xl:hidden lg:hidden md:flex sm:flex max-sm:flex h-screen flex-col items-center justify-center">
        <Image src={error} alt={"error"} width={200} height={300} />
        <p> عفوا مقاس الشاشه الخاص بك غير مدعوم ☹ </p>
      </div>
    </>
  );
}
