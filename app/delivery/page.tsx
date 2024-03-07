"use client";

//React
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";

//nextUi
import { Button } from "@nextui-org/react";

//Images
import Delivery from "@/public/img/delivery-bike.png";

//icons
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();

  const Icons = {
    EyeIcon: <EyeIcon />,
    EyeNotIcon: <EyeNotIcon />,
  };

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
        if (validity === "مندوب توصيل") {
          Swal.fire({
            icon: "success",
            title: "تم التسجيل بنجاح",
            text: "✓",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "حسنًا",
          });
          localStorage.setItem("nameDelivery", name);
          localStorage.setItem("valDelivery", validity);
          router.push("/delivery/mainPage");
        } else {
          Swal.fire({
            icon: "error",
            title: "ليس لك الصلاحية للدخول لهذه الصفحة",
            text: "⤫",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "حسنًا",
          });
        }
      }

      if (response.data === "no") {
        Swal.fire({
          icon: "warning",
          title: "كلمة المرور خاطئة",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }

      if (answer === "notFoundUser") {
        Swal.fire({
          icon: "error",
          title: "هذا المستخدم غير موجود",
          text: "⤫",
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
      <div className="flex flex-col justify-center items-center h-auto pb-6">
        <div className="max-sm:w-[80%] sm:w-[80%] lg:w-[30%] max-lg:w-[40%] bg-white flex-col flex justify-center items-center">
          <div className="mt-6">
            <Image src={Delivery} alt={"error"} width={200} height={150} />
          </div>

          <input
            type="text"
            className="input"
            placeholder="إسم المستخدم الخاص بك"
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
          <Button className="button" onClick={Login} disabled={check}>
            تسجيل دخول
          </Button>
        </div>
      </div>
    </>
  );
}
