"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//Images
import UserSignUp from "@/public/img/userSignUp.png";

//icons
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";
import { Button } from "@nextui-org/react";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [check, setCheck] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordConfirn, setShowPasswordConfirn] = useState(true);
  const router = useRouter();

  const Icons = {
    EyeIcon: <EyeIcon />,
    EyeNotIcon: <EyeNotIcon />,
  };

  const SignUp = async () => {
    setCheck(true);
    try {
      const data = {
        name,
        phone,
        password,
      };
      const response = await axios.post(`${linkServer.link}users/signUp`, data);

      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم  التسجيل بنجاح ",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        localStorage.setItem("user", name);
        // localStorage.setItem("userValidity", validity);

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
    if (
      name.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      passwordConfirm.trim() !== "" &&
      password.trim() === passwordConfirm.trim()
    ) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [name, phone, password, passwordConfirm]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-auto pb-6">
        <div className="max-sm:w-[80%] sm:w-[80%] lg:w-[30%] max-lg:w-[40%] bg-white flex-col flex justify-center items-center">
          <div className="mt-6">
            <Image src={UserSignUp} alt={"error"} width={150} height={150} />
          </div>

          <input
            type="text"
            className="input"
            placeholder="إسم المستخدم "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            inputMode="numeric"
            className="input"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="flex justify-between items-center w-[100%]">
            <input
              type={showPassword ? "password" : "text"}
              className="input w-full"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                border:
                  password.trim() !== passwordConfirm.trim()
                    ? "1px solid red"
                    : "",
              }}
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
              type={showPasswordConfirn ? "password" : "text"}
              className="input w-full"
              placeholder="تأكيد كلمة المرور"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={{
                border:
                  password.trim() !== passwordConfirm.trim()
                    ? "1px solid red"
                    : "",
              }}
            />
            <span className="relative bg-red-400">
              <span
                onClick={() => setShowPasswordConfirn(!showPasswordConfirn)}
                className={`absolute inset-y-0 right-0 flex items-center pr-4  pt-3 text-[var(--mainColor)] hover:cursor-pointer`}
              >
                {showPasswordConfirn ? Icons.EyeIcon : Icons.EyeNotIcon}
              </span>
            </span>
          </div>

          <div className="flex justify-end w-[100%] mt-3">
            <Link className="mr-2 text-blue-400" href="/auth/login">
              تسجيل دخول
            </Link>
            <p> لديك حساب ؟</p>
          </div>

          <Button className="button" onClick={SignUp} disabled={check}>
            إنشاء حساب
          </Button>
        </div>
      </div>
    </>
  );
}
